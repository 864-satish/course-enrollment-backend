import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create colleges table
    await queryRunner.query(`
      CREATE TABLE "colleges" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "UQ_colleges_name" UNIQUE ("name"),
        CONSTRAINT "PK_colleges" PRIMARY KEY ("id")
      )
    `);

    // Create students table
    await queryRunner.query(`
      CREATE TABLE "students" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "college_id" integer NOT NULL,
        CONSTRAINT "PK_students" PRIMARY KEY ("id"),
        CONSTRAINT "FK_students_college" FOREIGN KEY ("college_id") 
          REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create courses table
    await queryRunner.query(`
      CREATE TABLE "courses" (
        "id" SERIAL NOT NULL,
        "code" character varying NOT NULL,
        "college_id" integer NOT NULL,
        CONSTRAINT "PK_courses" PRIMARY KEY ("id"),
        CONSTRAINT "FK_courses_college" FOREIGN KEY ("college_id") 
          REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create semesters table
    await queryRunner.query(`
      CREATE TABLE "semesters" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        CONSTRAINT "PK_semesters" PRIMARY KEY ("id")
      )
    `);

    // Create course_timetables table
    await queryRunner.query(`
      CREATE TABLE "course_timetables" (
        "id" SERIAL NOT NULL,
        "course_id" integer NOT NULL,
        "day_of_week" character varying NOT NULL,
        "start_time" time NOT NULL,
        "end_time" time NOT NULL,
        CONSTRAINT "PK_course_timetables" PRIMARY KEY ("id"),
        CONSTRAINT "FK_timetables_course" FOREIGN KEY ("course_id") 
          REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create enrollments table
    await queryRunner.query(`
      CREATE TABLE "enrollments" (
        "id" SERIAL NOT NULL,
        "student_id" integer NOT NULL,
        "course_id" integer NOT NULL,
        "semester_id" integer NOT NULL,
        "enrolled_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_enrollments" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_enrollments_student_course_semester" UNIQUE ("student_id", "course_id", "semester_id"),
        CONSTRAINT "FK_enrollments_student" FOREIGN KEY ("student_id") 
          REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_enrollments_course" FOREIGN KEY ("course_id") 
          REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_enrollments_semester" FOREIGN KEY ("semester_id") 
          REFERENCES "semesters"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_students_college_id" ON "students" ("college_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_courses_college_id" ON "courses" ("college_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_timetables_course_id" ON "course_timetables" ("course_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_enrollments_student_id" ON "enrollments" ("student_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_enrollments_course_id" ON "enrollments" ("course_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_enrollments_semester_id" ON "enrollments" ("semester_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_enrollments_semester_id"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_enrollments_course_id"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_enrollments_student_id"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_timetables_course_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_courses_college_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_students_college_id"`);

    // Drop tables in reverse order (respecting foreign key constraints)
    await queryRunner.query(`DROP TABLE IF EXISTS "enrollments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "course_timetables"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "semesters"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "courses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "students"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "colleges"`);
  }
}
