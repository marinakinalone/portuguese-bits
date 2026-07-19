import { useRouter } from 'expo-router';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DELAY_MS,
  isDemoMode,
  LANGUAGES,
  QUIZZ_VARIANTS,
  QuizzVariant,
} from '@/constants';
import { useAuth } from '@/providers/Auth';
import * as vocabApi from '@/services/vocabApi';
import type { ConfirmAction, VocabWord } from '@/types/api';

const { FR, PT } = LANGUAGES;
const { VERSION, THEME } = QUIZZ_VARIANTS;

interface Result {
  questionNumber: number;
  isCorrect: boolean;
}

interface LearnedWord {
  _id: string;
  pt: string;
}

interface QuizzContextProps {
  correctAnswer: string;
  handleCheckAnswer: () => void;
  handleNextQuestion: () => void;
  input: string;
  isCorrect: boolean | null;
  isLoadingQuiz: boolean;
  isFinishing: boolean;
  pendingSuccess: boolean;
  learnedQueue: LearnedWord[];
  confirmLearnedWord: (action: ConfirmAction) => Promise<void>;
  questionNumber: number;
  quizError: string | null;
  result: Result[];
  resetQuizz: () => void;
  setInput: (input: string) => void;
  setQuestionNumber: (number: number) => void;
  setVariant: (variant: QuizzVariant) => void;
  startQuiz: (variant: QuizzVariant) => Promise<void>;
  variant: QuizzVariant | '';
  wordToDisplay: string;
  wordsToTranslate: VocabWord[];
  currentStreak: number | null;
  isReviewPhase: boolean;
  reviewCurrent: number;
  reviewTotal: number;
  registerAnswerInputFocus: (focus: (() => void) | null) => void;
  focusAnswerInput: () => void;
}

const QuizzContext = createContext<QuizzContextProps | undefined>(undefined);

