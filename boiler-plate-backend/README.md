# Boilerplate Backend

Simple Express + Mongo backend for the MERN starter.

Features
- Health check and demo endpoints
- JWT auth endpoints (register, login, me)
- Optional MongoDB with in-memory fallback
- Basic security middleware and rate limiting

Endpoints
- GET /health
- GET /api/hello
- POST /api/echo
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (Bearer token)

Run locally
```powershell
cd boiler-plate-backend
npm install
copy .env.example .env
npm run dev
```

Environment
- PORT (default 4000)
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- CORS_ORIGIN (comma-separated list)
