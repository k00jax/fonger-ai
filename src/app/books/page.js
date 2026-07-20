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

        {/* Book Cards — newest to oldest */}
        <div className="grid grid-cols-1 gap-6 mb-16">

          {/* Book 1: The Gap (most recent) */}
          <div className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 card-hover transition-all duration-500 flex flex-col sm:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white leading-tight mb-2">
                The Gap
              </h2>
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">Why Some People Shape Reality and Others Just Experience It</p>
              <span className="inline-block px-3 py-1 bg-brand-red/10 text-brand-red text-xs rounded-full mb-4 font-medium tracking-wide">
                Writing
              </span>
              <p className="text-gray-400 leading-relaxed text-sm mb-4">
                The most important divide in the twenty-first century will not be wealth,
                politics, or education. It will be agency. A philosophy of creation,
                consumption, and crossing the gap between them.
              </p>
              <p className="text-gray-600 text-xs">Philosophy, agency, technology, and the creative posture.</p>
            </div>
            <div className="sm:w-40 sm:flex-shrink-0 rounded-xl overflow-hidden border border-[#2a2a2a] self-start">
              <img src="/book-the-gap.jpeg" alt="The Gap cover" className="w-full object-cover" />
            </div>
          </div>

          {/* Book 2: Manufacturing Monsters */}
          <div className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 card-hover-orange transition-all duration-500 flex flex-col sm:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white leading-tight mb-3">
                Manufacturing Monsters
              </h2>
              <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs rounded-full mb-4 font-medium tracking-wide">
                In Progress
              </span>
              <p className="text-gray-400 leading-relaxed text-sm mb-4">
                From the satanic panic of the 1980s to QAnon and the modern conspiracy
                landscape. A deep analysis of how we manufacture moral panics and the
                monsters we need to believe in.
              </p>
              <p className="text-gray-600 text-xs">Conspiracy theory analysis, cultural history.</p>
            </div>
            <div className="sm:w-40 sm:flex-shrink-0 rounded-xl overflow-hidden border border-[#2a2a2a] self-start">
              <img src="/book-manufacturing-monsters.jpeg" alt="Manufacturing Monsters cover" className="w-full object-cover" />
            </div>
          </div>

          {/* Book 2: WTFAYTA */}
          <div className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 card-hover transition-all duration-500 flex flex-col sm:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white leading-tight mb-2">
                What the Fuck Are You Talking About?
              </h2>
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">A History of Metaphysical Ideas, from Apocalypse to the Ground of Being</p>
              <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full mb-4 font-medium tracking-wide">
                Complete
              </span>
              <p className="text-gray-400 leading-relaxed text-sm mb-4">
                A journey through philosophy and comparative religion for people who
                are tired of jargon and academic gatekeeping. Clear thinking about big
                ideas. No fluff. Just the questions that matter and the traditions
                that have tried to answer them.
              </p>
              <p className="text-gray-600 text-xs mb-4">Philosophy, comparative religion, and honest inquiry.</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://youtu.be/ElUaKsgD4es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-all duration-300 hover:glow-red"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Listen on YouTube
                </a>
                <a
                  href="/wtfayta.md"
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-red/30 text-brand-red text-sm rounded-lg font-medium hover:bg-brand-red/10 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Manuscript
                </a>
              </div>
            </div>
            <div className="sm:w-40 sm:flex-shrink-0 rounded-xl overflow-hidden border border-[#2a2a2a] self-start">
              <img src="/book-wtfayta.png" alt="What the Fuck Are You Talking About? cover" className="w-full object-cover" />
            </div>
          </div>

          {/* Book 3: Where Are You (oldest) */}
          <div className="group bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 card-hover transition-all duration-500 flex flex-col sm:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white leading-tight mb-2">
                Where Are You
              </h2>
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">The Bible as a Map of Consciousness</p>
              <span className="inline-block px-3 py-1 bg-[#22d3ee]/10 text-[#22d3ee] text-xs rounded-full mb-4 font-medium tracking-wide">
                Final Draft · June 2026 · 174 pages
              </span>
              <p className="text-gray-400 leading-relaxed text-sm mb-5">
                A sympathetic reading of the biblical tradition that treats
                scripture not as a rulebook or a history text, but as a guide to
                the inner landscape.
              </p>
              <a
                href="/where-are-you.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22d3ee]/20 text-[#22d3ee] text-sm rounded-lg font-medium hover:bg-[#22d3ee]/30 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </a>
              <p className="text-gray-500 text-xs uppercase tracking-wider mt-5">K.W.F.</p>
              <p className="text-gray-600 text-xs">Biblical interpretation, consciousness studies, perennial philosophy.</p>
            </div>
            <div className="sm:w-40 sm:flex-shrink-0 rounded-xl overflow-hidden border border-[#2a2a2a] self-start">
              <img src="/book-where-are-you.jpeg" alt="Where Are You cover" className="w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Subscribe */}
        <div className="text-center animate-fade-in-up animate-delay-300">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 max-w-md mx-auto card-hover">
            <h3 className="text-lg font-semibold text-white mb-3">Get Notified</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              New books and writing in progress. Drop your email for updates.
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
              Email kyle@fonger.ai with subject "Book Updates"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
