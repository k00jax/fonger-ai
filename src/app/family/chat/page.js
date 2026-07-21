'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import PasswordGate from '../../../components/PasswordGate';
import { KIDS } from '../../../lib/demoData';

// Derive age from bio or fallback to known ages
function getKidAge(kid) {
  const m = kid.bio.match(/(\d+)\s+years?\s+old/);
  if (m) return parseInt(m[1], 10);
  const fallbacks = { ollie: 10, barrett: 8, isla: 5 };
  return fallbacks[kid.id] || 8;
}

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

function buildSystemPrompt(kid) {
  const age = getKidAge(kid);
  return [
    `You are Auri, a friendly AI tutor for a ${age}-year-old named ${kid.name}.`,
    'Keep answers simple, encouraging, and age-appropriate.',
    'Use emojis occasionally. Be kind, patient, and educational.',
    'Never discuss violence, drugs, or inappropriate topics.',
    'If asked about something you should not discuss, gently redirect.',
  ].join(' ');
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Loading dots ────────────────────────────────────────────────
function Dots({ color = '#4da6ff' }) {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────
export default function FamilyChatPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedKidId, setSelectedKidId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auth check
  useEffect(() => {
    const auth = sessionStorage.getItem('family-auth');
    if (auth === 'true') setAuthenticated(true);
    setLoading(false);
  }, []);

  // Load selected kid from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('arcadia-active-kid');
    if (stored && KIDS.find((k) => k.id === stored)) {
      setSelectedKidId(stored);
    }
  }, []);

  // Load chat history when kid changes
  useEffect(() => {
    if (!selectedKidId || typeof window === 'undefined') return;
    const raw = localStorage.getItem(`arcadia-chat-${selectedKidId}`);
    if (raw) {
      try {
        setMessages(JSON.parse(raw));
      } catch {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [selectedKidId]);

  // Persist chat history
  useEffect(() => {
    if (!selectedKidId || typeof window === 'undefined') return;
    if (messages.length > 0) {
      localStorage.setItem(
        `arcadia-chat-${selectedKidId}`,
        JSON.stringify(messages),
      );
    }
  }, [messages, selectedKidId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedKid = KIDS.find((k) => k.id === selectedKidId) || null;

  const selectKid = useCallback((kidId) => {
    setSelectedKidId(kidId);
    localStorage.setItem('arcadia-active-kid', kidId);
    setShowPicker(false);
  }, []);

  const clearChat = useCallback(() => {
    if (!selectedKidId) return;
    setMessages([]);
    localStorage.removeItem(`arcadia-chat-${selectedKidId}`);
  }, [selectedKidId]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !selectedKid || sending) return;

    const userMsg = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

    // Build API payload
    const apiMessages = [
      { role: 'system', content: buildSystemPrompt(selectedKid) },
      ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const res = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: apiMessages,
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      const aiContent =
        data.choices?.[0]?.message?.content ||
        'Hmm, I had trouble thinking of a response. Try again!';

      const aiMsg = {
        role: 'assistant',
        content: aiContent,
        timestamp: new Date().toISOString(),
        id: (Date.now() + 1).toString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = {
        role: 'assistant',
        content: 'Oops! Something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
        id: (Date.now() + 1).toString(),
      };
      setMessages((prev) => [...prev, errMsg]);
      console.error('DeepSeek API error:', err);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [input, selectedKid, sending, messages]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // ── Auth gate ─────────────────────────────────────────────────
  if (!authenticated) {
    return <PasswordGate onUnlock={setAuthenticated} />;
  }

  // ── Kid picker ────────────────────────────────────────────────
  if (!selectedKid) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-sm animate-fade-in-scale">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Who is chatting?
            </h1>
            <p className="text-gray-500 text-sm">
              Pick your profile to start a conversation with Auri.
            </p>
          </div>
          <div className="space-y-3">
            {KIDS.map((kid) => (
              <button
                key={kid.id}
                onClick={() => selectKid(kid.id)}
                className="w-full flex items-center gap-4 bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 hover:border-[#2a2a2a] hover:bg-[#141414] transition-all duration-300 text-left"
              >
                <span className="text-4xl">{kid.emoji}</span>
                <div>
                  <div className="text-white font-semibold text-lg">
                    {kid.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {getKidAge(kid)} years old
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Chat view ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative z-10">
      {/* Header */}
      <header
        className="sticky top-0 z-20 border-b px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: '#0a0a0a',
          borderColor: '#1f1f1f',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Kid selector button */}
          <button
            onClick={() => setShowPicker((p) => !p)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Switch kid"
          >
            <span className="text-2xl">{selectedKid.emoji}</span>
            <div>
              <div className="text-white font-semibold text-sm leading-tight">
                {selectedKid.name}
              </div>
              <div className="text-gray-500 text-xs">
                chatting with Auri
              </div>
            </div>
            <svg
              className="w-3.5 h-3.5 text-gray-600 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <button
          onClick={clearChat}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-3 py-1.5 rounded-lg border border-[#1f1f1f] hover:border-[#2a2a2a]"
        >
          Clear chat
        </button>
      </header>

      {/* Kid picker dropdown */}
      {showPicker && (
        <div className="absolute top-14 left-4 z-30 bg-[#111] border border-[#1f1f1f] rounded-xl shadow-2xl overflow-hidden w-56">
          {KIDS.map((kid) => (
            <button
              key={kid.id}
              onClick={() => selectKid(kid.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#1a1a1a] transition-colors ${
                kid.id === selectedKidId
                  ? 'bg-[#1a1a1a] border-l-2'
                  : 'border-l-2 border-transparent'
              }`}
              style={{
                borderLeftColor:
                  kid.id === selectedKidId ? kid.color : 'transparent',
              }}
            >
              <span className="text-xl">{kid.emoji}</span>
              <div>
                <div className="text-white text-sm font-medium">
                  {kid.name}
                </div>
                <div className="text-gray-500 text-xs">
                  {getKidAge(kid)} years old
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">{selectedKid.emoji}</span>
              <h2 className="text-white text-lg font-semibold mb-1">
                Say hello to Auri!
              </h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Ask me anything -- I am here to help you learn and explore.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 break-words ${
                  msg.role === 'user'
                    ? 'rounded-br-md'
                    : 'rounded-bl-md'
                }`}
                style={{
                  backgroundColor:
                    msg.role === 'user' ? '#2563eb' : '#1f1f1f',
                  color: msg.role === 'user' ? '#fff' : '#e5e5e5',
                }}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
                <p
                  className="text-[10px] mt-1.5 opacity-50 font-mono"
                  style={{
                    color:
                      msg.role === 'user'
                        ? 'rgba(255,255,255,0.6)'
                        : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-[#1f1f1f] rounded-2xl rounded-bl-md px-5 py-3">
                <Dots color={selectedKid.color} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="sticky bottom-0 z-20 border-t px-4 py-3"
        style={{ backgroundColor: '#0a0a0a', borderColor: '#1f1f1f' }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Auri anything, ${selectedKid.name}...`}
            disabled={sending}
            className="flex-1 bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/50 focus:ring-2 focus:ring-brand-orange/10 transition-all duration-300 text-sm disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: selectedKid.color,
              color: '#fff',
            }}
            aria-label="Send message"
          >
            {sending ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
