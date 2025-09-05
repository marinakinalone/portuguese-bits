export const QUIZZ_VARIANTS = {
  VERSION: 'version',
  THEME: 'theme',
};

type QuizzVariantsType = typeof QUIZZ_VARIANTS;

export const LOCAL_STORAGE_VARIANT_KEY = 'variant';

export type QuizzVariant = QuizzVariantsType[keyof QuizzVariantsType];

export const DELAY_MS = 1500;
