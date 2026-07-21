import { Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { PRIMARY_BUTTON_STYLE, QuizzVariant } from '@/constants';
import theme from '@/theme/defaultTheme';

type PrimaryButtonStyle =
  (typeof PRIMARY_BUTTON_STYLE)[keyof typeof PRIMARY_BUTTON_STYLE];

interface IPrimaryButton {
  style?: PrimaryButtonStyle;
  handlePress: (variant?: QuizzVariant) => void;
  attenuated?: boolean;
  children: React.ReactNode;
  accessibilityLabel?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

const PrimaryButton = ({
  style = PRIMARY_BUTTON_STYLE.DEFAULT,
  attenuated = false,
  handlePress,
  children,
  accessibilityLabel,
  fullWidth = false,
  disabled = false,
}: IPrimaryButton) => {
  const label =
    accessibilityLabel ||
    (typeof children === 'string' ? children : 'Button');

  return (
    <TouchableOpacity
      onPress={() => handlePress()}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        styles[style],
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      activeOpacity={0.8}>
      <Text style={[styles.label, attenuated && styles.attenuated]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 16,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minWidth: 144,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  label: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.mediumSmall,
    textAlign: 'center',
  },
  default: {
    ...theme.palette.primary,
  },
  navigation: {
    ...theme.palette.primary,
  },
  attenuated: {
    textTransform: 'lowercase',
  },
  accent: {
    ...theme.palette.primaryAcc,
  },
  warning: {
    ...theme.palette.warning,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default PrimaryButton;
