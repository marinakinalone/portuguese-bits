import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { SCREENS } from '@/constants/screens';
import HomeScreen from '@/screens/HomeScreen';

const Home: React.FC = () => {
  return (
    <ScreenWrapper screen={SCREENS.HOME}>
      <HomeScreen />
    </ScreenWrapper>
  );
};

export default Home;
