import { QuizzVariant, SCREENS } from '@/constants';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      [SCREENS.HOME]: undefined;
      [SCREENS.LOGIN]: undefined;
      [SCREENS.SUCCESS]: undefined;
      [SCREENS.NOT_FOUND]: undefined;
      [SCREENS.VOCABULARY]: undefined;
      [SCREENS.SETTINGS]: undefined;
      [SCREENS.WORD_EDIT]: {
        mode?: 'add' | 'edit';
        fr?: string;
        pt?: string;
        successStreak?: string | number;
      };
      [SCREENS.QUIZZ]: { questionNumber: number; variant: QuizzVariant };
    }
  }
}

export {};
