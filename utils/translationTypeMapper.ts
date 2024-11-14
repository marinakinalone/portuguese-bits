import { LANGUAGES, QUIZZ_VARIANTS, QuizzVariant } from '@/constants';

const { FR, PT } = LANGUAGES;
const { VERSION, THEME } = QUIZZ_VARIANTS;

export const translationTypeMapper = (variant: QuizzVariant) => {
  switch (variant) {
    case VERSION:
      return { display: PT, answer: FR };
    case THEME:
      return { display: FR, answer: PT };
    default:
      return { display: FR, answer: PT };
  }
};
