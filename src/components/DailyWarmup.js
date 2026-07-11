'use client';

import { useState, useEffect, useCallback } from 'react';

const AURI_ENCOURAGEMENT = {
  correct: [
    "Nailed it! You're on fire! 🔥",
    "That's right! Your brain is amazing! ⭐",
    "Yes! You really know your stuff! 🌟",
    "Perfect! You're getting stronger every day! 💪",
    "Boom! Correct! I'm so proud of you! 🎯",
  ],
  incorrect: [
    "Not quite — but that's how we grow! The answer is",
    "Close! Learning means trying. The right answer is",
    "Good guess! Now you'll remember: it's",
    "Almost! That was tricky. The answer is",
    "No worries — now you know! It's",
  ],
};

const INTRO_MESSAGES = [
  "Good morning, superstar! Ready to wake up that brilliant brain? Here's your daily warmup — 5 quick questions to get those gears turning!",
  "Hey there, awesome learner! Time for today's brain workout. Just 5 fun questions — show me what you know!",
  "Welcome back, champ! Every day you show up, you get stronger. Let's kick off with 5 quick warmup questions!",
];

const WRAPUP_MESSAGES = {
  perfect: "WOW — a perfect score! You're absolutely crushing it! Your brain is on fire today! 🔥🎉",
  great: "Incredible work! You got {score}/{total} right. That's some serious brain power! 🌟",
  good: "Nice job! {score}/{total} correct. You're building those skills every single day! 💪",
  ok: "Good effort! {score}/{total} today. Remember — every mistake is just a lesson in disguise. Let's keep growing! 🌱",
  low: "You showed up and that's what matters! {score}/{total} today. Let's focus on those tricky ones next time. Every champion started right here! 💛",
};

