// components/QuoteConversation.tsx
import React, { useState } from "react";

type Message = {
  sender: string;
  createdAt: string | number | Date;
  content: string;
};

type QuoteConversationProps = {
  quote: {
    messages: Message[];
  };
  onSend: (message: string) => void;
};

export default function QuoteConversation({ quote, onSend }: QuoteConversationProps) {
  const [message, setMessage] = useState("");

  return (
    <div>
      <h3 className="font-bold mb-2">Conversation</h3>
      <div className="bg-gray-50 p-3 rounded mb-4 max-h-64 overflow-y-auto">
        {quote.messages && quote.messages.length > 0 ? (
          quote.messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <div className="text-xs text-gray-500">
                {msg.sender} • {new Date(msg.createdAt).toLocaleString()}
              </div>
              <div className="p-2 rounded bg-white border">{msg.content}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No conversation yet.</div>
        )}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (message.trim()) {
            onSend(message);
            setMessage("");
          }
        }}
        className="flex gap-2"
      >
        <input
          className="flex-1 border rounded px-2 py-1"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-brand-yellow px-4 py-1 rounded font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
}