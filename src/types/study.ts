export type SubjectCategory =
  | 'Computer Science & IT'
  | 'Medicine & Life Sciences'
  | 'Engineering & Physics'
  | 'Economics & Business'
  | 'Law & Humanities'
  | 'General Science'
  | 'Other';

export type ExamTarget = 'CAT (Continuous Assessment Test)' | 'Midterm Exam' | 'Final Examination' | 'General Mastery';

export type SummaryMode = 'concise' | 'comprehensive' | 'exam_cram' | 'bullets';

export interface KeyDefinition {
  id: string;
  term: string;
  definition: string;
  importance: 'critical' | 'high' | 'medium';
  examContext?: string;
}

export interface KeyConcept {
  id: string;
  title: string;
  explanation: string;
  highYieldPoints: string[];
  formulaOrRule?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;
  examTip?: string;
  box: number; // Leitner box 1-5
  intervalDays: number;
  masteryStatus: 'new' | 'learning' | 'review' | 'mastered';
  timesReviewed: number;
  lastReviewedAt?: string;
}

export interface ExamAlert {
  id: string;
  title: string;
  trapDescription: string;
  howToAvoid: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'short';
  options?: string[]; // for MCQ
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface ProcessingMetrics {
  originalWordCount: number;
  summaryWordCount: number;
  compressionRatioPercent: number;
  estimatedOriginalReadTimeMin: number;
  estimatedSummaryReadTimeMin: number;
  timeSavedMin: number;
  processingLatencyMs: number;
  aiModelUsed: string;
  keyTermsExtractedCount: number;
  flashcardsGeneratedCount: number;
  accuracyScore: number;
}

export interface StudySessionResult {
  title: string;
  subject: SubjectCategory;
  targetExam: ExamTarget;
  overviewSummary: string;
  bulletSummary: string[];
  concepts: KeyConcept[];
  definitions: KeyDefinition[];
  flashcards: Flashcard[];
  examAlerts: ExamAlert[];
  metrics: ProcessingMetrics;
  createdAt: string;
}

export interface SampleLecture {
  id: string;
  title: string;
  subject: SubjectCategory;
  targetExam: ExamTarget;
  text: string;
  estimatedWords: number;
}
