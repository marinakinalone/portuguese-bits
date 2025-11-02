import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import CorrectAnswerFeedback from '@/components/AnswerFeedback/Correct';
import WrongAnswerFeedback from '@/components/AnswerFeedback/Wrong';
import ProgressCircles from '@/components/ProgressCircles';
import WordToTranslate from '@/components/WordToTranslate';
import MainView from '@/components/core/MainView';
import PrimaryButton from '@/components/core/PrimaryButton';
import { PRIMARY_BUTTON_STYLE, SCREENS, VIEW_STYLE } from '@/constants';
import useQuizzLogicStore from '@/stores/QuizzLogic';

const QuizzScreen = () => {
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const navigation = useNavigation();
  const { wordsToTranslate, fetchWordsForQuiz, isLoadingWords } =
    useQuizzLogicStore();

  useEffect(() => {
    // Only fetch if words array is empty and we're not already loading
    if (!wordsToTranslate.length && !isLoadingWords) {
      fetchWordsForQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleCheckAnswer = useQuizzLogicStore(
    (state) => state.handleCheckAnswer,
  );
  const isCorrect = useQuizzLogicStore((state) => state.isCorrect);
  const shouldNavigateToSuccessScreen = useQuizzLogicStore(
    (state) => state.shouldNavigateToSuccessScreen,
  );
  const { setShouldNavigateToSuccessScreen } = useQuizzLogicStore();

  useEffect(() => {
    if (shouldNavigateToSuccessScreen) {
      navigation.navigate(SCREENS.SUCCESS);
      setShouldNavigateToSuccessScreen(false);
    }
  }, [
    shouldNavigateToSuccessScreen,
    navigation,
    setShouldNavigateToSuccessScreen,
  ]);

  const renderBottomContainer = () => {
    if (isCorrect === null) {
      return (
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.ACCENT}
          handlePress={handleCheckAnswer}
          disabled={isInputEmpty}>
          verify
        </PrimaryButton>
      );
    }

    return isCorrect ? <CorrectAnswerFeedback /> : <WrongAnswerFeedback />;
  };

  return (
    <MainView
      style={VIEW_STYLE.DEFAULT}
      TopContainer={<ProgressCircles />}
      CenterContainer={<WordToTranslate setIsInputEmpty={setIsInputEmpty} />}
      BottomContainer={renderBottomContainer()}
    />
  );
};

export default QuizzScreen;
