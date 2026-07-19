import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/providers/Auth';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const CELEBRATIONS = ['AMAZING!', 'EXCELLENT!', 'FANTASTIC!', 'WONDERFUL!'];

const QuizzSuccessScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { currentStreak, resetQuizz } = useQuizzLogic();

  const title = useMemo(
    () => CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)],
    [],
  );

  const streak = currentStreak ?? user?.quizStreak ?? 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      resetQuizz();
      router.replace('/');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [resetQuizz, router]);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${title} Current streak ${streak}`}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.streakLabel}>current streak:</Text>
      <Text style={styles.streakValue}>{streak}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.extralarge,
    textAlign: 'center',
    marginBottom: 16,
  },
  streakLabel: {
    fontFamily: theme.fonts.primary.fontFamily,
    fontSize: theme.fonts.primary.mediumSmall.fontSize,
    textTransform: 'none',
    textAlign: 'center',
  },
  streakValue: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.large,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default QuizzSuccessScreen;
