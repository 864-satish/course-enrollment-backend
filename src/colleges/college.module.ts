import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { College } from './entities/college.entity';
import { CollegeService } from './college.service';
import { CollegeController } from './college.controller';

@Module({
  imports: [TypeOrmModule.forFeature([College])],
  providers: [CollegeService],
  controllers: [CollegeController],
  exports: [CollegeService],
})
export class CollegeModule {}
