import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
// import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
// import { useEffect } from 'react';
import 'react-native-reanimated'; // TODO use or not?
import { SCREENS } from '@/constants/screens';
import {} from '@/constants/screens';
import { useColorScheme } from '@/hooks/useColorScheme';

const { HOME, QUIZZ, NOT_FOUND, SUCCESS, VOCABULARY } = SCREENS;

/*
/ Prevent the splash screen from auto-hiding before asset loading is complete. 
*/
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  //TODO fix font loading
  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name={HOME} options={{ title: 'home' }} />
        <Stack.Screen name={QUIZZ} initialParams={{ questionNumber: 0 }} />
        <Stack.Screen name={SUCCESS} />
        <Stack.Screen name={VOCABULARY} />
        <Stack.Screen name={NOT_FOUND} />
      </Stack>
    </ThemeProvider>
  );
}
