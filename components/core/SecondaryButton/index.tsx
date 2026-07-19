import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import theme from '@/theme/defaultTheme';

interface ISecondaryButton {
  handlePress: () => void;
  children: React.ReactNode;
}

const SecondaryButton = ({ handlePress, children }: ISecondaryButton) => {
  const label = typeof children === 'string' ? children : 'Button';

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  text: {
    textDecorationLine: 'underline',
    fontSize: theme.fonts.primary.mediumSmall.fontSize,
    fontFamily: theme.fonts.primary.fontFamily,
  },
});

export default SecondaryButton;
