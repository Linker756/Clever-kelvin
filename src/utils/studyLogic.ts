/**
 * Pure study and NLP logic functions for LecturaAI
 * Decoupled from React UI for deterministic testing and fast execution.
 */

export interface LeitnerState {
  box: number; // 1 to 5
  intervalDays: number;
  masteryStatus: 'new' | 'learning' | 'review' | 'mastered';
}

/**
 * Calculates accurate word count ignoring excess whitespace
 */
export function calculateWordCount(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Calculates estimated reading time in minutes based on average adult/student reading speed (225 words per minute)
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 225): number {
  const words = calculateWordCount(text);
  if (words === 0) return 0;
  const minutes = words / wordsPerMinute;
  return Math.max(0.5, Math.round(minutes * 10) / 10);
}

/**
 * Calculates percentage of words reduced by summarization
 * Example: original 1000 words, summary 200 words => 80% compression
 */
export function calculateCompressionRatio(originalWords: number, summaryWords: number): number {
  if (originalWords <= 0) return 0;
  if (summaryWords >= originalWords) return 0;
  const ratio = ((originalWords - summaryWords) / originalWords) * 100;
  return Math.round(ratio * 10) / 10;
}

/**
 * Spaced Repetition (modified Leitner system)
 * Rating: 'again' (reset), 'hard' (stay/step 1), 'good' (+1 box), 'easy' (+2 boxes)
 */
export function updateLeitnerBox(
  currentBox: number,
  rating: 'again' | 'hard' | 'good' | 'easy'
): LeitnerState {
  let nextBox = currentBox;
  
  switch (rating) {
    case 'again':
      nextBox = 1;
      break;
    case 'hard':
      nextBox = Math.max(1, currentBox);
      break;
    case 'good':
      nextBox = Math.min(5, currentBox + 1);
      break;
    case 'easy':
      nextBox = Math.min(5, currentBox + 2);
      break;
  }

  // Interval calculation based on box
  const intervals: Record<number, number> = {
    1: 1,  // 1 day
    2: 3,  // 3 days
    3: 7,  // 1 week
    4: 14, // 2 weeks
    5: 30, // 1 month
  };

  const intervalDays = intervals[nextBox] || 1;

  let masteryStatus: LeitnerState['masteryStatus'] = 'learning';
  if (nextBox >= 4) {
    masteryStatus = 'mastered';
  } else if (nextBox >= 2) {
    masteryStatus = 'review';
  } else {
    masteryStatus = 'learning';
  }

  return {
    box: nextBox,
    intervalDays,
    masteryStatus,
  };
}

/**
 * Calculates aggregate mastery score from an array of flashcards
 */
export function calculateDeckMastery(cards: { masteryStatus: string }[]): {
  masteredPercent: number;
  total: number;
  mastered: number;
  review: number;
  learning: number;
  newCount: number;
} {
  const total = cards.length;
  if (total === 0) {
    return { masteredPercent: 0, total: 0, mastered: 0, review: 0, learning: 0, newCount: 0 };
  }

  let mastered = 0;
  let review = 0;
  let learning = 0;
  let newCount = 0;

  for (const card of cards) {
    if (card.masteryStatus === 'mastered') mastered++;
    else if (card.masteryStatus === 'review') review++;
    else if (card.masteryStatus === 'learning') learning++;
    else newCount++;
  }

  const masteredPercent = Math.round(((mastered + review * 0.5) / total) * 100);

  return {
    masteredPercent,
    total,
    mastered,
    review,
    learning,
    newCount,
  };
}

/**
 * Grades quiz answer (case-insensitive, trims punctuation)
 */
