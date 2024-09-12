import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const WordEditScreen: React.FC = () => {
  // should navigate to vocabulary screen if saved or pressed back
  return (
    <View style={styles.container}>
      <Text>WordEdit Screen</Text>
      <Link href={{ pathname: '/' }}>Go to Home</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WordEditScreen;
