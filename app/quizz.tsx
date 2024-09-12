import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { SCREENS } from '@/constants/screens';
import QuizzScreen from '@/screens/QuizzScreen';

type QuizzRouteParams = {
  questionNumber: number;
};

type QuizzRouteProp = RouteProp<{ params: QuizzRouteParams }, 'params'>;

const Quizz: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<QuizzRouteProp>();
  const [questionNumber, setQuestionNumber] = useState(
    route.params.questionNumber,
  );

  const handleNextQuestion = () => {
    const newQuestionNumber = questionNumber + 1;

    if (newQuestionNumber > 9) {
      return navigation.navigate(SCREENS.SUCCESS);
    }
    setQuestionNumber(newQuestionNumber);
    navigation.setParams({ questionNumber: newQuestionNumber });
  };

  return (
    <ScreenWrapper screen={SCREENS.QUIZZ} questionNumber={questionNumber}>
      <QuizzScreen handleNextQuestion={handleNextQuestion} />
    </ScreenWrapper>
  );
};

export default Quizz;
