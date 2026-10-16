import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  BookMarked,
  Sliders,
  CheckCircle2,
  Trash2,
  Lightbulb,
} from 'lucide-react';
import { SubjectCategory, ExamTarget, SummaryMode, SampleLecture } from '../types/study';
import { SAMPLE_LECTURES } from '../data/sampleLectures';
import { calculateWordCount, calculateReadingTime } from '../utils/studyLogic';

interface NoteInputSectionProps {
  onGenerate: (payload: {
    title: string;
    rawText: string;
    subject: SubjectCategory;
    targetExam: ExamTarget;
    summaryMode: SummaryMode;
    cardCount: number;
  }) => Promise<void>;
  isLoading: boolean;
}

export const NoteInputSection: React.FC<NoteInputSectionProps> = ({ onGenerate, isLoading }) => {
  const [title, setTitle] = useState('Operating Systems: Concurrency & Synchronization');
  const [rawText, setRawText] = useState(SAMPLE_LECTURES[0].text);
  const [subject, setSubject] = useState<SubjectCategory>('Computer Science & IT');
  const [targetExam, setTargetExam] = useState<ExamTarget>('CAT (Continuous Assessment Test)');
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('concise');
  const [cardCount, setCardCount] = useState<number>(8);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = calculateWordCount(rawText);
  const readTimeMin = calculateReadingTime(rawText);

  const handleSelectSample = (sample: SampleLecture) => {
    setTitle(sample.title);
    setRawText(sample.text);
    setSubject(sample.subject);
    setTargetExam(sample.targetExam);
    setUploadError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File is larger than 5MB. Please upload a smaller file or paste text directly.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        // If title is generic or default, use filename without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        setUploadError(null);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read the file. Please try pasting the text directly.');
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    onGenerate({
      title: title.trim() || 'Untitled Lecture',
      rawText: rawText.trim(),
      subject,
      targetExam,
      summaryMode,
      cardCount,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Lecture Notes Input</h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              Step 1
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Paste your raw notes, upload note files (.txt, .md), or select university sample lectures.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Quick Samples:
          </span>
          {SAMPLE_LECTURES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition-colors whitespace-nowrap cursor-pointer font-medium"
            >
              {sample.subject.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Lecture Meta Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label htmlFor="lecture-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Lecture / Course Title
            </label>
            <input
              id="lecture-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CS301 Operating Systems - Concurrency"
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="lecture-subject" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject Category
            </label>
            <select
              id="lecture-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="Computer Science & IT">Computer Science & IT</option>
              <option value="Medicine & Life Sciences">Medicine & Life Sciences</option>
              <option value="Engineering & Physics">Engineering & Physics</option>
              <option value="Economics & Business">Economics & Business</option>
              <option value="Law & Humanities">Law & Humanities</option>
              <option value="General Science">General Science</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="target-exam" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Assessment
            </label>
            <select
              id="target-exam"
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value as ExamTarget)}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="CAT (Continuous Assessment Test)">CAT (Continuous Assessment Test)</option>
              <option value="Midterm Exam">Midterm Exam</option>
              <option value="Final Examination">Final Examination</option>
              <option value="General Mastery">General Mastery</option>
            </select>
          </div>
        </div>

        {/* Configuration Pills: Summary Mode & Flashcard Count */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Summary Mode:
            </span>
            {(
              [
                { id: 'concise', label: 'Concise Brief', desc: 'Core takeaways' },
                { id: 'comprehensive', label: 'Concept Mastery', desc: 'In-depth explanations' },
                { id: 'exam_cram', label: 'CAT Cram Sheet', desc: 'High-yield definitions & formulas' },
                { id: 'bullets', label: 'Bullet Points', desc: 'Fast scanning' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSummaryMode(mode.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  summaryMode === mode.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title={mode.desc}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-indigo-600" /> Flashcards:
            </span>
            {[5, 8, 12, 16].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setCardCount(count)}
                className={`w-7 h-7 rounded-lg text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
                  cardCount === count
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area with Live Stats & Upload Button */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="raw-lecture-text" className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-indigo-600" /> Raw Lecture Notes
            </label>

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.text"
                className="hidden"
                aria-label="Upload lecture file"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded-md hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File (.txt, .md)
              </button>

              {rawText.trim() && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {uploadError && (
            <div className="mb-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {uploadError}
            </div>
          )}

          <div className="relative">
            <textarea
              id="raw-lecture-text"
              rows={11}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste complete lecture transcript, slides content, syllabus chapters, or textbook readings here..."
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
              required
            />

            {/* Floating Live Metrics Badge */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 text-xs text-slate-600 shadow-xs">
              <span><strong>{wordCount.toLocaleString()}</strong> words</span>
              <span className="text-slate-300">|</span>
              <span>~<strong>{readTimeMin}</strong> min read</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>AI extracts key definitions, high-yield exam alerts, summaries, and spaced-repetition flashcards.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !rawText.trim()}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 text-white shadow-md transition-all cursor-pointer ${
              isLoading || !rawText.trim()
                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-indigo-200'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Lecture & Generating Flashcards...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generate Summary & Flashcards
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
