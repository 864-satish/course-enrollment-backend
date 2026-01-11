import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(name: string, college_id: number): Promise<Student> {
    const student = this.studentRepository.create({ name, college_id });
    return this.studentRepository.save(student);
  }

  async findByCollege(college_id: number): Promise<Student[]> {
    return this.studentRepository.find({ where: { college_id } });
  }
}
