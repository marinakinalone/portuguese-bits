import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { SCREENS } from '@/constants';
import VocabularyScreen from '@/screens/VocabularyScreen';

const Vocabulary: React.FC = () => {
  return (
    <ScreenWrapper screen={SCREENS.VOCABULARY}>
      <VocabularyScreen />;
    </ScreenWrapper>
  );
};

export default Vocabulary;
