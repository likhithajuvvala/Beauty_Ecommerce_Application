# Beauty E‑Commerce (Express + MySQL + React)

A production-style, resume-ready **beauty products** e-commerce platform.

**Stack**
- **Frontend:** React (Vite) + HTML/CSS/JS (Tailwind prewired)
- **Backend:** Node.js + Express + Sequelize (ORM)
- **DB:** MySQL
- **Auth:** JWT-based login/signup
- **Realtime:** Socket.IO (inventory & price updates)
- **Dynamic Pricing:** demand + stock + time-of-day
- **Tests:** Jest + Supertest (backend), Vitest + Testing Library (frontend)
- **Infra:** Dockerfiles + docker-compose + GitHub Actions CI
- **Seed data** included

---

## Quick Start (Docker)
```bash
docker compose up --build -d
# wait ~10–20s for MySQL
docker compose exec backend npm run db:migrate
docker compose exec backend npm run db:seed
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:4000
- phpMyAdmin (optional if enabled): http://localhost:8080

### Default creds after seed
- **User:** user@example.com / `Test@1234`
- **Admin:** admin@example.com / `Admin@1234`

---

## Local Setup (Manual)
### Prereqs
- Node 18+
- **MySQL 8+** running locally (create DB: `beauty_ecom`)
- Create `backend/.env` from `.env.example` and set your MySQL URI

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```
Backend: http://localhost:4000

### Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```
Frontend: http://localhost:5173

---

## API (selected)
- `POST /api/auth/signup`, `POST /api/auth/login`
- `GET  /api/products` (query: `q`, `category`, `minPrice`, `maxPrice`)
- `GET  /api/products/:id`
- `POST /api/products` (admin)
- `PUT  /api/products/:id` (admin)
- `POST /api/cart/checkout` (JWT) → creates order, decrements stock, broadcasts updates
- `GET  /api/orders/my` (JWT)
- `GET  /api/pricing/preview/:id` (admin)

---

## Dynamic Pricing
`price = basePrice × demandFactor × stockFactor × timeFactor`
- **Demand:** recent demand raises price (up to +25%)
- **Stock:** low stock bumps price, high stock reduces
- **Time:** slight evening multiplier

---

## Scripts
Backend:
- `npm run db:migrate` — run Sequelize migrations
- `npm run db:seed` — seed users/products
- `npm test` — Jest + Supertest

Frontend:
- `npm test` — Vitest + RTL
- `npm run build` — production build

---

## Deploy
- Containerize with included Dockerfiles; push images to your registry.
- Or deploy backend to Render/Railway with a managed MySQL; frontend to Netlify/Vercel (set `VITE_API_URL`).

---

## Structure
```
backend/   # Express + Sequelize + MySQL + Socket.IO
frontend/  # React + Vite + Tailwind
docker-compose.yml
.github/workflows/ci.yml
```
