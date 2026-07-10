import Link from 'next/link';
import NavigationCard from '../components/NavigationCard';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:pt-32 sm:pb-24">
        {/* Subtle animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl animate-pulse-slow animate-delay-200" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up tracking-tight">
            Kyle Fonger
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 mb-4 animate-slide-up animate-delay-100 max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of AI, philosophy, and what it means to build things that matter.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up animate-delay-200">
            <Link
              href="/swarm/"
              className="px-6 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700 transition-all hover:glow-red"
            >
              See the Swarm
            </Link>
            <Link
              href="/books/"
              className="px-6 py-3 border border-[#1f1f1f] text-gray-300 rounded-lg font-medium hover:border-brand-orange/30 hover:text-white transition-all"
            >
              Read the Books
            </Link>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="px-4 py-16 border-t border-[#1f1f1f]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">About</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            BA in Philosophy. Enterprise AE at Paylocity. Founder of Trivance AI.
            Father of three. Martial artist. Building autonomous agent swarms and
            writing about the ideas that shape us. Based in the Midwest, shipping
            from the basement.
          </p>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="px-4 py-16 border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Explore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
