"use client";

import React, { useState, useEffect, useRef } from "react";
import AITyping from "./AITyping";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  isTyping?: boolean;
}

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi! I'm SalesMind Copilot. I can help analyze your pipeline, grade current leads, draft follow-ups, or pull key analytics. What should we tackle?",
    },
  ]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const suggestions = [
    "Identify high-value accounts ready for outreach.",
    "Draft a follow-up email for lead Noah Williams.",
    "Show conversion rates by channel.",
    "Analyze pipeline risk factors.",
  ];

  const handleSend = (text: string) => {
    if (!text.trim() || isAiResponding) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsAiResponding(true);

    // AI thinking latency simulation
    setTimeout(() => {
      let aiResponseText = "";
      
      const lower = text.toLowerCase();
      if (lower.includes("noah") || lower.includes("email") || lower.includes("follow")) {
        aiResponseText = "Here is a high-impact email draft for Noah Williams (Tier A):\n\nSubject: Unlocking 42% ROI in your sales pipeline - SalesMind AI\n\nHi Noah,\n\nI noticed Stripe's sales speed increased, but CRM integration gaps are slowing outbound conversions. SalesMind AI automates CRM ingestion to recover 8+ hours/week per rep.\n\nAre you open to a brief 10-minute sync next Tuesday at 10 AM EST?\n\nBest,\n[Your Name]";
      } else if (lower.includes("value") || lower.includes("lead") || lower.includes("outreach")) {
        aiResponseText = "Top Priority Outreach Recommendation:\n\n1. Noah Williams (Stripe, 94 Score) - Interest spike from email interactions.\n2. Emma Watson (GitHub, 88 Score) - Recently viewed the enterprise pricing page.\n\nBoth accounts show strong intent and match our ICP.";
      } else if (lower.includes("conversion") || lower.includes("channel") || lower.includes("analytic")) {
        aiResponseText = "Recent Conversion Channel Breakdown:\n\n• Email Campaigns: 42.5% (High)\n• LinkedIn Direct Outreach: 28.1% (Medium)\n• Organic Search Inbound: 19.4% (Highest LTV)\n• Referral Program: 10% (Top Velocity)";
      } else {
        aiResponseText = "I've analyzed your pipeline. Total open pipeline value is $1,245,300 with an average conversion velocity of 14 days. Lead conversion is up 12% this week, driven by email outreach automated tasks.";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        isTyping: true,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAiResponding(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border-medium bg-[#0B0F19]/90 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(6,214,255,0.4)] transition-all duration-300 group overflow-hidden"
      >
        {/* Glow backdrop effect */}
        <span className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-accent-cyan/10 to-accent-violet/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-accent-cyan relative z-10 transition-transform duration-300 rotate-90"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative h-6 w-6 flex items-center justify-center z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-primary group-hover:text-accent-cyan transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 21l8.982-11.861H13.65l.53-7.509-8.982 11.861h6.615z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
            </span>
          </div>
        )}
      </button>

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-96 max-w-full border-l border-border-default bg-card/90 backdrop-blur-xl shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-gradient-to-r from-bg-surface to-bg-card">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4 text-white animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 21l8.982-11.861H13.65l.53-7.509-8.982 11.861h6.615z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-text-primary tracking-wide">
                SalesMind Copilot
              </h3>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-[10px] font-mono text-text-secondary">AI Agent Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-secondary hover:text-text-primary transition-colors p-1 hover:bg-white/5 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-[10px] text-text-muted mb-1 px-1">
                {msg.sender === "user" ? "You" : "Copilot"}
              </span>
              {msg.sender === "user" ? (
                /* User bubble */
                <div
                  style={{
                    background: "#1e1e2e",
                    borderRadius: "18px 18px 4px 18px",
                    padding: "10px 16px",
                    maxWidth: "85%",
                    fontSize: 13,
                    color: "#fff",
                    lineHeight: 1.6,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  <span style={{ whiteSpace: "pre-line" }}>{msg.text}</span>
                </div>
              ) : (
                /* AI message — no background bubble */
                <div
                  style={{
                    maxWidth: "90%",
                    fontSize: 13,
                    color: "#d4d4d4",
                    lineHeight: 1.8,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {msg.isTyping ? (
                    <AITyping
                      text={msg.text}
                      speed={15}
                      onComplete={() => {
                        setMessages((prev) =>
                          prev.map((m) => (m.id === msg.id ? { ...m, isTyping: false } : m))
                        );
                      }}
                    />
                  ) : (
                    <span style={{ whiteSpace: "pre-line" }}>{msg.text}</span>
                  )}
                </div>
              )}
            </div>
          ))}
          {isAiResponding && (
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-text-muted mb-1 px-1">Copilot</span>
              {/* No bubble bg — dots float inline */}
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 0" }}>
                <span className="typing-dot" style={{ animationDelay: "0ms" }} />
                <span className="typing-dot" style={{ animationDelay: "150ms" }} />
                <span className="typing-dot" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="px-5 py-3 border-t border-border-subtle bg-bg-surface/30">
          <p className="text-[10px] text-text-muted font-heading uppercase tracking-wider mb-2">
            Suggested Prompts
          </p>
          <div className="flex flex-col space-y-1.5">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="text-left text-[11px] text-text-secondary hover:text-accent-cyan border border-border-subtle hover:border-accent-cyan/30 bg-bg-surface/40 hover:bg-accent-cyan/5 rounded-lg px-3 py-1.5 transition-all duration-200 truncate"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-border-subtle bg-bg-surface/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot anything..."
              className="flex-1 bg-[#0A0E17] border border-border-default focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 rounded-xl px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isAiResponding}
              className="h-9 w-9 rounded-xl bg-primary hover:bg-primary-light text-white flex items-center justify-center disabled:opacity-50 disabled:hover:bg-primary transition-colors shadow-[0_0_10px_rgba(99,102,241,0.3)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A89.65 89.65 0 0121 12.003a89.65 89.65 0 01-17.73 8.877L6 12z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
