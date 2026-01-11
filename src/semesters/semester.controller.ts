import { Controller, Post, Get, Body } from '@nestjs/common';
import { SemesterService } from './semester.service';

@Controller('semesters')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
  ) {
    return this.semesterService.create(name, startDate, endDate);
  }

  @Get()
  async findAll() {
    return this.semesterService.findAll();
  }
}
