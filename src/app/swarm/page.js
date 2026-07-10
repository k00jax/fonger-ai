import Link from 'next/link';

export default function SwarmPage() {
  const projects = [
    {
      icon: '🤖',
      title: 'The Trivance',
      tagline: '40-Agent Autonomous Swarm',
      description:
        'Nine departments operating in concert. A fully autonomous POD pipeline from product research to customer support. Built on a modular agent architecture with inter-department communication protocols.',
      link: '/dashboard/',
      linkLabel: 'View Dashboard',
      variant: 'red',
    },
    {
      icon: '🎯',
      title: 'NakedLeadGen',
      tagline: 'Bulk Business Intelligence',
      description:
        'Automated lead generation at scale. Business data enrichment, structured prospecting lists, and sales intelligence. Built for B2B sales teams who need clean data fast.',
      variant: 'orange',
    },
    {
      icon: '📞',
      title: 'DealPilot',
      tagline: 'Sales Call Intelligence',
      description:
        'Real-time agent assistance during sales calls. Call transcription, objection handling prompts, and post-call summaries. Like having a strategist in your ear.',
      variant: 'red',
    },
    {
      icon: '❓',
      title: 'The Questionarium',
      tagline: 'Wonder-Question Game',
      description:
        'A game that asks the biggest questions. Philosophy meets play. Designed to spark curiosity and deep conversation. For kids and adults who still know how to wonder.',
      variant: 'orange',
    },
  ];

  const swarmDepts = [
    'Research', 'Design', 'Listings', 'Orders', 'QA',
    'Support', 'Analytics', 'Content', 'Infra',
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-fade-in-up mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Portfolio</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            The Swarm
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
            A portfolio of autonomous agent projects. Live demos where available.
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="mb-16 animate-fade-in-up animate-delay-100">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Architecture</h2>
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 text-center card-hover">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-red/10 text-brand-red text-2xl mb-5">
              ⚡
            </div>
            <h3 className="text-white font-semibold text-lg mb-3">The Swarm Architecture</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-7 leading-relaxed">
              40 agents, 9 departments. Each agent has a specific role. They
              communicate, delegate, and escalate. The swarm is greater than the
              sum of its parts.
            </p>

            {/* Department pills */}
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {swarmDepts.map((dept, i) => (
                <span
                  key={dept}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 hover:scale-105 ${
                    i % 2 === 0
                      ? 'border-brand-red/20 text-brand-red bg-brand-red/5 hover:bg-brand-red/10 hover:border-brand-red/30'
                      : 'border-brand-orange/20 text-brand-orange bg-brand-orange/5 hover:bg-brand-orange/10 hover:border-brand-orange/30'
                  }`}
                >
                  {dept}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <span className="text-gray-600 text-xs">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5 animate-pulse" />
                Inter-agent communication bus
              </span>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-7 animate-fade-in-up transition-all duration-500
                ${project.variant === 'orange' ? 'card-hover-orange' : 'card-hover'}`}
              style={{ animationDelay: `${(i + 2) * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-500 group-hover:scale-110 ${
                    project.variant === 'orange'
                      ? 'bg-brand-orange/10 text-brand-orange'
                      : 'bg-brand-red/10 text-brand-red'
                  }`}
                >
                  {project.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1">
                    {project.title}
                  </h3>
                  <p
                    className={`text-xs mb-3 font-medium tracking-wide ${
                      project.variant === 'orange' ? 'text-brand-orange' : 'text-brand-red'
                    }`}
                  >
                    {project.tagline}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  {project.link && (
                    project.link.startsWith('http') ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-all duration-300 hover:glow-red"
                      >
                        {project.linkLabel}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={project.link}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-all duration-300 hover:glow-red"
                      >
                        {project.linkLabel}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-14 text-center animate-fade-in-up animate-delay-600">
          <p className="text-gray-600 text-sm">
            Interested in the swarm?{' '}
            <a
              href="mailto:kyle@fonger.ai"
              className="text-brand-red hover:text-red-400 transition-colors font-medium"
            >
              kyle@fonger.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
