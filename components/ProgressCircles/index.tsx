import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

interface IProgressCircles {
  questionNumber: number;
}

const ProgressCircles = ({ questionNumber }: IProgressCircles) => {
  const { result } = useQuizzLogic();

  const circles = Array.from({ length: 10 }, (_, index) => {
    const questionResult = result.find((r) => r.questionNumber === index);
    let circleStyle;

    if (questionResult) {
      circleStyle = questionResult.isCorrect ? styles.correct : styles.wrong;
    } else if (index < questionNumber + 1) {
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
