/**
 * Curriculum loader for the Arcadia Learning section of fonger.ai.
 *
 * Loads unit JSONs from /curriculum/ at runtime. Caches results.
 * For the static export, these are served as plain JSON files.
 */

const GRADE_MAP = {
  k: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};

/** All subjects we have in the taxonomy-based curriculum */
const SUBJECTS = [
  'Math',
  'Reading',
  'Science',
  'SEL',
  'Social Studies',
  'Computing',
  'Life Skills',
  'Learning to Learn',
];

const cache = new Map();

/** Fetch a single unit JSON */
export async function loadUnit(grade, subject, unitId) {
  const key = `${grade}/${subject}/${unitId}`;
  if (cache.has(key)) return cache.get(key);

  // Try the unit ID directly, then try with .json extension
  const filename = unitId.endsWith('.json') ? unitId : `${unitId}.json`;
  const url = `/curriculum/grade_${grade}/${subject}/${filename}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    cache.set(key, data);
    return data;
  } catch {
    return null;
  }
}

/** List available subjects for a grade by scanning the manifest */
export async function listSubjects(grade) {
  // We know which subjects exist based on the taxonomy mapping.
  // In production, fetch from an index file. For now, try each subject
  // and return the ones that have files.
  const results = [];
  for (const subject of SUBJECTS) {
    const url = `/curriculum/grade_${grade}/${subject}/`;
    try {
      // Since we can't "list" a directory in static hosting,
      // we use a precomputed manifest. Attempt to load unit_01 for each.
      const unit = await loadUnit(grade, subject, `${subject}_unit_01`);
      if (unit) {
        results.push({
          key: subject,
          label: formatSubjectLabel(subject),
          icon: SUBJECT_ICONS[subject] || '📚',
        });
      }
    } catch {
      // subject doesn't exist for this grade
    }
  }
  return results;
}

/** Load all units for a grade + subject combination */
export async function listUnits(grade, subject) {
  const units = [];
  for (let i = 1; i <= 30; i++) {
    const unitId = `${subject}_unit_${String(i).padStart(2, '0')}`;
    const unit = await loadUnit(grade, subject, unitId);
    if (unit) {
      units.push({
        id: unit.id || unitId,
        title: unit.title || unitId,
        objective: unit.objective || '',
        lessonCount: (unit.lessons || []).length,
      });
    }
  }
  return units;
}

function formatSubjectLabel(key) {
  if (key === 'SEL') return 'Social-Emotional Learning';
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const SUBJECT_ICONS = {
  Math: '🧮',
  Reading: '📖',
  Science: '🔬',
  SEL: '💛',
  'Social Studies': '🌍',
  Computing: '💻',
  'Life Skills': '🛠️',
  'Learning to Learn': '🧠',
};

export { GRADE_MAP, SUBJECTS, SUBJECT_ICONS };
