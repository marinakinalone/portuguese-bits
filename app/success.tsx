import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { SCREENS } from '@/constants';
import QuizzSuccessScreen from '@/screens/QuizzSuccessScreen';

const Success: React.FC = () => {
  return (
    <ScreenWrapper screen={SCREENS.SUCCESS} showNavigation={false}>
      <QuizzSuccessScreen />
    </ScreenWrapper>
  );
};

export default Success;
