export const QUIZZ_VARIANTS = {
  VERSION: 'version',
  THEME: 'theme',
};

export const LANGUAGE = {
  PT: 'pt',
  FR: 'fr',
};

type QuizzVariantsType = typeof QUIZZ_VARIANTS;

export type QuizzVariant = QuizzVariantsType[keyof QuizzVariantsType];

export const DELAY_MS = 1500;
