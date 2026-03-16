# Rahman AI — Full Stack Career Intelligence Platform

A Next-Gen AI-powered career platform for Indian college students.  
Built with React + TypeScript + Vite + Express + Socket.IO + Gemini AI.

---

## 🚀 Quick Start (Local)

### 1. Get your Gemini API Key
Go to → https://aistudio.google.com/app/apikey  
Create a free API key (no credit card needed).

### 2. Setup environment
```bash
cp .env.example .env
# Open .env and paste your key:
# GEMINI_API_KEY=your_key_here
```

### 3. Install & Run
```bash
npm install
npm run dev
```
Open http://localhost:3000

---

## 🌐 Deploy Free (Railway — Recommended)

1. Push this folder to a GitHub repo
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Select your repo
4. In Settings → Variables, add:
   - `GEMINI_API_KEY` = your key
   - `NODE_ENV` = production
5. Deploy — get a live URL in ~2 minutes ✅

## Deploy on Render.com (Alternative Free)

1. New Web Service → Connect GitHub repo
2. Build Command: `npm install && npm run build`
3. Start Command: `NODE_ENV=production node --import tsx/esm server.ts`
4. Add env variable: `GEMINI_API_KEY=your_key`

---

## ✨ Features

| Module | Status | Description |
|--------|--------|-------------|
| Neural Chat (Rai) | ✅ Working | AI career chat with voice input & text-to-speech |
| Vision Studio | ✅ Working | AI image analysis & transformation descriptions |
| AI Mock Interview | ✅ Working | Full interview simulation with AI evaluation |
| Career Roadmap | ✅ Working | Personalized AI-generated preparation roadmap |
| Job Matcher | ✅ Working | AI matches your skills to job roles |
| ATS Resume Checker | ✅ Working | Upload PDF resume for AI analysis |
| Aptitude Simulator | ✅ Working | Practice quant, logical, verbal questions |
| Coding Arena | ✅ Working | DSA problems with AI hints & code review |
| Company Intelligence | ✅ Working | Company profiles, HR patterns, prep tips |
| Global Pulse (News) | ✅ Working | AI-generated latest tech & world news |
| ChatTea | ✅ Working | Real-time peer chat with room codes |
| Logic Matrix (Tasks) | ✅ Working | Task manager synced to 3D city |
| 3D Metropolis | ✅ Working | Goals visualized as a growing city |
| Focus Timer | ✅ Working | Pomodoro timer with confetti reward |
| Profile | ✅ Working | Personal profile saved to SQLite |

---

## 🔧 What Was Fixed

| File | Issue | Fix Applied |
|------|-------|-------------|
| `services/gemini.ts` | Wrong model names (`gemini-3.1-pro-preview` etc.) | → `gemini-1.5-pro` / `gemini-1.5-flash` |
| `services/gemini.ts` | `googleSearch` tool in `fetchRealNews` | → Direct AI generation |
| `services/gemini.ts` | `responseMimeType` config broke API calls | → Removed; parse text manually |
| `Chat.tsx` | Fake TTS model `gemini-2.5-flash-preview-tts` | → Browser `SpeechSynthesis` API |
| `Chat.tsx` | Mic button did nothing (just toggled state) | → Real `SpeechRecognition` API |
| `Chat.tsx` | No system prompt for Rai persona | → Added career-focused system prompt |
| `MockInterview.tsx` | `ai.chats.create()` doesn't exist in SDK | → `generateContent` with history |
| `RoadmapGenerator.tsx` | `responseMimeType` config broke it | → Fixed with clean JSON parsing |
| `JobMatcher.tsx` | Same `responseMimeType` issue | → Fixed same way |
| `ImageEnhancement.tsx` | Expected AI to return edited image | → Shows detailed AI analysis |
| `vite.config.ts` | No dev proxy for backend API | → Added proxy for `/api` & `/socket.io` |

---

## 📁 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Framer Motion, Three.js
- **Backend**: Express.js, Socket.IO, better-sqlite3
- **AI**: Google Gemini 1.5 Pro / Flash
- **Build**: Vite 6
