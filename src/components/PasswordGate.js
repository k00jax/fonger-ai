'use client';

import { useState } from 'react';

const PASSWORD_HASH = '74d669aa7337d9abf65365cd91f7aff8a0bd0f262f69862a8a6b616b3fbeddf9';

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function PasswordGate({ onUnlock, title = 'Family Portal', demoLink = '/family/demo/' }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">
            This area requires authentication. Enter the password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password..."
              className="w-full px-4 py-3 bg-[#111] border border-[#1f1f1f] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-red transition-colors"
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="mt-2 text-sm text-brand-red">Incorrect password. Try again.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Enter Portal'}
          </button>
        </form>

        {demoLink && (
          <div className="mt-4 text-center">
            <a href={demoLink} className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
              View guest demo instead →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
