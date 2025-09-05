/* eslint-disable @typescript-eslint/no-require-imports */
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated'; // TODO use or not?
import { SCREENS } from '@/constants';
import LoadingScreen from '@/screens/LoadingScreen';
import { LoadingProvider } from '@/stores/Loading';

const { HOME, QUIZZ, NOT_FOUND, SUCCESS, VOCABULARY } = SCREENS;

/*
/ Prevent the splash screen from auto-hiding before asset loading is complete. 
*/
SplashScreen.preventAutoHideAsync();

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
      <Stack>
        <Stack.Screen name={HOME} options={{ title: 'home' }} />
        <Stack.Screen name={QUIZZ} initialParams={{ questionNumber: 0 }} />
        <Stack.Screen name={SUCCESS} />
        <Stack.Screen name={VOCABULARY} />
        <Stack.Screen name={NOT_FOUND} />
      </Stack>
    </LoadingProvider>
  );
}
