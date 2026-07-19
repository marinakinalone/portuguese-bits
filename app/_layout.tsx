/* eslint-disable @typescript-eslint/no-require-imports */
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import LearnedWordModal from '@/components/LearnedWordModal';
import { SCREENS } from '@/constants';
import { AuthProvider, useAuth } from '@/providers/Auth';
import { LoadingProvider } from '@/providers/Loading';
import { QuizzProvider } from '@/providers/QuizzLogic';
import LoadingScreen from '@/screens/LoadingScreen';

const {
  HOME,
  LOGIN,
  QUIZZ,
  NOT_FOUND,
  SUCCESS,
  VOCABULARY,
  WORD_EDIT,
  SETTINGS,
} = SCREENS;

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name={HOME} options={{ title: 'home' }} />
        <Stack.Screen name={LOGIN} options={{ headerShown: false }} />
        <Stack.Screen name={QUIZZ} initialParams={{ questionNumber: 0 }} />
        <Stack.Screen name={SUCCESS} />
        <Stack.Screen name={VOCABULARY} />
        <Stack.Screen name={WORD_EDIT} />
        <Stack.Screen name={SETTINGS} />
        <Stack.Screen name={NOT_FOUND} />
      </Stack>
      <LearnedWordModal />
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    UchenRegular: require('../assets/fonts/UchenRegular.ttf'),
    LatoRegular: require('../assets/fonts/LatoRegular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <LoadingScreen />;
  }

  return (
    <LoadingProvider>
      <AuthProvider>
        <QuizzProvider>
          <RootNavigator />
        </QuizzProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
