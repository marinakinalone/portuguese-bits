import React from 'react';
import CorrectAnswerFeedback from '@/components/AnswerFeedback/Correct';
import WrongAnswerFeedback from '@/components/AnswerFeedback/Wrong';
import ProgressCircles from '@/components/ProgressCircles';
import WordToTranslate from '@/components/WordToTranslate';
import MainView from '@/components/core/MainView';
import PrimaryButton from '@/components/core/PrimaryButton';
import { PRIMARY_BUTTON_STYLE, VIEW_STYLE } from '@/constants';
import { useQuizzLogic } from '@/providers/QuizzLogic';

const QuizzScreen = () => {
  const { handleCheckAnswer, isCorrect } = useQuizzLogic();

  const renderBottomContainer = () => {
    if (isCorrect === null) {
      return (
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.ACCENT}
          handlePress={handleCheckAnswer}>
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
      CenterContainer={<WordToTranslate />}
      BottomContainer={renderBottomContainer()}
    />
  );
};

export default QuizzScreen;
