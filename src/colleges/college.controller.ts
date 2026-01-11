import { Controller, Post, Get, Body } from '@nestjs/common';
import { CollegeService } from './college.service';

@Controller('colleges')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Post()
  async create(@Body('name') name: string) {
    return this.collegeService.create(name);
  }

  @Get()
  async findAll() {
    return this.collegeService.findAll();
  }
}
