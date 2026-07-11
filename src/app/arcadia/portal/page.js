'use client';

import { useState, useEffect } from 'react';
import PasswordGate from '../../../components/PasswordGate';

function ArcadiaPortalContent() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d1b2a' }}>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        {/* Welcome */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: '#f5f0e8' }}>
            Arcadia <span style={{ color: '#f0a030' }}>Portal</span>
          </h1>
          <p className="text-lg mb-2" style={{ color: 'rgba(245,240,232,0.6)' }}>
            Welcome back, Ollie, Barrett, and Isla!
          </p>
          <p className="text-sm" style={{ color: 'rgba(245,240,232,0.3)' }}>
            Full content coming soon. This portal will be populated with real assignments.
          </p>
        </div>

        {/* Placeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Assignments */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ backgroundColor: 'rgba(15,35,55,0.6)', border: '1px solid rgba(240,160,48,0.1)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
              style={{ backgroundColor: 'rgba(240,160,48,0.1)', color: '#f0a030' }}>
              📋
            </div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#f5f0e8' }}>
              Today&apos;s Assignments
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.45)' }}>
              Daily lessons and tasks tailored to each child&apos;s level. Assignments will appear here each morning.
            </p>
          </div>

          {/* Weekly Schedule */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ backgroundColor: 'rgba(15,35,55,0.6)', border: '1px solid rgba(240,160,48,0.1)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
              style={{ backgroundColor: 'rgba(240,160,48,0.1)', color: '#f0a030' }}>
              📅
            </div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#f5f0e8' }}>
              Weekly Schedule
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.45)' }}>
              A full five-day schedule with time blocks for each subject. Customize based on what works best.
            </p>
          </div>

          {/* Progress Dashboard */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ backgroundColor: 'rgba(15,35,55,0.6)', border: '1px solid rgba(240,160,48,0.1)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
              style={{ backgroundColor: 'rgba(240,160,48,0.1)', color: '#f0a030' }}>
              📊
            </div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#f5f0e8' }}>
              Progress Dashboard
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.45)' }}>
              Track completion rates and progress across all subjects for each child.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArcadiaPortalPage() {
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d1b2a' }}>
        <div style={{ color: 'rgba(245,240,232,0.25)' }}>Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <PasswordGate
        onUnlock={setAuthenticated}
        title="Arcadia Learning Portal"
        demoLink={null}
      />
    );
  }

  return <ArcadiaPortalContent />;
}
