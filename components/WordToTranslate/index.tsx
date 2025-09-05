import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Title from '@/components/core/Title';
import useQuizzLogicStore from '@/stores/QuizzLogic';
import { wordsToTranslate } from '@/stores/QuizzLogic';
import theme from '@/theme/defaultTheme';
import { translationTypeMapper } from '@/utils';

interface IWordToTranslate {
  setIsInputEmpty: (isEmpty: boolean) => void;
}

const WordToTranslate = ({ setIsInputEmpty }: IWordToTranslate) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const variant = useQuizzLogicStore((state) => state.variant);
  const questionNumber = useQuizzLogicStore((state) => state.questionNumber);
  const handleCheckAnswer = useQuizzLogicStore(
    (state) => state.handleCheckAnswer,
  );
  const isCorrect = useQuizzLogicStore((state) => state.isCorrect);
  const input = useQuizzLogicStore((state) => state.input);
  const { setInput } = useQuizzLogicStore();

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

  useEffect(() => {
    if (isCorrect !== null) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [isCorrect]);

  const getWordToDisplay = () => {
    const { display } = translationTypeMapper(variant);
    if (display === 'none') {
      return 'nothing to display';
    }

    return wordsToTranslate[questionNumber]?.[
      display as keyof (typeof wordsToTranslate)[0]
    ];
  };
  return (
    <View style={styles.container}>
      <Title title={getWordToDisplay()} />
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
        editable={!isDisabled}
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
    fontFamily: theme.fonts.secondary.fontFamily,
    ...theme.palette.input.default,
    ...theme.fonts.secondary.medium,
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
