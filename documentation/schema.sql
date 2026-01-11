-- Course Enrollment System - Database Schema
-- PostgreSQL Database Schema Definition
-- This file contains the complete SQL schema for creating all tables, constraints, and indexes

-- ============================================================================
-- TABLES
-- ============================================================================

-- Colleges Table
CREATE TABLE "colleges" (
  "id" SERIAL NOT NULL,
  "name" character varying NOT NULL,
  CONSTRAINT "UQ_colleges_name" UNIQUE ("name"),
  CONSTRAINT "PK_colleges" PRIMARY KEY ("id")
);

-- Students Table
CREATE TABLE "students" (
  "id" SERIAL NOT NULL,
  "name" character varying NOT NULL,
  "college_id" integer NOT NULL,
  CONSTRAINT "PK_students" PRIMARY KEY ("id"),
  CONSTRAINT "FK_students_college" FOREIGN KEY ("college_id") 
    REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Courses Table
CREATE TABLE "courses" (
  "id" SERIAL NOT NULL,
  "code" character varying NOT NULL,
  "college_id" integer NOT NULL,
  CONSTRAINT "PK_courses" PRIMARY KEY ("id"),
  CONSTRAINT "FK_courses_college" FOREIGN KEY ("college_id") 
    REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Semesters Table
CREATE TABLE "semesters" (
  "id" SERIAL NOT NULL,
  "name" character varying NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  CONSTRAINT "PK_semesters" PRIMARY KEY ("id")
);

-- Course Timetables Table
CREATE TABLE "course_timetables" (
  "id" SERIAL NOT NULL,
  "course_id" integer NOT NULL,
  "day_of_week" character varying NOT NULL,
  "start_time" time NOT NULL,
  "end_time" time NOT NULL,
  CONSTRAINT "PK_course_timetables" PRIMARY KEY ("id"),
  CONSTRAINT "FK_timetables_course" FOREIGN KEY ("course_id") 
    REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "CHK_timetable_time" CHECK (start_time < end_time)
);

-- Enrollments Table
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
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Indexes for better query performance on foreign keys

CREATE INDEX "IDX_students_college_id" ON "students" ("college_id");
CREATE INDEX "IDX_courses_college_id" ON "courses" ("college_id");
CREATE INDEX "IDX_timetables_course_id" ON "course_timetables" ("course_id");
CREATE INDEX "IDX_enrollments_student_id" ON "enrollments" ("student_id");
CREATE INDEX "IDX_enrollments_course_id" ON "enrollments" ("course_id");
CREATE INDEX "IDX_enrollments_semester_id" ON "enrollments" ("semester_id");

-- ============================================================================
-- CONSTRAINTS SUMMARY
-- ============================================================================

-- Primary Keys:
--   - colleges.id
--   - students.id
--   - courses.id
--   - semesters.id
--   - course_timetables.id
--   - enrollments.id

-- Foreign Keys (with CASCADE on DELETE):
--   - students.college_id → colleges.id
--   - courses.college_id → colleges.id
--   - course_timetables.course_id → courses.id
--   - enrollments.student_id → students.id
--   - enrollments.course_id → courses.id
--   - enrollments.semester_id → semesters.id

-- Unique Constraints:
--   - colleges.name (unique)
--   - enrollments (student_id, course_id, semester_id) (unique)

-- Check Constraints:
--   - course_timetables.start_time < end_time

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. All foreign keys use ON DELETE CASCADE to maintain referential integrity
-- 2. The unique constraint on enrollments prevents duplicate enrollments
-- 3. Indexes are created on foreign key columns for query optimization
-- 4. Timestamps use CURRENT_TIMESTAMP as default for enrolled_at
-- 5. All tables use SERIAL for auto-incrementing primary keys

