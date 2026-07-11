import Link from 'next/link';

const todaysLessons = [
  { subject: 'Mathematics', topic: 'Fractions & Decimals', chapter: 'Chapter 7', color: '#f0a030' },
  { subject: 'Science', topic: 'The Water Cycle', chapter: 'Unit 3', color: '#4da6ff' },
  { subject: 'Language Arts', topic: 'Essay Writing Workshop', chapter: 'Module 5', color: '#6fcf97' },
  { subject: 'History', topic: 'Ancient Civilizations', chapter: 'Chapter 4', color: '#bb6bd9' },
];

const weeklySchedule = [
  { day: 'Monday', blocks: ['Math (9:00 - 10:00)', 'Science (10:30 - 11:30)', 'Reading (1:00 - 2:00)'] },
  { day: 'Tuesday', blocks: ['Language Arts (9:00 - 10:00)', 'Math Lab (10:30 - 11:30)', 'History (1:00 - 2:00)'] },
  { day: 'Wednesday', blocks: ['Science Lab (9:00 - 10:30)', 'Writing Workshop (11:00 - 12:00)', 'Free Reading (1:00 - 2:00)'] },
  { day: 'Thursday', blocks: ['Math (9:00 - 10:00)', 'History (10:30 - 11:30)', 'Art & Music (1:00 - 2:30)'] },
  { day: 'Friday', blocks: ['Review & Quizzes (9:00 - 10:30)', 'Project Time (11:00 - 12:00)', 'Nature Study (1:00 - 2:00)'] },
];

const childProgress = [
  { name: 'Ollie', math: 85, science: 72, reading: 94, writing: 68 },
  { name: 'Barrett', math: 78, science: 80, reading: 88, writing: 62 },
  { name: 'Isla', math: 92, science: 75, reading: 96, writing: 81 },
];

function ProgressBar({ value, color = '#f0a030' }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(245,240,232,0.08)' }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function ArcadiaDemoPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d1b2a' }}>
      {/* Demo Banner */}
      <div className="px-4 py-3 text-center text-sm"
        style={{ backgroundColor: 'rgba(240,160,48,0.1)', borderBottom: '1px solid rgba(240,160,48,0.15)' }}>
        <p style={{ color: '#f0a030' }}>
          👋 This is a public demo. The real Arcadia Learning portal is password-protected.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: '#f5f0e8' }}>
            Arcadia Learning <span style={{ color: '#f0a030' }}>Demo</span>
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.5)' }}>Explore a sample of what the full portal offers</p>
        </div>

        {/* Two-column grid: Lessons + Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Lessons */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ backgroundColor: 'rgba(15,35,55,0.6)', border: '1px solid rgba(240,160,48,0.1)' }}
          >
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: '#f5f0e8' }}>
              <span>📖</span> Today&apos;s Lessons
            </h2>
            <div className="space-y-4">
              {todaysLessons.map((lesson) => (
                <div
                  key={lesson.subject}
                  className="flex items-start gap-4 p-4 rounded-xl transition-colors"
                  style={{ backgroundColor: 'rgba(13,27,42,0.4)' }}
                >
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: lesson.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm" style={{ color: '#f5f0e8' }}>
                      {lesson.subject}
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(245,240,232,0.5)' }}>
                      {lesson.topic}
                    </p>
                    <span className="text-xs mt-1 inline-block" style={{ color: 'rgba(245,240,232,0.3)' }}>
                      {lesson.chapter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ backgroundColor: 'rgba(15,35,55,0.6)', border: '1px solid rgba(240,160,48,0.1)' }}
          >
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: '#f5f0e8' }}>
              <span>📅</span> Weekly Schedule
            </h2>
            <div className="space-y-3">
              {weeklySchedule.map((day) => (
                <div
                  key={day.day}
                  className="p-4 rounded-xl transition-colors"
                  style={{ backgroundColor: 'rgba(13,27,42,0.4)' }}
                >
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#f0a030' }}>
                    {day.day}
                  </h3>
                  <ul className="space-y-1">
                    {day.blocks.map((block, i) => (
                      <li key={i} className="text-sm flex items-center gap-2" style={{ color: 'rgba(245,240,232,0.6)' }}>
                        <span style={{ color: 'rgba(240,160,48,0.3)' }}>&#8226;</span>
                        {block}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Dashboard */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-10"
          style={{ backgroundColor: 'rgba(15,35,55,0.6)', border: '1px solid rgba(240,160,48,0.1)' }}
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: '#f5f0e8' }}>
            <span>📊</span> Progress Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {childProgress.map((child) => (
              <div
                key={child.name}
                className="rounded-xl p-5"
                style={{ backgroundColor: 'rgba(13,27,42,0.4)' }}
              >
                <h3 className="font-semibold text-base mb-4" style={{ color: '#f5f0e8' }}>
                  {child.name}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: 'rgba(245,240,232,0.5)' }}>Math</span>
                      <span style={{ color: 'rgba(245,240,232,0.7)' }}>{child.math}%</span>
                    </div>
                    <ProgressBar value={child.math} color="#f0a030" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: 'rgba(245,240,232,0.5)' }}>Science</span>
                      <span style={{ color: 'rgba(245,240,232,0.7)' }}>{child.science}%</span>
                    </div>
                    <ProgressBar value={child.science} color="#4da6ff" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: 'rgba(245,240,232,0.5)' }}>Reading</span>
                      <span style={{ color: 'rgba(245,240,232,0.7)' }}>{child.reading}%</span>
                    </div>
                    <ProgressBar value={child.reading} color="#6fcf97" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: 'rgba(245,240,232,0.5)' }}>Writing</span>
                      <span style={{ color: 'rgba(245,240,232,0.7)' }}>{child.writing}%</span>
                    </div>
                    <ProgressBar value={child.writing} color="#bb6bd9" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/arcadia/portal/"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold transition-all duration-300"
            style={{ backgroundColor: '#f0a030', color: '#0d1b2a' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Access Full Portal
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-lg" />
          </Link>
        </div>
      </div>
    </div>
  );
}
