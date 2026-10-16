import React from 'react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Layers,
  GraduationCap,
  Gauge,
  Download,
  Clock,
  Sparkles,
  Settings,
  HelpCircle,
  Headphones,
  CheckCircle,
  X,
  FileDown,
} from 'lucide-react';
import { ExamTarget } from '../types/study';

export type ActiveNavTab = 'dashboard' | 'input' | 'summary' | 'flashcards' | 'quiz' | 'metrics';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  targetExam: ExamTarget;
  flashcardsCount: number;
  onOpenPdfExport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  targetExam,
  flashcardsCount,
  onOpenPdfExport,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel matching dark theme in reference image */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0d1424] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0d5c4b] flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex items-center">
              <span className="font-bold text-lg text-white tracking-tight">
                Lectura<span className="text-emerald-400">AI</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* OPERATIONS SECTION */}
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
              OPERATIONS
            </div>

            <button
              onClick={() => {
                onSelectTab('dashboard');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#0d5c4b] text-white shadow-sm shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('input');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'input'
                  ? 'bg-[#0d5c4b] text-white shadow-sm shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Lecture Notes & Input</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('summary');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-[#0d5c4b] text-white shadow-sm shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Concise Summary</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('flashcards');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-[#0d5c4b] text-white shadow-sm shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 shrink-0" />
                <span>Flashcards Deck</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
                {flashcardsCount}
              </span>
            </button>

            <button
              onClick={() => {
                onSelectTab('quiz');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-[#0d5c4b] text-white shadow-sm shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Practice CAT Quiz</span>
            </button>
          </div>

          {/* EXAM PREP & METRICS SECTION */}
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
              EXAM METRICS
            </div>

            <button
              onClick={() => {
                onSelectTab('metrics');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-[#0d5c4b] text-white shadow-sm shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Gauge className="w-4 h-4 shrink-0" />
              <span>Performance Analytics</span>
            </button>
          </div>

          {/* OFFLINE & EXPORT SECTION */}
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
              OFFLINE & EXPORT
            </div>

            <button
              onClick={() => {
                onOpenPdfExport();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileDown className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Export PDF Packet</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-800/70 text-emerald-200">
                Offline
              </span>
            </button>
          </div>

          {/* ACCOUNT & PREFERENCES SECTION */}
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
              ACCOUNT
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verification</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Setup
              </span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-400">
              <Settings className="w-4 h-4 shrink-0" />
              <span>Target: CAT Exam</span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-400">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Help Centre</span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-400">
              <Headphones className="w-4 h-4 shrink-0" />
              <span>Contact Support</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>LecturaAI Engine v2.4</span>
          <span className="text-emerald-400 font-semibold">Ready</span>
        </div>
      </aside>
    </>
  );
};
