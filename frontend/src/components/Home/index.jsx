import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaUser, FaPaperPlane, FaSignOutAlt } from "react-icons/fa";
import "./index.css";

function Home() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`${API_URL}/api/profile`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.name) {
          setUserName(data.user.name);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });

    setMessages(getInitialMessages("chat"));
  }, [navigate, API_URL]);

  const getInitialMessages = (selectedMode) => {
    if (selectedMode === "interview") {
      return [
        {
          sender: "bot",
          text: "Welcome to Interview Mode. Let’s start. Tell me about yourself.",
        },
      ];
    }
    return [
      {
        sender: "bot",
        text: "Hi! I am DevMentor AI. Ask me anything about Coding, English, or Interview Questions.",
      },
    ];
  };

  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .trim();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessages(getInitialMessages(newMode));
    setInput("");
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { sender: "bot", text: "Bot is typing..." }]);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, mode }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs.pop();
        return [...newMsgs, { sender: "bot", text: cleanText(data.reply) }];
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs.pop();
        return [...newMsgs, { sender: "bot", text: "Error talking to AI." }];
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-box">
        <div className="chat-header">
          <div className="nav-left">
            <FaRobot className="logo-icon" />
            <span className="logo-text">MentorHub AI</span>
          </div>

          <div className="nav-center">
            <button
              className={mode === "chat" ? "mode-btn active" : "mode-btn"}
              onClick={() => switchMode("chat")}
            >
              Chat
            </button>
            <button
              className={mode === "interview" ? "mode-btn active" : "mode-btn"}
              onClick={() => switchMode("interview")}
            >
              Interview
            </button>
          </div>

          <div className="nav-right">
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              <span className="logout-text">Logout</span>
              <FaSignOutAlt className="logout-icon" />
            </button>
          </div>
        </div>

        {userName && <div className="welcome-user">Hi, {userName.toUpperCase()} 👋</div>}

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-row ${
                msg.sender === "user" ? "user-row" : "bot-row"
              }`}
            >
              <div className="avatar">
                {msg.sender === "user" ? <FaUser /> : <FaRobot />}
              </div>
              <div
                className={`message-bubble ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} disabled={loading}>
            <FaPaperPlane />
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you sure you want to logout?</h3>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
