export const LANGUAGES = {
  PT: 'pt',
  FR: 'fr',
} as const;

export interface Translation {
  fr: string;
  pt: string;
}

export type TranslationList = Translation[];
