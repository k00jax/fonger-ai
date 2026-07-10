'use client';

export default function FamilyPortal({ isDemo, demoData }) {
  const data = isDemo ? demoData : null;

  const assignments = isDemo
    ? demoData.assignments
    : [{ kid: 'Your child', subject: 'Assignments', task: 'Check back for updates' }];

  const schedule = isDemo
    ? demoData.schedule
    : [{ time: '--:--', activity: 'Schedule coming soon' }];

  const reminders = isDemo
    ? demoData.reminders
    : ['Portal is live. Content coming soon.'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 relative z-10">
      {/* Demo banner */}
      {isDemo && (
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in-up">
          <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl px-5 py-3.5 flex items-center gap-3">
            <span className="text-lg flex-shrink-0">👋</span>
            <p className="text-sm text-brand-orange">
              This is a demo. The real family portal is password-protected.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-fade-in-up mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-4">Private</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {isDemo ? 'Demo Family Portal' : 'Fonger Family Hub'}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Assignments */}
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 animate-fade-in-up animate-delay-100 card-hover">
            <h2 className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-5">
              📚 Today&apos;s Assignments
            </h2>
            <div className="space-y-2.5">
              {assignments.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] hover:border-[#252525] transition-colors duration-300"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-brand-orange/60 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">{item.kid}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.subject}: {item.task}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 animate-fade-in-up animate-delay-200 card-hover">
            <h2 className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-5">
              📅 Weekly Schedule
            </h2>
            <div className="space-y-1.5">
              {schedule.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#0a0a0a] transition-colors duration-200 group"
                >
                  <span className="text-brand-orange text-xs font-mono w-16 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.time}
                  </span>
                  <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                    {item.activity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 animate-fade-in-up animate-delay-300 card-hover">
            <h2 className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-5">
              📌 Reminders &amp; Announcements
            </h2>
            <div className="space-y-2.5">
              {reminders.map((reminder, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] hover:border-[#252525] transition-colors duration-300"
                >
                  <span className="text-sm mt-0.5 flex-shrink-0">📌</span>
                  <p className="text-gray-400 text-sm leading-relaxed">{reminder}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 animate-fade-in-up animate-delay-400 card-hover">
            <h2 className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-5">
              🔗 Quick Links
            </h2>
            <div className="space-y-2">
              {[
                { icon: '📖', label: 'Reading List' },
                { icon: '🧮', label: 'Math Resources' },
                { icon: '🔬', label: 'Science Lab' },
                { icon: '🎨', label: 'Art Projects' },
              ].map((link) => (
                <a
                  key={link.label}
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] text-gray-400 hover:text-white hover:border-brand-red/20 hover:bg-[#111] transition-all duration-300 text-sm group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  <svg
                    className="w-3.5 h-3.5 ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Logout */}
        {!isDemo && (
          <div className="mt-10 text-center animate-fade-in-up animate-delay-500">
            <button
              onClick={() => {
                sessionStorage.removeItem('family-auth');
                window.location.reload();
              }}
              className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
