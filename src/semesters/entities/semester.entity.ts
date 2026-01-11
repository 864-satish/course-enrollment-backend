import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('semesters')
export class Semester {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;
}
