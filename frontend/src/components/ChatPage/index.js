import "./index.css";
import Sidebar from "../Sidebar";
import ChatWindow from "../ChatWindow";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const API = "https://tanuproject.onrender.com";

  const [sessions, setSessions] = useState([]);
  const [history, setHistory] = useState([]);

  // GET ALL SESSIONS
  const fetchSessions = () => {
    fetch(`${API}/api/sessions`)
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions || []));
  };

  // GET CHAT HISTORY
  const fetchHistory = () => {
    if (!sessionId) return;
    fetch(`${API}/api/session/${sessionId}`)
      .then((res) => res.json())
      .then((data) => setHistory(data.history || []));
  };

  // CREATE NEW CHAT
  const loadNewChat = () => {
    fetch(`${API}/api/new-chat`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => navigate(`/chat/${data.sessionId}`));
  };

  // DELETE CHAT
  const deleteChat = (id) => {
    fetch(`${API}/api/session/${id}`, { method: "DELETE" })
      .then(() => {
        if (sessionId === id) navigate("/");
        fetchSessions();
      });
  };

  // RENAME CHAT
  const renameChat = (id, newName) => {
    fetch(`${API}/api/session/${id}/title`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newName }),
    }).then(fetchSessions);
  };

  // PIN CHAT
  const pinChat = (id) => {
    fetch(`${API}/api/session/${id}/pin`, {
      method: "PUT",
    }).then(fetchSessions);
  };

  useEffect(fetchSessions, []);
  useEffect(fetchHistory, [sessionId]);

  return (
    <div className="page-layout">
      <Sidebar
        sessions={sessions}
        loadNewChat={loadNewChat}
        deleteChat={deleteChat}
        renameChat={renameChat}
        pinChat={pinChat}
      />

      <ChatWindow sessionId={sessionId} history={history} />
    </div>
  );
}
