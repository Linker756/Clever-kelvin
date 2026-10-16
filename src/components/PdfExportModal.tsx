import React, { useState } from 'react';
import {
  FileDown,
  X,
  Check,
  FileText,
  Layers,
  BookOpen,
  AlertTriangle,
  Printer,
  Sparkles,
  Download,
  Info,
} from 'lucide-react';
import { StudySessionResult } from '../types/study';
import {
  DEFAULT_PDF_OPTIONS,
  PdfExportOptions,
  downloadStudySessionPdf,
} from '../utils/pdfExport';
import { preparePdfExportManifest } from '../utils/studyLogic';

interface PdfExportModalProps {
  session: StudySessionResult;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({ session, isOpen, onClose }) => {
  const [options, setOptions] = useState<PdfExportOptions>(DEFAULT_PDF_OPTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const manifest = preparePdfExportManifest(session);

  const toggleOption = (key: keyof PdfExportOptions) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDownload = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      setTimeout(() => {
        downloadStudySessionPdf(session, options);
        setIsGenerating(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3500);
      }, 250);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setIsGenerating(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0d5c4b] text-white p-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileDown className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 id="pdf-modal-title" className="text-base sm:text-lg font-bold">
                Export Study Packet for Offline Reading
              </h2>
              <p className="text-xs text-emerald-100">
                Generate high-res PDF summary, glossary & flashcards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close export dialog"
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Document Summary Info Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start justify-between gap-3">
            <div>
              <strong className="block text-slate-900 font-semibold text-sm mb-0.5">
                {session.title}
              </strong>
              <div className="text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{session.subject}</span>
                <span>•</span>
                <span>{session.targetExam}</span>
                <span>•</span>
                <span>Est. {manifest.estimatedPages} pages</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md shrink-0">
              OFFLINE READY
            </span>
          </div>

          {/* Section Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Include Sections in PDF:
            </label>

            <div className="space-y-2">
              {/* Executive Summary */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#0d5c4b]" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Executive Summary & Key Principles
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Overview briefing and {session.bulletSummary.length} bullet takeaways
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={options.includeSummary}
                  onChange={() => toggleOption('includeSummary')}
                  className="w-4 h-4 rounded text-[#0d5c4b] focus:ring-[#0d5c4b] cursor-pointer"
                />
              </label>

              {/* Flashcards */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#0d5c4b]" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Spaced Repetition Flashcards Deck
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {session.flashcards.length} revision cards with questions, answers & tips
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={options.includeFlashcards}
                  onChange={() => toggleOption('includeFlashcards')}
                  className="w-4 h-4 rounded text-[#0d5c4b] focus:ring-[#0d5c4b] cursor-pointer"
                />
              </label>

              {/* Definitions */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#0d5c4b]" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Must-Know Glossary & Definitions
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {session.definitions.length} textbook definitions with exam marking notes
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={options.includeDefinitions}
                  onChange={() => toggleOption('includeDefinitions')}
                  className="w-4 h-4 rounded text-[#0d5c4b] focus:ring-[#0d5c4b] cursor-pointer"
                />
              </label>

              {/* Exam Traps & Alerts */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Critical Exam Traps & Pitfalls
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Common student mistakes and examiner scoring criteria
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={options.includeExamAlerts}
                  onChange={() => toggleOption('includeExamAlerts')}
                  className="w-4 h-4 rounded text-[#0d5c4b] focus:ring-[#0d5c4b] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Paper Size Setting */}
          <div className="pt-2 flex items-center justify-between gap-4 text-xs">
            <span className="font-semibold text-slate-700">Page Format:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOptions((prev) => ({ ...prev, paperSize: 'a4' }))}
                className={`px-3 py-1 rounded-lg font-semibold cursor-pointer border transition-all ${
                  options.paperSize === 'a4'
                    ? 'bg-[#0d5c4b] text-white border-[#0d5c4b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                A4 (Standard)
              </button>
              <button
                type="button"
                onClick={() => setOptions((prev) => ({ ...prev, paperSize: 'letter' }))}
                className={`px-3 py-1 rounded-lg font-semibold cursor-pointer border transition-all ${
                  options.paperSize === 'letter'
                    ? 'bg-[#0d5c4b] text-white border-[#0d5c4b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                US Letter
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>PDF generated and downloaded successfully! File is saved for offline reading.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleNativePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Open browser print dialog"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print to PDF</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0d5c4b] hover:bg-[#09473a] active:bg-[#07362c] shadow-md shadow-emerald-950/10 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>Download Offline PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
