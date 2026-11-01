import React, { useState } from "react";

const API = "http://localhost:5000";

export default function Chatbot({ destination }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Namaste! I am your free BharatYatra travel assistant. How can I help?" }
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e) {
    e?.preventDefault();
    const message = text.trim();
    if (!message || loading) return;

    setMessages(prev => [...prev, { role: "user", text: message }]);
    setText("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message, destination })
      });
      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: data.message || data.reply || "I could not answer that right now." }
      ]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Unable to connect to the travel assistant." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chatbot">
      <div className="chatbot-header"><span>🤖</span><div><h3>BharatYatra AI</h3><small>Free Travel Assistant</small></div></div>
      <div className="chatbot-messages">
        {messages.map((m, i) => <div key={i} className={`chat-message ${m.role}`}>{m.text}</div>)}
        {loading && <div className="chat-message assistant">Thinking...</div>}
      </div>
      <form className="chatbot-input" onSubmit={send}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Ask about your trip..." />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </section>
  );
}
