import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CorrectAnswerFeedback from '@/components/AnswerFeedback/Correct';
import WrongAnswerFeedback from '@/components/AnswerFeedback/Wrong';
import BackToHome from '@/components/BackToHome';
import ProgressCircles from '@/components/ProgressCircles';
import ReviewBanner from '@/components/ReviewBanner';
import WordToTranslate from '@/components/WordToTranslate';
import MainView from '@/components/core/MainView';
import PrimaryButton from '@/components/core/PrimaryButton';
import { PRIMARY_BUTTON_STYLE, VIEW_STYLE } from '@/constants';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const QuizzScreen = () => {
  const {
    handleCheckAnswer,
    input,
    isCorrect,
    isLoadingQuiz,
    isFinishing,
    pendingSuccess,
    quizError,
    wordsToTranslate,
  } = useQuizzLogic();

  if (isFinishing || pendingSuccess) {
    return (
      <View
        style={styles.centered}
        accessibilityLabel="Finishing quiz"
        accessibilityLiveRegion="polite">
        <ActivityIndicator color={theme.colors.midnight} size="large" />
        <Text style={styles.finishingLabel}>Finishing quiz…</Text>
      </View>
    );
  }

  if (!isLoadingQuiz && (quizError || wordsToTranslate.length === 0)) {
    return (
      <View style={styles.centered}>
        <BackToHome />
        <Text style={styles.error} accessibilityRole="alert">
          {quizError || 'No quiz words available.'}
        </Text>
      </View>
    );
  }

  const renderBottomContainer = () => {
    if (isLoadingQuiz) {
      return (
        <ActivityIndicator
          color={theme.colors.midnight}
          size="large"
          accessibilityLabel="Loading quiz"
        />
      );
    }

    if (isCorrect === null) {
      const canVerify = input.trim().length > 0;

      return (
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.ACCENT}
          disabled={!canVerify}
          handlePress={handleCheckAnswer}>
          verify
        </PrimaryButton>
      );
    }

    return isCorrect ? <CorrectAnswerFeedback /> : <WrongAnswerFeedback />;
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <BackToHome />
        <MainView
          style={VIEW_STYLE.DEFAULT}
          TopContainer={
            <View style={styles.topContent}>
              <ProgressCircles />
              <ReviewBanner />
            </View>
          }
          CenterContainer={<WordToTranslate />}
          BottomContainer={renderBottomContainer()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishingLabel: {
    ...theme.fonts.secondary.small,
    marginTop: 16,
    textAlign: 'center',
  },
  error: {
    ...theme.fonts.secondary.small,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  topContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
});

export default QuizzScreen;
