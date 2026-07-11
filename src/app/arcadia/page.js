'use client';

import Link from 'next/link';

const features = [
  {
    icon: '📚',
    title: 'Interactive Lessons',
    description: 'Engaging, hands-on lessons across math, science, language arts, and history, designed to spark curiosity and deep understanding.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Real-time progress bars and completion metrics for every student, so you always know exactly where they stand.',
  },
  {
    icon: '✨',
    title: 'Curated Content',
    description: 'Every lesson is carefully selected and reviewed to align with the Fonger family learning goals and values.',
  },
  {
    icon: '🏠',
    title: 'Safe Environment',
    description: 'A private, password-protected space built exclusively for the Fonger children. No ads, no tracking, no outside distractions.',
  },
];

export default function ArcadiaPage() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0d1b2a' }}>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-20 sm:pt-40 sm:pb-28">
        <div className="relative max-w-4xl mx-auto text-center" style={{ zIndex: 2 }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 animate-fade-in"
            style={{ borderColor: 'rgba(240,160,48,0.2)', backgroundColor: 'rgba(240,160,48,0.06)' }}>
            <span style={{ color: '#f0a030' }} className="text-xs font-medium tracking-wider uppercase">
              Arcadia Learning
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 animate-fade-in-up tracking-tighter leading-none"
            style={{ color: '#f5f0e8' }}>
            Arcadia<br className="sm:hidden" /> Learning
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl mb-4 animate-fade-in-up animate-delay-100 max-w-xl mx-auto leading-relaxed text-balance"
            style={{ color: 'rgba(245,240,232,0.7)' }}>
            A homeschool learning environment built for the Fonger family
          </p>

          {/* Description */}
          <p className="text-base mb-12 animate-fade-in-up animate-delay-200 max-w-lg mx-auto leading-relaxed"
            style={{ color: 'rgba(245,240,232,0.5)' }}>
            Interactive lessons, assignments, and progress tracking designed to make
            learning engaging and measurable for every child.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animate-delay-300">
            <Link
              href="/arcadia/demo/"
              className="group relative px-8 py-3.5 rounded-lg font-semibold transition-all duration-300"
              style={{ backgroundColor: '#f0a030', color: '#0d1b2a' }}
            >
              <span className="relative z-10">Try the Demo</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-lg" />
            </Link>
            <Link
              href="/arcadia/portal/"
              className="group px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              style={{
                borderColor: 'rgba(240,160,48,0.3)',
                borderWidth: '1px',
                color: '#f0a030',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Family Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs tracking-[0.2em] uppercase text-center mb-10"
            style={{ color: 'rgba(240,160,48,0.5)' }}>
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl p-6 transition-all duration-500 ease-out hover:-translate-y-1"
                style={{
                  backgroundColor: 'rgba(15,35,55,0.6)',
                  borderColor: 'rgba(240,160,48,0.1)',
                  borderWidth: '1px',
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-500 group-hover:scale-110"
                  style={{ backgroundColor: 'rgba(240,160,48,0.1)', color: '#f0a030' }}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: '#f5f0e8' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.45)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-10">
        <div className="max-w-5xl mx-auto text-center text-sm" style={{ color: 'rgba(245,240,232,0.25)' }}>
          <p>
            <Link href="/arcadia/demo/" className="hover:underline" style={{ color: 'rgba(240,160,48,0.5)' }}>
              View the public demo
            </Link>
            <span className="mx-2">&middot;</span>
            <Link href="/" className="hover:underline">
              fonger.ai
            </Link>
          </p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Kyle Fonger</p>
        </div>
      </footer>
    </div>
  );
}
