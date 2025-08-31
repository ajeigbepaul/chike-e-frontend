"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { defaultFAQs, FAQ } from "@/lib/faqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, MessageCircle, Search, ChevronDown, ChevronUp, Send } from "lucide-react";

// Helper: open WhatsApp with prefilled message
function openWhatsApp(message: string, phone: string) {
  const text = encodeURIComponent(message);
  // WhatsApp wa.me requires phone without plus or spaces
  const normalized = phone.replace(/[^\d]/g, "");
  const url = `https://wa.me/${normalized}?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

type ChatMessage = {
  role: "system" | "user" | "bot";
  content: string;
  faqId?: string;
};

const STORAGE_KEY = "chatwidget_state_v1";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content:
        "Hi! I can help with quick answers. Pick a topic below or search. Need more help? Tap 'Speak to an agent'.",
    },
  ]);
  const [faqs] = useState<FAQ[]>(defaultFAQs);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load/persist state in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setIsOpen(parsed.isOpen ?? false);
        setMessages(parsed.messages ?? messages);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({ isOpen, messages });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [isOpen, messages]);

  useEffect(() => {
    // Auto-scroll to bottom on message updates
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Simple keyword search across question/answer/tags
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((f) => {
      return (
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, faqs]);

  const handleSelectFAQ = (faq: FAQ) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: faq.question, faqId: faq.id },
      { role: "bot", content: faq.answer, faqId: faq.id },
    ]);
    setQuery("");
  };

  const handleSpeakToAgent = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const page = typeof window !== "undefined" ? window.location.href : "";
    const question = lastUser?.content ? `Question: ${lastUser.content}\n` : "";
    const message = `Hi, I need help with ${question}Page: ${page}`;
    openWhatsApp(message, "+2348104560115");
  };

  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Find matching FAQ or use default response
    const matchingFaq = faqs.find(faq => 
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase()) ||
      (faq.tags || []).some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
    
    if (matchingFaq) {
      handleSelectFAQ(matchingFaq);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: query },
        { role: "bot", content: "I couldn't find a specific answer to that question. Please try rephrasing or speak to an agent for more help." },
      ]);
      setQuery("");
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <Button
            aria-label="Open chat"
            className="rounded-full bg-brand-yellow hover:bg-brand-yellow/70 shadow-lg h-14 w-14 flex items-center justify-center p-0"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        ) : null}
      </div>

      {/* Chat panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Support chat"
          className="fixed bottom-6 right-6 z-50 w-[22rem] max-w-[90vw] bg-white border rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
          style={{ height: isMinimized ? "3.5rem" : "28rem", maxHeight: "90vh" }}
        >
          {/* Header with clear close button */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-brand-yellow text-white">
            <div className="font-medium">Customer Support</div>
            <div className="flex items-center gap-2">
              <button
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                className="p-1 rounded hover:bg-brand-yellow transition-colors"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button
                aria-label="Close chat"
                className="p-1 rounded hover:bg-brand-yellow transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50" ref={listRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        m.role === "user"
                          ? "bg-brand-yellow text-white rounded-br-none"
                          : "bg-white border text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Search/Input area */}
              <div className="p-3 border-t bg-white">
                <form onSubmit={handleSubmitQuery} className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      ref={inputRef}
                      placeholder="Type your question or search..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button type="submit" size="icon" className="flex-shrink-0 bg-brand-yellow">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                {query && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">FAQ RESULTS</div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {results.length === 0 ? (
                        <div className="text-sm text-gray-500 p-2 text-center">No results found. Try other keywords.</div>
                      ) : (
                        results.map((faq) => (
                          <Card
                            key={faq.id}
                            className="p-3 cursor-pointer hover:bg-blue-50 transition-colors border-gray-200"
                            onClick={() => handleSelectFAQ(faq)}
                            role="button"
                            aria-label={`FAQ: ${faq.question}`}
                          >
                            <div className="font-medium text-sm">{faq.question}</div>
                            <div className="text-xs text-gray-600 line-clamp-2">{faq.answer}</div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-gray-500">Can't find what you need?</div>
                  <Button size="sm" onClick={handleSpeakToAgent} className="text-gray-800 border border-gray-700 hover:bg-gray-100 bg-transparent font-normal">
                    Speak to an agent
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}