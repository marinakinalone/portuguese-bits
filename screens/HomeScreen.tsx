import React, {useEffect } from 'react';
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen: React.FC = ({}) => {
 
  return (
    <View style={styles.container}>
     
      <Text>Home Screen</Text>
      <Link href={{ pathname: 'quizz' }}>Go to Quizz</Link>
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

export default HomeScreen;