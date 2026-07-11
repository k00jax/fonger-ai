'use client';

import Link from 'next/link';
import { useState } from 'react';

const projects = [
  {
    name: 'fonger.ai',
    description:
      'Personal brand hub. This site you are on. Built with Next.js, static export, and GitHub Pages. 8 pages, password-protected areas, and a swarm dashboard.',
    status: 'live',
    link: 'https://fonger.ai',
    image: '/fongerai-preview.png',
    tech: ['Next.js', 'GitHub Pages', 'Tailwind CSS'],
  },
  {
    name: 'The Swarm',
    description:
      'A 45-agent autonomous swarm across 10 departments: Research, Design, Production, Marketing, Operations, Quality, Analytics, Strategy, Director, and Security. Coordinated multi-agent workflows running autonomously.',
    status: 'live',
    link: '/swarm/',
    image: '/swarm-preview.png',
    internal: true,
    tech: ['Python', 'Hermes', 'Claude', 'GPT-4o'],
  },
  {
    name: 'NakedLeadGen',
    description:
      'Free bulk business lookup tool. Enter a ZIP code, get a list of businesses via the OSM Overpass API. Fast, free, and zero fluff.',
    status: 'live',
    link: 'https://nakedleadgen.vercel.app',
    image: '/nakedleadgen-preview.webp',
    tech: ['Next.js', 'OSM Overpass API', 'Vercel'],
  },
  {
    name: 'The Questionarium',
    description:
      'A philosophical wonder-question game. 33 scenarios with XP leveling and badges. Built as an interactive web app that explores the biggest ideas through play.',
    status: 'live',
    link: 'https://questionarium.vercel.app/',
    image: '/questionarium-preview.webp',
    tech: ['Next.js', 'React', 'Tailwind CSS'],
  },
  {
    name: 'Every Voice Matters',
    description:
      'A Shopify plus Printify print-on-demand pipeline covering 11 niches with roughly 29 products. Automated mockup refresh and order processing.',
    status: 'live',
    link: 'https://everyvoicematters.myshopify.com',
    image: '/evm-preview.png',
    tech: ['Shopify', 'Printify', 'Python', 'Automation'],
  },
  {
    name: 'Sales Hub',
    description:
      'An AI sales call assistant that provides real-time guidance during calls, post-call summaries, and CRM integration. Like having a strategist in your ear.',
    status: 'live',
    link: 'https://pay-sales-hub.vercel.app',
    image: '/saleshub-preview.png',
    tech: ['Python', 'Whisper', 'GPT-4o', 'CRM API'],
  },
  {
    name: 'AetherChat',
    description:
      'AI API arbitrage platform. Pay-per-use access to Claude, Gemini, Qwen, and more. Stripe checkout, zero subscriptions. Multi-model chat with usage-based pricing.',
    status: 'live',
    link: 'https://aetherchat-silk.vercel.app',
    image: '/aetherchat-preview.png',
    tech: ['Next.js', 'Stripe', 'Claude API', 'Gemini API'],
  },
  {
    name: 'Agora',
    description:
      'Digital marketplace for AI agents. A platform where autonomous agents can offer services, negotiate deals, and transact with each other.',
    status: 'development',
    link: 'https://github.com/k00jax/agora',
    image: '/agora-preview.webp',
    tech: ['HTML', 'JavaScript', 'Python'],
  },
  {
    name: 'Audiobook Studio',
    description:
      'Turn manuscripts into audiobooks. Automated narration pipeline with voice synthesis, chapter segmentation, and audio mastering.',
    status: 'development',
    link: 'https://github.com/k00jax/audiobook-studio',
    image: '/audiobook-preview.webp',
    tech: ['TypeScript', 'Python', 'ElevenLabs API'],
  },
  {
    name: 'HERMES Offline Survival',
    description:
      'The agent framework that powers The Trivance. Multi-profile AI assistant with skills, plugins, cron scheduling, and Discord integration. Built on Nous Research\'s Hermes architecture.',
    status: 'live',
    link: 'https://github.com/k00jax/HERMES',
    tech: ['Python', 'C++', 'Shell'],
  },
  {
    name: 'Forge',
    description:
      'Project scaffolding and generation tool. Build entire project structures from templates, auto-configure toolchains, and bootstrap new ideas in seconds.',
    status: 'development',
    link: 'https://github.com/k00jax/Forge',
    tech: ['Python'],
  },
];

const StatusDot = ({ status }) => {
  const isLive = status === 'live';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${
          isLive ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
        }`}
      />
      <span className={`text-xs font-medium ${isLive ? 'text-green-400' : 'text-amber-400'}`}>
        {isLive ? 'Live' : 'In Development'}
      </span>
    </span>
  );
};

export default function ProjectsPage() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="animate-fade-in-up mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Portfolio</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Active Projects
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
            What is running in the swarm. Live demos, active builds, and things in the pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <div
              key={project.name}
              className={`group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 card-hover flex flex-col animate-fade-in-up ${
                i === 0 ? '' : `animate-delay-${(i % 5 + 1) * 100}`
              }`}
              style={i >= 5 ? { animationDelay: `${(i - 4) * 100}ms` } : undefined}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">{project.name}</h3>
                <StatusDot status={project.status} />
              </div>

              {/* Project image */}
              {project.image && (
                <div
                  className="mb-4 rounded-xl overflow-hidden border border-[#2a2a2a] cursor-zoom-in hover:border-[#444] transition-colors"
                  onClick={() => setLightbox({ src: project.image, alt: project.name })}
                >
                  <img src={project.image} alt={project.name} className="w-full object-cover" />
                </div>
              )}

              <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#1a1a1a] text-gray-500 border border-[#2a2a2a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.link && (
                <div className="pt-3 border-t border-[#1f1f1f]">
                  {project.internal ? (
                    <Link
                      href={project.link}
                      className="inline-flex items-center gap-1.5 text-xs text-brand-red hover:text-red-400 transition-colors font-medium"
                    >
                      Open
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-red hover:text-red-400 transition-colors font-medium"
                    >
                      {project.link.replace(/^https?:\/\//, '')}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in-up animate-delay-700">
          <p className="text-gray-600 text-sm">
            More projects in the pipeline. The swarm never sleeps.
          </p>
        </div>
      </div>
    </div>
  );
}
