# TaskFlow — Trello-Inspired Kanban Board

A modern full-stack Kanban productivity application inspired by Trello, built using React, Node.js, Express, and MySQL.

Supports drag-and-drop task management, multiple boards, global inbox workflow, labels, and checklist tracking.

---

# Live Demo

- Frontend:  
  https://trello-clone-6spq6jfgm-itsswetas-projects.vercel.app

- Backend API:  
  https://trello-clone-pebf.onrender.com

- GitHub Repository:  
  https://github.com/dearsweta/trello-clone

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- @dnd-kit

## Backend
- Node.js
- Express.js
- MySQL
- mysql2

## Deployment
- Vercel
- Render
- Railway MySQL

---

# Features

- Multiple Kanban boards
- Drag-and-drop cards
- Cross-list movement
- Global Inbox system
- Board ↔ Inbox movement
- Labels & due dates
- Checklist progress tracking
- Responsive modern UI

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/dearsweta/trello-clone.git
cd trello-clone
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trello_clone
```

Run database setup:

```bash
mysql -u root -p trello_clone < db/schema.sql
mysql -u root -p trello_clone < db/seed.sql
```

Start backend:

```bash
npm run dev
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:3001
```

Start frontend:

```bash
npm run dev
```

# Assumptions Made

- Single workspace environment
- No authentication or authorization implemented
- Inbox is global across all boards
- Optimized primarily for desktop usage
- Real-time collaboration not implemented
- File attachments and notifications are planned future improvements
  
## Author
Sweta Jaiswal

GitHub:
https://github.com/dearsweta
