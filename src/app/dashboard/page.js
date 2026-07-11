'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import PasswordGate from '../../components/PasswordGate';

const DEPT_COLORS = {
  research: '#f0a030',
  design: '#4da6ff',
  production: '#a78bfa',
  marketing: '#ff6b5e',
  operations: '#7ddc8a',
  quality: '#ffd866',
  analytics: '#5aa2e8',
  strategy: '#f2c94c',
  director: '#c8ffbe',
  security: '#22d3ee',
};

const DEPT_ICONS = {
  research: '\uD83D\uDD2C',
  design: '\uD83C\uDFA8',
  production: '\u2699\uFE0F',
  marketing: '\uD83D\uDCE2',
  operations: '\uD83D\uDD27',
  quality: '\u2705',
  analytics: '\uD83D\uDCCA',
  strategy: '\uD83E\uDDE0',
  director: '\uD83C\uDFAF',
  security: '\uD83D\uDEE1\uFE0F',
};

// ─── Stats Header ────────────────────────────────────────────────────────

function StatsHeader({ agents, active, depts, selectedDept, onSelectDept }) {
  const activeCount = active.length;
  const totalCount = agents.length;
  const pct = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a2e]">
      <div className="flex items-center gap-3 px-5 py-3 max-w-[1600px] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2 mr-4">
          <span className="text-[#dc2626] font-bold text-sm tracking-tight">THE SWARM</span>
          <span className="w-1 h-1 rounded-full bg-[#33ff33] animate-pulse" />
        </div>

        {/* Active count */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#0d0d1a] rounded-lg border border-[#1a1a2e]">
          <span className="text-[#33ff33] font-bold font-mono text-lg leading-none">
            {activeCount}
          </span>
          <span className="text-gray-500 font-mono text-xs">/ {totalCount} active</span>
        </div>

        {/* Mini progress bar */}
        <div className="hidden sm:flex items-center gap-2 flex-1 max-w-[200px]">
          <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#33ff33] transition-all duration-700"
              style={{
                width: `${pct}%`,
                boxShadow: pct > 0 ? '0 0 8px rgba(51,255,51,0.3)' : 'none',
              }}
            />
          </div>
          <span className="text-[10px] text-gray-600 font-mono">{pct}%</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Department filter chips */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => onSelectDept(null)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
              selectedDept === null
                ? 'bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/40'
                : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-[#333]'
            }`}
          >
            ALL
          </button>
          {depts.map((dept) => {
            const color = DEPT_COLORS[dept] || '#888';
            const deptActive = agents.filter(
              (a) => a.dept === dept && (a.status === 'running' || a.status === 'busy')
            ).length;
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => onSelectDept(isSelected ? null : dept)}
                className="px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all border whitespace-nowrap"
                style={{
                  color: isSelected ? color : '#666',
                  borderColor: isSelected ? color + '66' : 'transparent',
                  backgroundColor: isSelected ? color + '10' : 'transparent',
                }}
              >
                {dept}
                {deptActive > 0 && (
                  <span className="ml-1 text-[#33ff33]">{deptActive}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

// ─── Agent Row ────────────────────────────────────────────────────────────

function AgentRow({ agent, color }) {
  const isRunning = agent.status === 'running' || agent.status === 'busy';
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowDetail(!showDetail)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs border-b border-[#1a1a2e]/30 last:border-0 transition-colors hover:bg-[#0d0d1a] text-left ${
          isRunning ? 'bg-[#0a0f0a]' : ''
        }`}
      >
        {/* Status dot */}
        <span
          className={`w-2 h-2 rounded-full flex-none ${
            isRunning
              ? 'bg-[#33ff33] shadow-[0_0_6px_rgba(51,255,51,0.5)] animate-pulse'
              : 'bg-gray-700'
          }`}
        />

        {/* Agent name + role */}
        <span className="font-mono truncate min-w-0 flex-1">
          <span className={isRunning ? 'text-white font-semibold' : 'text-gray-500'}>
            {agent.name}
          </span>
          <span className="text-gray-700 text-[9px] ml-1.5 hidden sm:inline">
            {agent.role}
          </span>
        </span>

        {/* Task (visible when running) */}
        {isRunning && agent.task && (
          <span className="text-[#33ff33]/70 text-[10px] truncate max-w-[180px] hidden sm:inline font-mono">
            {agent.task}
          </span>
        )}

        {/* Status badge */}
        <span
          className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono flex-none ${
            isRunning ? 'bg-[#33ff33]/15 text-[#33ff33]' : 'bg-[#1a1a2e] text-gray-600'
          }`}
        >
          {agent.status}
        </span>

        {/* Expand icon */}
        <svg
          className={`w-3 h-3 text-gray-600 flex-none transition-transform ${showDetail ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded detail */}
      {showDetail && (
        <div className="px-3 pb-3 pt-1 bg-[#060610] border-b border-[#1a1a2e]/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
            <div>
              <span className="text-gray-600">Dept</span>
              <div className="text-gray-400 mt-0.5 uppercase">{agent.dept}</div>
            </div>
            <div>
              <span className="text-gray-600">Role</span>
              <div className="text-gray-400 mt-0.5">{agent.role}</div>
            </div>
            <div>
              <span className="text-gray-600">Model</span>
              <div className="text-gray-400 mt-0.5">{agent.model || '—'}</div>
            </div>
            <div>
              <span className="text-gray-600">Last Active</span>
              <div className="text-gray-400 mt-0.5">{agent.last || '—'}</div>
            </div>
            {agent.tokens > 0 && (
              <div>
                <span className="text-gray-600">Tokens</span>
                <div className="text-gray-400 mt-0.5">{agent.tokens.toLocaleString()}</div>
              </div>
            )}
            {agent.task && (
              <div className="col-span-2">
                <span className="text-gray-600">Current Task</span>
                <div className={`mt-0.5 ${isRunning ? 'text-[#33ff33]/80' : 'text-gray-500'}`}>
                  {agent.task}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Department Card ─────────────────────────────────────────────────────

function DepartmentCard({ dept, agents, activeIds, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const color = DEPT_COLORS[dept] || '#888';
  const deptActive = agents.filter((a) => activeIds.has(a.name));
  const fillPct = agents.length > 0 ? Math.round((deptActive.length / agents.length) * 100) : 0;
  const hasActive = deptActive.length > 0;

  return (
    <div
      id={`dept-${dept}`}
      className="bg-[#0a0a14] border border-[#1a1a2e] rounded-xl overflow-hidden transition-all duration-500 group"
      style={{
        borderColor: hasActive ? `${color}33` : '#1a1a2e',
        boxShadow: hasActive ? `0 0 24px ${color}08` : 'none',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#0d0d1a] transition-colors"
      >
        <span className="text-lg">{DEPT_ICONS[dept] || '\u2753'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
              {dept}
            </span>
            <span className="text-[10px] text-gray-500 font-mono tabular-nums">
              {deptActive.length}/{agents.length}
            </span>
          </div>
          <div className="mt-1.5 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${fillPct}%`,
                backgroundColor: color,
                boxShadow: fillPct > 0 ? `0 0 6px ${color}66` : 'none',
              }}
            />
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-300 flex-none ${
            expanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Agent list */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: expanded ? '600px' : '0px',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="border-t border-[#1a1a2e]">
          {agents.map((a) => (
            <AgentRow key={a.name} agent={a} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Live Feed ────────────────────────────────────────────────────────────

function LiveFeed({ events }) {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events]);

  const displayEvents = (events || []).slice(-50).reverse();

  return (
    <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-xl overflow-hidden flex flex-col h-full">
      {/* Feed header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a2e]">
        <span className="w-2 h-2 rounded-full bg-[#33ff33] animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Live Feed
        </span>
        <span className="text-[10px] text-gray-600 font-mono ml-auto">
          {displayEvents.length} events
        </span>
      </div>

      {/* Feed content */}
      <div ref={feedRef} className="flex-1 overflow-y-auto">
        {displayEvents.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-600 text-xs font-mono">
            Waiting for agent activity...
          </div>
        )}
        {displayEvents.map((ev, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 px-4 py-2 text-[11px] font-mono border-b border-[#1a1a2e]/30 last:border-0 transition-colors hover:bg-[#0d0d1f] ${
              i === 0 ? 'bg-[#0d0d1f] border-l-2 border-l-[#33ff33]' : ''
            }`}
          >
            <span className="text-gray-600 text-[10px] w-12 flex-none pt-px">{ev.time}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full flex-none mt-1.5 ${
                ev.status === 'running' ? 'bg-[#33ff33]' : 'bg-gray-600'
              }`}
            />
            <div className="min-w-0 flex-1">
              <span className="text-gray-300 font-bold">{ev.agent}</span>
              <span className="text-gray-500 ml-1.5">{ev.msg}</span>
            </div>
            {i === 0 && (
              <span className="text-[#33ff33] text-[9px] animate-pulse flex-none">NOW</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── All Agents Table ─────────────────────────────────────────────────────

function AgentsTable({ agents, activeIds }) {
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    const sorted = [...agents].sort((a, b) => {
      const aActive = activeIds.has(a.name);
      const bActive = activeIds.has(b.name);
      // Active always first
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      // Then by selected key
      const va = (a[sortKey] || '').toLowerCase();
      const vb = (b[sortKey] || '').toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [agents, activeIds, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortArrow = ({ col }) => {
    if (sortKey !== col) return <span className="text-gray-700 ml-1">{'\u2195'}</span>;
    return (
      <span className="text-[#33ff33] ml-1">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
    );
  };

  const cols = [
    { key: 'name', label: 'Agent', w: 'w-32' },
    { key: 'dept', label: 'Dept', w: 'w-24' },
    { key: 'status', label: 'Status', w: 'w-20' },
    { key: 'task', label: 'Task', w: 'flex-1' },
  ];

  return (
    <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-center px-4 py-2.5 border-b border-[#1a1a2e] bg-[#0d0d1a] text-[10px] font-mono uppercase tracking-wider text-gray-500">
        {cols.map((col) => (
          <button
            key={col.key}
            onClick={() => toggleSort(col.key)}
            className={`${col.w} text-left hover:text-gray-300 transition-colors flex items-center`}
          >
            {col.label}
            <SortArrow col={col.key} />
          </button>
        ))}
      </div>
      {/* Body */}
      <div className="max-h-[400px] overflow-y-auto">
        {sorted.map((a) => {
          const isRunning = activeIds.has(a.name);
          const color = DEPT_COLORS[a.dept] || '#888';
          return (
            <div
              key={a.name}
              className={`flex items-center px-4 py-2 text-xs border-b border-[#1a1a2e]/20 last:border-0 transition-colors hover:bg-[#0d0d1a] ${
                isRunning ? 'bg-[#0a0f0a]/50' : ''
              }`}
            >
              <div className="w-32 flex items-center gap-2 min-w-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-none ${
                    isRunning
                      ? 'bg-[#33ff33] shadow-[0_0_6px_rgba(51,255,51,0.5)] animate-pulse'
                      : 'bg-gray-700'
                  }`}
                />
                <span
                  className={`font-mono truncate ${isRunning ? 'text-white font-semibold' : 'text-gray-500'}`}
                >
                  {a.name}
                </span>
              </div>
              <div className="w-24">
                <span
                  className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded"
                  style={{ color, backgroundColor: `${color}10` }}
                >
                  {a.dept}
                </span>
              </div>
              <div className="w-20">
                <span
                  className={`text-[10px] uppercase tracking-wider font-mono ${
                    isRunning ? 'text-[#33ff33]' : 'text-gray-600'
                  }`}
                >
                  {a.status}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-gray-600 text-[11px] truncate block">
                  {a.task || '\u2014'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────

function SwarmDashboard() {
  const [state, setState] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const r = await fetch('/api/state.json?' + Date.now());
        if (r.ok) setState(await r.json());
      } catch {}
    };
    fetchState();
    const i = setInterval(fetchState, 5000);
    return () => clearInterval(i);
  }, []);

  if (!state)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[#33ff33] font-mono text-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-[#33ff33] animate-pulse" />
            initializing swarm...
          </div>
          <p className="text-gray-600 text-xs font-mono">connecting to agent bus</p>
        </div>
      </div>
    );

  const agents = state.agents || [];
  const active = agents.filter((a) => a.status === 'running' || a.status === 'busy');
  const activeIds = new Set(active.map((a) => a.name));
  const depts = [...new Set(agents.map((a) => a.dept))];

  const filteredDepts = selectedDept
    ? depts.filter((d) => d === selectedDept)
    : depts;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      {/* Stats header */}
      <StatsHeader
        agents={agents}
        active={active}
        depts={depts}
        selectedDept={selectedDept}
        onSelectDept={setSelectedDept}
      />

      {/* Main content: Department cards + Live feed */}
      <div className="flex gap-0 max-w-[1600px] mx-auto">
        {/* Left: Department cards */}
        <div className="flex-1 min-w-0 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDepts.map((dept) => {
              const deptAgents = agents.filter((a) => a.dept === dept);
              return (
                <DepartmentCard
                  key={dept}
                  dept={dept}
                  agents={deptAgents}
                  activeIds={activeIds}
                  defaultExpanded={depts.length <= 5 || selectedDept !== null}
                />
              );
            })}
          </div>

          {/* Agents table toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowTable(!showTable)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform ${showTable ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {showTable ? 'Hide' : 'Show'} all agents table ({agents.length})
            </button>
            {showTable && (
              <div className="mt-3">
                <AgentsTable agents={agents} activeIds={activeIds} />
              </div>
            )}
          </div>
        </div>

        {/* Right: Live feed sidebar (hidden on mobile via md:flex) */}
        <div className="hidden lg:block w-80 flex-none p-4 pl-0">
          <div className="sticky top-[57px]" style={{ height: 'calc(100vh - 73px)' }}>
            <LiveFeed events={state.events} />
          </div>
        </div>
      </div>

      {/* Mobile: Live feed as bottom section */}
      <div className="lg:hidden px-4 pb-6">
        <div style={{ height: '350px' }}>
          <LiveFeed events={state.events} />
        </div>
      </div>
    </div>
  );
}

// ─── Exported Page with Password Gate ───────────────────────────────────

export default function DashboardPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      sessionStorage.getItem('family-auth') === 'true'
    ) {
      setUnlocked(true);
    }
  }, []);

  if (!unlocked) {
    return (
      <PasswordGate
        title="Swarm Dashboard"
        onUnlock={() => setUnlocked(true)}
      />
    );
  }

  return <SwarmDashboard />;
}
