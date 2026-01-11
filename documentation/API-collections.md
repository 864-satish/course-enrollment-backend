# API Collections

Complete API documentation with cURL commands for testing all endpoints in the Course Enrollment System.

**Base URL**: `http://localhost:3000`

---

## Table of Contents

1. [Health Check](#health-check)
2. [College APIs](#college-apis)
3. [Student APIs](#student-apis)
4. [Course APIs](#course-apis)
5. [Semester APIs](#semester-apis)
6. [Timetable APIs](#timetable-apis)
7. [Enrollment APIs](#enrollment-apis)
8. [Complete Testing Flow](#complete-testing-flow)
9. [Error Testing](#error-testing)

---

## Health Check

### GET - Health Check

```bash
curl -X GET http://localhost:3000/
```

**Response**: Simple "Hello" message

---

## College APIs

### POST - Create College

```bash
curl -X POST http://localhost:3000/colleges \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MIT"
  }'
```

**Request Body:**
```json
{
  "name": "MIT"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "MIT"
}
```

### GET - Get All Colleges

```bash
curl -X GET http://localhost:3000/colleges
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "MIT"
  }
]
```

---

## Student APIs

### POST - Create Student

```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "collegeId": 1
  }'
```

**Request Body:**
```json
{
  "name": "John Doe",
  "collegeId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "college_id": 1
}
```

### GET - Get Students by College

```bash
curl -X GET http://localhost:3000/colleges/1/students
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "college_id": 1
  }
]
```

---

## Course APIs

### POST - Create Course

```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CS101",
    "collegeId": 1
  }'
```

**Request Body:**
```json
{
  "code": "CS101",
  "collegeId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "code": "CS101",
  "college_id": 1
}
```

### GET - Get Courses by College

```bash
curl -X GET http://localhost:3000/colleges/1/courses
```

**Response:**
```json
[
  {
    "id": 1,
    "code": "CS101",
    "college_id": 1
  }
]
```

---

## Semester APIs

### POST - Create Semester

```bash
curl -X POST http://localhost:3000/semesters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fall 2024",
    "startDate": "2024-09-01",
    "endDate": "2024-12-15"
  }'
```

**Request Body:**
```json
{
  "name": "Fall 2024",
  "startDate": "2024-09-01",
  "endDate": "2024-12-15"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Fall 2024",
  "start_date": "2024-09-01",
  "end_date": "2024-12-15"
}
```

### GET - Get All Semesters

```bash
curl -X GET http://localhost:3000/semesters
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Fall 2024",
    "start_date": "2024-09-01",
    "end_date": "2024-12-15"
  }
]
```

---

## Timetable APIs

### POST - Add Timetable to Course

```bash
curl -X POST http://localhost:3000/courses/1/timetables \
  -H "Content-Type: application/json" \
  -d '{
    "dayOfWeek": "Monday",
    "startTime": "09:00",
    "endTime": "10:30"
  }'
```

**Request Body:**
```json
{
  "dayOfWeek": "Monday",
  "startTime": "09:00",
  "endTime": "10:30"
}
```

**Response:**
```json
{
  "id": 1,
  "course_id": 1,
  "day_of_week": "Monday",
  "start_time": "09:00:00",
  "end_time": "10:30:00"
}
```

### GET - Get Timetables for a Course

```bash
curl -X GET http://localhost:3000/courses/1/timetables
```

**Response:**
```json
[
  {
    "id": 1,
    "course_id": 1,
    "day_of_week": "Monday",
    "start_time": "09:00:00",
    "end_time": "10:30:00"
  }
]
```

### PUT - Update Timetable (Admin)

```bash
curl -X PUT http://localhost:3000/timetables/1 \
  -H "Content-Type: application/json" \
  -d '{
    "dayOfWeek": "Tuesday",
    "startTime": "10:00",
    "endTime": "11:30"
  }'
```

**Request Body:**
```json
{
  "dayOfWeek": "Tuesday",
  "startTime": "10:00",
  "endTime": "11:30"
}
```

### DELETE - Delete Timetable (Admin)

```bash
curl -X DELETE http://localhost:3000/timetables/1
```

**Response:**
```json
{
  "deleted": true
}
```

---

## Enrollment APIs

### POST - Enroll Student in Courses

```bash
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseIds": [1, 2, 3],
    "semesterId": 1
  }'
```

**Request Body:**
```json
{
  "studentId": 1,
  "courseIds": [1, 2, 3],
  "semesterId": 1
}
```

**Response:**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "course_id": 1,
    "semester_id": 1,
    "enrolled_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "student_id": 1,
    "course_id": 2,
    "semester_id": 1,
    "enrolled_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 3,
    "student_id": 1,
    "course_id": 3,
    "semester_id": 1,
    "enrolled_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET - Get Student Enrollments

```bash
curl -X GET http://localhost:3000/students/1/enrollments
```

**Response:**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "course_id": 1,
    "semester_id": 1,
    "enrolled_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET - Get Student Enrollments by Semester

```bash
curl -X GET "http://localhost:3000/students/1/enrollments?semesterId=1"
```

**Response:** Same as above, filtered by semester

---

## Complete Testing Flow

Follow this sequence to test the entire system:

### Step 1: Create a College

```bash
curl -X POST http://localhost:3000/colleges \
  -H "Content-Type: application/json" \
  -d '{"name": "MIT"}'
```

**Save the college ID** from response (e.g., `1`)

### Step 2: Create Students

```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "collegeId": 1}'

curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Smith", "collegeId": 1}'
```

**Save student IDs** (e.g., `1`, `2`)

### Step 3: Create Courses

```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"code": "CS101", "collegeId": 1}'

curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"code": "CS102", "collegeId": 1}'

curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"code": "MATH101", "collegeId": 1}'
```

**Save course IDs** (e.g., `1`, `2`, `3`)

### Step 4: Create Semester

```bash
curl -X POST http://localhost:3000/semesters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fall 2024",
    "startDate": "2024-09-01",
    "endDate": "2024-12-15"
  }'
```

**Save semester ID** (e.g., `1`)

### Step 5: Add Timetables to Courses

```bash
# CS101 - Monday 9:00-10:30
curl -X POST http://localhost:3000/courses/1/timetables \
  -H "Content-Type: application/json" \
  -d '{"dayOfWeek": "Monday", "startTime": "09:00", "endTime": "10:30"}'

# CS102 - Monday 11:00-12:30 (No conflict with CS101)
curl -X POST http://localhost:3000/courses/2/timetables \
  -H "Content-Type: application/json" \
  -d '{"dayOfWeek": "Monday", "startTime": "11:00", "endTime": "12:30"}'

# MATH101 - Tuesday 09:00-10:30 (Different day, no conflict)
curl -X POST http://localhost:3000/courses/3/timetables \
  -H "Content-Type: application/json" \
  -d '{"dayOfWeek": "Tuesday", "startTime": "09:00", "endTime": "10:30"}'
```

### Step 6: Enroll Student in Courses

```bash
# Enroll student 1 in courses 1, 2, 3 (should succeed - no conflicts)
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseIds": [1, 2, 3],
    "semesterId": 1
  }'
```

### Step 7: View Enrollments

```bash
# Get all enrollments for student 1
curl -X GET http://localhost:3000/students/1/enrollments

# Get enrollments for student 1 in semester 1
curl -X GET "http://localhost:3000/students/1/enrollments?semesterId=1"
```

---

## Error Testing

### Test 1: Timetable Conflict

```bash
# Add a conflicting timetable (same day, overlapping time)
curl -X POST http://localhost:3000/courses/2/timetables \
  -H "Content-Type: application/json" \
  -d '{"dayOfWeek": "Monday", "startTime": "09:30", "endTime": "11:00"}'

# Try to enroll - should fail with conflict error
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseIds": [1, 2],
    "semesterId": 1
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": "Timetable clash detected between selected courses"
}
```

### Test 2: Student from Different College

```bash
# Create another college
curl -X POST http://localhost:3000/colleges \
  -H "Content-Type: application/json" \
  -d '{"name": "Harvard"}'

# Create a course in the new college
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"code": "PHY101", "collegeId": 2}'

# Try to enroll student from college 1 in course from college 2 - should fail
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseIds": [4],
    "semesterId": 1
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": "All courses must belong to the same college as the student"
}
```

### Test 3: Invalid Student ID

```bash
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 999,
    "courseIds": [1],
    "semesterId": 1
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": "Student not found"
}
```

### Test 4: Invalid Course ID

```bash
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseIds": [999],
    "semesterId": 1
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": "One or more courses not found"
}
```

---

## Postman Import

You can import these cURL commands into Postman:

1. Open Postman
2. Click **"Import"** button
3. Select **"Raw text"** tab
4. Paste any cURL command
5. Postman will automatically parse and create the request

---

## Notes

- Replace `localhost:3000` with your actual server URL if different
- Replace IDs (1, 2, 3, etc.) with actual IDs from your database responses
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- All times should be in 24-hour format (HH:mm)
- The enrollment API validates:
  - Student exists
  - All courses exist
  - Student and courses belong to the same college
  - No timetable conflicts between selected courses

---

## API Summary Table

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|----------------|
| `/` | GET | Health check | No |
| `/colleges` | POST, GET | Manage colleges | No |
| `/students` | POST | Create student | No |
| `/colleges/:collegeId/students` | GET | Get students by college | No |
| `/courses` | POST | Create course | No |
| `/colleges/:collegeId/courses` | GET | Get courses by college | No |
| `/semesters` | POST, GET | Manage semesters | No |
| `/courses/:courseId/timetables` | POST, GET | Manage course timetables | No |
| `/timetables/:id` | PUT, DELETE | Admin: Update/Delete timetables | No |
| `/enrollments` | POST | Enroll student in courses | No |
| `/students/:studentId/enrollments` | GET | Get student enrollments | No |

**Note**: Authentication/Authorization is not implemented in the current version. Consider adding it for production use.

