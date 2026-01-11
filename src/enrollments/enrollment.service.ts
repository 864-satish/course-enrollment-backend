import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Course } from '../courses/entities/course.entity';
import { Timetable } from '../timetables/entities/timetable.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Timetable)
    private readonly timetableRepository: Repository<Timetable>,
    private readonly dataSource: DataSource,
  ) {}

  async enrollStudent(
    student_id: number,
    course_ids: number[],
    semester_id: number,
  ): Promise<Enrollment[]> {
    // 1. Validate student exists
    const student = await this.studentRepository.findOneBy({ id: student_id });
    if (!student) throw new BadRequestException('Student not found');

    // 2. Validate all courses exist and belong to the same college as the student
    const courses = await this.courseRepository.findBy({
      id: In(course_ids),
    });
    if (courses.length !== course_ids.length)
      throw new BadRequestException('One or more courses not found');
    if (courses.some((c) => c.college_id !== student.college_id)) {
      throw new BadRequestException(
        'All courses must belong to the same college as the student',
      );
    }

    // 3. Fetch all timetables for the selected courses
    const timetables = await this.timetableRepository
      .createQueryBuilder('timetable')
      .where('timetable.course_id IN (:...courseIds)', {
        courseIds: course_ids,
      })
      .getMany();

    // 4. Check for timetable clashes
    for (let i = 0; i < timetables.length; i++) {
      for (let j = i + 1; j < timetables.length; j++) {
        if (
          timetables[i].day_of_week === timetables[j].day_of_week &&
          !(
            timetables[i].end_time <= timetables[j].start_time ||
            timetables[j].end_time <= timetables[i].start_time
          )
        ) {
          throw new BadRequestException(
            'Timetable clash detected between selected courses',
          );
        }
      }
    }

    // 5. Save enrollments in a transaction
    return await this.dataSource.transaction(async (manager) => {
      const enrollments: Enrollment[] = [];
      for (const course_id of course_ids) {
        const enrollment = manager.create(Enrollment, {
          student_id,
          course_id,
          semester_id,
        });
        enrollments.push(await manager.save(Enrollment, enrollment));
      }
      return enrollments;
    });
  }

  async findByStudent(
    student_id: number,
    semester_id?: number,
  ): Promise<Enrollment[]> {
    const where: { student_id: number; semester_id?: number } = { student_id };
    if (semester_id) where.semester_id = semester_id;
    return await this.enrollmentRepository.find({ where });
  }
}
