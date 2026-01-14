import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './common/redis/redis.module';
import { CollegeModule } from './colleges/college.module';
import { StudentModule } from './students/student.module';
import { CourseModule } from './courses/course.module';
import { SemesterModule } from './semesters/semester.module';
import { TimetableModule } from './timetables/timetable.module';
import { EnrollmentModule } from './enrollments/enrollment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number.parseInt(process.env.DB_PORT || '5432', 10) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'course_enrollment_db',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production and use migrations
    }),
    RedisModule,
    CollegeModule,
    StudentModule,
    CourseModule,
    SemesterModule,
    TimetableModule,
    EnrollmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
