'use client';

import { useState } from 'react';

export default function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '[REDACTED]') {
      sessionStorage.setItem('family-auth', 'true');
      onUnlock(true);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Family Portal</h1>
          <p className="text-gray-500 text-sm">
            This area is for the Fonger family. Enter the password to continue.
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
            />
            {error && (
              <p className="mt-2 text-sm text-brand-red">Incorrect password. Try again.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Enter Portal
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/family/demo/" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
            View guest demo instead →
          </a>
        </div>
      </div>
    </div>
  );
}
