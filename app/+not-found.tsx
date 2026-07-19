import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import PrimaryButton from '@/components/core/PrimaryButton';
import { PRIMARY_BUTTON_STYLE, SCREENS } from '@/constants';
import theme from '@/theme/defaultTheme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: 'Error' }} />
      <ScreenWrapper screen={SCREENS.NOT_FOUND}>
        <View style={styles.container}>
          <View
            style={styles.card}
            accessible
            accessibilityRole="summary"
            accessibilityLabel="Error. This screen does not exist.">
            <View style={styles.errorBar}>
              <Text style={styles.errorTitle}>ERROR</Text>
            </View>
            <Text style={styles.message}>This screen doesn&apos;t exist.</Text>
            <PrimaryButton
              style={PRIMARY_BUTTON_STYLE.ACCENT}
              handlePress={() => router.replace('/')}>
              OK
            </PrimaryButton>
          </View>
        </View>
      </ScreenWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: theme.colors.linen,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.midnight,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 20,
  },
  errorBar: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.coral,
    paddingVertical: 12,
    alignItems: 'center',
  },
  errorTitle: {
    ...theme.fonts.secondary.medium,
  },
  message: {
    ...theme.fonts.secondary.small,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
});
