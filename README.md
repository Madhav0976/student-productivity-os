# 🎓 Student Productivity OS

> A Full-Stack Productivity Platform built for students to manage academics, coding progress, placements, goals, notes, and productivity analytics from a single dashboard.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

---

# 🌐 Live Demo

### Frontend

https://student-productivity-os.vercel.app

### Backend API

https://student-productivity-os.onrender.com

---

# 🚀 Overview

Student Productivity OS is a centralized productivity platform designed specifically for students.

Most students use separate tools for:

* Task Management
* Study Planning
* Placement Tracking
* Coding Progress
* Notes
* Goal Tracking
* Productivity Analytics

This project combines all of them into a single web application.

The goal is to help students organize their academic journey, monitor progress, and improve productivity using data-driven insights.

---

# 🎯 Why I Built This

As a Computer Science student, I found myself switching between multiple applications to manage tasks, study plans, coding practice, placements, notes, and goals.

I built Student Productivity OS to solve this problem by creating a single platform where students can manage everything from one dashboard while also improving my full-stack development, deployment, authentication, and cloud engineering skills.

---

# ✨ Features

## 🔐 Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Password Hashing using bcrypt
* User-Specific Data Isolation
* Persistent Login Sessions

---

## 📋 Task Manager

* Create Tasks
* Edit Tasks
* Delete Tasks
* Mark Tasks Complete
* Search Tasks
* Filter Tasks
* Track Progress

---

## 📚 Study Planner

* Create Study Sessions
* Track Study Hours
* Mark Sessions Complete
* Study Progress Monitoring

---

## 💼 Placement Tracker

* Track Applications
* Company Pipeline Management
* Interview Tracking
* Placement Analytics

---

## 💻 Coding Tracker

* Track Solved Problems
* Difficulty Tracking
* Coding Progress Analytics
* Coding Streak Monitoring

---

## 📝 Notes Management

* Create Notes
* Edit Notes
* Delete Notes
* Categorize Notes
* Search Notes

---

## 🎯 Goal Tracking

* Create Goals
* Track Goal Progress
* Update Goal Status
* Completion Monitoring

---

## 📊 Analytics Dashboard

* Productivity Insights
* Task Statistics
* Study Statistics
* Coding Statistics
* Placement Analytics

---

## 👤 Student Profile

* Academic Information
* Productivity Score
* Coding Streak
* Study Statistics
* Placement Overview

---

## 🌙 UI Features

* Responsive Design
* Dark Mode
* Mobile Friendly Layout
* Protected Navigation

---

# ✅ Current Features Status

| Feature           | Status |
| ----------------- | ------ |
| Authentication    | ✅      |
| Dashboard         | ✅      |
| Tasks             | ✅      |
| Study Planner     | ✅      |
| Placement Tracker | ✅      |
| Coding Tracker    | ✅      |
| Notes             | ✅      |
| Goals             | ✅      |
| Analytics         | ✅      |
| Profile           | ✅      |
| Dark Mode         | ✅      |
| Cloud Deployment  | ✅      |

---

# 🏗️ System Architecture

```text
Frontend (React + Vite + TypeScript)
                │
                ▼
      Express REST API
                │
                ▼
       MongoDB Atlas
                │
                ▼
      Cloud Infrastructure
```

### Deployment Architecture

```text
Frontend  → Vercel

Backend   → Render

Database  → MongoDB Atlas

Auth      → JWT
```

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS
* Zustand
* React Router
* Recharts

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* JWT
* bcrypt

## Deployment

* Vercel
* Render

---

# 📂 Project Structure

