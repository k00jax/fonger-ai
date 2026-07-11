/**
 * Demo data for the Arcadia Learning guest experience.
 * Seeds Oliver, Barrett, and Isla with grade levels and mock progress.
 */

const KIDS = [
  {
    id: 'ollie',
    name: 'Oliver',
    emoji: '🦊',
    grade: '4',
    color: '#f97316', // brand-orange
    bio: '9 years old. Loves building things and asking big questions.',
  },
  {
    id: 'barrett',
    name: 'Barrett',
    emoji: '🐺',
    grade: '2',
    color: '#dc2626', // brand-red
    bio: '7 years old. Curious explorer, always ready for the next adventure.',
  },
  {
    id: 'isla',
    name: 'Isla',
    emoji: '🦋',
    grade: 'k',
    color: '#f59e0b', // amber
    bio: 'Almost ready to start! Loves stories, colors, and asking "why?"',
  },
];

/** Subjects available per grade, with mock completion data */
const DEMO_PROGRESS = {
  ollie: {
    xp: 1840,
    streak: 12,
    completedLessons: {},
    // Track which units are fully complete
    completedUnits: {
      Math: ['Math_unit_01', 'Math_unit_02'],
      Science: ['Science_unit_01'],
      Reading: ['Reading_unit_01'],
    },
    // Track progress within current unit
    currentUnitProgress: {
      Math: { unit: 'Math_unit_03', lesson: 4 },
      Science: { unit: 'Science_unit_02', lesson: 2 },
      Reading: { unit: 'Reading_unit_02', lesson: 1 },
    },
    weakSkills: ['fractions', 'inference'],
    strongSkills: ['multiplication', 'ecosystems', 'geometry'],
  },
  barrett: {
    xp: 720,
    streak: 7,
    completedLessons: {},
    completedUnits: {
      Math: ['Math_unit_01'],
    },
    currentUnitProgress: {
      Math: { unit: 'Math_unit_02', lesson: 2 },
      Science: { unit: 'Science_unit_01', lesson: 3 },
      Reading: { unit: 'Reading_unit_02', lesson: 1 },
    },
    weakSkills: ['addition_basics'],
    strongSkills: ['animals', 'counting'],
  },
  isla: {
    xp: 120,
    streak: 3,
    completedLessons: {},
    completedUnits: {},
    currentUnitProgress: {
      Math: { unit: 'Math_unit_01', lesson: 1 },
      Reading: { unit: 'Reading_unit_01', lesson: 1 },
    },
    weakSkills: [],
    strongSkills: ['colors', 'shapes'],
  },
};

/** Get or create demo state from localStorage */
export function getDemoState() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('arcadia-demo-state');
    if (stored) return JSON.parse(stored);
  } catch {
    // corrupted, reset
  }
  return null;
}

export function saveDemoState(state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('arcadia-demo-state', JSON.stringify(state));
}

export function initDemoState(kidId) {
  const seed = DEMO_PROGRESS[kidId] || {};
  const base = {
    kidId,
    xp: seed.xp || 0,
    streak: seed.streak || 1,
    completedLessons: seed.completedLessons || {},
    completedUnits: seed.completedUnits || {},
    quizHistory: [],
    startedAt: new Date().toISOString(),
  };
  saveDemoState(base);
  return base;
}

export { KIDS, DEMO_PROGRESS };
