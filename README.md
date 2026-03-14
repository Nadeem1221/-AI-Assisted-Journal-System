# Project Documentation

1. System Overview
Aura is a full-stack MERN application that uses Generative AI to provide emotional feedback on journal entries. It features a responsive grid dashboard and real-time LLM analysis.

2. Technical Stack
Frontend: React + Vite (UI), Lucide (Icons), Axios (API calls).
Backend: Node.js + Express (REST API), Dotenv (Config).
Database: MongoDB + Mongoose (Data persistence).
AI Engine: Groq SDK (Llama 3.3 70B Model).


3. Directory Structure
├── backend/            # Express Server & API Routes
│   ├── models/         # MongoDB Schemas (JournalEntry)
│   ├── routes/         # API Endpoints (/analyze, /insights)
│   └── server.js       # Entry point (Port 5000)
├── src/                # React Frontend
│   ├── api.js          # Centralized Axios service
│   ├── App.jsx         # Main Logic & UI Layout
│   └── App.css         # Grid-based Styling
└── .env                # API Keys & DB URI


4. Setup & Installation

(1) Clone & Install:

bash
npm install                   # Root dependencies
cd backend && npm install    # Server dependencies

(2) Environment Configuration: Create a .env in the root:

env
GROQ_API_KEY=your_key_here
MONGODB_URI=mongodb://localhost:27017/ai-journal
PORT=5000

(3) Run Development:
    Backend: cd backend && npm start
    Frontend: npm run dev (Runs on port 5173)


5. Main API Endpoints
POST /api/journal/analyze: Sends text to LLM for emotion/keyword extraction.
POST /api/journal: Saves the entry + AI analysis to MongoDB.
GET /api/journal/:userId: Fetches all previous entries for a user.
GET /api/journal/insights/:userId: Aggregates stats (Top emotion, total entries).

6. Key Features Implemented
Dynamic Layout: Auto-adapting grid for desktop/mobile views.
Error Handling: Centralized API error catching.
Rate Limiting: Backend protection (10 requests/min).