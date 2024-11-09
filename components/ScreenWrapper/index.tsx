import { useNavigation } from '@react-navigation/native';
import React, { ReactNode, useEffect } from 'react';
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
import SuccessScreenBackground_0 from '../../assets/backgrounds/success/success_0.jpg';
import SuccessScreenBackground_1 from '../../assets/backgrounds/success/success_1.jpg';
import SuccessScreenBackground_2 from '../../assets/backgrounds/success/success_2.jpg';
import SuccessScreenBackground_3 from '../../assets/backgrounds/success/success_3.jpg';
import VocabularyScreenBackground from '../../assets/backgrounds/vocabulary.jpg';
import { SCREENS } from '@/constants';
import {
  bottomValue,
  windowHeight,
  windowWidth,
} from '@/utils/windowDimensions';

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
  [SCREENS.QUIZZ]: quizzBackgrounds,
  [SCREENS.VOCABULARY]: VocabularyScreenBackground,
  [SCREENS.SUCCESS]: successBackgrounds,
};

const mapScreenToBackground = (
  screenName: string,
  questionNumber: number = 0,
) => {
  if (screenName === SCREENS.QUIZZ) {
    return quizzBackgrounds[questionNumber % quizzBackgrounds.length];
  }

  if (screenName === SCREENS.SUCCESS) {
    return successBackgrounds[Math.floor(Math.random() * 4)];
  }

  return screenBackgrounds[screenName] || StartScreenBackground;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  screen,
  questionNumber,
  children,
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={mapScreenToBackground(screen, questionNumber)}
        style={styles.background}
      />
      <View style={styles.screenContent}>{children}</View>
    </View>
  );
};

// TODO consider sharing with loading screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    bottom: bottomValue,
    width: windowWidth,
    maxWidth: 500,
    maxHeight: windowHeight,
    flex: 1,
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenWrapper;
