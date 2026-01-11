import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College } from './entities/college.entity';

@Injectable()
export class CollegeService {
  constructor(
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
  ) {}

  async create(name: string): Promise<College> {
    const existingCollege = await this.collegeRepository.findOneBy({ name });
    if (existingCollege) {
      throw new BadRequestException('College already exists');
    }
    const college = this.collegeRepository.create({ name });
    return await this.collegeRepository.save(college);
  }

  async findAll(): Promise<College[]> {
    return await this.collegeRepository.find();
  }
}
