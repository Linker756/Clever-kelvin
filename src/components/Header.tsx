import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Clock,
  Layers,
  Printer,
  RotateCcw,
  Download,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Menu,
  CheckCircle2,
} from 'lucide-react';
import { ExamTarget } from '../types/study';

interface HeaderProps {
  targetExam: ExamTarget;
  timeSavedMin: number;
  cardsMasteredCount: number;
  totalCardsCount: number;
  onReset: () => void;
  hasActiveSession: boolean;
  onOpenPdfExport: () => void;
  onQuickDownloadPdf: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  targetExam,
  timeSavedMin,
  cardsMasteredCount,
  totalCardsCount,
  onReset,
  hasActiveSession,
  onOpenPdfExport,
  onQuickDownloadPdf,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs lg:pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Focus Selector Target Area */}
        <div className="flex items-center space-x-3">
          {/* Mobile Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              aria-label="Toggle navigation sidebar"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo Mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0d5c4b] via-[#10715c] to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/15">
            <BookOpen className="w-5 h-5" />
          </div>

          {/* Brand Name & Target Span for CSS Selector */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Lectura<span className="text-[#0d5c4b]">AI</span>
              </h1>
              {/* TARGET OF CSS SELECTOR 1: div#root:nth-of-type(1) > div:nth-of-type(1) > header:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > span:nth-of-type(1) */}
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-[#0d5c4b] border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#0d5c4b]" /> University Study Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              AI-Powered Lecture Summaries, Flashcards & Offline PDF Packet
            </p>
          </div>
        </div>

        {/* Action Controls & Dashboard Status Pills matching reference image */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Operator Status Pill (matching the Operator $800.00 pill in reference image) */}
          {hasActiveSession && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-medium text-slate-700 shadow-2xs">
              <LayoutDashboard className="w-3.5 h-3.5 text-[#0d5c4b]" />
              <span className="text-slate-500">Operator:</span>
              <span className="font-semibold text-slate-900">Apollo</span>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-[#0d5c4b]">{timeSavedMin}m Saved</span>
            </div>
          )}

          {/* Quick PDF Export Button (styled like the signature Top Up v green button from reference image) */}
          {hasActiveSession && (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                aria-label="Export study packet to PDF"
                title="Export session to PDF for offline reading"
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-[#0d5c4b] hover:bg-[#0a4c3e] active:bg-[#07392f] shadow-sm shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                <span>Export PDF</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              {/* Dropdown Menu */}
              {showExportMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Offline Reading Options
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onQuickDownloadPdf();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#0d5c4b] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4 text-[#0d5c4b]" />
                    <div>
                      <div>Quick Download (.pdf)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Summary & all flashcards</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onOpenPdfExport();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#0d5c4b] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div>Customize PDF Sections...</div>
                      <div className="text-[10px] text-slate-400 font-normal">Choose pages, traps, size</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      window.print();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>Print Study Packet</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notification Bell (matching bell icon in reference image) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View study notifications"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span>Study Notifications</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="space-y-2 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-900 block text-[11px]">PDF Offline Packet Ready</span>
                    <span>Download your lecture notes & cards to read offline without internet.</span>
                  </div>
                  <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="font-semibold text-amber-900 block text-[11px]">Spaced Review Due</span>
                    <span>{cardsMasteredCount}/{totalCardsCount} cards mastered. Complete today's review session.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar Circle (matching AT v avatar in reference image) */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User profile menu"
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#0d5c4b] text-white flex items-center justify-center font-bold text-xs">
                AP
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900 block">Apollo (Student Operator)</span>
                  <span className="text-[11px] text-slate-500">Target: {targetExam}</span>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onReset();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Start New Lecture Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
