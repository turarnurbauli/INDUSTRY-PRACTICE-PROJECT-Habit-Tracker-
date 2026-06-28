# HabitFlow — Industry Practice Report

**Student:** Nurbauli Turar  
**Group:** SE-2425  
**Project:** Habit Tracker Web Application  
**Stack:** HTML, CSS, JavaScript, Node.js, Express, MongoDB  
**Deployment URL:** https://industry-practice-project-habit-tracker.onrender.com

---

## 1. Project Overview

### Problem
Many people struggle to maintain healthy daily routines. Without a simple tracking system, habits are easy to forget and hard to measure.

### Solution
**HabitFlow** is a full-stack habit tracker that allows users to:

- Register and log in securely
- Create, edit, and delete personal habits
- Mark habits as completed for a specific day
- Search and filter habits by keyword, frequency, and category
- View account profile and statistics

### Real-World Value
The application solves a practical productivity and wellness problem for students and professionals who want consistent routines in health, learning, fitness, and mindfulness.

---

## 2. Setup Instructions

### Requirements
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
cd habit-tracker
npm install
copy .env.example .env
```

Configure `.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Run locally

```bash
npm start
```

Application URL: `http://localhost:3000`

---

## 3. Database Design

Three related MongoDB collections:

### Users
| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name |
| email | String | Unique login email |
| password | String | Hashed with bcrypt |
| phone | String | Optional contact number |

### Habits
| Field | Type | Description |
|-------|------|-------------|
| title | String | Habit name |
| description | String | Details |
| frequency | String | `daily` or `weekly` |
| category | String | health, fitness, learning, etc. |
| color | String | UI color marker |
| isActive | Boolean | Active status |
| user | ObjectId | Owner reference |

### HabitLogs
| Field | Type | Description |
|-------|------|-------------|
| habit | ObjectId | Related habit |
| user | ObjectId | Owner reference |
| completedDate | Date | Day of completion |
| status | String | `completed` or `skipped` |
| notes | String | Optional note |

---

## 4. API Documentation

Base URL: `/api`

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Login and receive JWT |
| GET | `/profile` | Yes | Get user profile and stats |

### Habits (resource CRUD)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/habits` | Yes | Create habit |
| GET | `/habits` | Yes | List habits with search/filter/pagination |
| PUT | `/habits/:id` | Yes | Update habit |
| DELETE | `/habits/:id` | Yes | Delete habit |
| POST | `/habits/:id/log` | Yes | Log daily completion |

### Search, Filtering, Pagination Example

```http
GET /api/habits?search=read&frequency=daily&category=learning&page=1&limit=10
Authorization: Bearer <token>
```

**Query parameters:**
- `search` — keyword in title/description
- `frequency` — `daily` or `weekly`
- `category` — habit category
- `page` — page number (default: 1)
- `limit` — items per page (default: 10)

---

## 5. Security and Validation

- JWT authentication for protected routes
- Password hashing with bcrypt (12 salt rounds)
- Sensitive values stored in environment variables
- Server-side validation with Joi
- Global error-handling middleware
- Frontend validation for email, password complexity, phone format, required fields

---

## 6. Frontend Features

- Responsive layout (desktop, tablet, mobile)
- Professional UI with consistent typography and contrast
- Light and dark mode
- User Sign Up, Log In, Profile page
- Habit dashboard with create/edit/delete/complete actions
- Search, filter, and pagination controls
- `localStorage` stores theme preference and last filter configuration

---

## 7. Screenshots

> Add screenshots here before submission:

1. Landing page  
2. Registration page  
3. Login page  
4. Dashboard with habits  
5. Search and filter in action  
6. Profile page  
7. Dark mode example  

---

## 8. Deployment

Deployed on: **Render**

Live URL: **https://industry-practice-project-habit-tracker.onrender.com**

Environment variables configured in hosting dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

---

## 9. Conclusion

HabitFlow meets all project requirements: modular architecture, MongoDB with three related entities, secure REST API, validated input, responsive frontend, and cloud deployment. The application provides a practical solution for building and tracking daily habits.

---

## Requirements Mapping (100 points)

| Section | Points | Status |
|---------|--------|--------|
| Project Setup | 10 | Done |
| Database | 10 | Done |
| API Endpoints | 20 | Done |
| Authentication & Security | 15 | Done |
| Validation & Error Handling | 10 | Done |
| Frontend Requirements | 15 | Done |
| User Features | 10 | Done |
| Deployment | 10 | Live on Render |

**Total:** 90/100 in code + 10 after deployment
