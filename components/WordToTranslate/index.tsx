import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Title from '@/components/core/Title';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const WordToTranslate = () => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    handleCheckAnswer,
    isCorrect,
    input,
    setInput,
    questionNumber,
    wordToDisplay,
  } = useQuizzLogic();
  console.log('questionNumber ', questionNumber);
  return (
    <View style={styles.container}>
      <Title title={wordToDisplay} />
      <TextInput
        style={[
          styles.input,
          isCorrect === true && styles.correctInput,
          isCorrect === false && styles.incorrectInput,
          isFocused && styles.focusedInput,
        ]}
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleCheckAnswer}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        underlineColorAndroid="transparent"
        autoFocus
        enablesReturnKeyAutomatically
        keyboardType="default"
        inputMode="text"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  input: {
    height: 56,
    borderRadius: 40,
    borderWidth: 1,
    marginTop: 24,
    marginBottom: 40,
    paddingHorizontal: 24,
    width: '80%',
    ...theme.palette.input.default,
    borderColor: 'blue',
  },
  correctInput: {
    ...theme.palette.input.correct,
  },
  incorrectInput: {
    ...theme.palette.input.wrong,
  },
  focusedInput: {
    ...theme.palette.input.focus,
  },
});

export default WordToTranslate;
