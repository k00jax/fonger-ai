'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import NavigationCard from '../components/NavigationCard';

/* ── Particle Swarm Canvas ── */
function ParticleSwarm() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let mouse = { x: -1000, y: -1000 };
    let targetMouse = { x: -1000, y: -1000 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 140;
    const MOUSE_RADIUS = 160;

    // Cluster centers — positioned where the orbs used to be
    const clusters = [
      { x: 0.28, y: 0.28, color: [220, 38, 38], spread: 180 },
      { x: 0.72, y: 0.68, color: [249, 115, 22], spread: 160 },
    ];

    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const cluster = i < PARTICLE_COUNT * 0.45 ? clusters[0] : clusters[1];
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * cluster.spread;
      return {
        x: window.innerWidth * cluster.x + Math.cos(angle) * dist,
        y: window.innerHeight * cluster.y + Math.sin(angle) * dist,
        homeX: window.innerWidth * cluster.x + Math.cos(angle) * dist,
        homeY: window.innerHeight * cluster.y + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        cluster,
      };
    });

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse tracking
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Update & draw connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift toward home with some wander
        const dxHome = p.homeX - p.x;
        const dyHome = p.homeY - p.y;
        p.vx += dxHome * 0.00003 + (Math.random() - 0.5) * 0.02;
        p.vy += dyHome * 0.00003 + (Math.random() - 0.5) * 0.02;

        // Mouse repulsion
        const dxM = p.x - mouse.x;
        const dyM = p.y - mouse.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < MOUSE_RADIUS && distM > 0) {
          const force = (MOUSE_RADIUS - distM) / MOUSE_RADIUS;
          p.vx += (dxM / distM) * force * 0.3;
          p.vy += (dyM / distM) * force * 0.3;
        }

        // Damping
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            // Use red if same cluster, orange if cross-cluster
            const sameCluster = a.cluster === b.cluster;
            const color = sameCluster
              ? `rgba(220,38,38,${alpha})`
              : `rgba(249,115,22,${alpha * 0.6})`;
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const [r, g, b] = p.cluster.color;
        ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}

/* ── Page ── */
export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-24 sm:pt-40 sm:pb-32">
        <ParticleSwarm />

        <div className="relative max-w-4xl mx-auto text-center" style={{ zIndex: 2 }}>
          {/* Eyebrow */}
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-gray-600 mb-8 animate-fade-in">
            Kyle Fonger
          </p>

          {/* Main title */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 animate-fade-in-up tracking-tighter leading-none">
            <span className="text-gradient">FONGER.AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 mb-10 animate-fade-in-up animate-delay-100 max-w-xl mx-auto leading-relaxed text-balance">
            Exploring the intersection of AI, philosophy, and what it means to build
            things that matter.
          </p>

          {/* Terminal prompt */}
          <div className="inline-flex items-center gap-2.5 mb-12 animate-fade-in-up animate-delay-200 bg-[#0f0f0f] border border-[#222] rounded-lg px-5 py-3 font-mono text-sm shadow-lg">
            <span className="text-gray-600 select-none">&gt;</span>
            <span className="text-gray-400">initializing trivance swarm</span>
            <span className="inline-block w-2.5 h-5 bg-brand-red animate-blink ml-1 align-middle rounded-sm" />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animate-delay-300">
            <Link
              href="/dashboard/"
              className="group relative px-8 py-3.5 bg-brand-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Enter the Swarm</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link
              href="/books/"
              className="px-8 py-3.5 border border-[#2a2a2a] text-gray-300 rounded-lg font-semibold hover:border-brand-red/30 hover:text-white hover:bg-[#111] transition-all duration-300"
            >
              Read the Books
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-4 py-16">
        <div className="section-divider mb-16" />
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 sm:p-10 card-hover">
            <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">About</h2>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl text-balance">
              I'm Kyle Fonger, founder of Trivance AI.
            </p>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl text-balance mt-4">
              With a background in philosophy and sales, I build practical AI systems,
              autonomous agents, and tools that help people work more effectively.
              I also write about technology, human behavior, and the ideas shaping our future.
            </p>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl text-balance mt-4">
              Outside of work, I'm a husband of nearly 13 years, a father of three,
              and a martial artist based in the Midwest.
            </p>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section className="px-4 py-16">
        <div className="section-divider mb-16" />
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-10">Explore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <NavigationCard
              href="/dashboard/"
              icon="⚡"
              title="Dashboard"
              description="Live swarm monitor. See the 40 agents running across 9 departments in real time."
            />
            <NavigationCard
              href="/trivance/"
              icon="🤖"
              title="Trivance AI"
              description="A 40-agent swarm architecture with 9 autonomous departments. Building the future."
            />
            <NavigationCard
              href="/books/"
              icon="📚"
              title="Books"
              description="Philosophy, comparative religion, and conspiracy theory analysis. Two books in the works."
              variant="orange"
            />
            <NavigationCard
              href="/swarm/"
              icon="⚡"
              title="The Swarm"
              description="Live demos and portfolio: NakedLeadGen, Paylocity Sales Hub, The Questionarium."
            />
            <NavigationCard
              href="/family/"
              icon="🏠"
              title="Family Portal"
              description="Password-protected homeschool hub for the Fonger family."
              variant="orange"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-10">
        <div className="section-divider mb-10" />
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p>fonger.ai &copy; {new Date().getFullYear()} Kyle Fonger</p>
          <div className="mt-2 flex justify-center gap-5">
            <a href="mailto:kyle@fonger.ai" className="hover:text-gray-400 transition-colors">
              kyle@fonger.ai
            </a>
            <a
              href="https://github.com/k00jax"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
