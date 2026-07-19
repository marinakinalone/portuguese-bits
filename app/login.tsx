import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { SCREENS } from '@/constants';
import LoginScreen from '@/screens/LoginScreen';

const Login: React.FC = () => {
  return (
    <ScreenWrapper screen={SCREENS.LOGIN}>
      <LoginScreen />
    </ScreenWrapper>
  );
};

export default Login;
