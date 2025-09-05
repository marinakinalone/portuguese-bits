import { LANGUAGES, QUIZZ_VARIANTS, QuizzVariant } from '@/constants';

const { FR, PT } = LANGUAGES;
const { VERSION, THEME } = QUIZZ_VARIANTS;

export const translationTypeMapper = (variant: QuizzVariant | string) => {
  let actualVariant = variant;

  if (!variant || variant === '') {
    if (typeof window !== 'undefined' && window.location?.search) {
      const urlParams = new URLSearchParams(window.location.search);
      actualVariant = urlParams.get('variant') ?? '';
    }
  }

  switch (actualVariant) {
    case VERSION:
      return { display: PT, answer: FR };
    case THEME:
      return { display: FR, answer: PT };
    default:
      return { display: 'none', answer: 'none' };
  }
};
