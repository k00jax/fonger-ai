'use client';

import { useState, useEffect } from 'react';

const DEPT_COLORS = {
  research: '#f0a030', design: '#4da6ff', production: '#a78bfa',
  marketing: '#ff6b5e', operations: '#7ddc8a', quality: '#ffd866',
  analytics: '#5aa2e8', strategy: '#f2c94c', director: '#c8ffbe'
};
const DEPT_ICONS = {
  research: '🔬', design: '🎨', production: '⚙️', marketing: '📢',
  operations: '🔧', quality: '✅', analytics: '📊', strategy: '🧠', director: '🎯'
};

export default function DashboardPage() {
  const [state, setState] = useState(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const r = await fetch('/api/state.json?' + Date.now());
        if (r.ok) setState(await r.json());
      } catch {}
    };
    fetchState();
    const i = setInterval(fetchState, 5000);
    const t = setInterval(() => setTime(t => t + 1), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  if (!state) return (
    <div className="min-h-screen bg-[#08081a] flex items-center justify-center">
      <p className="text-[#33ff33] font-mono text-sm">Loading swarm...</p>
    </div>
  );

  const agents = state.agents || [];
  const active = agents.filter(a => a.status === 'running' || a.status === 'busy');
  const depts = [...new Set(agents.map(a => a.dept))];

  return (
    <div className="min-h-screen bg-[#08081a] text-[#33ff33] font-mono">
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50" style={{
        background: 'linear-gradient(transparent 50%, rgba(0,255,0,.015) 50%)',
        backgroundSize: '100% 4px'
      }} />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center gap-4 px-4 py-2 bg-[#08081ae8] border-b border-[#33ff3333]/10 text-xs">
        <b className="text-[#33ff33] text-sm">THE TRIVANCE · SWARM</b>
        <span className="text-gray-600">{active.length}/{agents.length} active</span>
        <span className="ml-auto text-gray-600 text-[10px]">fonger.ai/dashboard</span>
      </div>

      {/* Main swarm view */}
      <div className="pt-14 px-4">
        {/* Department rings */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {depts.map(dept => {
            const deptAgents = agents.filter(a => a.dept === dept);
            const deptActive = deptAgents.filter(a => a.status === 'running' || a.status === 'busy');
            const color = DEPT_COLORS[dept] || '#888';
            return (
              <div key={dept} className="bg-[#0d0d2a] border border-[#33ff3333]/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span>{DEPT_ICONS[dept] || '?'}</span>
                  <span className="text-xs font-bold uppercase" style={{ color }}>{dept}</span>
                  <span className="ml-auto text-[10px] text-gray-600">{deptActive.length}/{deptAgents.length}</span>
                </div>
                <div className="space-y-1">
                  {deptAgents.map(a => {
                    const isRunning = a.status === 'running' || a.status === 'busy';
                    return (
                      <div key={a.name}
                        className={`flex items-center justify-between text-[10px] px-2 py-1 rounded transition-colors ${
                          isRunning ? 'bg-[#33ff3308] border border-[#33ff3318]' : 'text-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
                          <span className="truncate">{a.name}</span>
                        </div>
                        <span className="text-gray-600 truncate ml-2 max-w-[80px]">{a.task || 'idle'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Events feed */}
        <div className="mt-4 bg-[#0d0d2a] border border-[#33ff3333]/10 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-2">RECENT ACTIVITY</div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {(state.events || []).slice(-20).reverse().map((ev, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <span className="text-gray-600 w-10 flex-none">{ev.time}</span>
                <span className={`w-1.5 h-1.5 rounded-full flex-none ${ev.status === 'running' ? 'bg-green-500' : 'bg-gray-600'}`} />
                <span className="truncate">{ev.agent}</span>
                <span className="text-gray-600 truncate">{ev.msg}</span>
              </div>
            ))}
            {(!state.events || state.events.length === 0) && (
              <p className="text-gray-600 text-[10px]">No events yet — agents report on next tick</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
