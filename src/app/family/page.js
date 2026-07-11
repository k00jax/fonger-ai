'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PasswordGate from '../../components/PasswordGate';

const tiles = [
  {
    title: 'Arcadia Learning',
    desc: 'Homeschool learning environment. Lessons, assignments, and progress tracking for the kids.',
    icon: '📚',
    href: '/arcadia/portal/',
    color: '#f0a030',
  },
  {
    title: 'Swarm Dashboard',
    desc: 'Live view of the 45-agent autonomous swarm. See which agents are active and what they are working on.',
    icon: '⚡',
    href: '/dashboard/',
    color: '#33ff33',
  },
  {
    title: 'AI Chat',
    desc: 'Kid-friendly AI assistant. Safe, educational conversations for curious minds.',
    icon: '🤖',
    href: '/family/chat/',
    color: '#4da6ff',
  },
];

export default function FamilyPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem('family-auth');
    if (auth === 'true') {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <PasswordGate onUnlock={setAuthenticated} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Family Hub
          </h1>
          <p className="text-gray-500 text-sm">
            What would you like to access?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile) => (
            <div key={tile.title}>
              {tile.comingSoon ? (
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 opacity-60 cursor-not-allowed">
                  <div className="text-3xl mb-4">{tile.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{tile.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{tile.desc}</p>
                  <span className="text-xs text-gray-600 font-mono uppercase tracking-wider">Coming Soon</span>
                </div>
              ) : (
                <Link
                  href={tile.href}
                  className="block bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2a2a2a] hover:bg-[#141414] transition-all duration-300 group"
                >
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {tile.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{tile.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{tile.desc}</p>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
