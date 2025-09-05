import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Title from '../core/Title';
import { TITLE_STYLE } from '@/constants';

interface IInteractiveHeader {
  header: string;
  setHeader: () => void;
}

const InteractiveHeader = ({ header, setHeader }: IInteractiveHeader) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={setHeader}>
        <Title style={TITLE_STYLE.LARGE} title={header} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    padding: 16,
  },
});

export default InteractiveHeader;
