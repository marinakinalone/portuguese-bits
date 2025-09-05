import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import CorrectAnswerFeedback from '@/components/AnswerFeedback/Correct';
import WrongAnswerFeedback from '@/components/AnswerFeedback/Wrong';
import ProgressCircles from '@/components/ProgressCircles';
import WordToTranslate from '@/components/WordToTranslate';
import MainView from '@/components/core/MainView';
import PrimaryButton from '@/components/core/PrimaryButton';
import {
  DELAY_MS,
  PRIMARY_BUTTON_STYLE,
  SCREENS,
  VIEW_STYLE,
} from '@/constants';
import useQuizzLogicStore from '@/stores/QuizzLogic';

const QuizzScreen = () => {
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const navigation = useNavigation();

  const handleCheckAnswer = useQuizzLogicStore(
    (state) => state.handleCheckAnswer,
  );
  const isCorrect = useQuizzLogicStore((state) => state.isCorrect);
  const result = useQuizzLogicStore((state) => state.result);
  const questionsToReview = useQuizzLogicStore(
    (state) => state.questionsToReview,
  );
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

  useEffect(() => {
    if (
      // TODO replace with wordsToTranslate.length - 1
      result.length === 3 &&
      questionsToReview.length === 0
    ) {
      setTimeout(() => {
        setShouldNavigateToSuccessScreen(true);
      }, DELAY_MS);
    }
  }, [result, questionsToReview, setShouldNavigateToSuccessScreen]);

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
