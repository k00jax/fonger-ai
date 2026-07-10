'use client';

import { useState } from 'react';

const PASSWORD_HASH = '74d669aa7337d9abf65365cd91f7aff8a0bd0f262f69862a8a6b616b3fbeddf9';

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function PasswordGate({
  onUnlock,
  title = 'Family Portal',
  demoLink = '/family/demo/',
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const hash = await sha256(password);
      if (hash === PASSWORD_HASH) {
        sessionStorage.setItem('family-auth', 'true');
        onUnlock(true);
      } else {
        setError(true);
        setPassword('');
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative z-10">
      <div className="w-full max-w-sm animate-fade-in-scale">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#111] border border-[#1f1f1f] mb-5 text-2xl">
            🔒
          </div>
          <h1 className="text-xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            This area requires authentication. Enter the password to continue.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
              placeholder="Enter password..."
              className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-red/50 focus:ring-2 focus:ring-brand-red/10 transition-all duration-300"
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="mt-2.5 text-sm text-brand-red flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Incorrect password. Try again.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-brand-red text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-300 disabled:opacity-50 hover:glow-red"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Enter Portal'
            )}
          </button>
        </div>

        {demoLink && (
          <div className="mt-5 text-center">
            <a
              href={demoLink}
              className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              View guest demo instead →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
