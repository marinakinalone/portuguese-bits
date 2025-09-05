import { create } from 'zustand';

import { DELAY_MS, QuizzVariant, TranslationList } from '@/constants';
import { checkAnswer, translationTypeMapper } from '@/utils';

// TODO delete when fetch database is implemented
export const wordsToTranslate: TranslationList = [
  { fr: 'Bonjour', pt: 'Olá' },
  { fr: 'Merci', pt: 'Obrigado' },
  { fr: 'Oui', pt: 'Sim' },
  { fr: 'Non', pt: 'Não' },
  { fr: `S'il vous plaît`, pt: 'Por favor' },
  { fr: 'Excusez-moi', pt: 'Desculpe' },
  { fr: 'Au revoir', pt: 'Tchau' },
  { fr: 'Comment ça va?', pt: 'Como vai?' },
  { fr: 'Je vais bien', pt: 'Estou bem' },
  { fr: 'Je ne comprends pas', pt: 'Não entendo' },
];
interface Result {
  questionNumber: number;
  isCorrect: boolean;
}

interface QuestionToReview {
  questionNumber: number;
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

  setInput: (input: string) => void;
  setVariant: (variant: QuizzVariant) => void;
  setQuestionNumber: (questionNumber: number) => void;
  handleCheckAnswer: () => void;
  handleNextQuestion: () => void;
  resetQuestion: (params: { newQuestionNumber: number }) => void;
  setShouldNavigateToSuccessScreen: (should: boolean) => void;
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

  wordsToTranslate,

  get wordToDisplay() {
    const state = get();
    const { display } = translationTypeMapper(state.variant);

    // If no valid variant, return "nothing to display"
    if (display === 'none') {
      return 'nothing to display';
    }

    return wordsToTranslate[state.questionNumber]?.[
      display as keyof (typeof wordsToTranslate)[0]
    ];
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
      wordsToTranslate[state.questionNumber]?.[
        answer as keyof (typeof wordsToTranslate)[0]
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
    // TODO replace with wordsToTranslate.length - 1
    if (state.questionNumber < 2) {
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
}));

export default useQuizzLogicStore;
