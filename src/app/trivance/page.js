import Link from 'next/link';

const services = [
  {
    icon: '📋',
    title: 'AI Strategy Report',
    description:
      'A custom roadmap for your business, grounded in your systems, goals, and friction points. We identify where AI can deliver the highest impact and build a practical plan to get there.',
  },
  {
    icon: '🔧',
    title: 'Hands-On Implementation',
    description:
      'We build the solutions. Document GPT, Meeting Bot, custom agent workflows — whatever your business needs. Not just advice, working tools delivered and integrated.',
  },
  {
    icon: '🎓',
    title: 'Team Training',
    description:
      'Practical, role-based LLM training for your team. Everyone learns how to use AI effectively in their actual workflow — not generic theory, real skills that stick.',
  },
  {
    icon: '🤝',
    title: 'Ongoing Advisory',
    description:
      'A monthly partnership for strategic guidance. As AI evolves, we keep you ahead. Regular check-ins, tool updates, and proactive recommendations to keep your strategy sharp.',
  },
];

export default function TrivancePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-fade-in-up mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Consulting</p>
          <div className="flex items-center gap-5 mb-4">
            <span className="w-14 h-14 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center text-2xl font-bold">
              T
            </span>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Trivance AI
              </h1>
              <p className="text-sm text-gray-500 mt-1">Founded by Kyle Fonger</p>
            </div>
          </div>
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl mt-4">
            AI strategy that works. Helping small and mid-sized businesses turn
            AI confusion into operational advantage.
          </p>
        </div>

        {/* Tagline */}
        <div className="mb-16 animate-fade-in-up animate-delay-100">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 text-center card-hover">
            <p className="text-2xl sm:text-3xl font-bold text-gradient">
              Where Thought Becomes System
            </p>
            <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
              Clarity, then Strategy, then Execution. A three-step approach that turns
              AI ideas into working systems your team actually uses.
            </p>
          </div>
        </div>

        {/* Approach */}
        <section className="mb-16 animate-fade-in-up animate-delay-200">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Approach</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { step: '01', label: 'Clarity', desc: 'Understand your systems, goals, and friction points' },
              { step: '02', label: 'Strategy', desc: 'Design a practical AI roadmap for your business' },
              { step: '03', label: 'Execution', desc: 'Build, train, and advise — we make it happen' },
            ].map((item) => (
              <div
                key={item.step}
                className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 card-hover text-center"
              >
                <span className="text-3xl font-bold text-gray-700 group-hover:text-brand-red transition-colors duration-300">
                  {item.step}
                </span>
                <h3 className="text-white font-semibold mt-3 mb-1.5">{item.label}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-16 animate-fade-in-up animate-delay-300">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 card-hover"
              >
                <span className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center text-lg mb-4">
                  {service.icon}
                </span>
                <h3 className="text-white font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Credentials */}
        <section className="mb-16 animate-fade-in-up animate-delay-400">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Backed By</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'BA Philosophy', desc: 'Critical thinking and systems analysis' },
              { label: '10 Years Sales', desc: 'Deep understanding of business operations' },
              { label: 'Prompt Engineering', desc: 'Certification from Vanderbilt University' },
            ].map((item) => (
              <div
                key={item.label}
                className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-5 card-hover text-center"
              >
                <h3 className="text-white font-semibold text-sm">{item.label}</h3>
                <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="animate-fade-in-up animate-delay-500 text-center">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 card-hover">
            <h2 className="text-xl font-bold text-white mb-3">Ready to get started?</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Book a free discovery call at trivanceai.com. No pitch, no pressure — just a
              conversation about your business and where AI can help.
            </p>
            <a
              href="https://trivanceai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-red hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:-translate-y-0.5"
            >
              Visit TrivanceAI.com
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
