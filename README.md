# Trello Clone

Trello-style Kanban app at

## Setup

### 1. MySQL (local, no Docker)

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Runs on http://localhost:3001

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173 (proxies `/api` to backend)

## Structure

```
trello-clone/
├── db/           schema + seed
├── backend/      Express API (routes → controllers → services)
└── frontend/     React + Vite + Tailwind + dnd-kit
```
