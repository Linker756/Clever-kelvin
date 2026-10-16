import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWordCount,
  calculateReadingTime,
  calculateCompressionRatio,
  updateLeitnerBox,
  calculateDeckMastery,
  gradeQuizAnswer,
  evaluateSummaryQuality,
  preparePdfExportManifest,
} from './studyLogic.ts';

test('calculateWordCount handles various text inputs correctly', () => {
  assert.equal(calculateWordCount(''), 0);
  assert.equal(calculateWordCount('   '), 0);
  assert.equal(calculateWordCount('Hello world'), 2);
  assert.equal(calculateWordCount('  Operating   Systems and   Concurrency  '), 4);
});

test('calculateReadingTime calculates reading minutes based on WPM', () => {
  assert.equal(calculateReadingTime(''), 0);
  // 450 words at 225 wpm = 2.0 min
  const text450 = Array(450).fill('word').join(' ');
  assert.equal(calculateReadingTime(text450), 2);
  // 100 words min is clamped to 0.5 min
  const text100 = Array(100).fill('concept').join(' ');
  assert.equal(calculateReadingTime(text100), 0.5);
});

test('calculateCompressionRatio returns percentage of word reduction', () => {
  assert.equal(calculateCompressionRatio(1000, 200), 80);
  assert.equal(calculateCompressionRatio(500, 250), 50);
  assert.equal(calculateCompressionRatio(100, 100), 0);
  assert.equal(calculateCompressionRatio(0, 50), 0);
});

test('updateLeitnerBox manages spaced repetition transitions', () => {
  // Test starting at box 1
  const afterGood = updateLeitnerBox(1, 'good');
  assert.equal(afterGood.box, 2);
  assert.equal(afterGood.intervalDays, 3);
  assert.equal(afterGood.masteryStatus, 'review');

  const afterEasy = updateLeitnerBox(1, 'easy');
  assert.equal(afterEasy.box, 3);
  assert.equal(afterEasy.intervalDays, 7);

  const afterAgain = updateLeitnerBox(4, 'again');
  assert.equal(afterAgain.box, 1);
  assert.equal(afterAgain.intervalDays, 1);
  assert.equal(afterAgain.masteryStatus, 'learning');

  const maxBox = updateLeitnerBox(4, 'easy');
  assert.equal(maxBox.box, 5);
  assert.equal(maxBox.masteryStatus, 'mastered');
});

test('calculateDeckMastery computes deck statistics accurately', () => {
  const cards = [
    { masteryStatus: 'mastered' },
    { masteryStatus: 'mastered' },
    { masteryStatus: 'review' },
    { masteryStatus: 'learning' },
  ];

  const stats = calculateDeckMastery(cards);
  assert.equal(stats.total, 4);
  assert.equal(stats.mastered, 2);
  assert.equal(stats.review, 1);
  assert.equal(stats.learning, 1);
  // (2 + 0.5) / 4 = 2.5 / 4 = 62.5% -> 63%
  assert.equal(stats.masteredPercent, 63);
});

test('gradeQuizAnswer grades multiple choice and short answers', () => {
  // MCQ exact or prefix match
  assert.equal(gradeQuizAnswer('Semaphore', 'Semaphore', 'mcq').isCorrect, true);
  assert.equal(gradeQuizAnswer('A) Mutex Lock', 'A', 'mcq').isCorrect, true);
  assert.equal(gradeQuizAnswer('A) Mutex Lock', 'B', 'mcq').isCorrect, false);

  // Short answer keyword match
  const answer = 'Mutual exclusion ensures only one process accesses a critical section at a time.';
  const studentGood = 'Only one process can access the critical section simultaneously.';
  const studentPoor = 'Computers run multiple threads.';

  const goodResult = gradeQuizAnswer(answer, studentGood, 'short');
  assert.equal(goodResult.isCorrect, true);

  const poorResult = gradeQuizAnswer(answer, studentPoor, 'short');
  assert.equal(poorResult.isCorrect, false);
});

test('evaluateSummaryQuality assesses conciseness and term coverage', () => {
  const original = 'Operating systems provide synchronization primitives like Semaphores, Mutex locks, and Monitors to prevent race conditions and deadlocks.';
  const summary = 'Operating systems use Semaphores and Mutex locks to prevent race conditions.';
  const keyTerms = ['Semaphores', 'Mutex', 'Deadlocks', 'Monitors'];

  const evalResult = evaluateSummaryQuality(original, summary, keyTerms);
  assert.equal(evalResult.termsFoundCount >= 2, true);
  assert.equal(evalResult.coverageScore > 0, true);
  assert.equal(evalResult.overallQualityScore > 0, true);
});

test('preparePdfExportManifest computes section counts and estimated pages accurately', () => {
  const mockSession = {
    title: 'Operating Systems Concurrency',
    overviewSummary: 'Detailed overview of mutual exclusion and semaphores.',
    definitions: [
      { term: 'Mutex', definition: 'Mutual exclusion primitive' },
      { term: 'Semaphore', definition: 'Integer synchronization variable' },
    ],
    flashcards: [
      { front: 'What is a race condition?', back: 'Concurrent access flaw' },
      { front: 'Define deadlock.', back: 'Permanent blocking cycle' },
      { front: 'Explain starvation.', back: 'Indefinite delay' },
      { front: 'What is priority inversion?', back: 'Low priority blocks high priority' },
      { front: 'What is monitor?', back: 'High level synchronization construct' },
    ],
    examAlerts: [{ title: 'Mutex vs Binary Semaphore trap' }],
  };

  const manifest = preparePdfExportManifest(mockSession);
  assert.equal(manifest.hasSummary, true);
  assert.equal(manifest.totalDefinitions, 2);
  assert.equal(manifest.totalFlashcards, 5);
  assert.equal(manifest.totalAlerts, 1);
  assert.equal(manifest.estimatedPages >= 3, true);
});

