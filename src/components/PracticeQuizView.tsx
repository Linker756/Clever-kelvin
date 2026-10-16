import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Award,
  ChevronRight,
} from 'lucide-react';
import { QuizQuestion, Flashcard, KeyDefinition } from '../types/study';
import { gradeQuizAnswer } from '../utils/studyLogic';

interface PracticeQuizViewProps {
  flashcards: Flashcard[];
  definitions: KeyDefinition[];
  title: string;
  subject: string;
}

export const PracticeQuizView: React.FC<PracticeQuizViewProps> = ({
  flashcards,
  definitions,
  title,
  subject,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    // Generate initial quiz questions from flashcards and definitions
    const list: QuizQuestion[] = [];

    // MCQs
    for (let i = 0; i < Math.min(3, flashcards.length); i++) {
      const fc = flashcards[i];
      const other = flashcards.filter((_, idx) => idx !== i);
      const dist1 = other[0]?.back || 'Enforces atomic non-preemptive lock cycles only.';
      const dist2 = other[1]?.back || 'Operates on uniprocessors without CPU thread context switching.';
      const dist3 = 'Causes thread starvation and immediate deadlock conditions.';

      const options = [fc.back, dist1, dist2, dist3].sort(() => 0.5 - Math.random());

      list.push({
        id: `q-mcq-${i + 1}`,
        type: 'mcq',
        question: fc.front,
        options,
        correctAnswer: fc.back,
        explanation: fc.examTip || 'Focus on the explicit formal conditions and definitions.',
      });
    }

    // Short answers
    for (let i = 0; i < Math.min(2, definitions.length); i++) {
      const def = definitions[i];
      list.push({
        id: `q-short-${i + 1}`,
        type: 'short',
        question: `Define "${def.term}" and summarize its core function in ${subject}.`,
        correctAnswer: def.definition,
        explanation: `Model Answer: ${def.definition} (Examiner Note: ${def.examContext || 'High exam value'})`,
      });
    }

    return list;
  });

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleShortAnswerChange = (questionId: string, text: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  // Calculate score
  let correctCount = 0;
  const gradedQuestions = questions.map((q) => {
    const userAns = userAnswers[q.id] || '';
    const { isCorrect } = gradeQuizAnswer(q.correctAnswer, userAns, q.type);
    if (isCorrect) correctCount++;
    return { ...q, userAnswer: userAns, isCorrect };
  });

  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">CAT Self-Assessment Test</h2>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Test your concept mastery with auto-generated multiple-choice and short-answer exam questions.
          </p>
        </div>

        {isSubmitted && (
          <button
            onClick={handleRetake}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all cursor-pointer shadow-2xs self-start sm:self-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Quiz
          </button>
        )}
      </div>

      {/* Score Banner when Submitted */}
      {isSubmitted && (
        <div
          className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            scorePercent >= 80
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : scorePercent >= 60
              ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl ${
                scorePercent >= 80
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : scorePercent >= 60
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-amber-500 text-white shadow-md shadow-amber-200'
              }`}
            >
              {scorePercent}%
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {scorePercent >= 80
                  ? 'Outstanding! CAT Ready'
                  : scorePercent >= 60
                  ? 'Good Progress — Review Missed Concepts'
                  : 'Needs Review Before Examination'}
              </h3>
              <p className="text-xs opacity-80 mt-0.5">
                You answered {correctCount} of {questions.length} questions correctly.
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/80 border border-current/10 shadow-2xs">
            Review model answers and marking criteria below.
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {gradedQuestions.map((q, idx) => {
          const userAns = userAnswers[q.id];
          const isCorrect = q.isCorrect;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 border border-indigo-200/60 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {q.type === 'mcq' ? 'Multiple Choice' : 'Short Answer / Conceptual Definition'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>

                {isSubmitted && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100/70 px-2.5 py-1 rounded-full">
                        <XCircle className="w-4 h-4 text-rose-600" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* MCQ Options */}
              {q.type === 'mcq' && q.options && (
                <div className="space-y-2 mt-4">
                  {q.options.map((option, optIdx) => {
                    const isSelected = userAns === option;
                    const isTheCorrectOption = isSubmitted && option === q.correctAnswer;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, option)}
                        className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${
                          isSubmitted
                            ? isTheCorrectOption
                              ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-500 font-semibold'
                              : isSelected
                              ? 'bg-rose-100 text-rose-900 border-2 border-rose-400'
                              : 'bg-slate-50 text-slate-500 border border-slate-200'
                            : isSelected
                            ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-900 shadow-2xs'
                            : 'bg-slate-50/70 hover:bg-slate-100 border border-slate-200 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Short Answer Input */}
              {q.type === 'short' && (
                <div className="mt-4 space-y-3">
                  <textarea
                    rows={3}
                    disabled={isSubmitted}
                    value={userAns || ''}
                    onChange={(e) => handleShortAnswerChange(q.id, e.target.value)}
                    placeholder="Type your explanation or definition here..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Explanation & Model Answer (shown after submission) */}
              {isSubmitted && (
                <div className="mt-4 p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Model Answer & Feedback:
                  </div>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Submit Button */}
      {!isSubmitted && (
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSubmitQuiz}
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center gap-2"
          >
            Submit & Grade Quiz
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
