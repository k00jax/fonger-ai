import Link from 'next/link';

const departments = [
  { name: 'Market Research', icon: '🔬' },
  { name: 'Design & Creative', icon: '🎨' },
  { name: 'Listing Optimization', icon: '📋' },
  { name: 'Order Fulfillment', icon: '📦' },
  { name: 'Quality Assurance', icon: '✅' },
  { name: 'Customer Support', icon: '💬' },
  { name: 'Analytics & Insights', icon: '📊' },
  { name: 'Content & Marketing', icon: '📢' },
  { name: 'Infrastructure & Ops', icon: '🔧' },
];

export default function TrivancePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-fade-in-up mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Projects</p>
          <div className="flex items-center gap-5 mb-4">
            <span className="w-14 h-14 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center text-3xl">
              🤖
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Trivance AI
            </h1>
          </div>
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
            A 40-agent autonomous swarm. Nine departments. One pipeline.
          </p>
        </div>

        {/* What It Is */}
        <section className="mb-16 animate-fade-in-up animate-delay-100">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Architecture</h2>
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 space-y-6 card-hover">
            <p className="text-gray-300 leading-relaxed text-base">
              Trivance AI is an autonomous agent swarm designed to operate an
              end-to-end print-on-demand (POD) business pipeline. 40 specialized
              agents run across 9 departments, each handling a slice of the
              workflow — from product research through design generation, listing
              optimization, and order fulfillment.
            </p>

            {/* Department grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {departments.map((dept) => (
                <div
                  key={dept.name}
                  className="group flex items-center gap-2.5 px-3.5 py-3 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] text-sm text-gray-400 hover:border-brand-red/15 hover:text-gray-200 hover:bg-[#111] transition-all duration-300"
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-300">
                    {dept.icon}
                  </span>
                  <span className="text-xs leading-tight">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-16 animate-fade-in-up animate-delay-200">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Active Projects</h2>
          <div className="space-y-4">
            {[
              {
                title: 'NakedLeadGen',
                desc: 'Bulk business lead generation. Automated data enrichment for sales prospecting at scale.',
              },
              {
                title: 'Shopify/Printify POD Pipeline',
                desc: 'Autonomous print-on-demand store operation. Trend detection to design to listing to fulfillment.',
              },
              {
                title: 'The Questionarium',
                desc: 'A philosophical wonder-question game. Exploring the biggest ideas through play.',
              },
            ].map((project) => (
              <div
                key={project.title}
                className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 card-hover transition-all duration-500 flex items-start gap-5"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-red/40 group-hover:bg-brand-red group-hover:shadow-[0_0_8px_rgba(220,38,38,0.4)] transition-all duration-500 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1.5">{project.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="animate-fade-in-up animate-delay-300 text-center">
          <p className="text-gray-600 text-sm">
            Questions? Reach out at{' '}
            <a
              href="mailto:kyle@fonger.ai"
              className="text-brand-red hover:text-red-400 transition-colors font-medium"
            >
              kyle@fonger.ai
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
