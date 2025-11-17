import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import TableResponse from "../TableResponse";
import { marked } from "marked";

export default function ChatWindow({ sessionId, history }) {
  const [messages, setMessages] = useState(history);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState("");

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => setMessages(history), [history]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, regenLoading]);

  // Auto-grow textarea
  const autoGrow = () => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  // -------------------------
  // 🎤 Voice Input (WORKING)
  // -------------------------
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setInput("Listening...");
    };

    recognition.onresult = (event) => {
      let voiceText = event.results[0][0].transcript;
      setInput(voiceText);
      setLastUserMessage(voiceText);
    };

    recognition.onerror = () => setInput("");

    recognition.start();
  };

  // -------------------------
  // SEND MESSAGE
  // -------------------------
  const sendMessage = () => {
    if (!input.trim()) return;

    const userText = input;
    setLastUserMessage(userText);

    setMessages((prev) => [...prev, { type: "user", text: userText }]);

    setInput("");
    autoGrow();
    setTyping(true);

    fetch(`https://tanuproject.onrender.com/api/chat/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userText }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: data.text,
            table: data.table,
            feedback: null,
          },
        ]);
      });
  };

  // -------------------------
  // 🔄 Regenerate Response
  // -------------------------
  const regenerate = () => {
    if (!lastUserMessage) return;

    setRegenLoading(true);

    fetch(`https://tanuproject.onrender.com/api/chat/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: lastUserMessage }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRegenLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: data.text,
            table: data.table,
            feedback: null,
          },
        ]);
      });
  };

  // -------------------------
  // 👍👎 FEEDBACK
  // -------------------------
  const giveFeedback = (i, fb) => {
    setMessages((prev) =>
      prev.map((m, index) =>
        index === i ? { ...m, feedback: fb } : m
      )
    );
  };

  return (
    <div className="chat-window">

      {/* ----------- CHAT MESSAGES ----------- */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.type}`}>
            <div className="avatar">{msg.type === "user" ? "🧑" : "🤖"}</div>

            <div className="bubble-content">
              <div
                className="bubble-text"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(msg.text || ""),
                }}
              />

              {msg.table && <TableResponse data={msg.table} />}

              {msg.type === "bot" && (
                <div className="feedback-buttons">
                  <button
                    className={msg.feedback === "like" ? "active" : ""}
                    onClick={() => giveFeedback(i, "like")}
                  >
                    👍
                  </button>

                  <button
                    className={msg.feedback === "dislike" ? "active" : ""}
                    onClick={() => giveFeedback(i, "dislike")}
                  >
                    👎
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* GPT Typing Indicator */}
        {typing && (
          <div className="bubble bot typing-bubble">
            <div className="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        {/* Regenerate Loading */}
        {regenLoading && (
          <div className="bubble bot typing-bubble">
            <div className="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ----------- REGENERATE BUTTON ----------- */}
      {lastUserMessage && (
        <button className="regen-btn" onClick={regenerate}>
          ↻ Regenerate Response
        </button>
      )}

      {/* ----------- INPUT AREA ----------- */}
      <div className="input-bar">
        <textarea
          ref={textareaRef}
          className="big-input"
          placeholder="Message ..."
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoGrow();
          }}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), sendMessage())
          }
        />

        {/* CAMERA */}
        <button
          className="action-btn"
          onClick={() => fileInputRef.current.click()}
        >
          📷
        </button>
        <input ref={fileInputRef} type="file" hidden />

        {/* MIC */}
        <button className="action-btn mic-btn" onClick={startVoiceInput}>
          🎤
        </button>

        {/* SEND */}
        <button className="send-btn" onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
}
