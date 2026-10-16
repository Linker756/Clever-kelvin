import React from 'react';
import {
  FileText,
  BookOpen,
  Layers,
  GraduationCap,
  Download,
  Clock,
  Sparkles,
  ArrowRight,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Compass,
  FileDown,
  ShieldAlert,
} from 'lucide-react';
import { StudySessionResult } from '../types/study';
import { calculateDeckMastery } from '../utils/studyLogic';

interface DashboardOverviewProps {
  session: StudySessionResult | null;
  onOpenPdfExport: () => void;
  onSelectTab: (tab: 'input' | 'summary' | 'flashcards' | 'quiz' | 'metrics') => void;
  onQuickDownloadPdf: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  session,
  onOpenPdfExport,
  onSelectTab,
  onQuickDownloadPdf,
}) => {
  const stats = session ? calculateDeckMastery(session.flashcards) : null;
  const timeSaved = session?.metrics.timeSavedMin || 42;
  const compression = session?.metrics.compressionRatioPercent || 76;
  const cardCount = session?.flashcards.length || 8;
  const masteryPercent = stats?.masteredPercent || 63;

  return (
    <div className="space-y-6">
      {/* Welcome Title matching reference image */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back, Apollo
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Operator Dashboard • University Exam & CAT Preparation
        </p>
      </div>

      {/* Alert Card matching the coral/red locked banner from reference image */}
      <div className="p-5 rounded-2xl bg-rose-50/90 border border-rose-200/90 text-rose-950 flex flex-col sm:flex-row items-start gap-4 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-300 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-rose-900 flex items-center gap-2">
            Exam Retention Alert • Action Required
          </h3>
          <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
            Your spaced repetition schedule indicates <strong>{cardCount} flashcards</strong> require review before the upcoming {session?.targetExam || 'CAT exam'}. Review cards or export the offline PDF to preserve 90%+ recall.
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-rose-700">
            <span>Scheduled: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>•</span>
            <button
              onClick={() => onSelectTab('flashcards')}
              className="font-bold underline hover:text-rose-900 cursor-pointer"
            >
              Start Spaced Review Session &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Action Banner matching the green "Get Verified" card from reference image */}
      <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-300/60">
            <FileDown className="w-5 h-5 text-[#0d5c4b]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              Offline Study Packet Ready for Export
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              Generate a high-resolution PDF document including complete executive summaries, must-know glossary definitions, and Leitner flashcards to read anywhere without internet access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={onOpenPdfExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0d5c4b] hover:bg-[#0a4c3e] active:bg-[#07392f] shadow-sm shadow-emerald-950/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Export PDF Document</span>
          </button>
        </div>
      </div>

      {/* 4 Metric / KPI Cards in Grid matching reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New / Active Cards */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Active Flashcards</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {cardCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              cards in spaced deck this week
            </div>
          </div>
        </div>

        {/* Card 2: Won / Mastered Leads */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Deck Retention</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {masteryPercent}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              mastery rate this month
            </div>
          </div>
        </div>

        {/* Card 3: In Progress / Time Saved */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Study Time Saved</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {timeSaved}m
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              vs manual note-taking this session
            </div>
          </div>
        </div>

        {/* Card 4: Compression Ratio */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Compression Efficiency</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {compression}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              total words reduced for CAT cram
            </div>
          </div>
        </div>
      </div>

      {/* Active Study Packet Overview Card */}
      {session && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d5c4b] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Current Lecture Study Packet
              </span>
              <h3 className="text-lg font-bold text-slate-900">{session.title}</h3>
              <p className="text-xs text-slate-500">
                {session.definitions.length} glossary terms • {session.flashcards.length} spaced cards • {session.concepts.length} core concepts • Target: {session.targetExam}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onQuickDownloadPdf}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Quick PDF</span>
              </button>

              <button
                onClick={() => onSelectTab('summary')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0d5c4b] hover:bg-[#0a4c3e] transition-colors cursor-pointer shadow-2xs"
              >
                <span>Read Summary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelectTab('flashcards')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#0d5c4b]" />
                <span>Practice Cards</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
