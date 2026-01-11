import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('colleges')
export class College {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
