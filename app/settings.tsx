import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { SCREENS } from '@/constants';
import SettingsScreen from '@/screens/SettingsScreen';

const Settings: React.FC = () => {
  return (
    <ScreenWrapper screen={SCREENS.SETTINGS}>
      <SettingsScreen />
    </ScreenWrapper>
  );
};

export default Settings;
