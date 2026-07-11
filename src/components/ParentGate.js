'use client';

import { useState } from 'react';

const PARENT_PASSWORD = 'parents';

export default function ParentGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (password === PARENT_PASSWORD) {
      sessionStorage.setItem('parent-auth', 'true');
      onUnlock(true);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#111] border border-[#1f1f1f] mb-5 text-2xl">
            👨‍👩‍👧‍👦
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Parent Access</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Enter the parent password to view the kids' dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              Parent Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter password..."
              className="w-full px-4 py-3.5 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/10 transition-all duration-300"
              autoFocus
            />
            {error && (
              <p className="mt-2.5 text-sm text-red-400 flex items-center gap-1.5">
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
            className="w-full py-3.5 bg-[#22c55e] text-white rounded-xl font-medium hover:bg-[#16a34a] transition-all duration-300"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
