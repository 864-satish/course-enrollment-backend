import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timetable } from './entities/timetable.entity';
import { TimetableService } from './timetable.service';
import {
  TimetableController,
  TimetableAdminController,
} from './timetable.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Timetable])],
  providers: [TimetableService],
  controllers: [TimetableController, TimetableAdminController],
  exports: [TimetableService],
})
export class TimetableModule {}
