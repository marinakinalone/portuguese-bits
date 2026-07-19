import { isDemoMode } from '@/constants';
import { apiRequest } from '@/services/api';
import type {
  ConfirmAction,
  ProgressResponse,
  QuizStreak,
  QuizStreakComplete,
  VocabWord,
  WordProgress,
} from '@/types/api';

function shuffleSample<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

/** Full vocab list (or curated demo list when EXPO_PUBLIC_DEMO_MODE=true). */
export function getVocab() {
  if (isDemoMode) {
    return apiRequest<VocabWord[]>('/vocab/demo');
  }
  return apiRequest<VocabWord[]>('/vocab');
}

export async function getQuizWords(count = 10) {
  if (isDemoMode) {
    const demoWords = await apiRequest<VocabWord[]>('/vocab/demo');
    return shuffleSample(demoWords, count);
  }
  return apiRequest<VocabWord[]>(`/vocab/${count}`);
}

export function createWord(pt: string, fr: string) {
  return apiRequest<VocabWord>('/vocab/create', {
    method: 'POST',
    body: { pt, fr },
  });
}

export function updateWord(frKey: string, pt: string, fr: string) {
  return apiRequest<VocabWord>(`/vocab/${encodeURIComponent(frKey)}`, {
    method: 'PUT',
    body: { pt, fr },
  });
}

export function deleteWord(frKey: string) {
  return apiRequest<unknown>(`/vocab/${encodeURIComponent(frKey)}`, {
    method: 'DELETE',
  });
}

export function postProgress(wordId: string, correct: boolean) {
  return apiRequest<ProgressResponse>(`/vocab/progress/${wordId}`, {
    method: 'POST',
    body: { correct },
  });
}

export function confirmProgress(wordId: string, action: ConfirmAction) {
  return apiRequest<VocabWord>(`/vocab/progress/${wordId}/confirm`, {
    method: 'POST',
    body: { action },
  });
}

export function getProgress() {
  return apiRequest<WordProgress[]>('/vocab/progress');
}

export function getQuizStreak() {
  return apiRequest<QuizStreak>('/vocab/quiz/streak');
}

export function completeQuiz() {
  return apiRequest<QuizStreakComplete>('/vocab/quiz/complete', {
    method: 'POST',
  });
}
