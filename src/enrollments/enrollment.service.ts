import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (!course_ids || course_ids.length === 0) {
      throw new BadRequestException('At least one course must be provided');
    }

    // 1. Validate student exists
    const student = await this.studentRepository.findOneBy({ id: student_id });
    if (!student) throw new NotFoundException('Student not found');

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

    // 3. Check for already enrolled courses in the same semester
    const existingEnrollments = await this.enrollmentRepository.find({
      where: { student_id, semester_id },
    });

    const alreadyEnrolledCourseIds = existingEnrollments
      .map((e) => e.course_id)
      .filter((id) => course_ids.includes(id));

    if (alreadyEnrolledCourseIds.length > 0) {
      throw new ConflictException(
        `Student is already enrolled in courses: ${alreadyEnrolledCourseIds.join(
          ', ',
        )} for this semester`,
      );
    }

    // 4. Fetch all timetables for the selected courses
    const newCourseTimetables = await this.timetableRepository
      .createQueryBuilder('timetable')
      .where('timetable.course_id IN (:...courseIds)', {
        courseIds: course_ids,
      })
      .getMany();

    // 5. Check for timetable clashes among the newly selected courses
    for (let i = 0; i < newCourseTimetables.length; i++) {
      for (let j = i + 1; j < newCourseTimetables.length; j++) {
        if (
          newCourseTimetables[i].day_of_week ===
            newCourseTimetables[j].day_of_week &&
          !(
            newCourseTimetables[i].end_time <=
              newCourseTimetables[j].start_time ||
            newCourseTimetables[j].end_time <=
              newCourseTimetables[i].start_time
          )
        ) {
          throw new BadRequestException(
            'Timetable clash detected between selected courses',
          );
        }
      }
    }

    // 6. Check for timetable clashes with existing enrollments in the same semester
    if (existingEnrollments.length > 0) {
      const existingCourseIds = existingEnrollments.map((e) => e.course_id);

      const existingTimetables = await this.timetableRepository
        .createQueryBuilder('timetable')
        .where('timetable.course_id IN (:...courseIds)', {
          courseIds: existingCourseIds,
        })
        .getMany();

      for (const existing of existingTimetables) {
        for (const incoming of newCourseTimetables) {
          if (
            existing.day_of_week === incoming.day_of_week &&
            !(
              existing.end_time <= incoming.start_time ||
              incoming.end_time <= existing.start_time
            )
          ) {
            throw new BadRequestException(
              'Timetable clash detected with existing enrollments',
            );
          }
        }
      }
    }

    // 7. Save enrollments in a transaction
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
