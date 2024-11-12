import React from 'react';
import { StyleSheet, Text } from 'react-native';
import theme from '@/theme/defaultTheme';

const Message = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.text}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: theme.palette.primary.color,
    fontFamily: theme.fonts.primary.fontFamily,
    fontSize: theme.fonts.primary.mediumLarge.fontSize,
  },
});

export default Message;
