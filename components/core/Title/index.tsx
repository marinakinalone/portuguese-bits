import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TITLE_STYLE } from '@/constants';
import theme from '@/theme/defaultTheme';

type TitleStyle = (typeof TITLE_STYLE)[keyof typeof TITLE_STYLE];

interface ITitle {
  title: string;
  style?: TitleStyle;
}

const Title = ({ title, style = TITLE_STYLE.SMALL }: ITitle) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles[style]]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    color: theme.palette.primary.color,
    fontFamily: theme.fonts.primary.fontFamily,
  },
  small: {
    fontSize: theme.fonts.primary.large.fontSize,
    textTransform: theme.fonts.primary.large.textTransform,
  },
  large: {
    fontSize: theme.fonts.primary.extralarge.fontSize,
    textTransform: theme.fonts.primary.extralarge.textTransform,
  },
});

export default Title;
