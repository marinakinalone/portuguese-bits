import React from 'react';
import { StyleSheet, View } from 'react-native';
import Message from '@/components/core/Message';
import SecondaryButton from '@/components/core/SecondaryButton';
import { useQuizzLogic } from '@/providers/QuizzLogic';

const WrongAnswerFeedback = () => {
  const { correctAnswer, handleNextQuestion } = useQuizzLogic();

  return (
    <View style={styles.container}>
      <Message>WRONG: &lsquo;{correctAnswer}&rsquo;</Message>
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
