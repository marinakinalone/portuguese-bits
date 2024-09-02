import { Link } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

const HomeScreen: React.FC = () => {
  return (
    <>
      <Text>Home Screen</Text>
      <Link href={{ pathname: 'quizz' }}>Go to Quizz</Link>
    </>
  );
};

export default HomeScreen;
