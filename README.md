# VideoCall

A full-stack real-time video conferencing application built with React, Node.js, Socket.IO, and WebRTC.

## Features

- Real-time video and audio calls (peer-to-peer via WebRTC)
- Screen sharing
- In-call text chat
- User authentication (register / login)
- Meeting history tracking
- Multiple participants per room

## Tech Stack

**Frontend**
- React 19 + Vite
- Material UI (MUI)
- Socket.IO Client
- WebRTC (native browser API)
- React Router v7

**Backend**
- Node.js + Express 5
- Socket.IO
- MongoDB + Mongoose
- bcrypt (password hashing)

## Project Structure

```
VideoCall/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express server entry point
│   │   ├── controller/
│   │   │   ├── socketManager.js    # Socket.IO event handling
│   │   │   └── user.controller.js  # Auth and history controllers
│   │   ├── models/
│   │   │   ├── user.model.js       # User schema
│   │   │   └── meeting.model.js    # Meeting history schema
│   │   └── routes/
│   │       └── users.routes.js     # API routes
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── landing.jsx         # Landing page
    │   │   ├── authentication.jsx  # Login / Register
    │   │   ├── home.jsx            # Dashboard
    │   │   ├── VideoMeet.jsx       # Video call room
    │   │   └── history.jsx         # Meeting history
    │   ├── contexts/
    │   │   └── AuthContext.jsx     # Auth state and API calls
    │   └── utils/
    │       └── withAuth.jsx        # Protected route HOC
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

In `frontend/src/environment.js` set `IS_PROD = false` for local development.

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/register` | Register a new user |
| POST | `/api/v1/users/login` | Login and get token |
| GET | `/api/v1/users/me` | Get current user info |
| GET | `/api/v1/users/get_all_activity` | Get meeting history |
| POST | `/api/v1/users/add_to_activity` | Save a meeting to history |

## Deployment

- **Backend** → [Render](https://render.com) (Root: `backend`, Start: `node src/app.js`)
- **Frontend** → [Vercel](https://vercel.com) (Root: `frontend`, Build: `npm run build`)
- **Database** → [MongoDB Atlas](https://mongodb.com/atlas)

## Environment Variables (Backend)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8000) |
| `MONGO_URI` | MongoDB connection string |
| `FRONTEND_URL` | Frontend URL for CORS (e.g. https://your-app.vercel.app) |

## License

MIT
