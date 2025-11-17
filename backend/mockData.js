const { v4: uuidv4 } = require("uuid");

// In-memory sessions DB
const sessions = {};

function createSession(title = "New Chat") {
  const id = uuidv4();
  const now = new Date().toISOString();

  sessions[id] = {
    id,
    title,
    pinned: false,
    messages: [],
    createdAt: now
  };

  return sessions[id];
}

// Auto-generate ChatGPT Style Title
function autoTitle(text) {
  const q = text.toLowerCase();

  if (q.includes("html")) return "HTML Explained";
  if (q.includes("css")) return "CSS Guide";
  if (q.includes("js") || q.includes("javascript")) return "JavaScript Explained";
  if (q.includes("react")) return "React Guide";
  if (q.includes("sql")) return "SQL Explanation";
  if (q.includes("python")) return "Python Overview";
  if (q.includes("what is")) return text.replace("What is", "").trim();
  if (q.length < 4) return "Conversation";

  // Default title: first 4–5 words
  return text.split(" ").slice(0, 4).join(" ");
}

function addMessage(sessionId, role, text, meta = {}) {
  const session = sessions[sessionId];
  if (!session) return;

  session.messages.push({
    id: uuidv4(),
    role,
    text,
    meta,
    createdAt: new Date().toISOString()
  });

  // If first user message → generate title
  if (role === "user" && session.messages.length === 1) {
    session.title = autoTitle(text);
  }
}

// Smart, ChatGPT-like reply
function generateMockResponse(question) {
  const q = question.trim().toLowerCase();

  if (["hi", "hii", "hello", "hey"].includes(q)) {
    return {
      answer: `
Hi there! 👋  
Great to see you. How can I assist you today?
      `,
      meta: { confidence: "0.97" }
    };
  }

  if (q.startsWith("what is") || q.startsWith("define")) {
    return {
      answer: `
**Simple Explanation:**  
${question} is an important concept and commonly used in learning.

### 🧠 Why it matters
- Easy to start learning  
- Useful in many real-world areas  
- Helps build strong fundamentals  

If you want examples, I can generate them!
      `,
      meta: { confidence: "0.93" }
    };
  }

  return {
    answer: `
### Here's your answer:  
You asked **"${question}"**

I analysed your input and prepared a helpful explanation.

### 📌 Key Points:
- This topic is commonly asked  
- Easy to understand  
- You can go deeper if needed  

Feel free to ask follow-up questions!
    `,
    meta: { confidence: "0.90" }
  };
}

module.exports = {
  sessions,
  createSession,
  addMessage,
  generateMockResponse,
  autoTitle
};
