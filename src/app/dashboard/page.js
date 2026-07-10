'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
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

// Helper: convert hex color to rgba string
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Particle Swarm Canvas ──────────────────────────────────────────────

const ParticleSwarm = memo(function ParticleSwarm({ agents, activeIds }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const activeIdsRef = useRef(activeIds);
  activeIdsRef.current = activeIds; // Always current for animation loop
  const hoveredRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const initParticles = useCallback(() => {
    const depts = [...new Set(agents.map((a) => a.dept))];
    const deptCenters = {};
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.35;

    // Place department cluster centers in a circle
    depts.forEach((dept, i) => {
      const angle = (i / depts.length) * Math.PI * 2 - Math.PI / 2;
      deptCenters[dept] = {
        x: cx + Math.cos(angle) * radius * 0.7,
        y: cy + Math.sin(angle) * radius * 0.7,
      };
    });

    const particles = agents.map((agent, i) => {
      const center = deptCenters[agent.dept] || { x: cx, y: cy };
      return {
        id: i,
        agent,
        x: center.x + (Math.random() - 0.5) * radius * 0.5,
        y: center.y + (Math.random() - 0.5) * radius * 0.5,
        baseX: center.x,
        baseY: center.y,
        radius: 3 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        dept: agent.dept,
        active: activeIds.has(agent.name),
      };
    });
    particlesRef.current = particles;
  }, []); // Only init once — active states update in animation loop

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    initParticles();

    const ctx = canvas.getContext('2d');

    const animate = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(51,255,51,0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update particles
      particles.forEach((p) => {
        const active = activeIdsRef.current.has(p.agent.name);
        const color = DEPT_COLORS[p.dept] || '#888';

        // Stable positions — snap to base
        p.x += (p.baseX - p.x) * 0.08;
        p.y += (p.baseY - p.y) * 0.08;

        // Draw connection lines to nearby same-dept particles
        const connDist = 130;
        particles.forEach((q) => {
          if (q.id <= p.id) return;
          if (q.dept !== p.dept) return;
          const dx2 = p.x - q.x;
          const dy2 = p.y - q.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < connDist) {
            const alpha = (1 - dist2 / connDist) * (active ? 0.15 : 0.04);
            ctx.strokeStyle = hexToRgba(color, alpha);
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });

        // Draw particle with pulse
        const pulse = active ? 1 + Math.sin(performance.now() * 0.003 + p.phase) * 0.3 : 1;
        const r = p.radius * pulse;
        const glow = active ? 8 : 2;

        // Outer glow
        const glowGrad = ctx.createRadialGradient(p.x, p.y, r * 0.3, p.x, p.y, r + glow);
        glowGrad.addColorStop(0, hexToRgba(color, active ? 0.9 : 0.5));
        glowGrad.addColorStop(0.5, hexToRgba(color, 0.15));
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + glow, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Active pulse ring
        if (active) {
          const pulseR = r + glow * (0.5 + 0.5 * Math.sin(performance.now() * 0.004 + p.phase));
          ctx.strokeStyle = color.replace(')', ', 0.4)').replace('rgb', 'rgba');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Check hover
      if (hoveredRef.current !== null) {
        const p = particles[hoveredRef.current];
        if (p) {
          const dx = p.x - mx;
          const dy = p.y - my;
          if (Math.sqrt(dx * dx + dy * dy) > (activeIdsRef.current.has(p.agent.name) ? 18 : 10)) {
            hoveredRef.current = null;
            setTooltip(null);
          }
        }
      } else {
        // Check for new hover
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          const dx = p.x - mx;
          const dy = p.y - my;
          const hitR = activeIdsRef.current.has(p.agent.name) ? 18 : 10;
          if (Math.sqrt(dx * dx + dy * dy) < hitR) {
            hoveredRef.current = i;
            setTooltip({
              name: p.agent.name,
              status: p.agent.status,
              task: p.agent.task || 'idle',
              dept: p.agent.dept,
              x: p.x,
              y: p.y,
            });
            break;
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initParticles, activeIds]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -100;
    mouseRef.current.y = -100;
    hoveredRef.current = null;
    setTooltip(null);
  };

  return (
    <div className="relative w-full" style={{ height: '40vh', minHeight: '280px' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-xs font-mono shadow-lg"
          style={{
            left: Math.min(tooltip.x + 14, (canvasRef.current?.parentElement?.clientWidth || 400) - 180),
            top: Math.max(0, tooltip.y - 40),
            transition: 'opacity 0.15s',
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  tooltip.status === 'running' || tooltip.status === 'busy' ? '#22c55e' : '#555',
                boxShadow:
                  tooltip.status === 'running' || tooltip.status === 'busy'
                    ? '0 0 6px rgba(34,197,94,0.6)'
                    : 'none',
              }}
            />
            <span className="text-white font-bold">{tooltip.name}</span>
          </div>
          <div className="text-gray-400 mt-0.5">
            {tooltip.status} &middot; {tooltip.dept}
          </div>
          {tooltip.task && <div className="text-gray-500 mt-0.5 truncate max-w-[140px]">{tooltip.task}</div>}
        </div>
      )}
    </div>
  );
});

// ─── Stats Bar ──────────────────────────────────────────────────────────

function StatsBar({ agents, active, depts, scrollToDept }) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4 px-4 py-2.5 bg-[#0d0d1a] border-b border-[#1a1a2e] text-xs font-mono sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-[#33ff33] font-bold text-sm">
          {active.length}
          <span className="text-gray-600 font-normal">/{agents.length}</span>
        </span>
        <span className="text-gray-500 uppercase tracking-wider text-[10px]">ACTIVE</span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      </div>

      <div className="hidden sm:block text-gray-600 text-[10px]">
        updated {new Date().toLocaleTimeString()}
      </div>

      <div className="flex-1" />

      <div className="flex flex-wrap gap-1.5">
        {depts.map((dept) => {
          const color = DEPT_COLORS[dept] || '#888';
          const deptActive = agents.filter(
            (a) =>
              a.dept === dept && (a.status === 'running' || a.status === 'busy')
          ).length;
          const total = agents.filter((a) => a.dept === dept).length;
          return (
            <button
              key={dept}
              onClick={() => scrollToDept(dept)}
              className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border border-transparent hover:border-current transition-colors whitespace-nowrap"
              style={{ color, borderColor: deptActive > 0 ? color + '33' : 'transparent' }}
            >
              {dept}
              <span className="ml-1 opacity-60">
                {deptActive}/{total}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Department Card ────────────────────────────────────────────────────

function DepartmentCard({ dept, agents, activeIds, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const color = DEPT_COLORS[dept] || '#888';
  const deptActive = agents.filter((a) =>
    a.status === 'running' || a.status === 'busy'
  );
  const fillPct = agents.length > 0 ? (deptActive.length / agents.length) * 100 : 0;
  const hasActive = deptActive.length > 0;

  return (
    <div
      id={`dept-${dept}`}
      className="bg-[#0a0a14] border border-[#1a1a2e] rounded-xl overflow-hidden transition-all duration-500"
      style={{
        boxShadow: hasActive
          ? `0 0 20px ${color}11, inset 0 0 20px ${color}04`
          : 'none',
        borderColor: hasActive ? `${color}33` : '#1a1a2e',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#0d0d1f] transition-colors"
      >
        <span className="text-lg">{DEPT_ICONS[dept] || '?'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color }}
            >
              {dept}
            </span>
            <span className="text-[10px] text-gray-600 font-mono">
              {deptActive.length}/{agents.length}
            </span>
          </div>
          {/* Status bar */}
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
          className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
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
        className={`overflow-hidden transition-all duration-400 ${
          expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        <div className="border-t border-[#1a1a2e]">
          {agents.map((a) => {
            const isRunning = a.status === 'running' || a.status === 'busy';
            return (
              <div
                key={a.name}
                className={`flex items-center gap-2.5 px-4 py-2 text-xs border-b border-[#1a1a2e]/50 last:border-0 transition-colors ${
                  isRunning ? 'bg-[#0f0f1f]' : ''
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-none ${
                    isRunning
                      ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)] animate-pulse'
                      : 'bg-gray-700'
                  }`}
                />
                <span
                  className={`truncate min-w-0 flex-1 ${
                    isRunning ? 'text-white font-semibold' : 'text-gray-500'
                  }`}
                >
                  {a.name}
                </span>
                <span className="text-gray-600 truncate max-w-[120px] text-[10px]">
                  {a.task || 'idle'}
                </span>
                <span
                  className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono flex-none"
                  style={{ color, backgroundColor: `${color}15` }}
                >
                  {a.dept}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Live Feed ──────────────────────────────────────────────────────────

function LiveFeed({ events }) {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1a1a2e] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Live Feed
        </span>
        <span className="ml-auto text-[10px] text-gray-600 font-mono">
          {(events || []).length} events
        </span>
      </div>
      <div
        ref={feedRef}
        className="overflow-y-auto"
        style={{ maxHeight: '200px' }}
      >
        {(!events || events.length === 0) && (
          <div className="px-4 py-6 text-center text-gray-600 text-xs font-mono">
            No events yet. Agents report on next tick.
          </div>
        )}
        {(events || [])
          .slice(-40)
          .reverse()
          .map((ev, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-4 py-1.5 text-[11px] font-mono border-b border-[#1a1a2e]/30 last:border-0 transition-colors hover:bg-[#0d0d1f] ${
                i === 0 ? 'bg-[#0d0d1f]' : ''
              }`}
            >
              <span className="text-gray-600 w-12 flex-none text-[10px]">{ev.time}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full flex-none ${
                  ev.status === 'running' ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
              <span className="text-gray-300 truncate font-bold min-w-0 w-24 flex-none">
                {ev.agent}
              </span>
              <span className="text-gray-500 truncate">{ev.msg}</span>
              {i === 0 && (
                <span className="text-[#33ff33] text-[9px] animate-pulse flex-none ml-auto">
                  NEW
                </span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────

function SwarmDashboard() {
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
    const t = setInterval(() => setTime((t) => t + 1), 1000);
    return () => {
      clearInterval(i);
      clearInterval(t);
    };
  }, []);

  if (!state)
    return (
      <div className="min-h-screen bg-[#08081a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[#33ff33] font-mono text-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            initializing swarm...
          </div>
          <p className="text-gray-600 text-xs font-mono">connecting to agent bus</p>
        </div>
      </div>
    );

  const agents = state.agents || [];
  const active = agents.filter(
    (a) => a.status === 'running' || a.status === 'busy'
  );
  const activeIds = new Set(active.map((a) => a.name));
  const depts = [...new Set(agents.map((a) => a.dept))];

  const scrollToDept = (dept) => {
    const el = document.getElementById(`dept-${dept}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#08081a] text-gray-200 font-sans relative">
      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background:
            'linear-gradient(transparent 50%, rgba(0,255,0,.012) 50%)',
          backgroundSize: '100% 4px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Particle Swarm Canvas */}
        <ParticleSwarm agents={agents} activeIds={activeIds} />

        {/* Stats Bar */}
        <StatsBar
          agents={agents}
          active={active}
          depts={depts}
          scrollToDept={scrollToDept}
        />

        {/* Department Cards */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {depts.map((dept) => {
              const deptAgents = agents.filter((a) => a.dept === dept);
              return (
                <DepartmentCard
                  key={dept}
                  dept={dept}
                  agents={deptAgents}
                  activeIds={activeIds}
                  defaultExpanded={depts.length <= 5}
                />
              );
            })}
          </div>

          {/* Live Feed */}
          <div className="mt-6">
            <LiveFeed events={state.events} />
          </div>
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