export function gradeQuizAnswer(
  correctAnswer: string,
  userAnswer: string,
  type: 'mcq' | 'short' = 'mcq'
): { isCorrect: boolean; confidenceScore: number } {
  if (!userAnswer || !userAnswer.trim()) {
    return { isCorrect: false, confidenceScore: 0 };
  }

  const cleanCorrect = correctAnswer.trim().toLowerCase();
  const cleanUser = userAnswer.trim().toLowerCase();

  if (type === 'mcq') {
    const isCorrect = cleanCorrect === cleanUser || cleanCorrect.startsWith(cleanUser);
    return { isCorrect, confidenceScore: isCorrect ? 100 : 0 };
  }

  // Short answer fuzzy comparison
  if (cleanCorrect === cleanUser) {
    return { isCorrect: true, confidenceScore: 100 };
  }

  // Check if significant keywords from answer appear in student's response (with simple root/stem match)
  const keywords = cleanCorrect
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .map((w) => (w.endsWith('es') ? w.slice(0, -2) : w.endsWith('s') ? w.slice(0, -1) : w));

  if (keywords.length === 0) {
    const isCorrect = cleanCorrect.includes(cleanUser) || cleanUser.includes(cleanCorrect);
    return { isCorrect, confidenceScore: isCorrect ? 85 : 0 };
  }

  let matched = 0;
  for (const kw of keywords) {
    if (cleanUser.includes(kw)) matched++;
  }

  const matchRatio = matched / keywords.length;
  // If at least 40% of key semantic roots are present, award correctness with confidence score
  const isCorrect = matchRatio >= 0.4;
  const confidenceScore = Math.min(100, Math.round(matchRatio * 150));

  return { isCorrect, confidenceScore };
}

/**
 * Evaluates summary quality & coverage against source text
 */
export function evaluateSummaryQuality(
  originalText: string,
  summaryText: string,
  keyTerms: string[]
): {
  coverageScore: number;
  concisenessScore: number;
  overallQualityScore: number;
  termsFoundCount: number;
} {
  const origWords = calculateWordCount(originalText);
  const sumWords = calculateWordCount(summaryText);

  if (origWords === 0 || sumWords === 0) {
    return { coverageScore: 0, concisenessScore: 0, overallQualityScore: 0, termsFoundCount: 0 };
  }

  // Conciseness: optimal is 15-30% of original
  const lengthRatio = sumWords / origWords;
  let concisenessScore = 100;
  if (lengthRatio > 0.45) {
    concisenessScore = Math.max(40, Math.round(100 - (lengthRatio - 0.45) * 150));
  } else if (lengthRatio < 0.05) {
    concisenessScore = Math.max(40, Math.round(lengthRatio * 1500));
  }

  // Coverage: how many key terms appear in summary
  let termsFoundCount = 0;
  const lowerSummary = summaryText.toLowerCase();

  for (const term of keyTerms) {
    if (lowerSummary.includes(term.toLowerCase())) {
      termsFoundCount++;
    }
  }

  const coverageScore =
    keyTerms.length > 0 ? Math.round((termsFoundCount / keyTerms.length) * 100) : 85;

  const overallQualityScore = Math.round(coverageScore * 0.55 + concisenessScore * 0.45);

  return {
    coverageScore,
    concisenessScore,
    overallQualityScore,
    termsFoundCount,
  };
}

/**
 * Pure helper to validate and extract sections for offline reading document export
 */
export function preparePdfExportManifest(session: {
  title: string;
  overviewSummary?: string;
  bulletSummary?: string[];
  definitions?: Array<{ term: string; definition: string }>;
  flashcards?: Array<{ front: string; back: string }>;
  examAlerts?: Array<{ title: string }>;
}): {
  hasSummary: boolean;
  totalDefinitions: number;
  totalFlashcards: number;
  totalAlerts: number;
  estimatedPages: number;
} {
  const hasSummary = Boolean(session.overviewSummary && session.overviewSummary.trim().length > 0);
  const totalDefinitions = session.definitions ? session.definitions.length : 0;
  const totalFlashcards = session.flashcards ? session.flashcards.length : 0;
  const totalAlerts = session.examAlerts ? session.examAlerts.length : 0;

  // Approximate page estimation:
  // Summary takes ~1 page, 6 definitions/page, 4 flashcards/page, alerts take ~0.5 page
  const summaryPages = hasSummary ? 1 : 0;
  const defPages = Math.ceil(totalDefinitions / 6);
  const fcPages = Math.ceil(totalFlashcards / 4);
  const alertPages = Math.ceil(totalAlerts / 3);

  const estimatedPages = Math.max(1, summaryPages + defPages + fcPages + alertPages);

  return {
    hasSummary,
    totalDefinitions,
    totalFlashcards,
    totalAlerts,
    estimatedPages,
  };
}

