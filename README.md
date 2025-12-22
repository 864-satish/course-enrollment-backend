# Student Course Enrollment System – Backend

## Overview
This project implements a backend system for a **Student Course Enrollment Platform**.  
It allows colleges to onboard, manage students and courses, define course timetables, and enable students to enroll in courses while ensuring **no timetable conflicts**.

The system is designed with scalability, data integrity, and clear separation of responsibilities in mind.

---

## Core Features

- Manage colleges, students, and courses
- Define multiple timetable slots per course
- Allow students to enroll in multiple courses
- Prevent timetable clashes during enrollment
- Enforce college-level data isolation
- Admin support for modifying course timetables safely

---

## Tech Stack

- Backend Framework: **NestJS**
- Database: **PostgreSQL**
- ORM: **TypeORM**
- Language: **TypeScript**

---

## Functional Requirements

### 1. Database Design
The database supports:
- Colleges onboarded onto the platform
- Students enrolled in a college
- Courses offered by a college
- Course timetables (day, start time, end time)
- Student course enrollments

Constraints enforced:
- Students can only enroll in courses from their own college
- Timetable clashes are not allowed for a student

---

### 2. Student Course Enrollment API

**Input**
- Student ID
- List of Course IDs

**Validations**
- Student exists
- Courses exist
- Student and courses belong to the same college
- No overlapping timetable slots across selected courses

**Output**
- Successfully saved enrollments
- OR validation error with reason

---

### 3. Bonus Features

#### Database Constraints
- Foreign key constraints
- Unique enrollment constraints
- Triggers to prevent timetable clashes

#### Admin Capabilities
- Add, edit, delete course timetable slots
- Prevent timetable changes that cause conflicts for already enrolled students

---

## How to Run

1. Clone the repository
2. Install dependencies
