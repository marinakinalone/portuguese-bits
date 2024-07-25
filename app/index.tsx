import React, {useEffect } from 'react';
import { useNavigation} from 'expo-router';
import HomeScreen from '@/screens/HomeScreen';

const Home: React.FC = ({}) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
 
  return <HomeScreen />
};

export default Home;