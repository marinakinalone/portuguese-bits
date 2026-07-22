import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from 'expo-router/react-navigation';
import React, { useCallback } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/core/PrimaryButton';
import {
  PRIMARY_BUTTON_STYLE,
  QUIZZ_VARIANTS,
  QuizzVariant,
  SCREENS,
} from '@/constants';
import { useAuth } from '@/providers/Auth';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user, refreshProfile } = useAuth();
  const { startQuiz, resetQuizz } = useQuizzLogic();

  useFocusEffect(
    useCallback(() => {
      resetQuizz();
      void refreshProfile();
    }, [refreshProfile, resetQuizz]),
  );

  const handleQuizzPress = (variant: QuizzVariant) => {
    // Start load + navigate in the same tap gesture so mobile browsers
    // allow autofocus to open the soft keyboard on the quiz screen.
    void startQuiz(variant);
    navigation.navigate({
      name: SCREENS.QUIZZ,
      params: { variant, questionNumber: 0 },
    });
  };

  const handleVocabularyPress = () => {
    navigation.navigate(SCREENS.VOCABULARY);
  };

  const handleSettingsPress = () => {
    navigation.navigate(SCREENS.SETTINGS);
  };

  const handleLinkPress = () => {
    Linking.openURL('https://kinalone.dev').catch((err) =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleSettingsPress}
        style={[styles.settingsButton, { top: insets.top + 8 }]}
        accessibilityRole="button"
        accessibilityLabel="Settings"
        hitSlop={8}>
        <Ionicons
          name="settings-outline"
          size={26}
          color={theme.colors.midnight}
        />
      </Pressable>

      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.title} accessibilityRole="header">
          Portuguese Bits
        </Text>
        <Text
          style={styles.streak}
          accessibilityLabel={`Current streak ${user?.quizStreak ?? 0}`}>
          current streak: {user?.quizStreak ?? 0}
        </Text>
        <Text style={styles.subtitle}>
          An App By{' '}
          <Text
            style={styles.link}
            onPress={handleLinkPress}
            accessibilityRole="link"
            accessibilityLabel="MKS website">
            MKS
          </Text>{' '}
          | 2026
        </Text>
      </View>

      <View
        style={[
          styles.buttonStack,
          { paddingBottom: Math.max(insets.bottom, 8) },
        ]}>
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.DEFAULT}
          handlePress={() => {
            void handleQuizzPress(QUIZZ_VARIANTS.VERSION);
          }}>
          {QUIZZ_VARIANTS.VERSION}
        </PrimaryButton>
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.DEFAULT}
          handlePress={() => {
            void handleQuizzPress(QUIZZ_VARIANTS.THEME);
          }}>
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
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    backgroundColor: theme.colors.linen,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    ...theme.fonts.secondary.small,
  },
  streak: {
    ...theme.fonts.secondary.medium,
    marginTop: 12,
  },
  subtitle: {
    ...theme.fonts.secondary.extraSmall,
    marginTop: 8,
  },
  link: {
    textDecorationLine: 'underline',
  },
  buttonStack: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default HomeScreen;
