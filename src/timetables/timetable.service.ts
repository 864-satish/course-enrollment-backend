import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './entities/timetable.entity';

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable)
    private readonly timetableRepository: Repository<Timetable>,
  ) {}

  async addTimetable(
    course_id: number,
    day_of_week: string,
    start_time: string,
    end_time: string,
  ): Promise<Timetable> {
    const timetable = this.timetableRepository.create({
      course_id,
      day_of_week,
      start_time,
      end_time,
    });
    return await this.timetableRepository.save(timetable);
  }

  async updateTimetable(
    id: number,
    day_of_week: string,
    start_time: string,
    end_time: string,
  ): Promise<Timetable> {
    const timetable = await this.timetableRepository.findOneBy({ id });
    if (!timetable) throw new Error('Timetable not found');
    timetable.day_of_week = day_of_week;
    timetable.start_time = start_time;
    timetable.end_time = end_time;
    return await this.timetableRepository.save(timetable);
  }

  async deleteTimetable(id: number): Promise<void> {
    await this.timetableRepository.delete(id);
  }

  async findByCourse(course_id: number): Promise<Timetable[]> {
    return await this.timetableRepository.find({ where: { course_id } });
  }
}
