import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

type BackToHomeProps = {
  resetQuiz?: boolean;
  label?: string;
  href?: string;
  style?: ViewStyle;
};

const BackToHome = ({
  resetQuiz = true,
  label = 'back to home page',
  href = '/',
  style,
}: BackToHomeProps) => {
  const router = useRouter();
  const { resetQuizz } = useQuizzLogic();

  const handlePress = () => {
    if (resetQuiz) {
      resetQuizz();
    }
    router.replace(href);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.button, style]}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.linen,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
    marginLeft: 16,
    marginTop: 8,
  },
  label: {
    ...theme.fonts.secondary.extraSmall,
    color: theme.colors.midnight,
  },
});

export default BackToHome;
