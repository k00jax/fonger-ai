export default function BooksPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-slide-up mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Books</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Writing at the intersection of philosophy, religion, and the stories we tell ourselves.
          </p>
        </div>

        {/* Book Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Book 1 */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-8 animate-slide-up animate-delay-100 hover:border-brand-red/30 transition-all duration-300">
            <div className="text-4xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
              What the Fuck Are You Talking About?
            </h2>
            <div className="inline-block px-3 py-1 bg-brand-red/10 text-brand-red text-xs rounded-full mb-4">
              24th Draft
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              A journey through philosophy and comparative religion for people who are tired
              of jargon and academic gatekeeping. Clear thinking about big ideas. No fluff.
              No footnotes that take up half the page. Just the questions that matter and
              the traditions that have tried to answer them.
            </p>
            <p className="text-gray-600 text-sm">
              Philosophy, comparative religion, and honest inquiry.
            </p>
          </div>

          {/* Book 2 */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-8 animate-slide-up animate-delay-200 hover:border-brand-orange/30 transition-all duration-300">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
              Manufacturing Monsters
            </h2>
            <div className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs rounded-full mb-4">
              In Progress
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              From the satanic panic of the 1980s to QAnon and the modern conspiracy
              landscape. A deep analysis of how we manufacture moral panics and the
              monsters we need to believe in. Tracing the threads that connect moral
              panics across decades.
            </p>
            <p className="text-gray-600 text-sm">
              Conspiracy theory analysis, cultural history.
            </p>
          </div>
        </div>

        {/* Coming Soon / Subscribe */}
        <div className="text-center animate-slide-up animate-delay-300">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-8 max-w-lg mx-auto">
            <h3 className="text-xl font-semibold text-white mb-3">Coming Soon</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Both books are actively being written. Get notified when they drop.
            </p>
            <a
              href="mailto:kyle@fonger.ai?subject=Book Updates"
              className="inline-block px-8 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700 transition-all"
            >
              Get Updates
            </a>
            <p className="mt-3 text-gray-600 text-xs">
              Email kyle@fonger.ai with subject &quot;Book Updates&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
