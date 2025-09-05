import { QuizzVariant, SCREENS } from '@/constants';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      [SCREENS.HOME]: undefined;
      [SCREENS.SUCCESS]: undefined;
      [SCREENS.NOT_FOUND]: undefined;
      [SCREENS.HOME]: undefined;
      [SCREENS.VOCABULARY]: undefined;
      [SCREENS.LOGIN]: undefined;
      [SCREENS.QUIZZ]: { questionNumber: number; variant: QuizzVariant };
      [SCREENS.ADD]: undefined;
      // INFO the id is the French translation of the word
      [SCREENS.EDIT]: { id: string };
    }
  }
}

export {};
