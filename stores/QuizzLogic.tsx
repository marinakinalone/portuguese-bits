import { create } from 'zustand';

import useVocabularyStore from './Vocabulary';
import { DELAY_MS, QuizzVariant, TranslationList } from '@/constants';
import { checkAnswer, translationTypeMapper } from '@/utils';

interface Result {
  questionNumber: number;
  isCorrect: boolean;
}

interface QuestionToReview {
  questionNumber: number;
  correctAnswer: string;
}

interface QuizzLogicStore {
  questionNumber: number;
  variant: QuizzVariant | '';
  input: string | '';
  isCorrect: boolean | null;
  result: Result[];
  questionsToReview: QuestionToReview[];
  shouldNavigateToSuccessScreen: boolean;
  feedbackAnswer: string; // Store the correct answer forfeedback

  wordToDisplay: string;
  wordsToTranslate: TranslationList;
  isLoadingWords: boolean;
  wordsError: string | null;

  setInput: (input: string) => void;
  setVariant: (variant: QuizzVariant) => void;
  setQuestionNumber: (questionNumber: number) => void;
  handleCheckAnswer: () => void;
  handleNextQuestion: () => void;
  resetQuestion: (params: { newQuestionNumber: number }) => void;
  setShouldNavigateToSuccessScreen: (should: boolean) => void;
  resetQuiz: () => void;
  fetchWordsForQuiz: () => Promise<void>;
}

const useQuizzLogicStore = create<QuizzLogicStore>((set, get) => ({
  questionNumber: 0,
  variant: '',
  input: '',
  isCorrect: null,
  result: [],
  questionsToReview: [],
  shouldNavigateToSuccessScreen: false,
  feedbackAnswer: '',

  wordsToTranslate: [],
  isLoadingWords: false,
  wordsError: null,

  get wordToDisplay() {
    const state = get();
    const { display } = translationTypeMapper(state.variant);

    // If no valid variant, return "nothing to display"
    if (display === 'none') {
      return 'nothing to display';
    }

    if (state.isLoadingWords) {
      return 'Loading...';
    }

    if (state.wordsError) {
      return `Error: ${state.wordsError}`;
    }

    if (!state.wordsToTranslate.length) {
      return 'No words available';
    }

    const word =
      state.wordsToTranslate[state.questionNumber]?.[
        display as keyof (typeof state.wordsToTranslate)[0]
      ];

    return word || 'No word available';
  },

  fetchWordsForQuiz: async () => {
    set({ isLoadingWords: true, wordsError: null });
    try {
      const vocabularyStore = useVocabularyStore.getState();
      const words = await vocabularyStore.fetchWords(10);

      if (!words || words.length === 0) {
        throw new Error('No words received from server');
      }
      set({ wordsToTranslate: words, isLoadingWords: false });
    } catch (error) {
      set({
        wordsError:
          error instanceof Error ? error.message : 'Failed to load words',
        isLoadingWords: false,
      });
    }
  },

  setInput: (input: string) => set({ input }),
  setVariant: (variant: QuizzVariant) => {
    set({ variant });
  },
  setQuestionNumber: (questionNumber: number) => set({ questionNumber }),

  setShouldNavigateToSuccessScreen: (should: boolean) =>
    set({ shouldNavigateToSuccessScreen: should }),

  handleCheckAnswer: () => {
    const state = get();
    const { answer } = translationTypeMapper(state.variant);
    const currentCorrectAnswer =
      state.wordsToTranslate[state.questionNumber]?.[
        answer as keyof (typeof state.wordsToTranslate)[0]
      ];

    const isAnswerCorrect = checkAnswer(state.input, currentCorrectAnswer);
    set({ isCorrect: isAnswerCorrect });

    if (!isAnswerCorrect) {
      // Store the correct answer for feedback display
      set({ feedbackAnswer: currentCorrectAnswer });

      set((state) => ({
        questionsToReview: [
          ...state.questionsToReview,
          {
            questionNumber: state.questionNumber,
            correctAnswer: currentCorrectAnswer,
          },
        ],
      }));
    }

    set((state) => {
      const existingResultIndex = state.result.findIndex(
        (r) => r.questionNumber === state.questionNumber,
      );

      if (existingResultIndex !== -1) {
        const updatedResult = [...state.result];
        updatedResult[existingResultIndex].isCorrect = isAnswerCorrect;
        return { result: updatedResult };
      } else {
        return {
          result: [
            ...state.result,
            {
              questionNumber: state.questionNumber,
              isCorrect: isAnswerCorrect,
            },
          ],
        };
      }
    });

    if (isAnswerCorrect) {
      setTimeout(() => {
        get().handleNextQuestion();
      }, DELAY_MS);
    }
  },

  resetQuestion: ({ newQuestionNumber }: { newQuestionNumber: number }) => {
    set({
      questionNumber: newQuestionNumber,
      input: '',
      isCorrect: null,
    });
  },

  handleNextQuestion: () => {
    const state = get();
    const maxQuestionNumber = state.wordsToTranslate.length - 1;
    if (state.questionNumber < maxQuestionNumber) {
      get().resetQuestion({ newQuestionNumber: state.questionNumber + 1 });
    } else {
      const nextQuestionToReview = state.questionsToReview[0];
      if (nextQuestionToReview) {
        // Remove the first question from the review list
        set((state) => ({
          questionsToReview: state.questionsToReview.slice(1),
        }));
        get().resetQuestion({
          newQuestionNumber: nextQuestionToReview.questionNumber,
        });
      } else {
        get().resetQuestion({ newQuestionNumber: 0 });
        set({
          shouldNavigateToSuccessScreen: true,
          result: [],
        });
      }
    }
  },

  resetQuiz: () => {
    set({
      questionNumber: 0,
      variant: '',
      input: '',
      isCorrect: null,
      result: [],
      questionsToReview: [],
      shouldNavigateToSuccessScreen: false,
      feedbackAnswer: '',
      // Keep wordsToTranslate to avoid unnecessary refetching
      // Only clear if we want to force a refetch
    });
  },
}));

export default useQuizzLogicStore;
