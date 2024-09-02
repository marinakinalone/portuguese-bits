import React from 'react';
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const QuizzScreen: React.FC = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Quizz Screen</Text>
      <Link href={{ pathname: '/' }}>Go to Home</Link>
      <Link href={{ pathname: 'quizz/success' }}>Go to success screen</Link>
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
