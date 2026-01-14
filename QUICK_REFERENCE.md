# Quick Reference - Interview Prep

## 🎯 Design Patterns (7 patterns)

1. **Repository Pattern** - TypeORM repositories abstract DB access
2. **Service Layer Pattern** - Business logic in services
3. **Dependency Injection** - NestJS DI container
4. **Module Pattern** - Domain-driven modules
5. **Transaction Script** - Atomic operations with transactions
6. **Factory Pattern** - TypeORM repository factories
7. **Exception Filter Pattern** - Centralized error handling

## 🏗️ Architecture

- **Type**: Modular Monolith
- **Style**: Layered Architecture (Controller → Service → Repository → DB)
- **Database**: PostgreSQL with TypeORM
- **Framework**: NestJS (Node.js/TypeScript)

## ✅ Strengths

✅ Clean modular architecture  
✅ Transaction-safe enrollment operations  
✅ Multi-layer data integrity (DB + Application)  
✅ Proper entity relationships  
✅ Comprehensive documentation  

## ⚠️ Top 5 Improvements Needed

1. **DTOs & Validation** - Missing input validation (no class-validator)
2. **Duplicate Check** - Missing explicit duplicate enrollment check
3. **Timetable Updates** - No conflict validation on timetable updates
4. **Error Handling** - Inconsistent exception types
5. **Production Config** - `synchronize: true` risk, need migrations

## 💡 Key Interview Points

### Core Feature: Timetable Conflict Detection
```typescript
// Location: EnrollmentService.enrollStudent()
// Algorithm: O(n²) pairwise comparison
// Checks: Same day + overlapping time ranges
```

### Transaction Management
```typescript
// Location: EnrollmentService.enrollStudent() line 70-81
// Uses: dataSource.transaction()
// Purpose: Atomic enrollment, rollback on failure
```

### Data Integrity Layers
1. Database: Foreign keys, unique constraints, check constraints
2. Application: Service layer validations
3. Transaction: ACID guarantees

## 🎤 Sample Answers

**Q: Why NestJS?**  
A: Built-in DI, TypeScript, modular architecture, TypeORM integration, enterprise patterns

**Q: How do you prevent race conditions?**  
A: Database transactions with unique constraints. Future: pessimistic locking for high concurrency.

**Q: Conflict detection algorithm?**  
A: Pairwise comparison of timetables - check same day and overlapping time ranges. O(n²) complexity.

**Q: Scalability?**  
A: Modular monolith allows horizontal scaling. Stateless API, database indexes, can extract microservices later.

**Q: What would you improve?**  
A: Add DTOs/validation, implement duplicate checks, add conflict validation for timetable updates, add logging, implement proper migrations for production.

## 📊 System Stats

- **6 Domain Modules**: Colleges, Students, Courses, Semesters, Timetables, Enrollments
- **6 Entities**: One per domain
- **1 Critical Transaction**: Enrollment operation
- **Key Constraint**: Unique (student_id, course_id, semester_id)

## 🔗 Key Files

- `enrollments/enrollment.service.ts` - Core enrollment logic
- `enrollments/enrollment.controller.ts` - REST endpoints
- `app.module.ts` - Root module configuration
- `documentation/design-doc.md` - Full design documentation

---
*Quick reference for interview preparation*
