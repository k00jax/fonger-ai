import Link from 'next/link';
import NavigationCard from '../components/NavigationCard';

export default function Home() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:pt-36 sm:pb-28">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-red/8 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-orange/6 rounded-full blur-[120px] animate-pulse-slow animate-delay-200" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Main title */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-4 animate-slide-up tracking-tighter">
            <span className="text-gradient">FONGER.AI</span>
          </h1>
          <p className="text-2xl sm:text-3xl text-white font-semibold mb-6 animate-slide-up animate-delay-100 tracking-tight">
            Kyle Fonger
          </p>
          <p className="text-lg sm:text-xl text-gray-400 mb-8 animate-slide-up animate-delay-100 max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of AI, philosophy, and what it means to build things that matter.
          </p>

          {/* Terminal-style prompt */}
          <div className="inline-flex items-center gap-2 mb-10 animate-slide-up animate-delay-200 bg-[#111] border border-[#1f1f1f] rounded-lg px-5 py-3 font-mono text-sm">
            <span className="text-gray-600">&gt;</span>
            <span className="text-gray-400">initializing trivance swarm</span>
            <span className="inline-block w-2.5 h-5 bg-brand-red animate-blink ml-1 align-middle" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up animate-delay-300">
            <Link
              href="/dashboard/"
              className="px-8 py-3.5 bg-brand-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all hover:glow-red"
            >
              Enter the Swarm
            </Link>
            <Link
              href="/books/"
              className="px-8 py-3.5 border border-[#1f1f1f] text-gray-300 rounded-lg font-semibold hover:border-brand-orange/40 hover:text-white transition-all"
            >
              Read the Books
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-16 border-t border-[#1f1f1f]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-white mb-5">About</h2>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl">
              BA in Philosophy. Enterprise AE at Paylocity. Founder of Trivance AI.
              Father of three. Martial artist. Building autonomous agent swarms and
              writing about the ideas that shape us. Based in the Midwest, shipping
              from the basement.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="px-4 py-16 border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Explore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <NavigationCard
              href="/dashboard/"
              icon="⚡"
              title="Dashboard"
              description="Live swarm monitor. See the 40 agents running across 9 departments in real time. Password protected."
            />
            <NavigationCard
              href="/trivance/"
              icon="🤖"
              title="Trivance AI"
              description="A 40-agent swarm architecture with 9 autonomous departments. Building the future of POD pipelines and lead generation."
            />
            <NavigationCard
              href="/books/"
              icon="📚"
              title="Books"
              description="Philosophy, comparative religion, and conspiracy theory analysis. Two books in the works, coming soon."
              variant="orange"
            />
            <NavigationCard
              href="/swarm/"
              icon="⚡"
              title="The Swarm"
              description="Live demos and portfolio: NakedLeadGen, DealPilot, The Questionarium. See what the agents are building."
            />
            <NavigationCard
              href="/family/"
              icon="🏠"
              title="Family Portal"
              description="Password-protected homeschool hub for the Fonger family. Assignments, schedules, and resources."
              variant="orange"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f1f1f] px-4 py-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p>fonger.ai &copy; {new Date().getFullYear()} Kyle Fonger</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="mailto:kyle@fonger.ai" className="hover:text-gray-400 transition-colors">kyle@fonger.ai</a>
            <a href="https://github.com/k00jax" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
