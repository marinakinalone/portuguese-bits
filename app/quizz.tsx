import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { QuizzVariant, SCREENS } from '@/constants';
// import { QUIZZ_VARIANTS } from '@/constants';
import QuizzScreen from '@/screens/QuizzScreen';

// const { VERSION, THEME } = QUIZZ_VARIANTS;

type QuizzRouteParams = {
  questionNumber: number;
  variant: QuizzVariant;
};

type QuizzRouteProp = RouteProp<{ params: QuizzRouteParams }, 'params'>;

const Quizz: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<QuizzRouteProp>();
  const [questionNumber, setQuestionNumber] = useState(
    route.params.questionNumber,
  );

  console.log('variant', route.params.variant);

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
