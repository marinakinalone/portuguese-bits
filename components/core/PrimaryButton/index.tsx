import { Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { PRIMARY_BUTTON_STYLE, QuizzVariant } from '@/constants';
import theme from '@/theme/defaultTheme';

type PrimaryButtonStyle =
  (typeof PRIMARY_BUTTON_STYLE)[keyof typeof PRIMARY_BUTTON_STYLE];

interface IPrimaryButton {
  style: PrimaryButtonStyle;
  handlePress: (variant?: QuizzVariant) => void;
  children: React.ReactNode;
}

const PrimaryButton = ({
  style = PRIMARY_BUTTON_STYLE.DEFAULT,
  handlePress,
  children,
}: IPrimaryButton) => {
  return (
    <TouchableOpacity
      onPress={() => handlePress()}
      style={[styles.button, styles[style]]}>
      <Text style={styles.label}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingTop: 2,
    borderRadius: 16,
    marginVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    width: 144,
    maxWidth: 144,
  },
  label: {
    color: theme.colors.midnight,
    ...theme.fonts.primary.small,
  },
  default: {
    backgroundColor: theme.palette.primary.background,
    color: theme.palette.primary.text,
  },
  accent: {
    backgroundColor: theme.palette.primaryAcc.background,
    color: theme.palette.primaryAcc.text,
  },
  warning: {
    backgroundColor: theme.palette.warning.background,
    color: theme.palette.warning.text,
  },
});

export default PrimaryButton;
