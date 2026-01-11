import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';
import { Semester } from '../../semesters/entities/semester.entity';

@Entity('enrollments')
@Unique(['student_id', 'course_id', 'semester_id'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: number;

  @ManyToOne(() => Course, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  course_id: number;

  @ManyToOne(() => Semester, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;

  @Column()
  semester_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrolled_at: Date;
}
