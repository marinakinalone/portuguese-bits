import React, { useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
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
    isLoadingQuiz,
    isReviewPhase,
    registerAnswerInputFocus,
    setInput,
    wordToDisplay,
    questionNumber,
  } = useQuizzLogic();

  const canEdit = isCorrect === null && !isLoadingQuiz;
  const shouldAutofocus = isCorrect === null;

  useEffect(() => {
    registerAnswerInputFocus(() => {
      inputRef.current?.focus();
    });
    return () => registerAnswerInputFocus(null);
  }, [registerAnswerInputFocus]);

  useEffect(() => {
    if (!shouldAutofocus) {
      return;
    }

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const focusInput = () => {
      if (!cancelled) {
        inputRef.current?.focus();
      }
    };

    // Wait for navigation / layout to settle — autofocus during a screen
    // transition is ignored on mobile, so the keyboard never opens.
    const task = InteractionManager.runAfterInteractions(() => {
      const initialDelay = Platform.OS === 'android' ? 350 : 50;
      timeouts.push(setTimeout(focusInput, initialDelay));
      timeouts.push(setTimeout(focusInput, initialDelay + 200));
    });

    return () => {
      cancelled = true;
      task.cancel();
      timeouts.forEach(clearTimeout);
    };
  }, [questionNumber, shouldAutofocus, isLoadingQuiz]);

  return (
    <View style={[styles.container, isReviewPhase && styles.reviewSpacing]}>
      <Title title={wordToDisplay} />
      <View style={styles.inputField}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            isCorrect === true && styles.correctInput,
            isCorrect === false && styles.incorrectInput,
            isFocused && styles.focusedInput,
          ]}
          value={input}
          onChangeText={(text) => {
            if (canEdit) {
              setInput(text);
            }
          }}
          onSubmitEditing={() => {
            if (canEdit && input.trim()) {
              handleCheckAnswer();
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          underlineColorAndroid="transparent"
          autoFocus
          showSoftInputOnFocus
          enablesReturnKeyAutomatically
          keyboardType="default"
          inputMode="text"
          // Keep the field focusable while feedback shows so the keyboard
          // stays up across auto-advance (editable={false} dismisses it).
          caretHidden={!canEdit}
          accessibilityLabel={`Translate ${wordToDisplay}`}
          accessibilityHint="Enter the translation and press verify"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch',
  },
  reviewSpacing: {
    marginTop: 16,
  },
  inputField: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: 40,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    ...theme.palette.input.default,
    borderColor: theme.colors.midnight,
    fontFamily: theme.fonts.secondary.fontFamily,
    fontSize: theme.fonts.secondary.small.fontSize,
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
