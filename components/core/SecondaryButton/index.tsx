import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import theme from '@/theme/defaultTheme';

interface ISecondaryButton {
  handlePress: () => void;
  children: React.ReactNode;
}

const SecondaryButton = ({ handlePress, children }: ISecondaryButton) => {
  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  text: {
    textDecorationLine: 'underline',
    fontSize: theme.fonts.primary.mediumSmall.fontSize,
    fontFamily: theme.fonts.primary.fontFamily,
  },
});

export default SecondaryButton;
