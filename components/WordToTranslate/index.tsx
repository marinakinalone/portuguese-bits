import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Title from '@/components/core/Title';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

interface IWordToTranslate {
  setIsInputEmpty: (isEmpty: boolean) => void;
}

const WordToTranslate = ({ setIsInputEmpty }: IWordToTranslate) => {
  const [isFocused, setIsFocused] = useState(false);
  const { handleCheckAnswer, isCorrect, input, setInput, wordToDisplay } =
    useQuizzLogic();
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const focus = () => {
        setTimeout(() => {
          inputRef?.current?.focus();
        }, 1);
      };
      focus();
      return focus;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleCheckAnswer]),
  );

  const isInputEmpty = input.trim() === '';

  useEffect(() => {
    setIsInputEmpty(isInputEmpty);
  }, [input, isInputEmpty, setIsInputEmpty]);

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
        onSubmitEditing={() => {
          if (!isInputEmpty) {
            handleCheckAnswer();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        underlineColorAndroid="transparent"
        enablesReturnKeyAutomatically
        keyboardType="default"
        inputMode="text"
        ref={inputRef}
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
