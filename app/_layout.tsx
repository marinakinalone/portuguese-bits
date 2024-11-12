/* eslint-disable @typescript-eslint/no-require-imports */
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated'; // TODO use or not?
import { SCREENS } from '@/constants';
import { LoadingProvider } from '@/providers/Loading';
import { QuizzProvider } from '@/providers/QuizzLogic';
import LoadingScreen from '@/screens/LoadingScreen';

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
      <QuizzProvider>
        <Stack>
          <Stack.Screen name={HOME} options={{ title: 'home' }} />
          <Stack.Screen name={QUIZZ} initialParams={{ questionNumber: 0 }} />
          <Stack.Screen name={SUCCESS} />
          <Stack.Screen name={VOCABULARY} />
          <Stack.Screen name={NOT_FOUND} />
        </Stack>
      </QuizzProvider>
    </LoadingProvider>
  );
}