const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const normalizeAnswer = (str: string) => {
  return removeAccents(str.toLowerCase())
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const checkAnswer = (input: string, answer: string) => {
  return normalizeAnswer(input) === normalizeAnswer(answer);
};

const translationTypeMapper = (variant: QuizzVariant | '') => {
  switch (variant) {
    case VERSION:
      return { display: PT, answer: FR };
    case THEME:
      return { display: FR, answer: PT };
    default:
      return { display: FR, answer: PT };
  }
};

const emptyState = {
  questionNumber: 0,
  input: '',
  isCorrect: null as boolean | null,
  result: [] as Result[],
  questionsToReview: [] as number[],
  wordsToTranslate: [] as VocabWord[],
  learnedQueue: [] as LearnedWord[],
  currentStreak: null as number | null,
  quizError: null as string | null,
};

export const QuizzProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [variant, setVariant] = useState<QuizzVariant | ''>('');
  const [input, setInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [result, setResult] = useState<Result[]>([]);
  const [_questionsToReview, setQuestionsToReview] = useState<number[]>([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [wordsToTranslate, setWordsToTranslate] = useState<VocabWord[]>([]);
  const [learnedQueue, setLearnedQueue] = useState<LearnedWord[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [currentStreak, setCurrentStreak] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [pendingSuccess, setPendingSuccess] = useState(false);
  const [phase, setPhase] = useState<'quiz' | 'review'>('quiz');

  const finishingRef = useRef(false);
  const answerInputFocusRef = useRef<(() => void) | null>(null);
  const router = useRouter();
  const { setQuizStreak, isAuthenticated } = useAuth();

  const registerAnswerInputFocus = useCallback(
    (focus: (() => void) | null) => {
      answerInputFocusRef.current = focus;
    },
    [],
  );

  const focusAnswerInput = useCallback(() => {
    answerInputFocusRef.current?.();
  }, []);

  const { display, answer } = translationTypeMapper(variant);

  const currentWord = wordsToTranslate[questionNumber];
  const wordToDisplay =
    (currentWord?.[display as 'pt' | 'fr'] as string | undefined) || '';
  const correctAnswer =
    (currentWord?.[answer as 'pt' | 'fr'] as string | undefined) || '';

  const resetQuizz = useCallback(() => {
    finishingRef.current = false;
    setQuestionNumber(emptyState.questionNumber);
    setInput(emptyState.input);
    setIsCorrect(emptyState.isCorrect);
    setResult(emptyState.result);
    setQuestionsToReview(emptyState.questionsToReview);
    setWordsToTranslate(emptyState.wordsToTranslate);
    setLearnedQueue(emptyState.learnedQueue);
    setCurrentStreak(emptyState.currentStreak);
    setQuizError(emptyState.quizError);
    setIsFinishing(false);
    setPendingSuccess(false);
    setPhase('quiz');
    setReviewTotal(0);
    setVariant('');
  }, []);

  const startQuiz = useCallback(
    async (nextVariant: QuizzVariant) => {
      if (!isAuthenticated) {
        setQuizError('Please log in to start a quiz.');
        return;
      }

      setIsLoadingQuiz(true);
      setQuizError(null);
      finishingRef.current = false;
      setQuestionNumber(0);
      setInput('');
      setIsCorrect(null);
      setResult([]);
      setQuestionsToReview([]);
      setLearnedQueue([]);
      setCurrentStreak(null);
      setPendingSuccess(false);
      setPhase('quiz');
      setReviewTotal(0);
      setVariant(nextVariant);

      try {
        const words = await vocabApi.getQuizWords(10);
        setWordsToTranslate(words);
        if (words.length === 0) {
          setQuizError('No words available for a quiz.');
        }
      } catch (err) {
        setWordsToTranslate([]);
        setQuizError(
          err instanceof Error ? err.message : 'Failed to load quiz words.',
        );
      } finally {
        setIsLoadingQuiz(false);
      }
    },
    [isAuthenticated],
  );

  const resetQuestion = ({
    newQuestionNumber,
  }: {
    newQuestionNumber: number;
  }) => {
    setQuestionNumber(newQuestionNumber);
    setInput('');
    setIsCorrect(null);
  };

  const finishQuiz = useCallback(async () => {
    if (finishingRef.current) {
      return;
    }
    finishingRef.current = true;
    setIsFinishing(true);

    if (isDemoMode) {
      setCurrentStreak(0);
      setPendingSuccess(true);
      return;
    }

    try {
      const streakResult = await vocabApi.completeQuiz();
      setCurrentStreak(streakResult.quizStreak);
      setQuizStreak(streakResult.quizStreak, true);
    } catch {
      // Still allow success UI if streak call fails
    }

    // Keep isFinishing true so the quiz screen stays on the loader until
    // /success replaces it (clearing flags early causes a quiz UI flicker).
    setPendingSuccess(true);
  }, [setQuizStreak]);

  const handleNextQuestion = useCallback(() => {
    const lastIndex = Math.max(wordsToTranslate.length - 1, 0);

    if (phase === 'quiz' && questionNumber < lastIndex) {
      resetQuestion({ newQuestionNumber: questionNumber + 1 });
      return;
    }

    setQuestionsToReview((prevReview) => {
      if (prevReview.length > 0) {
        const [next, ...rest] = prevReview;
        if (phase === 'quiz') {
          setReviewTotal(prevReview.length);
        }
        setPhase('review');
        resetQuestion({ newQuestionNumber: next });
        return rest;
      }

      void finishQuiz();
      return prevReview;
    });
  }, [finishQuiz, phase, questionNumber, wordsToTranslate.length]);

  const handleCheckAnswer = useCallback(async () => {
    if (!currentWord || isCorrect !== null || !input.trim()) {
      return;
    }

    const isAnswerCorrect = checkAnswer(input, correctAnswer);
    setIsCorrect(isAnswerCorrect);

    if (!isAnswerCorrect) {
      setQuestionsToReview((prev) =>
        prev.includes(questionNumber) ? prev : [...prev, questionNumber],
      );
    }

    setResult((prevResult) => {
      const existingResultIndex = prevResult.findIndex(
        (r) => r.questionNumber === questionNumber,
      );

      if (existingResultIndex !== -1) {
        const updatedResult = [...prevResult];
        updatedResult[existingResultIndex] = {
          questionNumber,
          isCorrect: isAnswerCorrect,
        };
        return updatedResult;
      }

      return [...prevResult, { questionNumber, isCorrect: isAnswerCorrect }];
    });

    if (!isDemoMode) {
      try {
        const progress = await vocabApi.postProgress(
          currentWord._id,
          isAnswerCorrect,
        );
        if (progress.newlyLearned) {
          setLearnedQueue((prev) => {
            if (prev.some((word) => word._id === progress._id)) {
              return prev;
            }
            return [...prev, { _id: progress._id, pt: progress.pt }];
          });
        }
      } catch {
        // Keep local UX even if progress fails
      }
    }

    if (isAnswerCorrect) {
      setTimeout(() => {
        handleNextQuestion();
      }, DELAY_MS);
    }
  }, [
    correctAnswer,
    currentWord,
    handleNextQuestion,
    input,
    isCorrect,
    questionNumber,
  ]);

  const confirmLearnedWord = useCallback(
    async (action: ConfirmAction) => {
      const [current, ...rest] = learnedQueue;
      if (!current) {
        return;
      }

      if (!isDemoMode) {
        try {
          await vocabApi.confirmProgress(current._id, action);
        } catch {
          // Continue queue even if confirm fails
        }
      }

      setLearnedQueue(rest);
    },
    [learnedQueue],
  );

  useEffect(() => {
    if (!pendingSuccess) {
      return;
    }

    // Learned-word confirmations happen before success navigation.
    if (learnedQueue.length > 0) {
      setIsFinishing(false);
      return;
    }

    router.replace('/success');
  }, [pendingSuccess, learnedQueue.length, router]);

  const isReviewPhase = phase === 'review';
  const reviewCurrent =
    isReviewPhase && reviewTotal > 0
      ? reviewTotal - _questionsToReview.length
      : 0;

  const value = useMemo(
    () => ({
      correctAnswer,
      handleCheckAnswer: () => {
        void handleCheckAnswer();
      },
      handleNextQuestion,
      input,
      isCorrect,
      isLoadingQuiz,
      isFinishing,
      pendingSuccess,
      learnedQueue,
      confirmLearnedWord,
      questionNumber,
      quizError,
      result,
      resetQuizz,
      setInput,
      setQuestionNumber,
      setVariant,
      startQuiz,
      variant,
      wordToDisplay,
      wordsToTranslate,
      currentStreak,
      isReviewPhase,
      reviewCurrent,
      reviewTotal,
      registerAnswerInputFocus,
      focusAnswerInput,
    }),
    [
      confirmLearnedWord,
      correctAnswer,
      currentStreak,
      focusAnswerInput,
      handleCheckAnswer,
      handleNextQuestion,
      input,
      isCorrect,
      isFinishing,
      isLoadingQuiz,
      isReviewPhase,
      learnedQueue,
      pendingSuccess,
      questionNumber,
      quizError,
      registerAnswerInputFocus,
      resetQuizz,
      result,
      reviewCurrent,
      reviewTotal,
      startQuiz,
      variant,
      wordToDisplay,
      wordsToTranslate,
    ],
  );

  return (
    <QuizzContext.Provider value={value}>{children}</QuizzContext.Provider>
  );
};

export const useQuizzLogic = (): QuizzContextProps => {
  const context = useContext(QuizzContext);
  if (!context) {
    throw new Error('useQuizzLogic must be used within a QuizzProvider');
  }
  return context;
};
