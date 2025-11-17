const express = require("express");
const cors = require("cors");

const {
  sessions,
  createSession,
  addMessage,
  generateMockResponse
} = require("./mockData");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// ----------------------------
// GET ALL SESSIONS
// ----------------------------
app.get("/api/sessions", (req, res) => {
  const list = Object.values(sessions)
    .sort((a, b) => (b.pinned ? 1 : -1))
    .map((s) => ({
      id: s.id,
      title: s.title,
      pinned: s.pinned || false,
      lastMessage: s.messages[s.messages.length - 1]?.text || "No messages"
    }));

  res.json({ sessions: list });
});

// ----------------------------
// CREATE NEW CHAT
// ----------------------------
app.post("/api/new-chat", (req, res) => {
  const session = createSession("New Chat");

  addMessage(session.id, "bot", "👋 New chat started!", {});

  res.json({ sessionId: session.id });
});

// ----------------------------
// GET CHAT HISTORY
// ----------------------------
app.get("/api/session/:id", (req, res) => {
  const s = sessions[req.params.id];
  if (!s) return res.json({ history: [] });

  const history = s.messages.map((m) => ({
    type: m.role,
    text: m.text,
    meta: m.meta
  }));

  res.json({ history });
});

// ----------------------------
// SEND MESSAGE
// ----------------------------
app.post("/api/chat/:id", async (req, res) => {
  const { question } = req.body;
  const sessionId = req.params.id;

  if (!sessions[sessionId])
    return res.status(404).json({ error: "Chat not found" });

  // save user message
  addMessage(sessionId, "user", question);

  // Simulate bot typing delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  // generate reply
  const reply = generateMockResponse(question);

  addMessage(sessionId, "bot", reply.answer, { meta: reply.meta });

  res.json({
    type: "bot",
    text: reply.answer,
    meta: reply.meta
  });
});

// ----------------------------
// DELETE CHAT
// ----------------------------
app.delete("/api/session/:id", (req, res) => {
  delete sessions[req.params.id];
  res.json({ success: true });
});

// ----------------------------
// UPDATE TITLE
// ----------------------------
app.put("/api/session/:id/title", (req, res) => {
  const { title } = req.body;

  sessions[req.params.id].title = title;

  res.json({ success: true });
});

// ----------------------------
// PIN / UNPIN
// ----------------------------
app.put("/api/session/:id/pin", (req, res) => {
  const s = sessions[req.params.id];

  s.pinned = !s.pinned;

  res.json({ success: true, pinned: s.pinned });
});

// ----------------------------
app.listen(5000, () =>
  console.log("🚀 AI Backend running on port 5000")
);
