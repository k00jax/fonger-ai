import Link from 'next/link';

export default function TrivancePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-slide-up mb-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-14 h-14 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center text-3xl">🤖</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Trivance AI</h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
            A 40-agent autonomous swarm. Nine departments. One pipeline.
          </p>
        </div>

        {/* What It Is */}
        <section className="mb-14 animate-slide-up animate-delay-100">
          <h2 className="text-sm font-semibold text-brand-red mb-5 uppercase tracking-widest">What It Is</h2>
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-7 space-y-5">
            <p className="text-gray-300 leading-relaxed text-base">
              Trivance AI is an autonomous agent swarm designed to operate an end-to-end
              print-on-demand (POD) business pipeline. 40 specialized agents run across
              9 departments, each handling a slice of the workflow: product research,
              design generation, listing optimization, order fulfillment, and everything
              in between.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                'Market Research',
                'Design & Creative',
                'Listing Optimization',
                'Order Fulfillment',
                'Quality Assurance',
                'Customer Support',
                'Analytics & Insights',
                'Content & Marketing',
                'Infrastructure & Ops',
              ].map((dept) => (
                <div
                  key={dept}
                  className="px-3 py-2.5 bg-[#0a0a0a] rounded-lg border border-[#1f1f1f] text-sm text-gray-400 text-center hover:border-brand-red/20 hover:text-gray-300 transition-colors"
                >
                  {dept}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Projects */}
        <section className="mb-14 animate-slide-up animate-delay-200">
          <h2 className="text-sm font-semibold text-brand-red mb-5 uppercase tracking-widest">Current Projects</h2>
          <div className="space-y-4">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 card-glow hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-white font-semibold mb-2 text-lg">NakedLeadGen</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bulk business lead generation. Automated data enrichment for sales prospecting.
                Scraping and structuring business intelligence at scale.
              </p>
            </div>
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 card-glow hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-white font-semibold mb-2 text-lg">Shopify/Printify POD Pipeline</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Autonomous print-on-demand store operation. From trend detection to
                design to listing to fulfillment. Fully automated.
              </p>
            </div>
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 card-glow hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-white font-semibold mb-2 text-lg">The Questionarium</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A philosophical wonder-question game. Exploring the biggest ideas through
                play. Built for curious minds of all ages.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="animate-slide-up animate-delay-300 text-center">
          <p className="text-gray-600 text-sm">
            Questions? Reach out at{' '}
            <a href="mailto:kyle@fonger.ai" className="text-brand-red hover:text-red-400 transition-colors font-medium">
              kyle@fonger.ai
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
