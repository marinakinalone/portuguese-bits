import React from 'react';
import { StyleSheet, View } from 'react-native';
import useQuizzLogicStore from '@/stores/QuizzLogic';
import theme from '@/theme/defaultTheme';

const ProgressCircles = () => {
  const { questionNumber, result } = useQuizzLogicStore();

  const circles = Array.from({ length: 10 }, (_, index) => {
    const questionResult = result[index];
    let circleStyle;

    if (questionResult) {
      circleStyle = questionResult.isCorrect ? styles.correct : styles.wrong;
    }

    if (index === questionNumber) {
      circleStyle = styles.active;
    }

    return <View key={index} style={[styles.circle, circleStyle]} />;
  });

  return <View style={styles.container}>{circles}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.chocolate,
    marginHorizontal: 1,
  },
  active: {
    backgroundColor: theme.colors.sunshine,
  },
  correct: {
    backgroundColor: theme.colors.pistachio,
  },
  wrong: {
    backgroundColor: theme.colors.coral,
  },
});

export default ProgressCircles;
