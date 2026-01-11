import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { College } from '../../colleges/entities/college.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => College, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'college_id' })
  college: College;

  @Column()
  college_id: number;
}
