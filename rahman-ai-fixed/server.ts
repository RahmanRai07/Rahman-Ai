import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("rabbu.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT,
    completed INTEGER,
    category TEXT,
    date TEXT
  );
  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT,
    progress INTEGER DEFAULT 0,
    deadline TEXT,
    building_type TEXT
  );
  CREATE TABLE IF NOT EXISTS chat_rooms (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT,
    max_participants INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT,
    email TEXT,
    college TEXT,
    course TEXT,
    graduationDate TEXT,
    skills TEXT,
    careerGoal TEXT,
    avatar TEXT
  );
  CREATE TABLE IF NOT EXISTS aptitude_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score INTEGER,
    total INTEGER,
    accuracy REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS typing_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wpm INTEGER,
    accuracy REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  app.use(express.json());

  // Socket.io logic for ChatTea
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomCode) => {
      socket.join(roomCode);
      console.log(`User ${socket.id} joined room ${roomCode}`);
    });

    socket.on("send-message", (data) => {
      // data: { roomCode, sender, content, timestamp }
      io.to(data.roomCode).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // API Routes
  app.get("/api/messages", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages ORDER BY timestamp ASC").all();
    res.json(messages);
  });

  app.post("/api/messages", (req, res) => {
    const { role, content } = req.body;
    const info = db.prepare("INSERT INTO messages (role, content) VALUES (?, ?)").run(role, content);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks").all();
    res.json(tasks.map(t => ({ ...t, completed: !!t.completed })));
  });

  app.post("/api/tasks", (req, res) => {
    const { id, title, completed, category, date } = req.body;
    db.prepare("INSERT OR REPLACE INTO tasks (id, title, completed, category, date) VALUES (?, ?, ?, ?, ?)")
      .run(id, title, completed ? 1 : 0, category, date);
    res.json({ success: true });
  });

  app.delete("/api/tasks/:id", (req, res) => {
    db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Goals API
  app.get("/api/goals", (req, res) => {
    const goals = db.prepare("SELECT * FROM goals").all();
    res.json(goals);
  });

  app.post("/api/goals", (req, res) => {
    const { id, title, progress, deadline, building_type } = req.body;
    db.prepare("INSERT OR REPLACE INTO goals (id, title, progress, deadline, building_type) VALUES (?, ?, ?, ?, ?)")
      .run(id, title, progress, deadline, building_type);
    res.json({ success: true });
  });

  // Chat Rooms API
  app.get("/api/rooms/:code", (req, res) => {
    const room = db.prepare("SELECT * FROM chat_rooms WHERE code = ?").get(req.params.code);
    res.json(room || null);
  });

  app.post("/api/rooms", (req, res) => {
    const { id, code, name, max_participants } = req.body;
    db.prepare("INSERT INTO chat_rooms (id, code, name, max_participants) VALUES (?, ?, ?, ?)")
      .run(id, code, name, max_participants);
    res.json({ success: true });
  });

  app.get("/api/profile", (req, res) => {
    const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
    if (profile) {
      res.json({ ...profile, skills: JSON.parse(profile.skills || "[]") });
    } else {
      res.json(null);
    }
  });

  app.post("/api/profile", (req, res) => {
    const { name, email, college, course, graduationDate, skills, careerGoal, avatar } = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO profile (id, name, email, college, course, graduationDate, skills, careerGoal, avatar)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, college, course, graduationDate, JSON.stringify(skills), careerGoal, avatar);
    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    const aptitude = db.prepare("SELECT * FROM aptitude_results ORDER BY timestamp DESC LIMIT 10").all();
    const typing = db.prepare("SELECT * FROM typing_results ORDER BY timestamp DESC LIMIT 10").all();
    res.json({ aptitude, typing });
  });

  app.post("/api/aptitude/save", (req, res) => {
    const { score, total, accuracy } = req.body;
    db.prepare("INSERT INTO aptitude_results (score, total, accuracy) VALUES (?, ?, ?)")
      .run(score, total, accuracy);
    res.json({ success: true });
  });

  app.post("/api/typing/save", (req, res) => {
    const { wpm, accuracy } = req.body;
    db.prepare("INSERT INTO typing_results (wpm, accuracy) VALUES (?, ?)")
      .run(wpm, accuracy);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist/index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
