export default function BooksPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-fade-in-up mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-5">Writing</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Books</h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
            At the intersection of philosophy, religion, and the stories we tell ourselves.
          </p>
        </div>

        {/* Book Cards */}
        <div className="grid grid-cols-1 gap-6 mb-16">
          {/* Book 1: WTFAYTA */}
          <div className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 card-hover transition-all duration-500">
            <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center text-xl mb-6 transition-transform duration-500 group-hover:scale-110">
              📖
            </div>

            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-bold text-white leading-tight">
                What the Fuck Are You Talking About?
              </h2>
            </div>

            <p className="text-gray-500 text-sm mb-3 leading-relaxed">A History of Metaphysical Ideas, from Apocalypse to the Ground of Being</p>

            <span className="inline-block px-3 py-1 bg-brand-red/10 text-brand-red text-xs rounded-full mb-5 font-medium tracking-wide">
              24th Draft
            </span>

            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              A journey through philosophy and comparative religion for people who
              are tired of jargon and academic gatekeeping. Clear thinking about big
              ideas. No fluff. No footnotes that take up half the page. Just the
              questions that matter and the traditions that have tried to answer them.
            </p>

            <p className="text-gray-600 text-xs">Philosophy, comparative religion, and honest inquiry.</p>

            <a
              href="https://youtu.be/ElUaKsgD4es"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-brand-red text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-all duration-300 hover:glow-red"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch on YouTube
            </a>
          </div>

          {/* Book 2: Manufacturing Monsters */}
          <div className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 card-hover-orange transition-all duration-500">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center text-xl mb-6 transition-transform duration-500 group-hover:scale-110">
              🔍
            </div>

            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-bold text-white leading-tight">
                Manufacturing Monsters
              </h2>
            </div>

            <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs rounded-full mb-5 font-medium tracking-wide">
              In Progress
            </span>

            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              From the satanic panic of the 1980s to QAnon and the modern conspiracy
              landscape. A deep analysis of how we manufacture moral panics and the
              monsters we need to believe in. Tracing the threads that connect moral
              panics across decades.
            </p>

            <p className="text-gray-600 text-xs">Conspiracy theory analysis, cultural history.</p>
          </div>

          {/* Book 3: Where Are You */}
          <div className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 card-hover transition-all duration-500">
            <div className="w-12 h-12 rounded-xl bg-[#22d3ee]/10 text-[#22d3ee] flex items-center justify-center text-xl mb-6 transition-transform duration-500 group-hover:scale-110">
              🌌
            </div>
            <h2 className="text-xl font-bold text-white leading-tight mb-3">
              Where Are You
            </h2>
            <span className="inline-block px-3 py-1 bg-[#22d3ee]/10 text-[#22d3ee] text-xs rounded-full mb-5 font-medium tracking-wide">
              Final Draft · June 2026 · 174 pages
            </span>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              The Bible as a map of consciousness. A sympathetic reading of the
              biblical tradition that treats scripture not as a rulebook or a
              history text, but as a guide to the inner landscape.
            </p>
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-2">K.W.F.</p>
            <p className="text-gray-600 text-xs">Biblical interpretation, consciousness studies, perennial philosophy.</p>
          </div>
        </div>

        {/* Subscribe */}
        <div className="text-center animate-fade-in-up animate-delay-300">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 max-w-md mx-auto card-hover">
            <h3 className="text-lg font-semibold text-white mb-3">Get Notified</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Both books are actively being written. Drop your email for updates.
            </p>
            <a
              href="mailto:kyle@fonger.ai?subject=Book Updates"
              className="inline-flex items-center gap-2 px-7 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-300 hover:glow-red"
            >
              <span>Get Updates</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
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
