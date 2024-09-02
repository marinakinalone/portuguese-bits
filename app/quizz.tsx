import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import QuizzScreen from '@/screens/QuizzScreen';

const Quizz: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return <QuizzScreen />;
};

export default Quizz;
