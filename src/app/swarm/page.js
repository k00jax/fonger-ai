export default function SwarmPage() {
  const projects = [
    {
      icon: '🤖',
      title: 'The Trivance',
      tagline: '40-Agent Autonomous Swarm',
      description:
        'Nine departments operating in concert. A fully autonomous POD pipeline from product research to customer support. Built on a modular agent architecture with inter-department communication protocols.',
      link: 'https://trivanceai-cc.vercel.app',
      linkLabel: 'View Dashboard',
      variant: 'red',
    },
    {
      icon: '🎯',
      title: 'NakedLeadGen',
      tagline: 'Bulk Business Intelligence',
      description:
        'Automated lead generation at scale. Business data enrichment, structured prospecting lists, and sales intelligence. Built for B2B sales teams who need clean data fast.',
      link: null,
      linkLabel: null,
      variant: 'orange',
    },
    {
      icon: '📞',
      title: 'DealPilot',
      tagline: 'Sales Call Intelligence',
      description:
        'Real-time agent assistance during sales calls. Call transcription, objection handling prompts, and post-call summaries. Like having a strategist in your ear.',
      link: null,
      linkLabel: null,
      variant: 'red',
    },
    {
      icon: '❓',
      title: 'The Questionarium',
      tagline: 'Wonder-Question Game',
      description:
        'A game that asks the biggest questions. Philosophy meets play. Designed to spark curiosity and deep conversation. For kids and adults who still know how to wonder.',
      link: null,
      linkLabel: null,
      variant: 'orange',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-slide-up mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">The Swarm</h1>
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
            A portfolio of autonomous agent projects. Live demos where available.
          </p>
        </div>

        {/* Agent Swarm Diagram */}
        <div className="mb-16 animate-slide-up animate-delay-100">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-red/10 text-brand-red text-2xl mb-5">
              ⚡
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">The Swarm Architecture</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-7 leading-relaxed">
              40 agents, 9 departments. Each agent has a specific role. They communicate,
              delegate, and escalate. The swarm is greater than the sum of its parts.
            </p>
            {/* Department pills */}
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {[
                'Research', 'Design', 'Listings', 'Orders', 'QA',
                'Support', 'Analytics', 'Content', 'Infra',
              ].map((dept, i) => (
                <span
                  key={dept}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    i % 2 === 0
                      ? 'border-brand-red/30 text-brand-red bg-brand-red/5 hover:bg-brand-red/10'
                      : 'border-brand-orange/30 text-brand-orange bg-brand-orange/5 hover:bg-brand-orange/10'
                  }`}
                >
                  {dept}
                </span>
              ))}
            </div>
            <div className="flex justify-center mt-5">
              <span className="text-gray-600 text-xs">🔄 Inter-agent communication bus</span>
            </div>
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`bg-[#111] border border-[#1f1f1f] rounded-xl p-7 animate-slide-up transition-all duration-300 hover:-translate-y-1 ${
                project.variant === 'orange' ? 'card-glow-orange' : 'card-glow'
              }`}
              style={{ animationDelay: `${(i + 2) * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                  project.variant === 'orange'
                    ? 'bg-brand-orange/10 text-brand-orange'
                    : 'bg-brand-red/10 text-brand-red'
                }`}>
                  {project.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                  <p className={`text-sm mb-3 font-medium ${
                    project.variant === 'orange' ? 'text-brand-orange' : 'text-brand-red'
                  }`}>
                    {project.tagline}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-5 py-2.5 bg-brand-red text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-all hover:glow-red"
                    >
                      {project.linkLabel} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-14 text-center animate-slide-up">
          <p className="text-gray-600 text-sm">
            Interested in the swarm?{' '}
            <a href="mailto:kyle@fonger.ai" className="text-brand-red hover:text-red-400 transition-colors font-medium">
              kyle@fonger.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
