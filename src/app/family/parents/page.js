'use client';

import { useState, useEffect } from 'react';
import ParentGate from '../../../components/ParentGate';
import { KIDS } from '../../../lib/demoData';

function KidCard({ kid, arcadiaData, chatData }) {
  const borderColor = kid.color + '40';

  const totalCompleted =
    arcadiaData
      ? Object.values(arcadiaData.completedLessons || {}).filter(Boolean).length +
        Object.values(arcadiaData.completedUnits || {})
          .flat()
          .filter(Boolean).length
      : 0;

  const warmupCount = arcadiaData
    ? Object.values(arcadiaData.warmupProgress || {}).filter(Boolean).length
    : 0;

  const recentUnits = arcadiaData
    ? Object.entries(arcadiaData.currentUnitProgress || {}).map(
        ([subject, info]) => `${subject}: ${info?.unit?.replace(/_/g, ' ')}`
      )
    : [];

  const totalMessages = chatData ? chatData.length : 0;

  const lastTimestamp = chatData?.length
    ? chatData[chatData.length - 1].timestamp
    : null;

  const lastMessages = chatData ? chatData.slice(-3).reverse() : [];

  return (
    <div
      className="bg-[#0f0f0f] border rounded-2xl p-6 transition-all duration-300"
      style={{ borderColor }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{kid.emoji}</span>
        <div>
          <h3 className="text-white font-semibold text-lg">{kid.name}</h3>
          <p className="text-gray-500 text-xs font-mono">
            Grade {kid.grade.toUpperCase()} &middot; Age {kid.bio.match(/\d+/)?.[0] || '?'}
          </p>
        </div>
      </div>

      {/* Arcadia Progress Section */}
      <div className="mb-5">
        <h4 className="text-[#22c55e] text-xs font-semibold uppercase tracking-wider mb-3">
          Arcadia Learning
        </h4>
        {arcadiaData ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Lessons Completed</span>
              <span className="text-white font-mono font-semibold">{totalCompleted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Warmups Completed</span>
              <span className="text-white font-mono font-semibold">{warmupCount}</span>
            </div>

            {totalCompleted > 0 && (
              <div className="mt-2">
                <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, totalCompleted * 8)}%`,
                      backgroundColor: kid.color,
                    }}
                  />
                </div>
              </div>
            )}

            {recentUnits.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">Recent Units</p>
                <div className="flex flex-wrap gap-1.5">
                  {recentUnits.map((unit, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-md bg-[#1a1a1a] text-gray-300 font-mono"
                    >
                      {unit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No activity yet</p>
        )}
      </div>

      {/* AI Chat Section */}
      <div>
        <h4 className="text-[#22c55e] text-xs font-semibold uppercase tracking-wider mb-3">
          AI Chat Activity
        </h4>
        {chatData && chatData.length > 0 ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Messages</span>
              <span className="text-white font-mono font-semibold">{totalMessages}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Last Active</span>
              <span className="text-white font-mono text-xs">
                {lastTimestamp
                  ? new Date(lastTimestamp).toLocaleString()
                  : 'Unknown'}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
              <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">Recent Messages</p>
              <div className="space-y-2">
                {lastMessages.map((msg, i) => (
                  <div key={i} className="text-xs">
                    <span className="text-gray-500 font-mono uppercase">
                      {msg.role === 'user' ? kid.name : 'AI'}
                      {': '}
                    </span>
                    <span className="text-gray-400 font-mono">
                      {msg.content.length > 50
                        ? msg.content.substring(0, 50) + '...'
                        : msg.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No chat activity yet</p>
        )}
      </div>
    </div>
  );
}

export default function ParentsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kidData, setKidData] = useState([]);

  useEffect(() => {
    const auth = sessionStorage.getItem('parent-auth');
    if (auth === 'true') {
      setAuthenticated(true);
      loadData();
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadData() {
    const data = KIDS.map((kid) => {
      let arcadiaData = null;
      let chatData = null;

      try {
        const raw = localStorage.getItem(`demo-state-${kid.id}`);
        if (raw) arcadiaData = JSON.parse(raw);
      } catch {
        // corrupted data
      }

      try {
        const raw = localStorage.getItem(`arcadia-chat-${kid.id}`);
        if (raw) {
          chatData = JSON.parse(raw);
          if (!Array.isArray(chatData)) chatData = null;
        }
      } catch {
        // corrupted data
      }

      return { kid, arcadiaData, chatData };
    });

    setKidData(data);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <ParentGate onUnlock={() => { setAuthenticated(true); loadData(); }} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Parents Dashboard
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Monitor your kids' learning progress and AI chat activity in one place.
          </p>
        </div>

        {/* Kid Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kidData.map(({ kid, arcadiaData, chatData }) => (
            <KidCard
              key={kid.id}
              kid={kid}
              arcadiaData={arcadiaData}
              chatData={chatData}
            />
          ))}
        </div>

        {/* Refresh hint */}
        <div className="mt-10 text-center">
          <button
            onClick={loadData}
            className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
          >
            Refresh data
          </button>
        </div>
      </div>
    </div>
  );
}
