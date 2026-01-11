# Setup Guide

This guide provides comprehensive instructions to set up and run the Course Enrollment Backend system.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Environment Configuration](#environment-configuration)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (v12 or higher)
- **pgAdmin4** (optional, for GUI database management)

---

## Database Setup

### Method 1: Using pgAdmin4 (GUI)

1. **Open pgAdmin4**
   - Launch pgAdmin4 application
   - Connect to your PostgreSQL server (enter password if prompted)

2. **Create Database**
   - Right-click on "Databases" in the left sidebar
   - Select **"Create"** → **"Database..."**

3. **Configure Database**
   - **Database name**: `course-enrollment-backend-db`
   - **Owner**: Select your PostgreSQL user (usually `postgres`)
   - **Encoding**: `UTF8` (default)
   - **Template**: `template0` (recommended)
   - Click **"Save"**

4. **Verify**
   - The database should appear in the Databases list

### Method 2: Using PostgreSQL CLI

1. **Connect to PostgreSQL**
   ```bash
   psql -U postgres
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE "course-enrollment-backend-db";
   ```

3. **Verify**
   ```sql
   \l
   ```

4. **Exit**
   ```sql
   \q
   ```

### Method 3: Using createdb Command

```bash
createdb -U postgres "course-enrollment-backend-db"
```

**Note**: The database name uses hyphens, so it must be enclosed in double quotes in SQL commands.

---

## Environment Configuration

1. **Create `.env` file** in the project root:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=course-enrollment-backend-db

   # Server Configuration
   PORT=3000
   ```

2. **Replace values** with your actual PostgreSQL credentials

---

## Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd course-enrollment-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## Running the Application

### Development Mode

```bash
npm run start:dev
```

This will:
- Start the NestJS application in watch mode
- Connect to the database
- Automatically create tables (if `synchronize: true` is enabled)
- Start the server on `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Using Migrations (Recommended for Production)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Run migrations**
   ```bash
   npx typeorm migration:run -d ormconfig.json
   ```

   See [Database Schema](./database-schema.md) for migration details.

---

## Verification

### 1. Check Application Status

**Health Check Endpoint:**
```bash
curl http://localhost:3000/
```

Expected response: A simple "Hello" message

### 2. Verify Database Connection

- Check application logs for successful database connection
- No connection errors should appear

### 3. Verify Tables Created

**Using psql:**
```sql
\c "course-enrollment-backend-db"
\dt
```

You should see:
- `colleges`
- `students`
- `courses`
- `semesters`
- `course_timetables`
- `enrollments`

**Using pgAdmin4:**
- Expand the database in the left sidebar
- Check "Schemas" → "public" → "Tables"

### 4. Test API Endpoint

**Create a College:**
```bash
curl -X POST http://localhost:3000/colleges \
  -H "Content-Type: application/json" \
  -d '{"name": "MIT"}'
```

Expected response: JSON with college ID

---

## Troubleshooting

### Database Connection Error

**Symptoms:**
- `ECONNREFUSED` error
- `password authentication failed`

**Solutions:**
1. Verify PostgreSQL is running:
   ```bash
   # macOS/Linux
   pg_isready
   
   # Windows
   # Check Services for PostgreSQL
   ```

2. Check `.env` credentials match your PostgreSQL setup

3. Verify database exists:
   ```sql
   \l
   ```

### Port Already in Use

**Symptoms:**
- `EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Change `PORT` in `.env` file
2. Or stop the process using port 3000:
   ```bash
   # Find process
   lsof -i :3000
   
   # Kill process (replace PID)
   kill -9 <PID>
   ```

### Module Not Found

**Symptoms:**
- `Cannot find module` errors

**Solutions:**
1. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Tables Not Created

**Symptoms:**
- Application starts but tables don't exist

**Solutions:**
1. Check `synchronize: true` is enabled in `app.module.ts` (development only)
2. Or run migrations manually (see [Database Schema](./database-schema.md))
3. Check database connection logs for errors

### Permission Denied

**Symptoms:**
- `permission denied` when creating database

**Solutions:**
1. Ensure PostgreSQL user has CREATE DATABASE privileges
2. Connect as superuser (usually `postgres`)

---

## Next Steps

After successful setup:

1. ✅ Review [API Collections](./API-collections.md) for testing endpoints
2. ✅ Check [Design Documentation](./design-doc.md) for system architecture
3. ✅ Review [Database Schema](./database-schema.md) for schema details
4. ✅ Start testing the APIs!

---

## Important Notes

⚠️ **Production Warning**: 
- Disable `synchronize: true` in production
- Use migrations for schema changes
- Always backup database before migrations

⚠️ **Security**: 
- Never commit `.env` file to version control
- Use strong database passwords in production
- Consider using environment-specific configuration

---

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start development | `npm run start:dev` |
| Build project | `npm run build` |
| Run migrations | `npx typeorm migration:run -d ormconfig.json` |
| Health check | `curl http://localhost:3000/` |

