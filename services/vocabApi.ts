import { apiRequest } from '@/services/api';
import type {
  ConfirmAction,
  ProgressResponse,
  QuizStreak,
  QuizStreakComplete,
  VocabWord,
  WordProgress,
} from '@/types/api';

export function getVocab() {
  return apiRequest<VocabWord[]>('/vocab');
}

export function getQuizWords(count = 10) {
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
