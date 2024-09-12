import { Link } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

interface IQuizzScreenProps {
  handleNextQuestion: () => void;
}

const QuizzScreen: React.FC<IQuizzScreenProps> = ({ handleNextQuestion }) => {
  return (
    <View style={styles.container}>
      <Text>Quizz Screen</Text>
      <Link href={{ pathname: '/' }}>Go to Home</Link>
      <Link href={{ pathname: 'success' }}>Go to success screen</Link>
      <Button title="Next question" onPress={handleNextQuestion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuizzScreen;
