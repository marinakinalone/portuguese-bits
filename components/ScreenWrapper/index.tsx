import { useNavigation } from '@react-navigation/native';
import React, { ReactNode, useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import StartScreenBackground from '../../assets/backgrounds/start.jpg';
import { SCREENS } from '@/constants/screens';

interface ScreenWrapperProps {
  screen: string;
  children: ReactNode;
}

const mapScreenToBackground = (screenName: string) => {
  switch (screenName) {
    case SCREENS.HOME:
      return StartScreenBackground;
    default:
      return StartScreenBackground;
  }
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ screen, children }) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={mapScreenToBackground(screen)} style={styles.background} />
      <View style={styles.screenContent}>{children}</View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const bottomValue =
  (windowWidth > 500 && windowHeight < 1000) || windowWidth < 500
    ? 0
    : undefined;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    bottom: bottomValue,
    width: windowWidth,
    maxWidth: 500,
    maxHeight: windowHeight,
    flex: 1,
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenWrapper;
