import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import loading_00 from '@/assets/loading/loading_00.jpg';
import loading_01 from '@/assets/loading/loading_01.jpg';
import loading_02 from '@/assets/loading/loading_02.jpg';
import loading_03 from '@/assets/loading/loading_03.jpg';
import loading_04 from '@/assets/loading/loading_04.jpg';
import loading_05 from '@/assets/loading/loading_05.jpg';
import loading_06 from '@/assets/loading/loading_06.jpg';
import loading_07 from '@/assets/loading/loading_07.jpg';
import loading_08 from '@/assets/loading/loading_08.jpg';
import loading_09 from '@/assets/loading/loading_09.jpg';
import loading_10 from '@/assets/loading/loading_10.jpg';
import loading_11 from '@/assets/loading/loading_11.jpg';
import loading_12 from '@/assets/loading/loading_12.jpg';
import {
  bottomValue,
  windowHeight,
  windowWidth,
} from '@/utils/windowDimensions';

const imageSources = [
  loading_00,
  loading_01,
  loading_02,
  loading_03,
  loading_04,
  loading_05,
  loading_06,
  loading_07,
  loading_08,
  loading_09,
  loading_10,
  loading_11,
  loading_12,
];

const LoadingScreen: React.FC = () => {
  const animation = useRef(new Animated.Value(0)).current;
  const [currentImage, setCurrentImage] = useState(imageSources[0]);

  useEffect(() => {
    const animate = () => {
      animation.setValue(0);
      Animated.timing(animation, {
        toValue: imageSources.length - 1,
        duration: 4000, // Adjust the duration as needed
        useNativeDriver: false,
      }).start(() => animate());
    };

    // Start the animation
    animate();

    // Listen to the animation value updates
    const listener = animation.addListener(({ value }) => {
      const imageIndex = Math.floor(value);
      setCurrentImage(imageSources[imageIndex]);
    });

    // Clean up listener on component unmount
    return () => {
      animation.removeListener(listener);
    };
  }, [animation]);

  return (
    <View style={styles.container}>
      <Image style={styles.background} source={currentImage} />
    </View>
  );
};

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
});

export default LoadingScreen;
