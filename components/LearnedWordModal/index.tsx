import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '@/components/core/PrimaryButton';
import { PRIMARY_BUTTON_STYLE } from '@/constants';
import { useQuizzLogic } from '@/providers/QuizzLogic';
import theme from '@/theme/defaultTheme';

const LearnedWordModal: React.FC = () => {
  const { learnedQueue, confirmLearnedWord, isFinishing } = useQuizzLogic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const current = learnedQueue[0];
  const visible = Boolean(current) && !isFinishing;

  useEffect(() => {
    setIsSubmitting(false);
  }, [current?._id]);

  if (!current) {
    return null;
  }

  const handleAction = async (action: 'keep' | 'remove') => {
    setIsSubmitting(true);
    await confirmLearnedWord(action);
    setIsSubmitting(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      accessibilityViewIsModal>
      <View style={styles.overlay}>
        <View
          style={styles.card}
          accessible
          accessibilityRole="summary"
          accessibilityLabel={`You have successfully learned ${current.pt}`}>
          <Text style={styles.title}>You have successfully learned</Text>
          <Text style={styles.word}>{current.pt}</Text>
          <Text style={styles.hint}>
            Keep it in your vocabulary list, or remove it from future quizzes.
          </Text>
          <PrimaryButton
            style={PRIMARY_BUTTON_STYLE.ACCENT}
            handlePress={() => {
              if (!isSubmitting) {
                void handleAction('keep');
              }
            }}>
            Keep
          </PrimaryButton>
          <PrimaryButton
            style={PRIMARY_BUTTON_STYLE.WARNING}
            handlePress={() => {
              if (!isSubmitting) {
                void handleAction('remove');
              }
            }}>
            Remove
          </PrimaryButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 30, 30, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: theme.colors.linen,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.midnight,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    ...theme.fonts.secondary.small,
    textAlign: 'center',
  },
  word: {
    ...theme.fonts.primary.large,
    textAlign: 'center',
  },
  hint: {
    ...theme.fonts.secondary.extraSmall,
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default LearnedWordModal;
