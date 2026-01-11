import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Course } from '../courses/entities/course.entity';
import { Timetable } from '../timetables/entities/timetable.entity';
import { EnrollmentService } from './enrollment.service';
import {
  EnrollmentController,
  StudentEnrollmentController,
} from './enrollment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Student, Course, Timetable])],
  providers: [EnrollmentService],
  controllers: [EnrollmentController, StudentEnrollmentController],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
