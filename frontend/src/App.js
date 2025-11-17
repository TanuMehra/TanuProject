import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./components/ChatPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}
