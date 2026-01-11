import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity('course_timetables')
export class Timetable {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  course_id: number;

  @Column()
  day_of_week: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;
}
