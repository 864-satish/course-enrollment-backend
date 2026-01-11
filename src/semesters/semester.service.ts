import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './entities/semester.entity';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
  ) {}

  async create(
    name: string,
    start_date: string,
    end_date: string,
  ): Promise<Semester> {
    const semester = this.semesterRepository.create({
      name,
      start_date,
      end_date,
    });
    return await this.semesterRepository.save(semester);
  }

  async findAll(): Promise<Semester[]> {
    return await this.semesterRepository.find();
  }
}
