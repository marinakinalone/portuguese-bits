import React, {useEffect } from 'react';
import { useNavigation} from 'expo-router';
import VocabularyScreen from '@/screens/VocabularyScreen';

const Vocabulary: React.FC = ({}) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
 
  return <VocabularyScreen />
};

export default Vocabulary;