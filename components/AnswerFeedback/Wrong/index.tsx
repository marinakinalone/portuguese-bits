import React from 'react';
import { StyleSheet, View } from 'react-native';
import Message from '@/components/core/Message';
import SecondaryButton from '@/components/core/SecondaryButton';
import useQuizzLogicStore from '@/stores/QuizzLogic';

const WrongAnswerFeedback = () => {
  const feedbackAnswer = useQuizzLogicStore((state) => state.feedbackAnswer);
  const handleNextQuestion = useQuizzLogicStore(
    (state) => state.handleNextQuestion,
  );

  return (
    <View style={styles.container}>
      <Message>WRONG: &lsquo;{feedbackAnswer}&rsquo;</Message>
      <SecondaryButton handlePress={() => handleNextQuestion()}>
        next question
      </SecondaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default WrongAnswerFeedback;
