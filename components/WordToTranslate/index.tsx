import { useFocusEffect } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Title from '@/components/core/Title';
import useQuizzLogicStore from '@/stores/QuizzLogic';
import theme from '@/theme/defaultTheme';
import { translationTypeMapper } from '@/utils';

interface IWordToTranslate {
  setIsInputEmpty: (isEmpty: boolean) => void;
}

const WordToTranslate = ({ setIsInputEmpty }: IWordToTranslate) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Subscribe to all dependencies so Zustand tracks them properly
  const variant = useQuizzLogicStore((state) => state.variant);
  const wordsToTranslate = useQuizzLogicStore(
    (state) => state.wordsToTranslate,
  );
  const questionNumber = useQuizzLogicStore((state) => state.questionNumber);
  const isLoadingWords = useQuizzLogicStore((state) => state.isLoadingWords);
  const wordsError = useQuizzLogicStore((state) => state.wordsError);

  // Compute wordToDisplay locally so it updates when dependencies change
  const wordToDisplay = useMemo(() => {
    const { display } = translationTypeMapper(variant);
    // If no valid variant, return "nothing to display"
    if (display === 'none') {
      return 'nothing to display';
    }

    if (isLoadingWords) {
      return 'Loading...';
    }

    if (wordsError) {
      return `Error: ${wordsError}`;
    }

    if (!wordsToTranslate.length) {
      return 'No words available';
    }

    const word =
      wordsToTranslate[questionNumber]?.[
        display as keyof (typeof wordsToTranslate)[0]
      ];

    return word || 'No word available';
  }, [variant, wordsToTranslate, questionNumber, isLoadingWords, wordsError]);

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
