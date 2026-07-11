'use client';

import { useState, useRef, useEffect } from 'react';

const AURI_GREETINGS = [
  "Hi friend! I'm Auri. What are you curious about today?",
  'Welcome! Ready to learn something awesome? Ask me anything!',
  "Hey there! I'm here to help with your lessons. What's on your mind?",
];

const AURI_SYSTEM = `You are Auri, the friendly AI tutor for Arcadia Learning. You help K-5 students learn.
- Keep answers short (1-3 sentences) and at a reading level for young children.
- Be warm, encouraging, and a little silly. Use emoji sparingly.
- If a student is stuck on a lesson, give hints, not answers.
- If they ask something off-topic, gently steer back to learning.
- Always end with an encouraging note or a follow-up question.`;

export default function AuriChat({ kidName, currentStep, subject }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  // Add greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = AURI_GREETINGS[Math.floor(Math.random() * AURI_GREETINGS.length)];
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    // If we have a DeepSeek key, use it. Otherwise, use canned responses.
    const apiKey = typeof window !== 'undefined'
      ? window.__ARCADIA_DEEPSEEK_KEY__ || null
      : null;

    let reply;
    if (apiKey) {
      reply = await callDeepSeek(apiKey, messages.concat(userMsg));
    } else {
      reply = cannedResponse(text);
    }

    setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') sendMessage();
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 shadow-lg ${
          open
            ? 'bg-[#1a1a1a] border border-[#333]'
            : 'bg-brand-red hover:bg-red-700 hover:scale-110'
        }`}
        style={{
          boxShadow: open
            ? '0 0 20px rgba(220,38,38,0.15)'
            : '0 0 30px rgba(220,38,38,0.3)',
        }}
        title="Chat with Auri"
      >
        {open ? '✕' : '🦊'}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 transition-all duration-400 ease-out ${
          open
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#1f1f1f] flex items-center gap-3">
            <span className="text-xl">🦊</span>
            <div>
              <p className="text-sm font-medium text-white">Auri</p>
              <p className="text-xs text-gray-600">Your learning guide</p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-red/20 text-gray-200 rounded-br-md'
                      : 'bg-[#1a1a1a] text-gray-300 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a1a] px-4 py-2.5 rounded-xl rounded-bl-md">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-[#1f1f1f] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Auri anything..."
              disabled={loading}
              className="flex-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-red/30 transition-all duration-200 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-3 py-2 bg-brand-red text-white rounded-lg text-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Canned Auri responses for when no API key is set */
function cannedResponse(text) {
  const t = text.toLowerCase();

  if (t.includes('help') || t.includes('stuck') || t.includes("don't understand")) {
    return "No worries! Sometimes the trick is to look at it from a different angle. What part is tricky? Let's break it down together! 🔍";
  }
  if (t.includes('hello') || t.includes('hi ') || t === 'hi') {
    return 'Hello, curious mind! Ready to learn something awesome today? 😊';
  }
  if (t.includes('bored') || t.includes('boring')) {
    return "I get it — sometimes things feel hard before they feel fun. Want to try a different subject? Animals? Space? Dinosaurs? 🦕";
  }
  if (t.includes('math') || t.includes('number') || t.includes('count')) {
    return "Math is like a puzzle, and puzzles are fun once you spot the pattern! Want a hint for your current problem? 🧩";
  }
  if (t.includes('science') || t.includes('animal') || t.includes('space')) {
    return "Ooh, science is my favorite! There's so much to discover. Did you know octopuses have three hearts? 🐙 What would you like to learn about?";
  }
  if (t.includes('reading') || t.includes('story') || t.includes('book')) {
    return "Reading is like having a superpower — it lets you visit any world without leaving your chair. What kind of stories do you like? 📚";
  }

  return "That's a great question! I'm in demo mode right now, so I can't look up new things — but I bet you could find the answer together with a grown-up. What else would you like to talk about? 🌟";
}

/** Call DeepSeek API (OpenAI-compatible) */
async function callDeepSeek(apiKey, messages) {
  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: AURI_SYSTEM }, ...messages],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || cannedResponse('');
  } catch {
    return cannedResponse('');
  }
}
