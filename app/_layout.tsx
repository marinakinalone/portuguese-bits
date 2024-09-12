import { Lato_400Regular } from '@expo-google-fonts/lato';
import { Uchen_400Regular } from '@expo-google-fonts/uchen';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated'; // TODO use or not?
import { SCREENS } from '@/constants/screens';
import {} from '@/constants/screens';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LoadingProvider } from '@/providers/Loading';
import LoadingScreen from '@/screens/LoadingScreen';

const { HOME, QUIZZ, NOT_FOUND, SUCCESS, VOCABULARY } = SCREENS;

/*
/ Prevent the splash screen from auto-hiding before asset loading is complete. 
*/
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Uchen_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      console.log('fonts loaded');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    console.log('loading fonts');
    return <LoadingScreen />;
  }

  return (
    <LoadingProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* <Stack>
          <Stack.Screen name={HOME} options={{ title: 'home' }} />
          <Stack.Screen name={QUIZZ} initialParams={{ questionNumber: 0 }} />
          <Stack.Screen name={SUCCESS} />
          <Stack.Screen name={VOCABULARY} />
          <Stack.Screen name={NOT_FOUND} />
        </Stack> */}
        <LoadingScreen />
      </ThemeProvider>
    </LoadingProvider>
  );
}
