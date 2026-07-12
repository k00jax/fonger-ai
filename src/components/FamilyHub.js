'use client';

import { useState, useEffect, useCallback } from 'react';
import ChildSwitcher from './ChildSwitcher';
import LessonViewer from './LessonViewer';
import DailyWarmup from './DailyWarmup';
import KnowledgeGraph from './KnowledgeGraph';
import AuriChat from './AuriChat';
import { loadUnit, listUnits } from '../lib/curriculum';
import { KIDS, getDemoState, initDemoState, saveDemoState } from '../lib/demoData';

const CORE_SUBJECTS = ['Math', 'Science', 'Reading', 'SEL', 'Social Studies'];

const SUBJECT_META = {
  Math: { icon: '🧮', color: '#3b82f6' },
  Science: { icon: '🔬', color: '#10b981' },
  Reading: { icon: '📖', color: '#f59e0b' },
  SEL: { icon: '💛', color: '#ec4899' },
  'Social Studies': { icon: '🌍', color: '#8b5cf6' },
  Learning: { icon: '🧠', color: '#6366f1' },
};

export default function FamilyHub({ isDemo }) {
  const [kidId, setKidId] = useState('ollie');
  const [view, setView] = useState('hub'); // 'hub' | 'units' | 'lesson' | 'warmup' | 'graph'
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeUnitId, setActiveUnitId] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [units, setUnits] = useState([]);
  const [unitData, setUnitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demoState, setDemoState] = useState(null);
  const [cachedUnits, setCachedUnits] = useState({}); // For warmup question bank

  const kid = KIDS.find((k) => k.id === kidId);
  const grade = kid?.grade || '1';

  // Initialize demo state
  useEffect(() => {
    let state = getDemoState();
    if (!state || state.kidId !== kidId) {
      state = initDemoState(kidId);
    }
    setDemoState(state);
  }, [kidId]);

  const handleSelectKid = useCallback((id) => {
    setKidId(id);
    setView('hub');
    setActiveSubject(null);
    setActiveUnitId(null);
    setActiveLesson(null);
  }, []);

  const handleSubjectClick = useCallback(async (subject) => {
    setActiveSubject(subject);
    setLoading(true);
    const unitList = await listUnits(grade, subject);
    setUnits(unitList);
    setLoading(false);
    setView('units');
  }, [grade]);

  const handleUnitClick = useCallback(async (unitId) => {
    setActiveUnitId(unitId);
    setLoading(true);
    const data = await loadUnit(grade, activeSubject, unitId);
    if (data) {
      data._subject = activeSubject;
      setCachedUnits((c) => ({ ...c, [unitId]: data }));
    }
    setUnitData(data);
    setLoading(false);
  }, [grade, activeSubject]);

  const handleLessonClick = useCallback((lesson) => {
    setActiveLesson(lesson);
    setView('lesson');
  }, []);

  const handleBack = useCallback(() => {
    if (view === 'lesson') {
      setView('units');
      setActiveLesson(null);
    } else if (view === 'units') {
      setView('hub');
      setActiveSubject(null);
      setActiveUnitId(null);
      setUnitData(null);
    } else if (view === 'warmup') {
      setView('hub');
    } else if (view === 'graph') {
      setView('hub');
    }
  }, [view]);

  const handleWarmup = useCallback(() => {
    // Preload first unit of each subject for question bank
    CORE_SUBJECTS.forEach(async (subj) => {
      const data = await loadUnit(grade, subj, `${subj}_unit_01`);
      if (data) {
        data._subject = subj;
        setCachedUnits((c) => ({ ...c, [`${subj}_unit_01`]: data }));
      }
    });
    setView('warmup');
  }, [grade]);

  const handleWarmupBack = useCallback(() => {
    const refreshed = getDemoState();
    if (refreshed) setDemoState(refreshed);
    setView('hub');
  }, []);

  // ── Warmup View ──
  if (view === 'warmup') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 relative z-10">
        {isDemo && <DemoBanner />}
        <DailyWarmup
          kidName={kid?.name}
          grade={grade}
          completedUnitsData={cachedUnits}
          onBack={handleWarmupBack}
        />
      </div>
    );
  }

  // ── Knowledge Graph View ──
  if (view === 'graph') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 relative z-10">
        {isDemo && <DemoBanner />}
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleBack}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to hub
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">
            {kid?.emoji} {kid?.name}&apos;s Knowledge Graph
          </h2>
          <p className="text-gray-500 text-xs font-mono mb-6">
            Each node is a concept or lesson. Connections show how ideas link together.
          </p>
          <KnowledgeGraph
            kidData={demoState}
            kidColor={kid?.color || '#f97316'}
            kidName={kid?.name || ''}
            kidEmoji={kid?.emoji || ''}
          />
        </div>
      </div>
    );
  }

  // ── Lesson View ──
  if (view === 'lesson' && activeLesson && unitData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 relative z-10">
        {isDemo && <DemoBanner />}
        <LessonViewer
          unit={unitData}
          lesson={activeLesson}
          subject={activeSubject}
          grade={grade}
          kidId={kidId}
          onBack={handleBack}
        />
        <AuriChat kidName={kid?.name} />
      </div>
    );
  }

  // ── Hub View ──
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 relative z-10">
      {isDemo && <DemoBanner />}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-4">
            {isDemo ? 'Guest Demo' : 'Private'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {isDemo ? 'Arcadia Learning Demo' : 'Family Learning Hub'}
          </h1>
        </div>

        {/* Child Switcher */}
        <div className="animate-fade-in-up animate-delay-100">
          <ChildSwitcher activeKid={kidId} onSelect={handleSelectKid} />
        </div>

        {/* Stats row */}
        {demoState && (
          <div className="grid grid-cols-3 gap-4 mb-10 animate-fade-in-up animate-delay-200">
            <StatCard label="XP" value={demoState.xp?.toLocaleString()} icon="⭐" />
            <StatCard label="Streak" value={`${demoState.streak} days`} icon="🔥" />
            <StatCard
              label="Lessons Done"
              value={Object.keys(demoState.completedLessons || {}).length}
              icon="✅"
            />
          </div>
        )}

        {/* Warmup button */}
        <div className="animate-fade-in-up animate-delay-250 mb-6">
          <button
            onClick={handleWarmup}
            className="w-full bg-gradient-to-r from-brand-orange/10 to-brand-red/10 border border-brand-orange/20 rounded-2xl p-5 text-left hover:border-brand-orange/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">☀️</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium group-hover:text-brand-orange transition-colors">
                  Daily Warmup
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  5 quick questions - adaptive from your weak skills - +50 XP possible
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-brand-orange transition-all duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Knowledge Graph button */}
        <div className="animate-fade-in-up animate-delay-275 mb-8">
          <button
            onClick={() => setView('graph')}
            className="w-full bg-gradient-to-r from-blue-500/5 to-purple-500/10 border border-blue-500/15 rounded-2xl p-5 text-left hover:border-blue-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🌌</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                  Knowledge Graph
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  See how concepts connect - completed lessons - what&apos;s next
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Subject grid or unit browser */}
        {view === 'hub' ? (
          <div className="animate-fade-in-up animate-delay-300">
            <h2 className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-4">
              📚 Today&apos;s Subjects — Grade {grade === 'k' ? 'K' : grade}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CORE_SUBJECTS.map((subject) => {
                const meta = SUBJECT_META[subject] || { icon: '📚', color: '#666' };
                const progress = getSubjectProgress(demoState, kidId, subject);

                return (
                  <button
                    key={subject}
                    onClick={() => handleSubjectClick(subject)}
                    className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-5 text-left hover:border-[#2a2a2a] transition-all duration-300 card-hover group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{meta.icon}</span>
                      <div>
                        <p className="text-white text-sm font-medium group-hover:text-brand-orange transition-colors">
                          {subject === 'SEL' ? 'Social-Emotional' : subject}
                        </p>
                        <p className="text-xs text-gray-600">Grade {grade}</p>
                      </div>
                    </div>
                    {progress && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress.pct}%</span>
                        </div>
                        <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${progress.pct}%`,
                              backgroundColor: meta.color,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Unit browser */
          <div className="animate-fade-in-up">
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-5 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All subjects
            </button>

            <h2 className="text-xl font-bold text-white mb-1">{activeSubject}</h2>
            <p className="text-sm text-gray-500 mb-6">
              Grade {grade} — {units.length} units available
            </p>

            {loading ? (
              <div className="text-center py-12 text-gray-600">Loading units...</div>
            ) : (
              <div className="space-y-4">
                {units.map((unit) => {
                  const isSelected = activeUnitId === unit.id;
                  return (
                    <div key={unit.id}>
                      <button
                        onClick={() => handleUnitClick(unit.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#1a1a1a] border-[#333]'
                            : 'bg-[#0f0f0f] border-[#1f1f1f] hover:border-[#2a2a2a]'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white text-sm font-medium">{unit.title}</p>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                              {unit.objective}
                            </p>
                          </div>
                          <span className="text-xs text-gray-600 flex-shrink-0 ml-3">
                            {unit.lessonCount} lessons
                          </span>
                        </div>
                      </button>

                      {/* Lesson list when unit is selected */}
                      {isSelected && unitData && (
                        <div className="mt-2 mb-4 ml-4 pl-4 border-l border-[#1f1f1f] space-y-1 animate-fade-in">
                          {(unitData.lessons || []).map((lesson, i) => {
                            const lessonKey = `${activeSubject}/${unit.id}/${lesson.id}`;
                            const isComplete =
                              demoState?.completedLessons?.[lessonKey];
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                                  isComplete
                                    ? 'text-gray-600 line-through'
                                    : 'text-gray-400 hover:text-white hover:bg-[#111]'
                                }`}
                              >
                                <span className="text-xs w-5 flex-shrink-0">
                                  {isComplete ? '✅' : `${i + 1}.`}
                                </span>
                                <span>{lesson.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <AuriChat kidName={kid?.name} />
    </div>
  );
}

/* ── Helpers ── */

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-4 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

function getSubjectProgress(demoState, kidId, subject) {
  if (!demoState) return null;
  const completed = (demoState.completedUnits || {})[subject] || [];
  // Estimate based on typical 8-12 units per subject
  const total = 12;
  const done = completed.length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

function DemoBanner() {
  return (
    <div className="max-w-4xl mx-auto mb-8 animate-fade-in-up">
      <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl px-5 py-3.5 flex items-center gap-3">
        <span className="text-lg flex-shrink-0">👋</span>
        <p className="text-sm text-brand-orange">
          Guest demo — pick a kid, choose a subject, and explore a real lesson. Progress is saved in your
          browser.
        </p>
      </div>
    </div>
  );
}
