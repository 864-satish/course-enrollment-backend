import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentService } from './student.service';
import {
  StudentController,
  CollegeStudentController,
} from './student.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentService],
  controllers: [StudentController, CollegeStudentController],
  exports: [StudentService],
})
export class StudentModule {}
