import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const QuizzSuccessScreen: React.FC = () => {
  // navigates automatically to the HomeScreen after 5 seconds
  return (
    <View style={styles.container}>
      <Text>QuizzSuccess Screen</Text>
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

export default QuizzSuccessScreen;
