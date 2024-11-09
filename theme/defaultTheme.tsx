import { FONT_STYLE, FONTS } from '@/constants';

const { UPPERCASE } = FONT_STYLE;
const { UCHEN_REGULAR, LATO_REGULAR } = FONTS;

export const colors = {
  sunshine: '#E5B207',
  midnight: '#1E1E1E',
  linen: '#F4E7D4',
  coral: '#FE8D69',
};

export const palette = {
  primaryAcc: {
    background: colors.sunshine,
    text: colors.midnight,
  },
  primary: {
    background: colors.linen,
    text: colors.midnight,
  },
  secondary: {
    background: colors.linen,
    text: colors.midnight,
  },
  tertiary: {
    text: colors.midnight,
  },
  warning: {
    background: colors.coral,
    text: colors.midnight,
  },
};

export const fonts = {
  primary: {
    extralarge: {
      fontFamily: UCHEN_REGULAR,
      fontSize: 24,
      textTransform: UPPERCASE,
    },
    large: {
      fontFamily: UCHEN_REGULAR,
      fontSize: 24,
      textTransform: UPPERCASE,
    },
    mediumLarge: {
      fontFamily: UCHEN_REGULAR,
      fontSize: 20,
      textTransform: UPPERCASE,
    },
    mediumSmall: {
      fontFamily: UCHEN_REGULAR,
      fontSize: 16,
      textTransform: UPPERCASE,
    },
    small: {
      fontFamily: UCHEN_REGULAR,
      fontSize: 14,
    },
  },
  secondary: {
    medium: {
      fontFamily: LATO_REGULAR,
      fontSize: 16,
      textTransform: UPPERCASE,
    },
    small: {
      fontFamily: LATO_REGULAR,
      fontSize: 14,
      textTransform: UPPERCASE,
    },
    extraSmall: {
      fontFamily: LATO_REGULAR,
      fontSize: 12,
      textTransform: UPPERCASE,
    },
  },
};

//TODO delete when not needed anymore - add everything in core components

//   secondaryButton: {
//     backgroundColor: palette.secondary.background,
//     color: palette.secondary.text,
//     ...fonts.primary.small,
//   },
//   tertiaryButton: {
//     textDecorationLine: 'underline',
//     ...fonts.primary.small,
//   },
//   headline: {
//     ...fonts.primary.extralarge,
//     color: palette.secondary.text,
//   },
//   title: {
//     ...fonts.primary.mediumLarge,
//     color: palette.secondary.text,
//   },
//   feedback: {
//     ...fonts.secondary.medium,
//     color: palette.warning.text,
//   },
//   body: {
//     ...fonts.secondary.small,
//     color: palette.secondary.text,
//   },

const theme = {
  colors,
  palette,
  fonts,
};

export default theme;
