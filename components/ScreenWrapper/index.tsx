import { useNavigation } from 'expo-router/react-navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import QuizzScreenBackground_0 from '../../assets/backgrounds/question/flowers_0.jpg';
import QuizzScreenBackground_1 from '../../assets/backgrounds/question/flowers_1.jpg';
import QuizzScreenBackground_2 from '../../assets/backgrounds/question/flowers_2.jpg';
import QuizzScreenBackground_3 from '../../assets/backgrounds/question/flowers_3.jpg';
import QuizzScreenBackground_4 from '../../assets/backgrounds/question/flowers_4.jpg';
import QuizzScreenBackground_5 from '../../assets/backgrounds/question/flowers_5.jpg';
import QuizzScreenBackground_6 from '../../assets/backgrounds/question/flowers_6.jpg';
import QuizzScreenBackground_7 from '../../assets/backgrounds/question/flowers_7.jpg';
import QuizzScreenBackground_8 from '../../assets/backgrounds/question/flowers_8.jpg';
import QuizzScreenBackground_9 from '../../assets/backgrounds/question/flowers_9.jpg';
import StartScreenBackground from '../../assets/backgrounds/start.jpg';
import LoginScreenBackground from '../../assets/backgrounds/login.jpg';
import NotFoundScreenBackground from '../../assets/backgrounds/notfound.jpg';
import SuccessScreenBackground_0 from '../../assets/backgrounds/success/success_0.jpg';
import SuccessScreenBackground_1 from '../../assets/backgrounds/success/success_1.jpg';
import SuccessScreenBackground_2 from '../../assets/backgrounds/success/success_2.jpg';
import SuccessScreenBackground_3 from '../../assets/backgrounds/success/success_3.jpg';
import VocabularyScreenBackground from '../../assets/backgrounds/vocabulary.jpg';
import { SCREENS } from '@/constants';

interface ScreenWrapperProps {
  screen: string;
  children: ReactNode;
  questionNumber?: number;
}

// TODO move to own file
const quizzBackgrounds = [
  QuizzScreenBackground_0,
  QuizzScreenBackground_1,
  QuizzScreenBackground_2,
  QuizzScreenBackground_3,
  QuizzScreenBackground_4,
  QuizzScreenBackground_5,
  QuizzScreenBackground_6,
  QuizzScreenBackground_7,
  QuizzScreenBackground_8,
  QuizzScreenBackground_9,
];

const successBackgrounds = [
  SuccessScreenBackground_0,
  SuccessScreenBackground_1,
  SuccessScreenBackground_2,
  SuccessScreenBackground_3,
];

const screenBackgrounds: { [key: string]: any } = {
  [SCREENS.HOME]: StartScreenBackground,
  [SCREENS.LOGIN]: LoginScreenBackground,
  [SCREENS.QUIZZ]: quizzBackgrounds,
  [SCREENS.VOCABULARY]: VocabularyScreenBackground,
  [SCREENS.WORD_EDIT]: VocabularyScreenBackground,
  [SCREENS.SETTINGS]: StartScreenBackground,
  [SCREENS.SUCCESS]: successBackgrounds,
  [SCREENS.NOT_FOUND]: NotFoundScreenBackground,
};

const mapScreenToBackground = (
  screenName: string,
  questionNumber: number = 0,
  successIndex: number = 0,
) => {
  if (screenName === SCREENS.QUIZZ) {
    return quizzBackgrounds[questionNumber % quizzBackgrounds.length];
  }

  if (screenName === SCREENS.SUCCESS) {
    return successBackgrounds[successIndex % successBackgrounds.length];
  }

  return screenBackgrounds[screenName] || StartScreenBackground;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  screen,
  questionNumber,
  children,
}) => {
  const navigation = useNavigation();
  // Pick once per mount so success doesn't flicker through random images.
  const [successIndex] = useState(() =>
    Math.floor(Math.random() * successBackgrounds.length),
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={mapScreenToBackground(screen, questionNumber, successIndex)}
        style={styles.background}
        resizeMode="cover"
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});

export default ScreenWrapper;
