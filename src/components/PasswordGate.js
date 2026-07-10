'use client';

import { useState } from 'react';

// Base64-encoded password — not plaintext, avoids crypto.subtle dependency
const ENCODED = 'RjBuZ2VyLUgwbWUtUDBydGFsITI2'; // F0nger-H0me-P0rtal!26

function check(password) {
  // Simple encode-and-compare — works everywhere, no crypto API needed
  try {
    return btoa(password) === ENCODED;
  } catch {
    return false;
  }
}

export default function PasswordGate({
  onUnlock,
  title = 'Family Portal',
  demoLink = '/family/demo/',
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    // Small delay so the spinner is visible
    setTimeout(() => {
      if (check(password)) {
        sessionStorage.setItem('family-auth', 'true');
        onUnlock(true);
      } else {
        setError(true);
        setPassword('');
      }
      setLoading(false);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleClick();
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
              onKeyDown={handleKeyDown}
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
            onClick={handleClick}
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
