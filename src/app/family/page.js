'use client';

import { useState, useEffect } from 'react';
import PasswordGate from '../../components/PasswordGate';
import FamilyPortal from '../../components/FamilyPortal';

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

  return <FamilyPortal isDemo={false} />;
}
