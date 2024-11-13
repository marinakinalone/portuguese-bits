import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '@/components/core/PrimaryButton';
import { QUIZZ_VARIANTS, QuizzVariant, SCREENS } from '@/constants';
import { PRIMARY_BUTTON_STYLE } from '@/constants';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setVariant } = useQuizzLogic();

  const handleQuizzPress = (variant: QuizzVariant) => {
    setVariant(variant);
    navigation.navigate({
      name: SCREENS.QUIZZ,
      params: { variant, questionNumber: 0 },
    });
  };

  const handleVocabularyPress = () => {
    navigation.navigate(SCREENS.VOCABULARY);
  };

  const handleLinkPress = () => {
    Linking.openURL('https://kinalone.dev').catch((err) =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Portuguese Bits</Text>
        <Text style={styles.subtitle}>
          An App By{' '}
          <Text style={styles.link} onPress={handleLinkPress}>
            MKS
          </Text>{' '}
          | 2024
        </Text>
      </View>

      <View style={styles.buttonStack}>
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.DEFAULT}
          handlePress={() => handleQuizzPress(QUIZZ_VARIANTS.VERSION)}>
          {QUIZZ_VARIANTS.VERSION}
        </PrimaryButton>
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.DEFAULT}
          handlePress={() => handleQuizzPress(QUIZZ_VARIANTS.THEME)}>
          {QUIZZ_VARIANTS.THEME}
        </PrimaryButton>
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.ACCENT}
          handlePress={handleVocabularyPress}>
          VOCABULARY
        </PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  header: {
    paddingTop: 24,
    alignItems: 'center',
    flex: 1,
  },
  title: {
    ...theme.fonts.secondary.small,
  },
  subtitle: {
    ...theme.fonts.secondary.extraSmall,
  },
  link: {
    textDecorationLine: 'underline',
  },
  buttonStack: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
});

export default HomeScreen;
