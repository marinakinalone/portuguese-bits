export const QUIZZ_VARIANTS = {
  VERSION: 'version',
  THEME: 'theme',
};

type QuizzVariantsType = typeof QUIZZ_VARIANTS;

export type QuizzVariant = QuizzVariantsType[keyof QuizzVariantsType];
