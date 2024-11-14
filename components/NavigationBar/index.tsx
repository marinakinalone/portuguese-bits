import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PrimaryButton from '../core/PrimaryButton';
import { SCREENS } from '@/constants';

const NavigationBar = () => {
  const navigation = useNavigation();

  const navigateToHomePage = () => {
    navigation.navigate(SCREENS.HOME);
  };

  return (
    <View style={styles.navigation}>
      <PrimaryButton handlePress={() => navigateToHomePage()} attenuated>
        back to home page
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  navigation: {
    position: 'absolute',
    left: 16,
    top: 8,
  },
});

export default NavigationBar;
