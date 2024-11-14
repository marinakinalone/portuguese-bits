import { FONT_STYLE, FONTS } from '@/constants';

const { UPPERCASE } = FONT_STYLE;
const { UCHEN_REGULAR, LATO_REGULAR } = FONTS;

export const colors = {
  sunshine: '#E5B207',
  chocolate: '#9B5030',
  midnight: '#1E1E1E',
  linen: '#F4E7D4',
  coral: '#FE8D69',
  pistachio: '#A3D49B',
  cloud: '#D9D9D9',
  coffee: '#6F5400',
  latte: '#DDCCB4',
};

export const palette = {
  primaryAcc: {
    backgroundColor: colors.sunshine,
    color: colors.midnight,
    borderColor: colors.midnight,
  },
  primary: {
    backgroundColor: colors.linen,
    color: colors.midnight,
    borderColor: colors.midnight,
  },
  secondary: {
    backgroundColor: colors.linen,
    color: colors.midnight,
    borderColor: colors.midnight,
  },
  tertiary: {
    color: colors.midnight,
  },
  warning: {
    backgroundColor: colors.coral,
    color: colors.midnight,
    borderColor: colors.midnight,
  },
  disabled: {
    backgroundColor: colors.latte,
    color: colors.coffee,
    borderColor: colors.coffee,
  },
  input: {
    default: {
      backgroundColor: colors.cloud,
      color: colors.midnight,
      borderColor: colors.cloud,
    },
    focus: {
      borderColor: colors.midnight,
    },
    correct: {
      backgroundColor: colors.pistachio,
      borderColor: colors.pistachio,
    },
    wrong: {
      backgroundColor: colors.coral,
      borderColor: colors.coral,
    },
  },
};

export const fonts = {
  primary: {
    fontFamily: UCHEN_REGULAR,
    extralarge: {
      fontSize: 36,
      textTransform: UPPERCASE,
    },
    large: {
      fontSize: 24,
      textTransform: UPPERCASE,
    },
    mediumLarge: {
      fontSize: 20,
      textTransform: UPPERCASE,
    },
    mediumSmall: {
      fontSize: 16,
      textTransform: UPPERCASE,
    },
    small: {
      fontSize: 14,
    },
  },
  secondary: {
    fontFamily: LATO_REGULAR,
    medium: {
      fontSize: 16,
      textTransform: UPPERCASE,
    },
    small: {
      fontSize: 14,
      textTransform: UPPERCASE,
    },
    extraSmall: {
      fontSize: 12,
      textTransform: UPPERCASE,
    },
  },
};

const theme = {
  colors,
  palette,
  fonts,
};

export default theme;
