# eShop

**Full-stack multi-vendor e-commerce · MERN, Socket.IO, Cloudinary**

Multi-vendor e-commerce platform with user, seller, and admin dashboards, real-time chat, Cloudinary uploads, and payment integration.

- **Frontend:** `frontend/` (React)
- **Backend:** `backend/` (Node.js, Express, MongoDB)
- **Socket:** `socket/` (Socket.IO)

## Quick start

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm start

# Socket.IO (optional, for chat)
cd socket && npm install && node index.js
```

## Configuration

- Backend: copy [`backend/config/.env.example`](backend/config/.env.example) to `backend/config/.env` and fill values. **MongoDB:** set `DB_URL` (or `MONGO_URI`) to your connection string, e.g. `mongodb://127.0.0.1:27017/eshop`. Start Mongo locally or with Docker: `docker run -d --name eshop-mongo -p 27017:27017 mongo:7`. Set `FRONTEND_URL` to your React origin(s), comma-separated for CORS.
- Frontend: copy [`frontend/.env.example`](frontend/.env.example) to `frontend/.env` — set `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` to match your deployed API and socket hosts.
- Socket: copy [`socket/.env.example`](socket/.env.example) to `socket/.env`; align `FRONTEND_URL` with the SPA origin.
- Stripe: use `STRIPE_PUBLISHABLE_KEY` for the publishable key; configure `STRIPE_WEBHOOK_SECRET` and point Stripe webhooks to `POST /api/v2/payment/webhook` on your API base (raw JSON body).

## Docker

```bash
cd backend && docker build -t eshop-backend . && docker run -p 4000:4000 --env-file config/.env eshop-backend
```
