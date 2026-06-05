# Student Productivity OS

Student Productivity OS is a full-stack productivity platform for college students to manage tasks, study planning, placement applications, coding progress, notes, goals, dashboards, analytics, and profile stats.

## Tech Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, React Router, Zustand, Recharts
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT authentication with bcrypt password hashing
- Deployment: Vercel frontend, Render backend

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
frontend/
  public/
  src/
    components/
    hooks/
    layouts/
    pages/
    services/
    store/
    types/
```

## Local Setup

1. Install backend dependencies:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

3. Configure environment variables:

Backend `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## API Routes

All feature routes except auth require `Authorization: Bearer <token>`.

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/study`
- `POST /api/study`
- `PUT /api/study/:id`
- `DELETE /api/study/:id`
- `GET /api/placements`
- `POST /api/placements`
- `PUT /api/placements/:id`
- `DELETE /api/placements/:id`
- `GET /api/coding`
- `POST /api/coding`
- `PUT /api/coding/:id`
- `DELETE /api/coding/:id`
- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`
- `GET /api/analytics`

## Deployment Guide

### Backend on Render

1. Create a new Render Web Service.
2. Connect this repository.
3. Set root directory to `backend`.
4. Set build command to `npm install`.
5. Set start command to `npm start`.
6. Add environment variables from `backend/.env.example`.
7. Set `CLIENT_URL` to your deployed Vercel frontend URL.

### Frontend on Vercel

1. Create a new Vercel project.
2. Set root directory to `frontend`.
3. Set build command to `npm run build`.
4. Set output directory to `dist`.
5. Add `VITE_API_URL=https://your-render-service.onrender.com/api`.

## Features

- JWT register, login, logout, and protected routes
- Dashboard summary cards for tasks, study hours, coding streak, placement progress, and notes
- Task manager with create, update, delete, filter, and search
- Study planner with sessions, completion toggle, and progress
- Placement tracker with company pipeline and success analytics
- Coding tracker with solved problem history and difficulty charts
- Notes system with categories, search, create, edit API, and delete
- Goals module with progress bars and status updates
- Analytics page with Recharts visualizations
- Profile page with user info and productivity stats
- Responsive UI with dark mode
