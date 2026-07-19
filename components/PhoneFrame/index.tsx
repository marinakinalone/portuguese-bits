import React, { ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import theme from '@/theme/defaultTheme';

const FRAME_WIDTH = 420;

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * On wide desktop web, centers the app in a phone-sized column.
 * Native and narrow web stay full-bleed.
 */
const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { width } = useWindowDimensions();
  const useFrame = Platform.OS === 'web' && width > FRAME_WIDTH;

  if (!useFrame) {
    return <View style={styles.fill}>{children}</View>;
  }

  return (
    <View style={styles.outer}>
      <View style={styles.frame}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  outer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cloud,
  },
  frame: {
    width: FRAME_WIDTH,
    maxWidth: '100%',
    height: '100%',
    maxHeight: 900,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    backgroundColor: theme.colors.linen,
    // Web shadow; ignored on native if this ever runs there
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
});

export default PhoneFrame;
