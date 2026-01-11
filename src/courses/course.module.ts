import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseService } from './course.service';
import { CourseController, CollegeCourseController } from './course.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CourseService],
  controllers: [CourseController, CollegeCourseController],
  exports: [CourseService],
})
export class CourseModule {}
