# Database Schema

Complete database schema documentation for the Course Enrollment System, including tables, columns, data types, relationships, and constraints.

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Tables](#tables)
3. [Relationships](#relationships)
4. [Constraints](#constraints)
5. [Indexes](#indexes)
6. [Data Types](#data-types)
7. [SQL Schema File](#sql-schema-file)

---

## Schema Overview

The database consists of **6 main tables**:

1. `colleges` - College information
2. `students` - Student records
3. `courses` - Course offerings
4. `semesters` - Semester information
5. `course_timetables` - Timetable slots for courses
6. `enrollments` - Student course enrollments

---

## Tables

### 1. colleges

Stores college information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY, NOT NULL | Auto-incrementing unique identifier |
| `name` | VARCHAR | UNIQUE, NOT NULL | College name (must be unique) |

**Example:**
```sql
INSERT INTO colleges (name) VALUES ('MIT');
```

---

### 2. students

Stores student information linked to colleges.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY, NOT NULL | Auto-incrementing unique identifier |
| `name` | VARCHAR | NOT NULL | Student name |
| `college_id` | INTEGER | FOREIGN KEY, NOT NULL | Reference to colleges.id |

**Foreign Key:**
- `college_id` → `colleges.id` (ON DELETE CASCADE)

**Example:**
```sql
INSERT INTO students (name, college_id) VALUES ('John Doe', 1);
```

---

### 3. courses

Stores course information linked to colleges.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY, NOT NULL | Auto-incrementing unique identifier |
| `code` | VARCHAR | NOT NULL | Course code (e.g., "CS101") |
| `college_id` | INTEGER | FOREIGN KEY, NOT NULL | Reference to colleges.id |

**Foreign Key:**
- `college_id` → `colleges.id` (ON DELETE CASCADE)

**Example:**
```sql
INSERT INTO courses (code, college_id) VALUES ('CS101', 1);
```

---

### 4. semesters

Stores semester information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY, NOT NULL | Auto-incrementing unique identifier |
| `name` | VARCHAR | NOT NULL | Semester name (e.g., "Fall 2024") |
| `start_date` | DATE | NOT NULL | Semester start date |
| `end_date` | DATE | NOT NULL | Semester end date |

**Example:**
```sql
INSERT INTO semesters (name, start_date, end_date) 
VALUES ('Fall 2024', '2024-09-01', '2024-12-15');
```

---

### 5. course_timetables

Stores timetable slots for courses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY, NOT NULL | Auto-incrementing unique identifier |
| `course_id` | INTEGER | FOREIGN KEY, NOT NULL | Reference to courses.id |
| `day_of_week` | VARCHAR | NOT NULL | Day of week (e.g., "Monday", "Tuesday") |
| `start_time` | TIME | NOT NULL | Class start time (HH:mm format) |
| `end_time` | TIME | NOT NULL | Class end time (HH:mm format) |

**Foreign Key:**
- `course_id` → `courses.id` (ON DELETE CASCADE)

**Check Constraint:**
- `CHK_timetable_time`: Ensures `start_time < end_time`

**Example:**
```sql
INSERT INTO course_timetables (course_id, day_of_week, start_time, end_time) 
VALUES (1, 'Monday', '09:00', '10:30');
```

---

### 6. enrollments

Stores student course enrollments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY, NOT NULL | Auto-incrementing unique identifier |
| `student_id` | INTEGER | FOREIGN KEY, NOT NULL | Reference to students.id |
| `course_id` | INTEGER | FOREIGN KEY, NOT NULL | Reference to courses.id |
| `semester_id` | INTEGER | FOREIGN KEY, NOT NULL | Reference to semesters.id |
| `enrolled_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Enrollment timestamp |

**Foreign Keys:**
- `student_id` → `students.id` (ON DELETE CASCADE)
- `course_id` → `courses.id` (ON DELETE CASCADE)
- `semester_id` → `semesters.id` (ON DELETE CASCADE)

**Unique Constraint:**
- (`student_id`, `course_id`, `semester_id`) - Prevents duplicate enrollments

**Example:**
```sql
INSERT INTO enrollments (student_id, course_id, semester_id) 
VALUES (1, 1, 1);
```

---

## Relationships

### Entity Relationship Diagram

```
colleges (1) ────────< (*) students
    │
    │ (1)
    │
    └───────< (*) courses (1) ────────< (*) course_timetables

students (*) ────────< (*) enrollments (*) ────────< (1) semesters
    │
    │ (*)
    │
courses (*) ────────< (*) enrollments
```

[![Complete Entity relations](./erd-schema.svg)](./erd-schema.svg)

### Relationship Details

1. **College → Students** (One-to-Many)
   - One college can have many students
   - Each student belongs to one college

2. **College → Courses** (One-to-Many)
   - One college can offer many courses
   - Each course belongs to one college

3. **Course → Timetables** (One-to-Many)
   - One course can have many timetable slots
   - Each timetable slot belongs to one course

4. **Student ↔ Course** (Many-to-Many via Enrollments)
   - Students can enroll in multiple courses
   - Courses can have multiple students enrolled
   - Relationship is tracked through `enrollments` table

5. **Semester → Enrollments** (One-to-Many)
   - One semester can have many enrollments
   - Each enrollment is for a specific semester

---

## Constraints

### Primary Keys

All tables have a primary key on the `id` column:

- `colleges.id` (PRIMARY KEY)
- `students.id` (PRIMARY KEY)
- `courses.id` (PRIMARY KEY)
- `semesters.id` (PRIMARY KEY)
- `course_timetables.id` (PRIMARY KEY)
- `enrollments.id` (PRIMARY KEY)

### Foreign Keys

All foreign keys use `ON DELETE CASCADE` to maintain referential integrity:

| Foreign Key | References | On Delete |
|-------------|------------|----------|
| `students.college_id` | `colleges.id` | CASCADE |
| `courses.college_id` | `colleges.id` | CASCADE |
| `course_timetables.course_id` | `courses.id` | CASCADE |
| `enrollments.student_id` | `students.id` | CASCADE |
| `enrollments.course_id` | `courses.id` | CASCADE |
| `enrollments.semester_id` | `semesters.id` | CASCADE |

**CASCADE Behavior:**
- When a parent record is deleted, all child records are automatically deleted
- Example: Deleting a college will delete all its students and courses

### Unique Constraints

1. **colleges.name** - College names must be unique
   ```sql
   CONSTRAINT "UQ_colleges_name" UNIQUE ("name")
   ```

2. **enrollments (student_id, course_id, semester_id)** - Prevents duplicate enrollments
   ```sql
   CONSTRAINT "UQ_enrollments_student_course_semester" 
   UNIQUE ("student_id", "course_id", "semester_id")
   ```

### Check Constraints

1. **course_timetables (start_time < end_time)** - Ensures valid time range
   ```sql
   CONSTRAINT "CHK_timetable_time" CHECK (start_time < end_time)
   ```

### Application-Level Validations

While not enforced at database level, the application enforces:

1. **Timetable Conflict**: No overlapping time slots on the same day
2. **College Match**: Students can only enroll in courses from their college
3. **Date Validation**: Semester start_date < end_date

---

## Indexes

Indexes are created on foreign key columns for better query performance:

| Index Name | Table | Column(s) |
|------------|-------|-----------|
| `IDX_students_college_id` | `students` | `college_id` |
| `IDX_courses_college_id` | `courses` | `college_id` |
| `IDX_timetables_course_id` | `course_timetables` | `course_id` |
| `IDX_enrollments_student_id` | `enrollments` | `student_id` |
| `IDX_enrollments_course_id` | `enrollments` | `course_id` |
| `IDX_enrollments_semester_id` | `enrollments` | `semester_id` |

**Benefits:**
- Faster joins on foreign key columns
- Improved query performance for filtering by relationships
- Better performance for enrollment queries

---

## Data Types

### PostgreSQL Data Types Used

| Type | Description | Example |
|------|-------------|---------|
| `SERIAL` | Auto-incrementing integer | `1, 2, 3, ...` |
| `INTEGER` | 32-bit integer | `1, 100, 999` |
| `VARCHAR` | Variable-length string | `'MIT'`, `'CS101'` |
| `DATE` | Date value | `'2024-09-01'` |
| `TIME` | Time value | `'09:00:00'` |
| `TIMESTAMP` | Date and time | `'2024-01-15 10:30:00'` |

### Type Mappings (TypeORM → PostgreSQL)

| TypeORM | PostgreSQL | Notes |
|---------|-----------|-------|
| `@PrimaryGeneratedColumn()` | `SERIAL` | Auto-increment |
| `@Column()` | `VARCHAR` | Default string type |
| `@Column({ type: 'date' })` | `DATE` | Date only |
| `@Column({ type: 'time' })` | `TIME` | Time only |
| `@Column({ type: 'timestamp' })` | `TIMESTAMP` | Date and time |

---

## SQL Schema File

A complete SQL schema file is available at:

📄 **[schema.sql](./schema.sql)**

This file contains:
- All table creation statements
- All constraint definitions
- All index creation statements
- Comments explaining the schema

**Usage:**
```bash
# Create database first
createdb -U postgres "course-enrollment-backend-db"

# Run schema file
psql -U postgres -d "course-enrollment-backend-db" -f documentation/schema.sql
```

---

## Schema Summary

### Table Count
- **6 tables** total

### Relationship Count
- **6 foreign key relationships**
- **1 many-to-many relationship** (via enrollments)

### Constraint Count
- **6 primary keys**
- **6 foreign keys**
- **2 unique constraints**
- **6 indexes**

### Data Integrity Features

✅ **Referential Integrity**: Foreign keys ensure valid relationships  
✅ **Uniqueness**: Unique constraints prevent duplicates  
✅ **Cascade Deletes**: Automatic cleanup of related records  
✅ **Indexes**: Optimized query performance  
✅ **Type Safety**: Proper data types for all columns  

---

## Migration

The schema can also be created using TypeORM migrations:

📄 **Migration File**: `src/common/database/migrations/1700000000000-CreateInitialTables.ts`

**To run migration:**
```bash
npm run build
npx typeorm migration:run -d ormconfig.json
```

See [Setup Guide](./setup-guide.md) for detailed instructions.

---

## Notes

1. **Development vs Production**:
   - Development: `synchronize: true` auto-creates schema
   - Production: Use migrations for schema changes

2. **Naming Conventions**:
   - Table names: lowercase, plural (e.g., `colleges`, `students`)
   - Column names: snake_case (e.g., `college_id`, `start_time`)
   - Constraint names: Descriptive (e.g., `FK_students_college`)

3. **Future Enhancements**:
   - Consider adding `created_at` and `updated_at` timestamps to all tables
   - Consider adding soft deletes for audit trails
   - Consider adding course capacity limits
   - Consider adding waitlist functionality

