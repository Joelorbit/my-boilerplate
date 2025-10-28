# Boilerplate Backend

This is a minimal Node/Express backend for the boilerplate project.

Available endpoints:

- GET /health — simple health check
- GET /api/hello — returns a hello message
- POST /api/echo — echoes JSON body

How to run:

1. Open a terminal in this folder:

```powershell
cd boiler-plate-backend
```

2. Install dependencies (only required the first time):

```powershell
npm install
```

3. Start server in development (auto-restarts on changes):

```powershell
npm run dev
```

4. Or start normally:

```powershell
npm start
```

Notes:

- Uses `PORT` env var if provided, otherwise defaults to 4000.
- To restrict CORS, set `CORS_ORIGIN` environment variable.
