import { SCREENS } from '@/constants/screens';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      [SCREENS.HOME]: undefined;
      [SCREENS.SUCCESS]: undefined;
      [SCREENS.NOT_FOUND]: undefined;
      [SCREENS.HOME]: undefined;
      [SCREENS.QUIZZ]: { questionNumber: number };
    }
  }
}

export {};
