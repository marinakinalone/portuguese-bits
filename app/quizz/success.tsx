import React, {useEffect } from 'react';
import { useNavigation} from 'expo-router';
import QuizzSuccessScreen from '@/screens/QuizzSuccessScreen';

const Success: React.FC = ({}) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
 
  return <QuizzSuccessScreen />
};

export default Success;