import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  async enroll(
    @Body('studentId') studentId: number,
    @Body('courseIds') courseIds: number[],
    @Body('semesterId') semesterId: number,
  ) {
    return this.enrollmentService.enrollStudent(
      studentId,
      courseIds,
      semesterId,
    );
  }
}

@Controller('students/:studentId/enrollments')
export class StudentEnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  async findByStudent(
    @Param('studentId') studentId: number,
    @Query('semesterId') semesterId?: number,
  ) {
    return this.enrollmentService.findByStudent(
      Number(studentId),
      semesterId ? Number(semesterId) : undefined,
    );
  }
}
