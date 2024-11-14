import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Message from '@/components/core/Message';
import Title from '@/components/core/Title';
import { SCREENS, TITLE_STYLE } from '@/constants';

const SUCCESS_MESSAGES = [
  'Well done!',
  'Great job!',
  'You did it!',
  'Awesome!',
  'Fantastic!',
  'Amazing!',
  'Incredible!',
  'Excellent!',
  'Superb!',
  'Brilliant!',
  'Spectacular!',
];

const QuizzSuccessScreen: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(SCREENS.HOME);
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSuccessMessage = () => {
    return SUCCESS_MESSAGES[
      Math.floor(Math.random() * SUCCESS_MESSAGES.length)
    ];
  };

  const getCurrentStreak = () => {
    return '1';
  };

  return (
    <View style={styles.container}>
      <Title title={getSuccessMessage()} />
      <Message>current streak:</Message>
      <Title title={getCurrentStreak()} style={TITLE_STYLE.LARGE} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    alignItems: 'center',
  },
});

export default QuizzSuccessScreen;
