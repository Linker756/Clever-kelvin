import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  Download,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Layers,
  LayoutGrid,
  Maximize2,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Flashcard } from '../types/study';
import { updateLeitnerBox, calculateDeckMastery } from '../utils/studyLogic';

interface FlashcardsViewProps {
  cards: Flashcard[];
  onUpdateCards: (updatedCards: Flashcard[]) => void;
  onExportPdf?: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ cards, onUpdateCards, onExportPdf }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [filterMode, setFilterMode] = useState<'all' | 'learning' | 'review' | 'mastered'>('all');

  const filteredCards = cards.filter((card) => {
    if (filterMode === 'learning') return card.masteryStatus === 'learning' || card.masteryStatus === 'new';
    if (filterMode === 'review') return card.masteryStatus === 'review';
    if (filterMode === 'mastered') return card.masteryStatus === 'mastered';
    return true;
  });

  const activeCards = filteredCards.length > 0 ? filteredCards : cards;
  const currentCard = activeCards[Math.min(currentIndex, activeCards.length - 1)];

  // Reset flip when switching cards
  useEffect(() => {
    setIsFlipped(false);
    setShowHint(false);
  }, [currentIndex, filterMode]);

  // Keyboard shortcut listener (Space to flip, Left/Right arrow to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight' && currentIndex < activeCards.length - 1) {
        e.preventDefault();
        setCurrentIndex((prev) => prev + 1);
      } else if (e.code === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((prev) => prev - 1);
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        else if (e.key === '2') handleRate('hard');
        else if (e.key === '3') handleRate('good');
        else if (e.key === '4') handleRate('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeCards.length, isFlipped]);

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    const { box, intervalDays, masteryStatus } = updateLeitnerBox(currentCard.box, rating);

    const updated = cards.map((c) =>
      c.id === currentCard.id
        ? {
            ...c,
            box,
            intervalDays,
            masteryStatus,
            timesReviewed: c.timesReviewed + 1,
            lastReviewedAt: new Date().toISOString(),
          }
        : c
    );

    onUpdateCards(updated);

    // Auto-advance to next card if available
    if (currentIndex < activeCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    onUpdateCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleExportCSV = () => {
    // Generate standard Anki-compatible CSV format: Front\tBack\tTags
    const rows = cards.map((c) => `"${c.front.replace(/"/g, '""')}","${c.back.replace(/"/g, '""')}","${c.topic}"`);
    const csvContent = 'data:text/csv;charset=utf-8,' + ['"Front","Back","Topic"', ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lectura_flashcards_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = calculateDeckMastery(cards);

  return (
    <div className="space-y-6">
      {/* Top Deck Stats & Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Deck Mastery Progress */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" /> Deck Retention & Mastery: {stats.masteredPercent}%
              </span>
              <span className="text-slate-500 font-medium">
                {stats.mastered} Mastered • {stats.review} In Review • {stats.learning + stats.newCount} Learning
              </span>
            </div>
            {/* Multi-segmented Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(stats.mastered / (stats.total || 1)) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Mastered: ${stats.mastered}`}
              />
              <div
                style={{ width: `${(stats.review / (stats.total || 1)) * 100}%` }}
                className="bg-indigo-500 h-full transition-all"
                title={`Review: ${stats.review}`}
              />
              <div
                style={{ width: `${((stats.learning + stats.newCount) / (stats.total || 1)) * 100}%` }}
                className="bg-amber-400 h-full transition-all"
                title={`Learning: ${stats.learning + stats.newCount}`}
              />
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2 self-end lg:self-center">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => {
                  setFilterMode('all');
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === 'all' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                All ({cards.length})
              </button>
              <button
                onClick={() => {
                  setFilterMode('learning');
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === 'learning' ? 'bg-white text-amber-700 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Due ({stats.learning + stats.newCount})
              </button>
              <button
                onClick={() => {
                  setFilterMode('mastered');
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === 'mastered' ? 'bg-white text-emerald-700 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Mastered ({stats.mastered})
              </button>
            </div>

            {/* Mode Toggle: Carousel vs Grid */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-slate-600">
              <button
                onClick={() => setViewMode('carousel')}
                title="Single Card Focus"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'carousel' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid Overview"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleShuffle}
              title="Shuffle card deck"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportCSV}
              title="Export to Anki / Quizlet CSV"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Anki</span>
            </button>

            {onExportPdf && (
              <button
                onClick={onExportPdf}
                title="Export Flashcards to PDF for offline reading"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0d5c4b] hover:bg-[#0a4c3e] rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Mode 1: Carousel / Focus Study Card */}
      {viewMode === 'carousel' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Card Navigation Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span className="font-semibold text-slate-700">
              Card {currentIndex + 1} of {activeCards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">
                Box {currentCard.box} / 5
              </span>
              <span
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider ${
                  currentCard.difficulty === 'hard'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : currentCard.difficulty === 'medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {currentCard.difficulty}
              </span>
            </div>
          </div>

          {/* 3D Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 cursor-pointer select-none group min-h-[340px]"
          >
            <div
              className={`relative w-full min-h-[340px] transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border-2 border-indigo-100 p-8 shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                      {currentCard.topic}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5" /> Click or Space to flip
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {currentCard.front}
                    </h3>
                  </div>
                </div>

                <div>
                  {currentCard.hint && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      {showHint ? (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Hint:</strong> {currentCard.hint}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(true);
                          }}
                          className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 font-semibold cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          Show study hint
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>Reviewed: {currentCard.timesReviewed} times</span>
                    <span className="text-indigo-600 font-semibold flex items-center gap-1">
                      Flip to reveal answer &rarr;
                    </span>
                  </div>
                </div>
              </div>

              {/* Back of Card (180 deg) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 text-white rounded-3xl border-2 border-slate-800 p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-900/80 text-indigo-300 border border-indigo-700/50">
                      Answer & Marking Scheme
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5" /> Click or Space to flip back
                    </span>
                  </div>

                  <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed mt-2">
                    {currentCard.back}
                  </p>

                  {currentCard.examTip && (
                    <div className="mt-4 p-3 rounded-xl bg-indigo-950/70 border border-indigo-800/60 text-xs text-indigo-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Examiner Tip:</strong> {currentCard.examTip}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-slate-400 flex items-center justify-between">
                  <span>Next interval: ~{currentCard.intervalDays} days</span>
                  <span className="text-slate-400">Rate your recall below:</span>
                </div>
              </div>
            </div>
          </div>

          {/* Leitner Spaced Repetition Rating Buttons */}
          {isFlipped ? (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-bold text-slate-700 text-center uppercase tracking-wide">
                How well did you know this? (Keys 1 - 4)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleRate('again')}
                  className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span className="text-sm">1. Again</span>
                  <span className="text-[10px] font-normal text-rose-600">Reset to Box 1</span>
                </button>

                <button
                  onClick={() => handleRate('hard')}
                  className="px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span className="text-sm">2. Hard</span>
                  <span className="text-[10px] font-normal text-amber-600">Stay in Box {currentCard.box}</span>
                </button>

                <button
                  onClick={() => handleRate('good')}
                  className="px-3 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span className="text-sm">3. Good</span>
                  <span className="text-[10px] font-normal text-indigo-600">+1 Box ({Math.min(5, currentCard.box + 1)})</span>
                </button>

                <button
                  onClick={() => handleRate('easy')}
                  className="px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span className="text-sm">4. Easy</span>
                  <span className="text-[10px] font-normal text-emerald-600">+2 Boxes ({Math.min(5, currentCard.box + 2)})</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={() => setIsFlipped(true)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> Flip to Check Answer (Space)
              </button>

              <button
                disabled={currentIndex === activeCards.length - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(activeCards.length - 1, prev + 1))}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* View Mode 2: Grid Overview */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    Box {card.box} • {card.topic}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      card.masteryStatus === 'mastered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : card.masteryStatus === 'review'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {card.masteryStatus}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-2">{card.front}</h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed mb-3">
                  {card.back}
                </div>
              </div>

              {card.examTip && (
                <div className="text-[11px] text-indigo-700 bg-indigo-50/50 p-2 rounded-lg italic">
                  Tip: {card.examTip}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
