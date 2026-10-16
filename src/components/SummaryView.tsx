import React, { useState } from 'react';
import {
  FileText,
  ListCheck,
  BookOpen,
  AlertTriangle,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Search,
  Bookmark,
  Share2,
} from 'lucide-react';
import { KeyConcept, KeyDefinition, ExamAlert, ExamTarget } from '../types/study';

interface SummaryViewProps {
  overviewSummary: string;
  bulletSummary: string[];
  concepts: KeyConcept[];
  definitions: KeyDefinition[];
  examAlerts: ExamAlert[];
  targetExam: ExamTarget;
  title: string;
  onExportPdf?: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  overviewSummary,
  bulletSummary,
  concepts,
  definitions,
  examAlerts,
  targetExam,
  title,
  onExportPdf,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'concepts' | 'definitions' | 'alerts'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Audio Text-to-Speech support via browser Web Speech API
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${title}. Overview: ${overviewSummary}. Key points: ${bulletSummary.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopySummary = () => {
    const fullSummary = `# ${title}\nTarget Exam: ${targetExam}\n\n## Overview\n${overviewSummary}\n\n## Key Takeaways\n${bulletSummary
      .map((b) => `- ${b}`)
      .join('\n')}\n\n## Core Definitions\n${definitions
      .map((d) => `### ${d.term} [${d.importance.toUpperCase()}]\n${d.definition}\nExam Note: ${d.examContext || 'High exam value'}`)
      .join('\n\n')}`;

    navigator.clipboard.writeText(fullSummary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Filter definitions based on search
  const filteredDefinitions = definitions.filter(
    (d) =>
      d.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Bar with Navigation Tabs and Audio/Copy Actions */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            Executive Synthesis
          </button>

          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'concepts'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListCheck className="w-4 h-4 text-indigo-600" />
            Key Concepts ({concepts.length})
          </button>

          <button
            onClick={() => setActiveTab('definitions')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'definitions'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Must-Know Definitions ({definitions.length})
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'bg-white text-amber-800 shadow-xs border border-amber-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Exam Traps & Alerts ({examAlerts.length})
          </button>
        </div>

        {/* Action Buttons: TTS Audio & Copy */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
            title={isSpeaking ? 'Stop read aloud' : 'Listen to summary read aloud'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Listen Aloud</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer"
            title="Copy formatted summary"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0d5c4b] hover:bg-[#0a4c3e] text-white border border-[#0d5c4b] shadow-2xs transition-all cursor-pointer"
              title="Export study summary to PDF document"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-200" />
              <span>Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 sm:p-8">
        {/* Tab 1: Executive Overview & Bullets */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-4xl">
            {/* Overview Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wide">
                  Executive Briefing
                </span>
                <span className="text-xs text-slate-400">• Formatted for high-yield university revision</span>
              </div>
              <div className="text-slate-800 text-base leading-relaxed space-y-4 font-normal bg-slate-50/50 p-5 rounded-xl border border-slate-200/60">
                {overviewSummary.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* High-Yield Bullets Section */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-600" />
                Core Exam Takeaways & Key Principles
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {bulletSummary.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-colors shadow-2xs"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-800 leading-normal">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Key Concepts */}
        {activeTab === 'concepts' && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 gap-4">
              {concepts.map((concept, idx) => (
                <div
                  key={concept.id || idx}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center border border-indigo-200/60">
                        {idx + 1}
                      </span>
                      {concept.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed pl-8">
                    {concept.explanation}
                  </p>

                  {concept.formulaOrRule && (
                    <div className="ml-8 p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs font-mono text-amber-900">
                      <span className="font-semibold uppercase tracking-wider block text-[10px] text-amber-700 mb-1">
                        Invariant Rule / Mathematical Relationship
                      </span>
                      {concept.formulaOrRule}
                    </div>
                  )}

                  {concept.highYieldPoints && concept.highYieldPoints.length > 0 && (
                    <div className="ml-8 pt-1">
                      <span className="text-xs font-semibold text-slate-500 block mb-1.5 uppercase tracking-wide">
                        High-Yield Aspects:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                        {concept.highYieldPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Must-Know Definitions */}
        {activeTab === 'definitions' && (
          <div className="space-y-6 max-w-4xl">
            {/* Search filter for definitions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search glossary terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="text-xs text-slate-500 self-end sm:self-center">
                Showing {filteredDefinitions.length} of {definitions.length} terms
              </div>
            </div>

            {filteredDefinitions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No definitions match "{searchTerm}". Try a different keyword.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDefinitions.map((def) => (
                  <div
                    key={def.id}
                    className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 text-sm">{def.term}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            def.importance === 'critical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : def.importance === 'high'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {def.importance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed mb-3">{def.definition}</p>
                    </div>

                    {def.examContext && (
                      <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
                        <span className="italic">{def.examContext}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${def.term}: ${def.definition}`);
                          }}
                          title="Copy definition"
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Exam Traps & Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Examiner Insight for {targetExam}</strong>
                <span>
                  University lecturers and examiners frequently craft question variations around subtle nuances, false equivalences, and partial condition answers. Review these alerts before testing.
                </span>
              </div>
            </div>

            {examAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 hover:border-amber-300 transition-colors shadow-2xs"
              >
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  {alert.title}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200/80">
                    <span className="font-semibold text-rose-800 uppercase tracking-wider block text-[10px] mb-1">
                      Common Student Pitfall:
                    </span>
                    <p className="text-rose-900 leading-relaxed">{alert.trapDescription}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                    <span className="font-semibold text-emerald-800 uppercase tracking-wider block text-[10px] mb-1">
                      How to Answer Correctly in Exams:
                    </span>
                    <p className="text-emerald-900 leading-relaxed">{alert.howToAvoid}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
