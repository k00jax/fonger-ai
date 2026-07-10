import Link from 'next/link';

const departments = [
  { name: 'Director', icon: '🎯', count: 3, agents: 'Director, Dashboard, Gateway', desc: 'Orchestrates the entire swarm. Single point of contact via Discord. Routes tasks to specialists.' },
  { name: 'Research', icon: '🔬', count: 5, agents: 'Scout, Trend, Intel, Ledger, Circuit', desc: 'Niche discovery, market research, SERP analysis, revenue modeling, AI/automation research.' },
  { name: 'Design', icon: '🎨', count: 5, agents: 'Pixel, Mockup, Pattern, Type, Brand', desc: 'Vector art, product mockups, print-ready patterns, typography, and brand identity.' },
  { name: 'Production', icon: '⚙️', count: 5, agents: 'Claude, Printify, OpenCode, Renderer, Canvas', desc: 'Heavy coding via Claude Code CLI, Printify uploads, platform-agnostic coding, Playwright renders, order processing.' },
  { name: 'Marketing', icon: '📢', count: 5, agents: 'Scribe, Signal, Reel, Inbox, Magnet', desc: 'Long-form content, social media, video, email campaigns, and lead magnets.' },
  { name: 'Operations', icon: '🔧', count: 6, agents: 'Cron, Monitor, Refresh, Pricer, DescBot, Cleanup', desc: 'Task scheduling, order monitoring, asset sync, price auditing, description generation, duplicate cleanup.' },
  { name: 'Quality', icon: '✅', count: 3, agents: 'QA-Design, QA-Price, QA-Desc', desc: 'Design review, pricing verification, listing accuracy and SEO audits.' },
  { name: 'Analytics', icon: '📊', count: 4, agents: 'Analyst-Sales, Analyst-Traffic, Analyst-Margin, Report', desc: 'Sales analytics, traffic reports, profit margin calculations, daily performance summaries.' },
  { name: 'Strategy', icon: '🧠', count: 4, agents: 'Strategist, Collector, Planner, Scope', desc: 'Niche selection roadmap, competitive intelligence, product roadmap, opportunity scoring.' },
  { name: 'Security', icon: '🛡️', count: 5, agents: 'Gate, Sentinel, Vault, Watchdog, Audit', desc: 'Pre-commit secret scanning, agent output filtering, encrypted secrets management, network monitoring, config auditing.' },
];

const howItWorks = [
  { title: 'Director Dispatch', desc: 'Everything flows through the Director via Discord. The Director analyzes requests, asks clarifying questions, then routes work to the right specialist with structured JSON handoffs.' },
  { title: 'Specialized Agents', desc: 'Each of the 45 agents has a narrow, deeply-prompted role. No generalists. Every agent knows its department, its tools, and its output format. One-shot execution is the goal.' },
  { title: 'Activity Reporter', desc: 'A cron job scans system signals every 60 seconds — active Hermes processes, running cron jobs, dispatched agents, and pre-commit hooks — then pushes real-time status to the dashboard.' },
  { title: 'Cron Scheduler', desc: 'Recurring jobs handle everything from crypto arbitrage monitoring to daily mockup refresh. The scheduler runs autonomous scripts with no human in the loop.' },
  { title: 'Live Dashboard', desc: 'A canvas-based visualization at fonger.ai/dashboard shows all 45 agents as an interactive node graph. Drag nodes, zoom with scroll, toggle side panels for agent details and live event feeds.' },
];

const DEPT_COLORS = {
  director: '#c8ffbe', research: '#f0a030', design: '#4da6ff', production: '#a78bfa',
  marketing: '#ff6b5e', operations: '#7ddc8a', quality: '#ffd866',
  analytics: '#5aa2e8', strategy: '#f2c94c', security: '#22d3ee',
};

const DEPT_ICONS = {
  director: '🎯', research: '🔬', design: '🎨', production: '⚙️', marketing: '📢',
  operations: '🔧', quality: '✅', analytics: '📊', strategy: '🧠', security: '🛡️',
};

export default function SwarmPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="animate-fade-in-up mb-14">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">The Trivance</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            The Swarm
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
            45 specialized agents across 10 departments, running on Hermes Desktop. 
            Orchestrated through a single Director. Autonomous pipelines, live monitoring, 
            and modular architecture.
          </p>
          <div className="flex gap-3 mt-6">
            <Link
              href="/dashboard/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-all hover:glow-red"
            >
              View Live Dashboard
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Department Grid */}
        <div className="mb-16">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">Departments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6 hover:border-[#2a2a3a] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">{dept.icon}</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{dept.name}</h3>
                  <span className="ml-auto text-xs text-gray-600 font-mono">{dept.count} agents</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{dept.desc}</p>
                <p className="text-gray-700 text-xs font-mono">{dept.agents}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">How It Works</h2>
          <div className="space-y-4">
            {howItWorks.map((item) => (
              <div
                key={item.title}
                className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6 hover:border-[#2a2a3a] transition-all duration-300"
              >
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">Built With</h2>
          <div className="flex flex-wrap gap-2">
            {['Hermes Desktop', 'DeepSeek v4', 'Python 3.11', 'Next.js 14', 'GitHub Pages', 'Vercel', 'Discord API', 'Shopify API', 'Printify API', 'Google Workspace', 'Power Automate'].map((tech) => (
              <span key={tech} className="px-3 py-1.5 bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg text-xs text-gray-400 font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Link to Dashboard */}
        <div className="text-center bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 card-hover">
          <h3 className="text-lg font-semibold text-white mb-3">See It Live</h3>
          <p className="text-gray-400 text-sm mb-5 leading-relaxed">
            Watch all 45 agents in real time. Interactive node graph, department
            status bars, and live event feed.
          </p>
          <Link
            href="/dashboard/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700 transition-all hover:glow-red"
          >
            Open Dashboard
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