export default function DailyWarmup({ kidName, grade, completedUnitsData, onBack, onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro | question | feedback | wrapup
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Build question bank from completed unit data
  useEffect(() => {
    const bank = buildQuestionBank(completedUnitsData, grade);
    const shuffled = bank.sort(() => Math.random() - 0.5).slice(0, 5);

    if (shuffled.length < 3) {
      // Fallback: generic grade-level questions
      setQuestions(generateFallbackQuestions(grade));
    } else {
      // Pad with fallbacks if needed
      while (shuffled.length < 5) {
        shuffled.push(generateFallbackQuestions(grade)[shuffled.length]);
      }
      setQuestions(shuffled);
    }
    setLoading(false);
  }, [completedUnitsData, grade]);

  function handleSelect(choice) {
    if (selected !== null) return;
    setSelected(choice);
    const correct = choice === questions[currentQ].answer;

    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, { ...questions[currentQ], selected: choice, correct }]);
  }

  function handleNext() {
    if (currentQ >= questions.length - 1) {
      onComplete?.(answers.filter((a) => a.correct).length + (selected === questions[currentQ]?.answer ? 1 : 0), questions.length);
      setPhase('wrapup');
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelected(null);
  }

  function getEncouragement() {
    const bank = selected === questions[currentQ]?.answer ? AURI_ENCOURAGEMENT.correct : AURI_ENCOURAGEMENT.incorrect;
    return bank[Math.floor(Math.random() * bank.length)];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 relative z-10 flex items-center justify-center">
        <div className="text-gray-600 text-center">
          <div className="text-4xl mb-4 animate-bounce">☀️</div>
          <p>Auri is preparing your warmup...</p>
        </div>
      </div>
    );
  }

  // ── Intro ──
  if (phase === 'intro') {
    const intro = INTRO_MESSAGES[Math.floor(Math.random() * INTRO_MESSAGES.length)];
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 relative z-10">
        <div className="max-w-lg mx-auto text-center animate-fade-in-up">
          <div className="text-6xl mb-6">☀️</div>
          <h1 className="text-3xl font-bold text-white mb-4">Daily Warmup</h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-2">{intro}</p>
          <p className="text-gray-600 text-sm mb-8">
            {questions.length} questions • Grade {grade === 'k' ? 'K' : grade} • +{questions.length * 10} XP possible
          </p>
          <button
            onClick={() => setPhase('question')}
            className="px-8 py-3.5 bg-brand-orange text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 animate-pulse-glow text-lg"
          >
            Let's Go!
          </button>
          <button
            onClick={onBack}
            className="block mx-auto mt-4 text-sm text-gray-600 hover:text-gray-400 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  // ── Wrapup ──
  if (phase === 'wrapup') {
    const total = questions.length;
    const pct = score / total;
    let message;
    if (pct === 1) message = WRAPUP_MESSAGES.perfect;
    else if (pct >= 0.8) message = WRAPUP_MESSAGES.great;
    else if (pct >= 0.6) message = WRAPUP_MESSAGES.good;
    else if (pct >= 0.4) message = WRAPUP_MESSAGES.ok;
    else message = WRAPUP_MESSAGES.low;
    const xpEarned = score * 10 + (pct === 1 ? 20 : 0);

    return (
      <div className="max-w-lg mx-auto text-center animate-fade-in-up">
        <div className="text-6xl mb-6">{pct >= 0.8 ? '🎉' : pct >= 0.5 ? '👏' : '💛'}</div>
        <h1 className="text-3xl font-bold text-white mb-4">Warmup Complete!</h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-3">
          {message.replace('{score}', score).replace('{total}', total)}
        </p>
        <div className="my-8 inline-flex items-center justify-center relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" fill="none" stroke="#1f1f1f" strokeWidth="8" />
            <circle cx="64" cy="64" r="56" fill="none" stroke={pct >= 0.8 ? '#10b981' : pct >= 0.6 ? '#f59e0b' : '#dc2626'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${pct * 352} 352`} />
          </svg>
          <span className="absolute text-2xl font-bold text-white">{score}/{total}</span>
        </div>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange/10 border border-brand-orange/20 rounded-xl mb-6">
          <span className="text-lg">⭐</span>
          <span className="text-brand-orange font-bold">+{xpEarned} XP</span>
        </div>
        {answers.some((a) => !a.correct) && (
          <div className="mb-8 text-left">
            <h3 className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">Let's review:</h3>
            <div className="space-y-2.5">
              {answers.filter((a) => !a.correct).map((a, i) => (
                <div key={i} className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4">
                  <p className="text-sm text-gray-300 mb-2">{a.question}</p>
                  <p className="text-xs text-gray-500">You said: <span className="text-red-400">{a.selected}</span></p>
                  <p className="text-xs text-gray-500">Correct: <span className="text-emerald-400">{a.answer}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <button onClick={onBack} className="px-6 py-3 bg-brand-red text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-300">Back to Hub</button>
          {pct < 1 && <button onClick={() => { setPhase('intro'); setCurrentQ(0); setScore(0); setAnswers([]); setSelected(null); }} className="px-6 py-3 border border-[#2a2a2a] text-gray-300 rounded-xl hover:border-brand-red/30 hover:bg-[#111] transition-all duration-300">Try Again</button>}
        </div>
      </div>
    );
  }

  // ── Question ──
  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 relative z-10">
      <div className="max-w-lg mx-auto animate-fade-in-up">
        {/* Progress bar */}
        <div className="flex gap-1 mb-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < currentQ
                  ? answers[i]?.correct
                    ? 'bg-emerald-500'
                    : 'bg-red-500'
                  : i === currentQ
                  ? 'bg-brand-orange'
                  : 'bg-[#1f1f1f]'
              }`}
            />
          ))}
        </div>

        {/* Question card */}
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 mb-6">
          <p className="text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">
            Question {currentQ + 1} of {questions.length}
          </p>
          <p className="text-white text-lg font-medium mb-6">{q.question}</p>

          <div className="space-y-2.5">
            {q.choices.map((choice, i) => {
              const isSelected = selected === choice;
              const isCorrect = choice === q.answer;
              let borderClass = 'border-[#1f1f1f] hover:border-[#333] hover:bg-[#111]';

              if (selected !== null) {
                if (isCorrect) borderClass = 'border-emerald-500/50 bg-emerald-500/10';
                else if (isSelected) borderClass = 'border-red-500/50 bg-red-500/10';
                else borderClass = 'border-[#1f1f1f] opacity-40';
              } else if (isSelected) {
                borderClass = 'border-brand-orange/50 bg-brand-orange/5';
              }

              return (
                <button
                  key={i}
                  disabled={selected !== null}
                  onClick={() => handleSelect(choice)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all duration-200 text-sm ${
                    selected !== null ? 'cursor-default' : 'cursor-pointer'
                  } ${borderClass}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0 opacity-50">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={isSelected && !isCorrect ? 'text-red-300' : isCorrect ? 'text-emerald-300' : 'text-gray-300'}>
                      {choice}
                    </span>
                    {selected !== null && isCorrect && <span className="ml-auto text-emerald-400">✓</span>}
                    {selected !== null && isSelected && !isCorrect && <span className="ml-auto text-red-400">✗</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Auri feedback */}
          {selected !== null && (
            <div
              className={`mt-5 p-4 rounded-xl border text-sm animate-fade-in-up ${
                selected === q.answer
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                  : 'bg-red-500/5 border-red-500/20 text-red-300'
              }`}
            >
              <p>
                <strong>{getEncouragement()}</strong>
                {selected !== q.answer && <span> {q.answer}.</span>}
              </p>
              {q.explanation && (
                <p className="mt-1.5 text-gray-500 text-xs">{q.explanation}</p>
              )}
            </div>
          )}
        </div>

        {/* Next / Finish button */}
        {selected !== null && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-brand-red text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-300 animate-fade-in-up"
          >
            {currentQ >= questions.length - 1 ? 'See My Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Question Bank Builder ── */

function buildQuestionBank(completedUnitsData, grade) {
  const questions = [];

  // Walk through loaded units and extract quiz questions and assessment prompts
  if (completedUnitsData && typeof completedUnitsData === 'object') {
    for (const unit of Object.values(completedUnitsData)) {
      if (!unit || !unit.lessons) continue;

      for (const lesson of unit.lessons || []) {
        for (const step of lesson.steps || []) {
          // Extract quiz steps
          if (step.type === 'quiz') {
            if (step.question && step.choices) {
              questions.push({
                question: step.question,
                choices: step.choices,
                answer: step.correct_answer || step.answer || step.choices[0],
                skill: step.skills_tested?.[0] || 'general',
                subject: unit._subject || 'General',
              });
            }
            if (step.questions) {
              for (const q of step.questions) {
                questions.push({
                  question: q.question || q.q,
                  choices: q.choices || q.options || [],
                  answer: q.answer || q.correct_answer,
                  skill: q.skill || q.skills_tested?.[0] || 'general',
                  subject: unit._subject || 'General',
                });
              }
            }
          }

          // Turn assessment prompts into questions
          if (step.type === 'try_it' && step.content && step.content.length > 10) {
            questions.push({
              question: step.content.replace('{{name}}', 'you'),
              choices: generateChoices(step.content, grade),
              answer: 'This is the correct choice', // placeholder — real answer built from content
              skill: 'comprehension',
              subject: unit._subject || 'General',
            });
          }
        }
      }
    }
  }

  return questions;
}

function generateChoices(content, grade) {
  // For "try it" assessment prompts, generate plausible multiple-choice answers
  // These are generic since we're extracting from text, not structured quiz data
  const gradeNum = grade === 'k' ? 0 : parseInt(grade) || 2;

  if (gradeNum <= 1) {
    return ['Yes, I can do that!', "I'm still learning this.", 'I need a hint.', 'This is easy!'];
  }
  if (gradeNum <= 3) {
    return ['I can explain it clearly.', 'I understand most of it.', "I'm not sure yet.", 'Can you show me an example?'];
  }
  return [
    'I can explain it in detail with examples.',
    'I understand the main idea.',
    "I'm still working on this concept.",
    'I could use more practice.',
  ];
}

function generateFallbackQuestions(grade) {
  const gradeNum = grade === 'k' ? 0 : parseInt(grade) || 2;
  const questions = [];

  if (gradeNum <= 1) {
    questions.push(
      { question: 'What do you get when you add 2 + 3?', choices: ['4', '5', '6', '7'], answer: '5', skill: 'addition', subject: 'Math' },
      { question: 'Which one is a fruit?', choices: ['Carrot', 'Apple', 'Bread', 'Cheese'], answer: 'Apple', skill: 'classification', subject: 'Science' },
      { question: 'How many sides does a triangle have?', choices: ['2', '3', '4', '5'], answer: '3', skill: 'geometry', subject: 'Math' },
      { question: 'What sound does a cow make?', choices: ['Woof', 'Meow', 'Moo', 'Quack'], answer: 'Moo', skill: 'animals', subject: 'Science' },
      { question: 'Which number is biggest?', choices: ['5', '12', '3', '8'], answer: '12', skill: 'number_sense', subject: 'Math' },
    );
  } else if (gradeNum <= 3) {
    questions.push(
      { question: 'What is 8 × 7?', choices: ['54', '56', '64', '49'], answer: '56', skill: 'multiplication', subject: 'Math' },
      { question: 'What planet do we live on?', choices: ['Mars', 'Venus', 'Earth', 'Jupiter'], answer: 'Earth', skill: 'space', subject: 'Science' },
      { question: 'Which word is a verb?', choices: ['Happy', 'Run', 'Blue', 'Tree'], answer: 'Run', skill: 'grammar', subject: 'Reading' },
      { question: 'What is the capital of the United States?', choices: ['New York', 'Washington D.C.', 'Los Angeles', 'Chicago'], answer: 'Washington D.C.', skill: 'geography', subject: 'Social Studies' },
      { question: 'If you have 24 cookies and share with 6 friends, how many does each get?', choices: ['3', '4', '6', '8'], answer: '4', skill: 'division', subject: 'Math' },
    );
  } else {
    questions.push(
      { question: 'What is 3/4 as a decimal?', choices: ['0.25', '0.5', '0.75', '0.34'], answer: '0.75', skill: 'fractions', subject: 'Math' },
      { question: 'What causes the seasons on Earth?', choices: ['Distance from the sun', "Earth's tilted axis", 'The moon', 'Ocean currents'], answer: "Earth's tilted axis", skill: 'earth_science', subject: 'Science' },
      { question: 'Which sentence uses correct grammar?', choices: ['They was running.', 'They were running.', 'They is running.', 'They be running.'], answer: 'They were running.', skill: 'grammar', subject: 'Reading' },
      { question: 'What is the main function of the heart?', choices: ['To think', 'To pump blood', 'To digest food', 'To breathe air'], answer: 'To pump blood', skill: 'human_body', subject: 'Science' },
      { question: 'If a rectangle has a length of 8 and width of 5, what is its area?', choices: ['13', '26', '40', '80'], answer: '40', skill: 'geometry', subject: 'Math' },
    );
  }

  return questions;
}
