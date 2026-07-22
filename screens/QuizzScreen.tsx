import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CorrectAnswerFeedback from '@/components/AnswerFeedback/Correct';
import WrongAnswerFeedback from '@/components/AnswerFeedback/Wrong';
import BackToHome from '@/components/BackToHome';
import ErrorCard from '@/components/ErrorCard';
import ProgressCircles from '@/components/ProgressCircles';
import ReviewBanner from '@/components/ReviewBanner';
import WordToTranslate from '@/components/WordToTranslate';
import MainView from '@/components/core/MainView';
import PrimaryButton from '@/components/core/PrimaryButton';
import { PRIMARY_BUTTON_STYLE, VIEW_STYLE } from '@/constants';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const QuizzScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    handleCheckAnswer,
    input,
    isCorrect,
    isLoadingQuiz,
    isFinishing,
    pendingSuccess,
    quizError,
    resetQuizz,
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
      <ErrorCard
        message={quizError || 'No quiz words available.'}
        onOk={() => {
          resetQuizz();
          router.replace('/');
        }}
      />
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
    <View style={styles.screen}>
      <BackToHome />
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <View
          style={[
            styles.cardSlot,
            { paddingBottom: Math.max(insets.bottom, 8) },
          ]}>
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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  keyboardArea: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  cardSlot: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    overflow: 'hidden',
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
  topContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
});

export default QuizzScreen;
