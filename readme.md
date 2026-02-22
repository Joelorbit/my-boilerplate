# Simple MERN Boilerplate

A clean, casual, and minimal MERN starter you can clone and build on.

What you get
- React + Vite frontend
- Express + MongoDB backend (Mongo optional for quick start)
- JWT auth (register, login, me)
- Basic security middleware and rate limiting
- Simple API helper and example pages

Project structure
- boiler-plate-frontend
- boiler-plate-backend

Quick start (two terminals)

Backend
```powershell
cd boiler-plate-backend
npm install
copy .env.example .env
npm run dev
```

Frontend
```powershell
cd boiler-plate-frontend
npm install
npm run dev
```

Environment

Backend
- PORT
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- CORS_ORIGIN (comma-separated list)

Frontend
- VITE_API_URL (defaults to http://localhost:4000)

Notes
- If MONGO_URI is not set, the backend uses an in-memory user store (no persistence).
