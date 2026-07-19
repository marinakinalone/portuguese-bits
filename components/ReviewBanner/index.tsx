import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const ReviewBanner = () => {
  const { isReviewPhase, reviewCurrent, reviewTotal } = useQuizzLogic();

  if (!isReviewPhase) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="header"
      accessibilityLabel={`Review ${reviewCurrent} of ${reviewTotal}, try again. You missed this word earlier.`}>
      <Text style={styles.label}>
        REVIEW {reviewCurrent} OF {reviewTotal} — TRY AGAIN
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.coral,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    alignItems: 'center',
  },
  label: {
    ...theme.fonts.secondary.extraSmall,
    textAlign: 'center',
  },
});

export default ReviewBanner;
