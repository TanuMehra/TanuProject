import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Landing() {
  const navigate = useNavigate();

  const startChat = () => {
    // Normally you would fetch new sessionId from backend
    const sessionId = Math.floor(Math.random() * 10000);
    navigate(`/chat/${sessionId}`);
  };

  return (
    <div className="landing">
      <h1>Welcome to AI Chat</h1>
      <button onClick={startChat}>Start New Chat</button>
    </div>
  );
}
