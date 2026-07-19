import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const ProgressCircles = () => {
  const { questionNumber, result, wordsToTranslate, isReviewPhase } =
    useQuizzLogic();
  const total = Math.max(wordsToTranslate.length, 1);

  const circles = Array.from({ length: total }, (_, index) => {
    const questionResult = result.find((r) => r.questionNumber === index);
    let circleStyle;

    if (questionResult) {
      circleStyle = questionResult.isCorrect ? styles.correct : styles.wrong;
    }

    if (index === questionNumber) {
      circleStyle = styles.active;
    }

    const label = questionResult
      ? `Question ${index + 1} of ${total}, ${
          questionResult.isCorrect ? 'correct' : 'wrong'
        }`
      : index === questionNumber
        ? `Question ${index + 1} of ${total}, current`
        : `Question ${index + 1} of ${total}`;

    return (
      <View
        key={index}
        style={[styles.circle, circleStyle]}
        accessible
        accessibilityRole="image"
        accessibilityLabel={label}
      />
    );
  });

  const progressLabel = isReviewPhase
    ? `Review round, question ${questionNumber + 1}`
    : `Quiz progress, question ${questionNumber + 1} of ${total}`;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={progressLabel}>
      {circles}
    </View>
  );
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
