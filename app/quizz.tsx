import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { SCREENS } from '@/constants';
import QuizzScreen from '@/screens/QuizzScreen';
import useQuizzLogicStore from '@/stores/QuizzLogic';

const Quizz: React.FC = () => {
  const { questionNumber } = useQuizzLogicStore();

  return (
    <ScreenWrapper screen={SCREENS.QUIZZ} questionNumber={questionNumber}>
      <QuizzScreen />
    </ScreenWrapper>
  );
};

export default Quizz;