```text
student-productivity-os/
Add screenshot here
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

# 📸 Screenshots

> Screenshots will be updated as the UI evolves.

### Login Page

<img width="1915" height="999" alt="image" src="https://github.com/user-attachments/assets/e5eaaf7a-d01f-4700-842f-7d2e50ae5e9e" />


### Dashboard

<img width="1915" height="999" alt="image" src="https://github.com/user-attachments/assets/9cc86cce-7893-4567-a272-83921fe199c2" />


### Tasks

<img width="1915" height="999" alt="image" src="https://github.com/user-attachments/assets/5990733e-667e-4236-aadc-ab36118a20e3" />


### Analytics

<img width="1915" height="999" alt="image" src="https://github.com/user-attachments/assets/1deaf6c0-47f2-4f08-9230-5c76a45ad5e6" />


### Profile

<img width="1915" height="999" alt="image" src="https://github.com/user-attachments/assets/8a524291-4180-4e3e-b8c2-1f74c646ff03" />


---

# ⚙️ Local Development Setup

## Clone Repository

```bash
git clone https://github.com/Madhav0976/student-productivity-os.git

cd student-productivity-os
```

---

## Backend Setup

```bash
cd backend

npm install

cp .env.example .env

npm run dev
```

Backend Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## Frontend Setup

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 🔌 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Tasks

```http
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

## Study

```http
GET    /api/study
POST   /api/study
PUT    /api/study/:id
DELETE /api/study/:id
```

## Placements

```http
GET    /api/placements
POST   /api/placements
PUT    /api/placements/:id
DELETE /api/placements/:id
```

## Coding

```http
GET    /api/coding
POST   /api/coding
PUT    /api/coding/:id
DELETE /api/coding/:id
```

## Notes

```http
GET    /api/notes
POST   /api/notes
PUT    /api/notes/:id
DELETE /api/notes/:id
```

## Goals

```http
GET    /api/goals
POST   /api/goals
PUT    /api/goals/:id
DELETE /api/goals/:id
```

## Analytics

```http
GET /api/analytics
```

---

# ⚡ Challenges Faced

During development, several real-world engineering challenges were encountered:

* JWT Authentication Flow
* MongoDB Atlas Configuration
* Render Deployment Issues
* Vercel Deployment Issues
* CORS Configuration
* Protected Routes
* API Integration
* State Management
* Production Environment Variables

---

# 📚 What I Learned

This project helped me gain hands-on experience in:

* React + TypeScript Development
* State Management using Zustand
* REST API Design
* JWT Authentication
* MongoDB Atlas
* Mongoose ODM
* Express Middleware
* Cloud Deployment
* Git & GitHub Workflow
* Frontend-Backend Integration
* Production Debugging

---

# 🛣️ Roadmap

## Phase 1 ✅ Core Platform

* Authentication
* Dashboard
* Tasks
* Study Planner
* Coding Tracker
* Placement Tracker
* Notes
* Goals
* Analytics
* Deployment

---

## Phase 2 🚧 UI/UX Modernization

* Modern Dashboard Design
* Better Analytics
* Improved Navigation
* Enhanced Mobile Experience
* Advanced Empty States
* Improved User Experience

---

## Phase 3 🚧 Productivity Features

* Kanban Task Board
* Calendar View
* Priority Management
* Notifications
* Deadline Tracking
* Smart Productivity Scoring

---

## Phase 4 🚧 Resume-Worthy Features

* Resume Builder
* ATS Resume Scanner
* Placement Intelligence
* Career Insights
* Interview Preparation Hub

---

## Phase 5 🚧 AI Features

* AI Study Assistant
* AI Productivity Coach
* AI Task Planning
* AI Note Summarization
* AI Goal Recommendations

---

## Phase 6 🚧 MCP Integrations

* Google Calendar MCP
* Gmail MCP
* GitHub MCP
* Notion MCP
* LinkedIn MCP
* AI Agent Workflows
* Custom Student Productivity MCP Server

---

## Phase 7 🚧 SaaS Features

* Team Workspaces
* Subscription Plans
* Productivity Reports
* Collaboration Features
* Public API
* Multi-Tenant Architecture

---

# 🤝 Contributing

Contributions, feature suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

# ⭐ Support

If you found this project useful, consider giving it a star.

---

# 👨‍💻 Author

T. V. Bindu Madhav

B.Tech CSE Student | Open Source Contributor | Full Stack Developer | AI/ML Enthusiast

GitHub: https://github.com/Madhav0976

LinkedIn: https://www.linkedin.com/in/madhavtanguturi

---

# 📄 License

This project is licensed under the MIT License.
