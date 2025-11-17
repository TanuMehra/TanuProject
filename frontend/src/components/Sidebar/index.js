import React, { useState } from "react";
import "./index.css";

export default function Sidebar({
  sessions,
  loadNewChat,
  deleteChat,
  renameChat,
  pinChat
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState(null);

  const toggleTheme = () => {
    const theme = document.body.getAttribute("data-theme");
    document.body.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
  };

  const startRename = (id, currentTitle) => {
    setRenameId(id);
    setRenameValue(currentTitle);
  };

  const submitRename = () => {
    if (renameValue.trim() !== "") {
      renameChat(renameId, renameValue);
    }
    setRenameId(null);
  };

  return (
    <div className="sidebar">
      <button className="new-chat" onClick={loadNewChat}>
        + New Chat
      </button>

      <button className="theme-btn" onClick={toggleTheme}>🌗 Theme</button>

      <h3 className="sidebar-title">Your Chats</h3>

      <ul className="session-list">
        {sessions.map((s) => (
          <li key={s.id} className="session-item">
            <div
              className="session-name"
              onClick={() => (window.location.href = `/chat/${s.id}`)}
            >
              {s.pinned && <span className="pin">📌</span>}
              {s.title}
            </div>

            <div
              className="menu-btn"
              onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
            >
              ⋮
            </div>

            {openMenu === s.id && (
              <div className="menu">
                <div onClick={() => pinChat(s.id)}>
                  {s.pinned ? "Unpin Chat" : "Pin Chat"}
                </div>
                <div onClick={() => startRename(s.id, s.title)}>Rename</div>
                <div className="delete" onClick={() => deleteChat(s.id)}>Delete</div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* RENAME POPUP */}
      {renameId && (
        <div className="popup-bg">
          <div className="popup">
            <h3>Rename Chat</h3>
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={() => setRenameId(null)}>Cancel</button>
              <button className="save" onClick={submitRename}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
