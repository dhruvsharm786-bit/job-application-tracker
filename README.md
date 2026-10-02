# Job Application Tracker

A full-stack job application tracker built with Java Spring Boot, MySQL, React, and Vite.

## Features
- Add, edit, delete job applications
- Track status: Applied, Screening, Assessment, Interview, Offer, Rejected, Withdrawn
- Track priority
- Add multiple interview rounds to an application
- Add follow-up reminders
- Dashboard with application/interview/offer/rejection counts
- Overdue and upcoming follow-up section
- Search and status filtering
- Browser notification reminders
- Responsive UI

## Stack
- Backend: Java, Spring Boot, Spring Data JPA, REST API
- Database: MySQL
- Frontend: React, Vite, plain CSS
- Vite 8.1 is used in the frontend setup. Spring Boot 3.5.16 is used for broad Java 17 compatibility.

## Requirements
- Java 17+
- Maven 3.9+
- Node.js 20+
- MySQL 8+

## 1. Create database

```sql
CREATE DATABASE job_tracker;
```

Then edit:
`backend/src/main/resources/application.properties`

Set your MySQL username/password.

## 2. Start backend

```bash
cd backend
mvn spring-boot:run
```

Backend:
http://localhost:8080

## 3. Start frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:
http://localhost:5173

## API
- GET /api/applications
- GET /api/applications/{id}
- POST /api/applications
- PUT /api/applications/{id}
- DELETE /api/applications/{id}
- POST /api/applications/{id}/interviews
- DELETE /api/interviews/{id}
- GET /api/followups
- POST /api/applications/{id}/followups
- PATCH /api/followups/{id}/complete
- DELETE /api/followups/{id}
- GET /api/dashboard

## Suggested future upgrades
- JWT authentication and multiple users
- Email reminders with Spring Mail
- Resume version storage
- Calendar integration
- CSV import/export
- Charts using Recharts
- Deployment with Docker + MySQL/PostgreSQL
- Automated tests and CI/CD
