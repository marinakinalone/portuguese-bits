import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { SCREENS } from '@/constants';
import WordEditScreen from '@/screens/WordEditScreen';

const WordEdit: React.FC = () => {
  return (
    <ScreenWrapper screen={SCREENS.WORD_EDIT}>
      <WordEditScreen />
    </ScreenWrapper>
  );
};

export default WordEdit;
