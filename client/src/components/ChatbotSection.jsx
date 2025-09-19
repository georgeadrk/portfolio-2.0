import React, { useState } from "react";

export default function ChatbotSection() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Ask me anything about me." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      const answer = data.answer || "I’m not sure about that yet. (Check your server.)";
      setMessages((m) => [...m, { role: "bot", text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "bot", text: "Server error. Check console." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <section id="chatbot" className="py-24 px-6 max-w-5xl mx-auto text-center text-gray-100">
      <h2 className="text-4xl font-bold mb-6 text-white">Ask Me Anything</h2>

      <div className="max-w-md mx-auto p-4 bg-darkBlue text-white rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-3">Chat with Me</h3>
        <div className="h-64 overflow-y-auto border border-purpleAccent rounded p-2 mb-2">
          {messages.map((m, i) => (
            <div key={i} className={`mb-2 ${m.role === "user" ? "text-blue-400 text-right" : "text-purple-300"}`}>
              <span>{m.text}</span>
            </div>
          ))}
          {loading && <div className="text-purple-500">Thinking…</div>}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 rounded bg-gray-800 text-white cursor-target"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question…"
          />
          <button
            type="submit"
            className="inline-block bg-purpleAccent text-white rounded text-lg shadow-lg cursor-target glow-button"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}