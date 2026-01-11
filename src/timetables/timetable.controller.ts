import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { TimetableService } from './timetable.service';

@Controller('courses/:courseId/timetables')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  async addTimetable(
    @Param('courseId') courseId: number,
    @Body('dayOfWeek') dayOfWeek: string,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
  ) {
    return this.timetableService.addTimetable(
      Number(courseId),
      dayOfWeek,
      startTime,
      endTime,
    );
  }

  @Get()
  async findByCourse(@Param('courseId') courseId: number) {
    return this.timetableService.findByCourse(Number(courseId));
  }
}

@Controller('timetables')
export class TimetableAdminController {
  constructor(private readonly timetableService: TimetableService) {}

  @Put(':id')
  async updateTimetable(
    @Param('id') id: number,
    @Body('dayOfWeek') dayOfWeek: string,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
  ) {
    return this.timetableService.updateTimetable(
      Number(id),
      dayOfWeek,
      startTime,
      endTime,
    );
  }

  @Delete(':id')
  async deleteTimetable(@Param('id') id: number) {
    await this.timetableService.deleteTimetable(Number(id));
    return { deleted: true };
  }
}
