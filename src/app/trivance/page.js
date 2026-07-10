import Link from 'next/link';

export default function TrivancePage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-slide-up mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🤖</span>
            <h1 className="text-4xl font-bold text-white">Trivance AI</h1>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed">
            A 40-agent autonomous swarm. Nine departments. One pipeline.
          </p>
        </div>

        {/* What It Is */}
        <section className="mb-12 animate-slide-up animate-delay-100">
          <h2 className="text-lg font-semibold text-brand-red mb-4 uppercase tracking-wide text-sm">What It Is</h2>
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Trivance AI is an autonomous agent swarm designed to operate an end-to-end
              print-on-demand (POD) business pipeline. 40 specialized agents run across
              9 departments, each handling a slice of the workflow: product research,
              design generation, listing optimization, order fulfillment, and everything
              in between.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
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
                  className="px-3 py-2 bg-[#0a0a0a] rounded-lg border border-[#1f1f1f] text-sm text-gray-400 text-center"
                >
                  {dept}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Projects */}
        <section className="mb-12 animate-slide-up animate-delay-200">
          <h2 className="text-lg font-semibold text-brand-red mb-4 uppercase tracking-wide text-sm">Current Projects</h2>
          <div className="space-y-4">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">NakedLeadGen</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bulk business lead generation. Automated data enrichment for sales prospecting.
                Scraping and structuring business intelligence at scale.
              </p>
            </div>
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Shopify/Printify POD Pipeline</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Autonomous print-on-demand store operation. From trend detection to
                design to listing to fulfillment. Fully automated.
              </p>
            </div>
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">The Questionarium</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A philosophical wonder-question game. Exploring the biggest ideas through
                play. Built for curious minds of all ages.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard & Contact */}
        <section className="animate-slide-up animate-delay-300">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Swarm Dashboard</h3>
                <p className="text-gray-500 text-sm">Monitor agent activity and pipeline status.</p>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://trivanceai-cc.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700 transition-all text-sm"
                >
                  Open Dashboard →
                </a>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-gray-600 text-sm">
            Questions? Reach out at{' '}
            <a href="mailto:kyle@fonger.ai" className="text-brand-red hover:text-red-400 transition-colors">
              kyle@fonger.ai
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
