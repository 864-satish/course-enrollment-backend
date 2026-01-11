import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { College } from '../../colleges/entities/college.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @ManyToOne(() => College, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'college_id' })
  college: College;

  @Column()
  college_id: number;
}
