import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Title from '@/components/core/Title';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const WordToTranslate = () => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const {
    handleCheckAnswer,
    isCorrect,
    input,
    isReviewPhase,
    setInput,
    wordToDisplay,
    questionNumber,
  } = useQuizzLogic();

  useEffect(() => {
    if (isCorrect !== null) {
      return;
    }

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeout);
  }, [questionNumber, isCorrect]);

  return (
    <View style={[styles.container, isReviewPhase && styles.reviewSpacing]}>
      <Title title={wordToDisplay} />
      <TextInput
        key={questionNumber}
        ref={inputRef}
        style={[
          styles.input,
          isCorrect === true && styles.correctInput,
          isCorrect === false && styles.incorrectInput,
          isFocused && styles.focusedInput,
        ]}
        value={input}
        onChangeText={setInput}
        onSubmitEditing={() => {
          if (input.trim()) {
            handleCheckAnswer();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        underlineColorAndroid="transparent"
        autoFocus
        enablesReturnKeyAutomatically
        keyboardType="default"
        inputMode="text"
        editable={isCorrect === null}
        accessibilityLabel={`Translate ${wordToDisplay}`}
        accessibilityHint="Enter the translation and press verify"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  reviewSpacing: {
    marginTop: 16,
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
    borderColor: theme.colors.midnight,
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
