import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { PRIMARY_BUTTON_STYLE, QuizzVariant } from '@/constants';
import theme from '@/theme/defaultTheme';

type PrimaryButtonStyle =
  (typeof PRIMARY_BUTTON_STYLE)[keyof typeof PRIMARY_BUTTON_STYLE];

interface IPrimaryButton {
  style?: PrimaryButtonStyle;
  handlePress: (variant?: QuizzVariant) => void;
  attenuated?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const PrimaryButton = ({
  style = PRIMARY_BUTTON_STYLE.DEFAULT,
  attenuated = false,
  handlePress,
  disabled = false,
  children,
}: IPrimaryButton) => {
  return (
    <Pressable
      onPress={() => handlePress()}
      style={[styles.button, styles[style], disabled && styles.disabled]}
      disabled={disabled}>
      <Text
        style={[
          styles.label,
          attenuated && styles.attenuated,
          disabled && styles.disabled,
        ]}>
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingTop: 2,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    minWidth: 144,
  },
  label: {
    ...theme.fonts.primary,
    ...theme.fonts.primary.mediumSmall,
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
    ...theme.palette.disabled,
  },
});

export default PrimaryButton;
