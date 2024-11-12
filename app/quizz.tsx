import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { SCREENS } from '@/constants';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import QuizzScreen from '@/screens/QuizzScreen';

const Quizz: React.FC = () => {
  const { questionNumber } = useQuizzLogic();

  return (
    <ScreenWrapper screen={SCREENS.QUIZZ} questionNumber={questionNumber}>
      <QuizzScreen />
    </ScreenWrapper>
  );
};

export default Quizz;
