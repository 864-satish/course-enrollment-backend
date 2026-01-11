import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Body('collegeId') collegeId: number,
  ) {
    return this.studentService.create(name, collegeId);
  }
}

@Controller('colleges/:collegeId/students')
export class CollegeStudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findByCollege(@Param('collegeId') collegeId: number) {
    return this.studentService.findByCollege(Number(collegeId));
  }
}
