import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './entities/timetable.entity';
import Redlock from 'redlock';

type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
type DaySegment = { dayIndex: DayIndex; startMin: number; endMin: number };

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable)
    private readonly timetableRepository: Repository<Timetable>,
    @Inject('REDLOCK')
    private readonly redlock: Redlock,
  ) { }
  // Expect input day_of_week as a stringified index "0".."6"
  // where 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
  private static readonly DAY_ALIASES: Record<string, DayIndex> = {
    'sunday': 0,
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
  };

  private normalizeDayOfWeek(dayOfWeek: string): DayIndex {
    const key = (dayOfWeek ?? '').toLowerCase().trim();
    const dayIndex = TimetableService.DAY_ALIASES[key];
    if (dayIndex === undefined) {
      throw new BadRequestException(
        'Invalid dayOfWeek. Expected a string from "0" to "6"',
      );
    }
    return dayIndex;
  }

  private dayIndexToCanonical(dayIndex: DayIndex): string {
    return (
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
      dayIndex
      ] ?? 'Sunday'
    );
  }

  private parseTimeToMinutes(time: string): number {
    // Accepts "HH:MM" or "HH:MM:SS"
    const t = (time ?? '').trim();
    const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(t);
    if (!match) {
      throw new BadRequestException(
        'Invalid time format. Expected HH:MM or HH:MM:SS',
      );
    }
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const seconds = match[3] ? Number(match[3]) : 0;
    if (
      !Number.isFinite(hours) ||
      !Number.isFinite(minutes) ||
      !Number.isFinite(seconds) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59 ||
      seconds < 0 ||
      seconds > 59
    ) {
      throw new BadRequestException(
        'Invalid time value. Hours 0-23, minutes/seconds 0-59',
      );
    }
    // "time" columns are second-granular; bump to next minute if seconds>0 to avoid false negatives.
    return hours * 60 + minutes + (seconds > 0 ? 1 : 0);
  }

  private splitIntoDaySegments(
    dayIndex: DayIndex,
    startTime: string,
    endTime: string,
  ): DaySegment[] {
    const startMin = this.parseTimeToMinutes(startTime);
    const endMin = this.parseTimeToMinutes(endTime);

    if (startMin === endMin) {
      throw new BadRequestException(
        'Start time and end time cannot be the same',
      );
    }

    // Same-day interval
    if (startMin < endMin) {
      return [{ dayIndex, startMin, endMin }];
    }

    // Overnight interval: dayIndex [start..24h) + nextDay [0..end)
    const nextDay = (((dayIndex + 1) % 7) as DayIndex);
    return [
      { dayIndex, startMin, endMin: 24 * 60 },
      { dayIndex: nextDay, startMin: 0, endMin },
    ];
  }

  private segmentsOverlap(a: DaySegment, b: DaySegment): boolean {
    if (a.dayIndex !== b.dayIndex) return false;
    // [start, end) overlap
    return !(a.endMin <= b.startMin || b.endMin <= a.startMin);
  }

  private checkTimetableClash(
    timetables: Timetable[],
    day_of_week: string,
    start_time: string,
    end_time: string,
    excludeId?: number,
  ): boolean {
    const candidateDayIndex = this.normalizeDayOfWeek(day_of_week);
    const candidateSegments = this.splitIntoDaySegments(
      candidateDayIndex,
      start_time,
      end_time,
    );

    for (const timetable of timetables) {
      if (excludeId !== undefined && timetable.id === excludeId) continue;

      const existingDayIndex = this.normalizeDayOfWeek(timetable.day_of_week);
      const existingSegments = this.splitIntoDaySegments(
        existingDayIndex,
        timetable.start_time,
        timetable.end_time,
      );

      for (const a of candidateSegments) {
        for (const b of existingSegments) {
          if (this.segmentsOverlap(a, b)) return true;
        }
      }
    }

    return false;
  }
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async addTimetable(
    course_id: number,
    day_of_week: string,
    start_time: string,
    end_time: string,
  ): Promise<Timetable> {
    const resource = `locks:course:${course_id}:timetables`;
    const ttl = 5000; // 5 seconds

    return this.redlock.using([resource], ttl, async () => {
      const allTimetables = await this.timetableRepository.find({
        where: { course_id },
      });
      await this.delay(1000); // artificial delay to simulate
      const isClash = this.checkTimetableClash(
        allTimetables,
        day_of_week,
        start_time,
        end_time,
      );
      if (isClash) throw new BadRequestException('Timetable clash detected');

      const timetable = this.timetableRepository.create({
        course_id,
        day_of_week: this.dayIndexToCanonical(
          this.normalizeDayOfWeek(day_of_week),
        ),
        start_time,
        end_time,
      });
      return await this.timetableRepository.save(timetable);
    });
  }

  async updateTimetable(
    id: number,
    day_of_week: string,
    start_time: string,
    end_time: string,
  ): Promise<Timetable> {
    const timetable = await this.timetableRepository.findOneBy({ id });
    if (!timetable) throw new NotFoundException('Timetable not found');
    const resource = `locks:course:${timetable.course_id}:timetables`;
    const ttl = 5000; // 5 seconds

    return this.redlock.using([resource], ttl, async () => {
      const allTimetables = await this.timetableRepository.find({
        where: { course_id: timetable.course_id },
      });
      const isClash = this.checkTimetableClash(
        allTimetables,
        day_of_week,
        start_time,
        end_time,
        id,
      );
      if (isClash) throw new BadRequestException('Timetable clash detected');

      timetable.day_of_week = this.dayIndexToCanonical(
        this.normalizeDayOfWeek(day_of_week),
      );
      timetable.start_time = start_time;
      timetable.end_time = end_time;
      return await this.timetableRepository.save(timetable);
    });
  }

  async deleteTimetable(id: number): Promise<void> {
    await this.timetableRepository.delete(id);
  }

  async findByCourse(course_id: number): Promise<Timetable[]> {
    return await this.timetableRepository.find({ where: { course_id } });
  }
}
