export type UserProfile = {
  username: string;
  quizStreak: number;
  lastQuizCompletedDate: string | null;
  completedToday: boolean;
};

export type VocabWord = {
  _id: string;
  pt: string;
  fr: string;
  successStreak?: number;
  isLearned?: boolean;
  excludeFromQuiz?: boolean;
};

export type WordProgress = {
  wordId: string;
  pt: string;
  fr: string;
  successStreak: number;
  isLearned: boolean;
  excludeFromQuiz: boolean;
  learnedAt: string | null;
};

export type ProgressResponse = VocabWord & {
  newlyLearned: boolean;
};

export type QuizStreak = {
  quizStreak: number;
  lastQuizCompletedDate: string | null;
  completedToday: boolean;
};

export type QuizStreakComplete = {
  quizStreak: number;
  lastQuizCompletedDate: string;
  alreadyCompletedToday: boolean;
  completedToday: true;
};

export type ConfirmAction = 'keep' | 'remove';

export type AuthSuccess = {
  success: true;
  token: string;
};

export type AuthMessage = {
  success: true;
  message: string;
};

export type ApiErrorBody = {
  error?: string;
  success?: false;
  message?: string;
};
