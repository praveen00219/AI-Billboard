# 🪧 AI Billboard Analysis

AI-powered platform for reporting and analyzing roadside billboards for **safety, structural and
content compliance**. Citizens submit billboard photos; a Google Gemini vision model extracts content
and scores risk; authorities review reports on a dashboard and a live violation **heatmap**.

## ✨ Features
- Citizen & Authority auth — JWT in httpOnly cookies, role-based access control
- Photo upload + AI billboard analysis (content / structure / placement risk scoring)
- Citizen dashboard — submit and track reports
- Authority dashboard — review reports, update status, view users
- Interactive violation heatmap (Leaflet)

## 🧱 Tech Stack
**Backend:** Node.js · Express 5 · Prisma ORM · MySQL · JWT · Multer · Google Gemini API
**Frontend:** React 19 · Vite · Tailwind CSS · React Router · TanStack Query · Leaflet · Axios

## 📁 Repository Structure
```
.
├── bill_backend/    # Express + Prisma REST API
│   ├── prisma/      # schema + migrations
│   └── src/         # config · controllers · middlewares · routes · services · utils
└── bill_frontend/   # React + Vite SPA
    └── src/         # api · middleware (context) · navigation · component · hooks · pages
```

## ✅ Prerequisites
- Node.js ≥ 18
- A MySQL database
- A Google Gemini API key

## ⚙️ Backend Setup
```bash
cd bill_backend
npm install
# create .env (see below)
npx prisma generate
npx prisma migrate deploy     # or: npx prisma migrate dev
npm run dev                   # http://localhost:2000
```

### Backend environment — `bill_backend/.env`
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
SEC_KEY=          # JWT secret for citizens
AUTH_KEY=         # JWT secret for authorities
KEY=              # Google Gemini API key
API=              # Gemini API endpoint URL
NODE_ENV=development
```
> `.env` is git-ignored — never commit real secrets. Copy `.env.example` to `.env` and fill it in.

## 💻 Frontend Setup
```bash
cd bill_frontend
npm install
npm run dev                   # http://localhost:5173
```
The SPA calls the API at `http://localhost:2000/api` (configured in `src/api/apiClient.js`).

## 🔌 API Overview
Base URL: `http://localhost:2000/api`

| Module | Example endpoints |
|--------|-------------------|
| Auth   | `POST /auth/userAuth-register` · `POST /auth/userAuth-login` · `GET /auth/me` · `POST /auth/authorityAuth-login` |
| Report | `POST /report/analysis` · `POST /report/citizen-report` · `GET /report/all-reports` · `GET /report/ai-analysis/:reportId` |
| Admin  | `GET /admin/getalluser-for-authority` · `GET /admin/violations` · `PATCH /admin/update-status` |

## 📜 Scripts
| Location | Command | Description |
|----------|---------|-------------|
| backend  | `npm run dev`   | Start API with nodemon |
| frontend | `npm run dev`   | Start Vite dev server |
| frontend | `npm run build` | Production build |

## 🔒 Notes
- `.env`, uploaded media (`bill_backend/uploads/`) and `node_modules/` are git-ignored.
- Frontend route guards are UX-level; the backend JWT is the source of truth for access control.
