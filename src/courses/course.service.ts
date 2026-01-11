import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(code: string, college_id: number): Promise<Course> {
    const course = this.courseRepository.create({ code, college_id });
    return await this.courseRepository.save(course);
  }

  async findByCollege(college_id: number): Promise<Course[]> {
    return await this.courseRepository.find({ where: { college_id } });
  }
}
