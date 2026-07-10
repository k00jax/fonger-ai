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
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12 px-4">
      {isDemo && (
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
          <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-lg px-4 py-3 flex items-center gap-3">
            <span className="text-lg">👋</span>
            <p className="text-sm text-brand-orange">
              This is a demo. The real family portal is password-protected.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 animate-slide-up">
          {isDemo ? 'Demo Family Portal' : 'Fonger Family Hub'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Assignments */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 animate-slide-up animate-delay-100">
            <h2 className="text-lg font-semibold text-brand-red mb-4">📚 Today&apos;s Assignments</h2>
            <div className="space-y-3">
              {assignments.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg border border-[#1f1f1f]">
                  <div className="w-2 h-2 mt-2 rounded-full bg-brand-orange flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">{item.kid}</p>
                    <p className="text-gray-400 text-xs">{item.subject}: {item.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 animate-slide-up animate-delay-200">
            <h2 className="text-lg font-semibold text-brand-red mb-4">📅 Weekly Schedule</h2>
            <div className="space-y-2">
              {schedule.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-[#0a0a0a] rounded-lg">
                  <span className="text-brand-orange text-xs font-mono w-16">{item.time}</span>
                  <span className="text-gray-300 text-sm">{item.activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 animate-slide-up animate-delay-300">
            <h2 className="text-lg font-semibold text-brand-red mb-4">📌 Reminders &amp; Announcements</h2>
            <div className="space-y-2">
              {reminders.map((reminder, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg border border-[#1f1f1f]">
                  <span className="text-sm mt-0.5">📌</span>
                  <p className="text-gray-300 text-sm">{reminder}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 animate-slide-up animate-delay-400">
            <h2 className="text-lg font-semibold text-brand-red mb-4">🔗 Quick Links</h2>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 p-3 bg-[#0a0a0a] rounded-lg border border-[#1f1f1f] text-gray-300 hover:text-white hover:border-brand-red/30 transition-all text-sm">
                <span>📖</span> Reading List
              </a>
              <a href="#" className="flex items-center gap-2 p-3 bg-[#0a0a0a] rounded-lg border border-[#1f1f1f] text-gray-300 hover:text-white hover:border-brand-red/30 transition-all text-sm">
                <span>🧮</span> Math Resources
              </a>
              <a href="#" className="flex items-center gap-2 p-3 bg-[#0a0a0a] rounded-lg border border-[#1f1f1f] text-gray-300 hover:text-white hover:border-brand-red/30 transition-all text-sm">
                <span>🔬</span> Science Lab
              </a>
              <a href="#" className="flex items-center gap-2 p-3 bg-[#0a0a0a] rounded-lg border border-[#1f1f1f] text-gray-300 hover:text-white hover:border-brand-red/30 transition-all text-sm">
                <span>🎨</span> Art Projects
              </a>
            </div>
          </div>
        </div>

        {/* Logout for real portal */}
        {!isDemo && (
          <div className="mt-8 text-center animate-slide-up animate-delay-500">
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
