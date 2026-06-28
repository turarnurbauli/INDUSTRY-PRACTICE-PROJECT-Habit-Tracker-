# HabitFlow — Habit Tracker

Full-stack habit tracking application built for the **Industry Practice Project**.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **Validation:** Joi

## Features (100 points checklist)

| Requirement | Implementation |
|-------------|----------------|
| 3 database entities | `User`, `Habit`, `HabitLog` |
| Auth endpoints | `POST /api/register`, `POST /api/login`, `GET /api/profile` |
| CRUD resource | `POST/GET/PUT/DELETE /api/habits` |
| Search, filter, pagination | `GET /api/habits?search=read&frequency=daily&category=health&page=1&limit=10` |
| JWT + protected routes | `Authorization: Bearer <token>` |
| Password hashing | bcrypt (12 rounds) |
| Environment variables | `.env` |
| Validation | Joi (backend) + frontend forms |
| Global error handler | `src/middleware/errorHandler.js` |
| Responsive UI | Desktop, tablet, mobile |
| Light / dark mode | `localStorage` theme preference |
| localStorage | Theme + last search/filter settings |
| Profile page | `/profile.html` |

## Project Structure

```
habit-tracker/
├── public/              # Frontend (HTML, CSS, JS)
├── src/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth, validation, errors
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── validators/      # Joi schemas
├── server.js
├── package.json
└── REPORT.md
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 2. Install

```bash
cd habit-tracker
npm install
```

### 3. Environment

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Edit `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/habit-tracker
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Run

```bash
npm start
```

Open: http://localhost:3000

## API Documentation

### Authentication

#### Register
`POST /api/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret123",
  "phone": "+77001234567"
}
```

#### Login
`POST /api/login`

```json
{
  "email": "john@example.com",
  "password": "Secret123"
}
```

#### Profile (protected)
`GET /api/profile`

Header: `Authorization: Bearer <token>`

### Habits (protected)

#### Create habit
`POST /api/habits`

```json
{
  "title": "Read 20 pages",
  "description": "Evening reading",
  "frequency": "daily",
  "category": "learning",
  "color": "#4f46e5"
}
```

#### List habits (search, filter, pagination)
`GET /api/habits?search=read&frequency=daily&category=learning&page=1&limit=10`

#### Update habit
`PUT /api/habits/:id`

#### Delete habit
`DELETE /api/habits/:id`

#### Log completion
`POST /api/habits/:id/log`

```json
{
  "completedDate": "2026-06-28T00:00:00.000Z",
  "status": "completed",
  "notes": "Finished chapter 3"
}
```

## Deployment (Render)

1. Push project to GitHub
2. Create MongoDB Atlas cluster (free tier)
3. On [Render](https://render.com):
   - New **Web Service**
   - Connect repository
   - Build command: `npm install`
   - Start command: `npm start`
4. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
5. Add deployment URL to `REPORT.md`

## Demo Account (optional for defense)

Create via Sign Up page or register API.

## License

MIT
