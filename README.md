# 🎓 Student Productivity OS

> A full-stack productivity platform designed to help students plan, track, and optimize their academic journey.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Overview

Student Productivity OS is a modern productivity platform built specifically for students.

Instead of using separate tools for tasks, study planning, coding progress, placement tracking, notes, goals, and analytics, students can manage everything from a single dashboard.

The platform combines academic planning, productivity tracking, and career preparation into one centralized workspace.

---

## ✨ Key Features

### 🔐 Authentication & Security

* JWT Authentication
* Protected Routes
* Password Hashing with bcrypt
* Persistent Login Sessions
* User-specific Data Isolation

---

### 📋 Task Manager

* Create, Update, Delete Tasks
* Task Status Tracking
* Search & Filtering
* Completion Monitoring
* Productivity Metrics

---

### 📚 Study Planner

* Study Session Management
* Track Study Hours
* Mark Sessions Complete
* Study Progress Analytics

---

### 💼 Placement Tracker

* Company Application Tracking
* Placement Pipeline Monitoring
* Interview Status Tracking
* Success Analytics

---

### 💻 Coding Tracker

* Problem Solving History
* Difficulty-wise Tracking
* Coding Streak Monitoring
* Coding Analytics

---

### 📝 Notes Management

* Create Notes
* Edit Notes
* Delete Notes
* Categorized Notes
* Search Functionality

---

### 🎯 Goal Tracking

* Goal Creation & Management
* Progress Monitoring
* Completion Status
* Goal Analytics

---

### 📊 Analytics Dashboard

* Productivity Metrics
* Task Completion Insights
* Study Statistics
* Coding Progress Charts
* Placement Analytics

---

### 👤 Student Profile

* Academic Information
* Productivity Score
* Coding Streak
* Study Statistics
* Placement Overview

---

## 🖼️ Screenshots

Add screenshots here after UI modernization.

### Login Page

```bash
/screenshots/login.png
```

### Dashboard

```bash
/screenshots/dashboard.png
```

### Tasks

```bash
/screenshots/tasks.png
```

### Analytics

```bash
/screenshots/analytics.png
```

---

## 🏗️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* TailwindCSS
* Zustand
* React Router
* Recharts

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication

* JWT
* bcrypt

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 📂 Project Structure

```bash
student-productivity-os/

├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── types/
│
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Madhav0976/student-productivity-os.git

cd student-productivity-os
```

---

### 2. Backend Setup

```bash
cd backend

npm install

cp .env.example .env

npm run dev
```

Backend Environment Variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

Frontend Environment Variables:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Tasks

```http
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Study

```http
GET    /api/study
POST   /api/study
PUT    /api/study/:id
DELETE /api/study/:id
```

### Placements

```http
GET    /api/placements
POST   /api/placements
PUT    /api/placements/:id
DELETE /api/placements/:id
```

### Coding

```http
GET    /api/coding
POST   /api/coding
PUT    /api/coding/:id
DELETE /api/coding/:id
```

### Notes

```http
GET    /api/notes
POST   /api/notes
PUT    /api/notes/:id
DELETE /api/notes/:id
```

### Goals

```http
GET    /api/goals
POST   /api/goals
PUT    /api/goals/:id
DELETE /api/goals/:id
```

### Analytics

```http
GET /api/analytics
```

---

## 🌍 Live Demo

### Frontend

Add your Vercel URL here.

### Backend

Add your Render URL here.

---

## 🛣️ Roadmap

### Phase 1 ✅

* Authentication
* Dashboard
* Tasks
* Study Planner
* Coding Tracker
* Placement Tracker
* Notes
* Goals
* Analytics

### Phase 2 🚧

* Modern UI/UX Redesign
* Improved Dashboard
* Advanced Analytics
* Better Mobile Experience

### Phase 3 🚧

* Kanban Task Board
* Calendar View
* Deadline Reminders
* Notifications
* Productivity Scoring Engine

### Phase 4 🚧

* Resume Builder
* ATS Resume Scanner
* Placement Intelligence
* Career Insights

### Phase 5 🚧

* AI Study Assistant
* AI Task Planner
* AI Productivity Coach

### Phase 6 🚧

* MCP Integrations
* Google Calendar Sync
* Gmail Integration
* GitHub Activity Sync
* Notion Sync
* Custom MCP Server

---

## 🤝 Contributing

Contributions, suggestions, and feature requests are welcome.

Fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

T. V. Bindu Madhav

B.Tech CSE Student | Open Source Contributor | Full Stack Developer | AI/ML Enthusiast

Building practical software products, AI applications, and productivity systems.

GitHub: https://github.com/Madhav0976

LinkedIn: https://www.linkedin.com/in/madhavtanguturi

⭐ If you found this project interesting, consider giving it a star.
