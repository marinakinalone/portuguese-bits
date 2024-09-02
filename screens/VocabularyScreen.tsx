import React from 'react';
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const VocabularyScreen: React.FC = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Vocabulary Screen</Text>
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

export default VocabularyScreen;
