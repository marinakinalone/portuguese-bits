import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '@/theme/defaultTheme';

interface IProgressCircles {
  questionNumber: number;
}

const ProgressCircles = ({ questionNumber }: IProgressCircles) => {
  const circles = Array.from({ length: 10 }, (_, index) => (
    <View
      key={index}
      style={[styles.circle, index < questionNumber + 1 && styles.activeCircle]}
    />
  ));

  return <View style={styles.container}>{circles}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.chocolate,
    marginHorizontal: 1,
  },
  activeCircle: {
    backgroundColor: theme.colors.sunshine,
  },
});

export default ProgressCircles;
