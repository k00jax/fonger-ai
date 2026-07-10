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
  const dragNodeRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const flowParticlesRef = useRef([]);

  const initParticles = useCallback(() => {
    const depts = [...new Set(agents.map((a) => a.dept))];
    const deptCenters = {};
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.42;

    // Place department cluster centers in a circle
    depts.forEach((dept, i) => {
      const angle = (i / depts.length) * Math.PI * 2 - Math.PI / 2;
      deptCenters[dept] = {
        x: cx + Math.cos(angle) * radius * 0.8,
        y: cy + Math.sin(angle) * radius * 0.8,
      };
    });

    // Load saved positions from localStorage
    let savedPositions = {};
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('trivance_node_positions');
        if (stored) savedPositions = JSON.parse(stored);
      }
    } catch {}

    const particles = agents.map((agent, i) => {
      const center = deptCenters[agent.dept] || { x: cx, y: cy };
      const saved = savedPositions[agent.name];
      return {
        id: i,
        agent,
        x: saved ? saved.x : center.x + (Math.random() - 0.5) * radius * 0.8,
        y: saved ? saved.y : center.y + (Math.random() - 0.5) * radius * 0.8,
        baseX: saved ? saved.x : center.x,
        baseY: saved ? saved.y : center.y,
        radius: 9 + Math.random() * 2,
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
      const panX = panRef.current.x;
      const panY = panRef.current.y;
      const zoom = zoomRef.current;

      // Transform helper
      const tx = (x) => x * zoom + panX;
      const ty = (y) => y * zoom + panY;

      // ── Draw department labels (follow cluster centers) ──
      const deptList = [...new Set(particles.map(p => p.dept))];
      deptList.forEach(dept => {
        const deptParticles = particles.filter(p => p.dept === dept);
        const baseCx = deptParticles.reduce((s, p) => s + p.baseX, 0) / deptParticles.length;
        const baseCy = deptParticles.reduce((s, p) => s + p.baseY, 0) / deptParticles.length;
        const lx = tx(baseCx);
        const ly = ty(baseCy - 85);
        const color = DEPT_COLORS[dept] || '#888';
        const icon = DEPT_ICONS[dept] || '';
        ctx.font = `bold ${11 * zoom}px "JetBrains Mono", monospace`;
        ctx.fillStyle = hexToRgba(color, 0.5);
        ctx.textAlign = 'center';
        ctx.fillText(`${icon} ${dept.toUpperCase()}`, lx, ly);
      });

      // ── Draw connection lines ──
      particles.forEach((p) => {
        particles.forEach((q) => {
          if (q.id <= p.id) return;
          if (q.dept !== p.dept) return;
          const dx = tx(p.x) - tx(q.x);
          const dy = ty(p.y) - ty(q.y);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 * zoom) {
            const alpha = (1 - dist / 180) * 0.1;
            ctx.strokeStyle = hexToRgba(DEPT_COLORS[p.dept] || '#888', alpha);
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(tx(p.x), ty(p.y));
            ctx.lineTo(tx(q.x), ty(q.y));
            ctx.stroke();
          }
        });
      });

      // ── Draw flow particles (Director ↔ active agents) ──
      const flowParticles = flowParticlesRef.current;
      const directorParticle = particles.find(p => p.agent.dept === 'director');
      const activeDeptAgents = particles.filter(
        p => p.agent.dept !== 'director' && activeIdsRef.current.has(p.agent.name)
      );

      // Maintain flow particles: one per active agent, alternating direction
      const activeSet = new Set(activeDeptAgents.map(p => p.id));
      for (let i = flowParticles.length - 1; i >= 0; i--) {
        if (!activeSet.has(flowParticles[i].agentId)) {
          flowParticles.splice(i, 1);
        }
      }
      for (const ap of activeDeptAgents) {
        if (!flowParticles.find(fp => fp.agentId === ap.id)) {
          flowParticles.push({
            agentId: ap.id,
            progress: Math.random(),
            direction: Math.random() > 0.5 ? 'outgoing' : 'incoming',
          });
        }
      }

      if (directorParticle) {
        const dx = tx(directorParticle.x);
        const dy = ty(directorParticle.y);
        flowParticles.forEach(fp => {
          const ap = particles[fp.agentId];
          if (!ap) return;
          const ax = tx(ap.x);
          const ay = ty(ap.y);
          // Advance progress
          fp.progress += 0.008;
          if (fp.progress > 1) {
            fp.progress = 0;
            fp.direction = fp.direction === 'outgoing' ? 'incoming' : 'outgoing';
          }
          // Interpolate position
          const t = fp.direction === 'outgoing' ? fp.progress : 1 - fp.progress;
          const fx = dx + (ax - dx) * t;
          const fy = dy + (ay - dy) * t;
          // Draw flow dot with glow
          const dotR = 2.5 * zoom;
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 6 * zoom;
          ctx.beginPath();
          ctx.arc(fx, fy, dotR, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          // Fading trail dot
          const trailT = Math.max(0, t - 0.03);
          const trailX = dx + (ax - dx) * trailT;
          const trailY = dy + (ay - dy) * trailT;
          ctx.fillStyle = 'rgba(0,255,255,0.3)';
          ctx.beginPath();
          ctx.arc(trailX, trailY, dotR * 0.7, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── Draw nodes ──
      particles.forEach((p) => {
        const active = activeIdsRef.current.has(p.agent.name);
        const color = DEPT_COLORS[p.dept] || '#888';
        const isDragged = dragNodeRef.current === p.id;
        if (!isDragged) {
          p.x += (p.baseX - p.x) * 0.08;
          p.y += (p.baseY - p.y) * 0.08;
        }

        const sx = tx(p.x);
        const sy = ty(p.y);
        const sr = p.radius * zoom;

        // Outer glow for active
        if (active) {
          const glow = ctx.createRadialGradient(sx, sy, sr * 0.5, sx, sy, sr * 2.5);
          glow.addColorStop(0, hexToRgba(color, 0.4));
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sx, sy, sr * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.fillStyle = hexToRgba(color, active ? 0.9 : 0.35);
        ctx.strokeStyle = hexToRgba(color, active ? 0.8 : 0.3);
        ctx.lineWidth = (active ? 1.5 : 0.8) * zoom;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner dot for active
        if (active) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(sx, sy, 3 * zoom, 0, Math.PI * 2);
          ctx.fill();
        }

        // Drag indicator
        if (isDragged) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(sx, sy, sr + 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Label
        const fontSize = (active ? 10 : 9) * zoom;
        ctx.font = `${active ? 'bold ' : ''}${Math.max(7, fontSize)}px "JetBrains Mono", monospace`;
        ctx.fillStyle = active ? '#fff' : '#666';
        ctx.textAlign = 'center';
        ctx.fillText(p.agent.name, sx, sy + sr + 12 * zoom);
      });

      // Check hover (use screen-space mouse coords)
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (hoveredRef.current !== null) {
        const p = particles[hoveredRef.current];
        if (p) {
          const dx = tx(p.x) - mx;
          const dy = ty(p.y) - my;
          if (Math.sqrt(dx * dx + dy * dy) > (activeIdsRef.current.has(p.agent.name) ? 22 : 14)) {
            hoveredRef.current = null;
            setTooltip(null);
          }
        }
      } else {
        // Check for new hover
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          const dx = (p.x * zoomRef.current + panRef.current.x) - mx;
          const dy = (p.y * zoomRef.current + panRef.current.y) - my;
          const hitR = (activeIdsRef.current.has(p.agent.name) ? 22 : 14) * zoomRef.current;
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
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current.x = mx;
    mouseRef.current.y = my;

    if (isPanningRef.current) {
      panRef.current.x = panStartRef.current.panX + (mx - panStartRef.current.x);
      panRef.current.y = panStartRef.current.panY + (my - panStartRef.current.y);
      return;
    }

    // Update dragged node position
    if (dragNodeRef.current !== null) {
      const particles = particlesRef.current;
      const p = particles[dragNodeRef.current];
      if (p) {
        const z = zoomRef.current;
        p.baseX = (mx - panRef.current.x) / z - dragOffsetRef.current.x;
        p.baseY = (my - panRef.current.y) / z - dragOffsetRef.current.y;
        p.x = p.baseX;
        p.y = p.baseY;
      }
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -100;
    mouseRef.current.y = -100;
    hoveredRef.current = null;
    setTooltip(null);
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const particles = particlesRef.current;

    // Find clicked node (reverse to get topmost)
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const dx = (p.x * zoomRef.current + panRef.current.x) - mx;
      const dy = (p.y * zoomRef.current + panRef.current.y) - my;
      if (Math.sqrt(dx * dx + dy * dy) < p.radius * zoomRef.current + 8) {
        dragNodeRef.current = i;
        dragOffsetRef.current.x = (mx - panRef.current.x) / zoomRef.current - p.x;
        dragOffsetRef.current.y = (my - panRef.current.y) / zoomRef.current - p.y;
        setIsDragging(true);
        return;
      }
    }
    // Start panning
    isPanningRef.current = true;
    panStartRef.current = { x: mx, y: my, panX: panRef.current.x, panY: panRef.current.y };
  };

  const handleMouseUp = useCallback(() => {
    if (dragNodeRef.current !== null) {
      // Save node positions to localStorage
      try {
        const positions = {};
        particlesRef.current.forEach((p) => {
          positions[p.agent.name] = { x: p.baseX, y: p.baseY };
        });
        localStorage.setItem('trivance_node_positions', JSON.stringify(positions));
      } catch {}
      dragNodeRef.current = null;
      setIsDragging(false);
    }
    if (isPanningRef.current) {
      isPanningRef.current = false;
    }
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.3, Math.min(3, zoomRef.current * delta));
    // Zoom toward mouse position
    panRef.current.x = mx - (mx - panRef.current.x) * (newZoom / zoomRef.current);
    panRef.current.y = my - (my - panRef.current.y) * (newZoom / zoomRef.current);
    zoomRef.current = newZoom;
  }, []);

  // Global mouseup to catch drag release outside canvas
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  return (
    <div className="relative w-full" style={{ height: '50vh', minHeight: '380px' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
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
}, (prev, next) => {
  // Custom comparison: only re-render if agent count or active counts change.
  // This prevents canvas flashing on every data poll when agents is a new array reference.
  if (prev.agents.length !== next.agents.length) return false;
  const prevActive = prev.activeIds.size;
  const nextActive = next.activeIds.size;
  return prevActive === nextActive;
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
    <div ref={feedRef} className="overflow-y-auto" style={{ maxHeight: 'calc(40vh - 44px)' }}>
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
  );
}

// ─── Sliding Drawer Panel ───────────────────────────────────────────────

/**
 * Fixed-position drawer that slides in/out from the left or right edge.
 * State is persisted to localStorage.
 * When closed, shows a thin tab on the edge with a toggle arrow.
 */
function SlidingDrawer({ side, storageKey, label, width, badge, children }) {
  const [open, setOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`sliding-drawer-${storageKey}`);
      if (stored !== null) return stored === 'true';
    }
    return false;
  });

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem(`sliding-drawer-${storageKey}`, String(next));
      return next;
    });
  };

  const isLeft = side === 'left';
  const transformOpen = 'translateX(0)';
  const transformClosed = isLeft ? 'translateX(-100%)' : 'translateX(100%)';

  return (
    <>
      {/* Backdrop overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      {/* Tab toggle (visible when closed) */}
      {!open && (
        <button
          onClick={toggle}
          className={`fixed top-1/2 -translate-y-1/2 z-50 px-1.5 py-6 bg-[#0d0d1a] border border-[#1a1a2e] text-[#33ff33] text-[10px] font-mono uppercase tracking-wider hover:bg-[#1a1a2e] transition-colors cursor-pointer ${
            isLeft ? 'left-0 rounded-r-md' : 'right-0 rounded-l-md'
          }`}
          style={{ writingMode: 'vertical-rl' }}
        >
          {isLeft ? '\u25B6 Agents' : '\u25C0 Feed'}
        </button>
      )}

      {/* Sliding panel */}
      <div
        className={`fixed top-0 ${isLeft ? 'left-0' : 'right-0'} h-full z-40 bg-[#0d0d1a] border-l border-r border-[#1a1a2e] overflow-y-auto shadow-2xl`}
        style={{
          width: `${width}px`,
          transform: open ? transformOpen : transformClosed,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a2e] sticky top-0 bg-[#0d0d1a] z-20">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {label}
          </span>
          <div className="flex items-center gap-2">
            {badge != null && (
              <span className="text-[10px] text-gray-600 font-mono">{badge}</span>
            )}
            <button
              onClick={toggle}
              className="text-gray-500 hover:text-gray-300 transition-colors p-1"
              aria-label={`Close ${label}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={isLeft ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {children}
        </div>
      </div>

      {/* Spacer to prevent content shift */}
      <div style={{ width: open ? `${width}px` : '0px', transition: 'width 0.3s ease', flexShrink: 0 }} />
    </>
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
        {/* Stats Bar */}
        <StatsBar
          agents={agents}
          active={active}
          depts={depts}
          scrollToDept={scrollToDept}
        />

        {/* Canvas — always full width, drawers overlay on top */}
        <div className="px-4 py-2">
          <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-xl overflow-hidden">
            <ParticleSwarm agents={agents} activeIds={activeIds} />
          </div>
        </div>

        {/* LEFT: Sliding Agent Drawer (overlay) */}
        <SlidingDrawer
          side="left"
          storageKey="agent-list"
          label="Agents"
          width={320}
          badge={`${depts.length} depts`}
        >
          <div className="space-y-3">
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
        </SlidingDrawer>

        {/* RIGHT: Sliding Feed Drawer (overlay) */}
        <SlidingDrawer
          side="right"
          storageKey="live-feed"
          label="Feed"
          width={300}
          badge={`${(state.events || []).length} events`}
        >
          <LiveFeed events={state.events} />
        </SlidingDrawer>
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
