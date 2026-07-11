'use client';

import { useState, useEffect } from 'react';
import { getDemoState, saveDemoState } from '../lib/demoData';

const STEP_COLORS = {
  hook: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-500' },
  concept: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-500' },
  guided_practice: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  try_it: { bg: 'bg-brand-red/10', border: 'border-brand-red/20', dot: 'bg-brand-red' },
  wrap_up: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', dot: 'bg-purple-500' },
  instruction: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-500' },
  activity: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  quiz: { bg: 'bg-brand-red/10', border: 'border-brand-red/20', dot: 'bg-brand-red' },
  review: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', dot: 'bg-purple-500' },
  wrapup: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', dot: 'bg-purple-500' },
};

function StepLabel(type) {
  const labels = {
    hook: 'Hook',
    concept: 'Learn',
    guided_practice: 'Practice Together',
    try_it: 'Your Turn',
    wrap_up: 'Wrap Up',
    instruction: 'Learn',
    activity: 'Activity',
    quiz: 'Quiz',
    review: 'Review',
    wrapup: 'Summary',
  };
  return labels[type] || type?.replace(/_/g, ' ') || 'Step';
}

export default function LessonViewer({ unit, lesson, subject, grade, kidId, onBack }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [complete, setComplete] = useState(false);

  const steps = lesson?.steps || [];
  const currentStep = steps[stepIndex];
  const isLast = stepIndex >= steps.length - 1;
  const isFirst = stepIndex === 0;

  // Reset state when lesson changes
  useEffect(() => {
    setStepIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setComplete(false);
  }, [lesson?.id]);

  function handleNext() {
    // If current step is a quiz, submit before advancing
    if (currentStep?.type === 'quiz' && !quizSubmitted) {
      setQuizSubmitted(true);
      return;
    }

    if (isLast) {
      // Mark lesson complete in demo state
      const state = getDemoState();
      if (state) {
        const key = `${subject}/${unit.id}/${lesson.id}`;
        state.completedLessons[key] = {
          completedAt: new Date().toISOString(),
          score: currentStep?.type === 'quiz' ? calculateScore() : null,
        };
        state.xp = (state.xp || 0) + 30;
        saveDemoState(state);
      }
      setComplete(true);
      return;
    }
    setStepIndex((i) => i + 1);
    setQuizSubmitted(false);
    setQuizAnswers({});
  }

  function handlePrev() {
    setStepIndex((i) => Math.max(0, i - 1));
    setQuizSubmitted(false);
  }

  function calculateScore() {
    if (!currentStep?.choices) return null;
    let correct = 0;
    Object.entries(quizAnswers).forEach(([idx, answer]) => {
      if (answer === currentStep.choices[Number(idx)]?.correct_answer) correct++;
    });
    return { correct, total: Object.keys(quizAnswers).length };
  }

  if (!lesson || !currentStep) {
    return (
      <div className="text-center py-20 text-gray-500">
        Lesson not found.
        <button onClick={onBack} className="block mx-auto mt-4 text-brand-red hover:underline">
          Back to lessons
        </button>
      </div>
    );
  }

  // ── Complete state ──
  if (complete) {
    const state = getDemoState();
    return (
      <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in-up">
        <div className="text-5xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-3">Lesson Complete!</h2>
        <p className="text-gray-400 mb-2">
          Great job! You earned <span className="text-brand-orange font-bold">30 XP</span>.
        </p>
        <p className="text-gray-600 text-sm mb-8">
          Total XP: {state?.xp || 0} | Streak: {state?.streak || 1} days
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Back to Lessons
          </button>
          <button
            onClick={() => {
              setStepIndex(0);
              setComplete(false);
              setQuizAnswers({});
              setQuizSubmitted(false);
            }}
            className="px-6 py-2.5 border border-[#2a2a2a] text-gray-300 rounded-lg hover:border-brand-red/30 hover:bg-[#111] transition-all duration-300"
          >
            Review Again
          </button>
        </div>
      </div>
    );
  }

  const colors = STEP_COLORS[currentStep.type] || STEP_COLORS.concept;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-4 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to lessons
        </button>
        <h1 className="text-2xl font-bold text-white mb-1">{lesson.title}</h1>
        <p className="text-sm text-gray-500">
          {unit.title} — {SubjectLabel(subject)} Grade {grade} — Lesson {lesson.id?.split('_lesson_').pop() || ''}
        </p>
      </div>

      {/* Step progress bar */}
      <div className="flex gap-1 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < stepIndex
                ? 'bg-brand-red'
                : i === stepIndex
                ? 'bg-brand-orange'
                : 'bg-[#1f1f1f]'
            }`}
          />
        ))}
      </div>

      {/* Step card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 mb-6 transition-all duration-300 ${colors.bg} ${colors.border}`}
      >
        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <span className="text-xs tracking-[0.15em] uppercase text-gray-500">
            Step {stepIndex + 1} of {steps.length} — {StepLabel(currentStep.type)}
          </span>
        </div>

        {/* Content based on step type */}
        {currentStep.type === 'quiz' ? (
          <QuizStep
            step={currentStep}
            answers={quizAnswers}
            setAnswers={setQuizAnswers}
            submitted={quizSubmitted}
          />
        ) : (
          <ContentStep step={currentStep} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className="px-5 py-2.5 border border-[#2a2a2a] text-gray-400 rounded-lg hover:border-[#3a3a3a] hover:text-gray-200 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2"
        >
          {isLast ? 'Finish Lesson' : 'Next'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Content Step ── */
function ContentStep({ step }) {
  const text = step.content || step.prompt || step.summary || '';

  return (
    <div>
      <div className="text-gray-200 text-base leading-relaxed whitespace-pre-line">
        {text}
      </div>

      {step.image && (
        <img
          src={step.image}
          alt=""
          className="mt-5 rounded-xl max-h-64 object-cover"
        />
      )}

      {step.check_for_understanding && (
        <div className="mt-5 p-4 bg-[#0a0a0a] rounded-xl border border-[#1f1f1f]">
          <p className="text-xs text-gray-500 mb-1">Think about it:</p>
          <p className="text-sm text-gray-300 italic">{step.check_for_understanding}</p>
        </div>
      )}

      {step.response_type && (
        <p className="mt-4 text-xs text-gray-600">
          Response type: {step.response_type.replace(/_/g, ' ')}
        </p>
      )}
    </div>
  );
}

/* ── Quiz Step ── */
function QuizStep({ step, answers, setAnswers, submitted }) {
  const questions = step.questions || [];
  const isSingleQuestion = questions.length === 0 && step.question;

  if (isSingleQuestion) {
    const choices = step.choices || [];
    const correctAnswer = step.correct_answer || step.answer;
    const selected = answers[0];

    return (
      <div>
        <p className="text-gray-200 text-base mb-5">{step.question}</p>
        <div className="space-y-2.5">
          {choices.map((choice, i) => {
            const isSelected = selected === choice;
            const isCorrect = choice === correctAnswer;
            let borderClass = 'border-[#1f1f1f] hover:border-[#2a2a2a]';
            if (submitted) {
              if (isCorrect) borderClass = 'border-emerald-500/40 bg-emerald-500/5';
              else if (isSelected) borderClass = 'border-red-500/40 bg-red-500/5';
            } else if (isSelected) {
              borderClass = 'border-brand-red/30 bg-brand-red/5';
            }

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setAnswers({ 0: choice })}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm text-gray-300 ${borderClass}`}
              >
                {submitted && isCorrect && <span className="text-emerald-400 mr-2">✓</span>}
                {submitted && isSelected && !isCorrect && <span className="text-red-400 mr-2">✗</span>}
                {choice}
              </button>
            );
          })}
        </div>
        {submitted && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm ${
              selected === correctAnswer
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-300 border border-red-500/20'
            }`}
          >
            {selected === correctAnswer
              ? 'Correct! Great thinking!'
              : `Not quite. The answer was: ${correctAnswer}`}
          </div>
        )}
      </div>
    );
  }

  // Multi-question quiz
  return (
    <div className="space-y-8">
      {questions.map((q, qi) => {
        const selected = answers[qi];
        const isCorrect = submitted && selected === q.answer;

        return (
          <div key={qi}>
            <p className="text-gray-200 text-sm font-medium mb-3">
              {qi + 1}. {q.question}
            </p>
            <div className="space-y-1.5">
              {(q.choices || []).map((choice, ci) => {
                let borderClass = 'border-[#1f1f1f] hover:border-[#2a2a2a]';
                if (submitted) {
                  if (choice === q.answer) borderClass = 'border-emerald-500/40 bg-emerald-500/5';
                  else if (selected === choice && choice !== q.answer)
                    borderClass = 'border-red-500/40 bg-red-500/5';
                } else if (selected === choice) {
                  borderClass = 'border-brand-red/30 bg-brand-red/5';
                }

                return (
                  <button
                    key={ci}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: choice }))}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm text-gray-400 transition-all duration-200 ${borderClass}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubjectLabel(key) {
  if (key === 'SEL') return 'Social-Emotional Learning';
  return key;
}
