'use client';

import { useState, useEffect } from 'react';
import PasswordGate from '../../../components/PasswordGate';
import FamilyHub from '../../../components/FamilyHub';

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

  return <FamilyHub isDemo={false} />;
}
