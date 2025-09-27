import React, { useState } from "react";

export default function ChatbotSection() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input || !input.trim()) return;

    // Save current input before clearing
    const question = input;
    const userMsg = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();
      const botReply = {
        role: "bot",
        text: data.reply || "No reply from server.",
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error talking to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <section
      id="chatbot"
      className="w-full max-w-lg mx-auto p-4 bg-gray-900 text-white rounded-xl shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4">Chat with me (Gemini)</h2>

      <div className="h-64 overflow-y-auto bg-gray-800 p-3 rounded mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === "user" ? "text-blue-300" : "text-green-300"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Georg"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-400">Bot is typing…</div>}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message…"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </section>
  );
}