export const QUIZZ_VARIANTS = {
  VERSION: 'version',
  THEME: 'theme',
};

export const LANGUAGES = {
  PT: 'pt',
  FR: 'fr',
} as const;

type QuizzVariantsType = typeof QUIZZ_VARIANTS;

export type QuizzVariant = QuizzVariantsType[keyof QuizzVariantsType];

export const DELAY_MS = 1500;
