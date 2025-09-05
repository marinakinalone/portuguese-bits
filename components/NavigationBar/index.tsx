import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PrimaryButton from '../core/PrimaryButton';
import { SCREENS } from '@/constants';

interface INavigationBar {
  destination?: typeof SCREENS.HOME | typeof SCREENS.VOCABULARY;
  label?: string;
}

const NavigationBar = ({
  destination = SCREENS.HOME,
  label = 'back to home page',
}: INavigationBar) => {
  const navigation = useNavigation();

  const navigateToHomePage = () => {
    navigation.navigate(destination);
  };

  return (
    <View style={styles.navigation}>
      <PrimaryButton handlePress={() => navigateToHomePage()} attenuated>
        {label}
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
