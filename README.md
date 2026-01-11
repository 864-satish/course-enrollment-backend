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
### 2. 📄 **[Design Documentation (HLD and LLD)](./documentation/design-doc.md)** 
- High-Level Design (HLD) and Low-Level Design (LLD) with system architecture



### 3. Student Course Enrollment API

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

### 4. Bonus Features

#### Database Constraints
- Foreign key constraints
- Unique enrollment constraints
- Triggers to prevent timetable clashes

#### Admin Capabilities
- Add, edit, delete course timetable slots
- Prevent timetable changes that cause conflicts for already enrolled students

---

---

## Documentation

Comprehensive documentation is available in the [`documentation`](./documentation) folder:

- 📘 **[Setup Guide](./documentation/setup-guide.md)** - Complete setup instructions, database configuration, and troubleshooting
- 🏗️ **[Design Documentation](./documentation/design-doc.md)** - High-Level Design (HLD) and Low-Level Design (LLD) with system architecture
- 🔌 **[API Collections](./documentation/API-collections.md)** - Complete API documentation with cURL commands for testing
- 🗄️ **[Database Schema](./documentation/database-schema.md)** - Detailed database schema with tables, relationships, and constraints
- 📄 **[Schema SQL](./documentation/schema.sql)** - Complete SQL file for creating the database schema
- ✅ **[Requirements Verification](./documentation/deliverables-review.md)** - Verification that all functional requirements and deliverables are met

---

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course-enrollment-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create database** (see [Setup Guide](./documentation/setup-guide.md))
   ```bash
   createdb -U postgres "course-enrollment-backend-db"
   ```

4. **Configure environment variables**
   Create `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=course-enrollment-backend-db
   PORT=3000
   ```

5. **Start the server**
   ```bash
   npm run start:dev
   ```

6. **Test the API**
   ```bash
   curl http://localhost:3000/
   ```

For detailed setup instructions, see the [Setup Guide](./documentation/setup-guide.md).

---

## How to Run

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Using Migrations

```bash
npm run build
npx typeorm migration:run -d ormconfig.json
```

See [Database Schema](./documentation/database-schema.md) for migration details.