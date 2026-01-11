import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(
    @Body('code') code: string,
    @Body('collegeId') collegeId: number,
  ) {
    return this.courseService.create(code, collegeId);
  }
}

@Controller('colleges/:collegeId/courses')
export class CollegeCourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async findByCollege(@Param('collegeId') collegeId: number) {
    return this.courseService.findByCollege(Number(collegeId));
  }
}
