import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackToHome from '@/components/BackToHome';
import ErrorCard from '@/components/ErrorCard';
import PrimaryButton from '@/components/core/PrimaryButton';
import { isDemoMode, PRIMARY_BUTTON_STYLE } from '@/constants';
import { ApiError } from '@/services/api';
import * as vocabApi from '@/services/vocabApi';
import theme from '@/theme/defaultTheme';

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const WordEditScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    fr?: string;
    pt?: string;
    successStreak?: string;
  }>();

  useEffect(() => {
    if (isDemoMode) {
      router.replace('/');
    }
  }, [router]);

  const isEdit = params.mode === 'edit';
  const originalFr = params.fr || '';
  const successStreak = isDemoMode
    ? 0
    : Number(params.successStreak ?? 0) || 0;

  const [pt, setPt] = useState(params.pt || '');
  const [fr, setFr] = useState(params.fr || '');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const title = useMemo(
    () => (isEdit ? 'EDIT WORD' : 'ADD A NEW WORD'),
    [isEdit],
  );

  const findDuplicateMessage = async (nextPt: string, nextFr: string) => {
    const existing = await vocabApi.getVocab();
    const ptKey = normalize(nextPt);
    const frKey = normalize(nextFr);
    const originalFrKey = normalize(originalFr);

    const duplicate = existing.find((word) => {
      if (isEdit && normalize(word.fr) === originalFrKey) {
        return false;
      }
      return normalize(word.pt) === ptKey || normalize(word.fr) === frKey;
    });

    if (!duplicate) {
      return null;
    }

    return 'This word already exists.';
  };

  const handleSave = async () => {
    const nextPt = pt.trim();
    const nextFr = fr.trim();
    if (!nextPt || !nextFr) {
      setError('Both PT and FR are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const duplicateMessage = await findDuplicateMessage(nextPt, nextFr);
      if (duplicateMessage) {
        setError(duplicateMessage);
        return;
      }

      if (isEdit) {
        await vocabApi.updateWord(originalFr, nextPt, nextFr);
      } else {
        await vocabApi.createWord(nextPt, nextFr);
      }
      setFeedback(isEdit ? 'SUCCESSFULLY SAVED!' : 'SUCCESSFULLY ADDED!');
      setTimeout(() => {
        router.replace('/vocabulary');
      }, 1200);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to save word');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!originalFr) {
      return;
    }

    setConfirmDelete(false);
    setIsSubmitting(true);
    setError(null);

    try {
      await vocabApi.deleteWord(originalFr);
      setFeedback('DELETED!');
      setTimeout(() => {
        router.replace('/vocabulary');
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete word');
      setIsSubmitting(false);
    }
  };

  if (isDemoMode) {
    return null;
  }

  if (feedback) {
    return (
      <View style={styles.feedbackContainer}>
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackText} accessibilityRole="alert">
            {feedback}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentColumn}>
        <BackToHome
          label="back to vocabulary"
          href="/vocabulary"
          resetQuiz={false}
          style={styles.backButton}
        />

        <View style={styles.card}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>

          {isEdit ? (
            <Text
              style={styles.streak}
              accessibilityLabel={`Current streak ${successStreak}`}>
              current streak: {successStreak}
            </Text>
          ) : null}

          <View style={styles.fieldRow}>
            <Text style={styles.label}>PT</Text>
            <TextInput
              style={styles.input}
              value={pt}
              onChangeText={setPt}
              autoFocus
              accessibilityLabel="Portuguese word"
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>FR</Text>
            <TextInput
              style={styles.input}
              value={fr}
              onChangeText={setFr}
              accessibilityLabel="French word"
            />
          </View>

          <View style={styles.actions}>
            {isEdit ? (
              <PrimaryButton
                style={PRIMARY_BUTTON_STYLE.WARNING}
                handlePress={() => {
                  if (!isSubmitting) {
                    setConfirmDelete(true);
                  }
                }}>
                DELETE
              </PrimaryButton>
            ) : null}
            <PrimaryButton
              style={PRIMARY_BUTTON_STYLE.ACCENT}
              handlePress={() => {
                if (!isSubmitting) {
                  void handleSave();
                }
              }}>
              {isEdit ? 'SAVE' : 'ADD WORD'}
            </PrimaryButton>
          </View>
        </View>
      </View>

      {confirmDelete ? (
        <View style={styles.confirmOverlay}>
          <View
            style={styles.confirmCard}
            accessible
            accessibilityRole="summary"
            accessibilityLabel={`Delete ${pt}? This cannot be undone.`}>
            <Text style={styles.confirmTitle}>Delete this word?</Text>
            <Text style={styles.confirmMessage}>
              {pt.toUpperCase()} = {fr.toUpperCase()}
            </Text>
            <PrimaryButton
              style={PRIMARY_BUTTON_STYLE.WARNING}
              handlePress={() => {
                if (!isSubmitting) {
                  void handleDelete();
                }
              }}>
              DELETE
            </PrimaryButton>
            <PrimaryButton
              style={PRIMARY_BUTTON_STYLE.DEFAULT}
              handlePress={() => setConfirmDelete(false)}>
              CANCEL
            </PrimaryButton>
          </View>
        </View>
      ) : null}

      {error ? <ErrorCard message={error} onOk={() => setError(null)} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    paddingHorizontal: 24,
  },
  contentColumn: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  backButton: {
    marginLeft: 0,
    alignSelf: 'flex-start',
  },
  card: {
    width: '100%',
    marginTop: 24,
    backgroundColor: theme.colors.linen,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'stretch',
  },
  title: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.mediumLarge,
    textAlign: 'center',
    marginBottom: 2,
  },
  streak: {
    fontFamily: theme.fonts.primary.fontFamily,
    fontSize: theme.fonts.primary.small.fontSize,
    textAlign: 'center',
    marginBottom: 16,
  },
  fieldRow: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  label: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.mediumSmall,
    width: 28,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    backgroundColor: theme.colors.cloud,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: theme.colors.midnight,
    fontFamily: theme.fonts.secondary.fontFamily,
    fontSize: theme.fonts.secondary.small.fontSize,
  },
  actions: {
    marginTop: 16,
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 8,
  },
  feedbackContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  feedbackCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: theme.colors.linen,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.midnight,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  feedbackText: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.mediumLarge,
    textAlign: 'center',
  },
  confirmOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 30, 30, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 20,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: theme.colors.linen,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.midnight,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  confirmTitle: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.mediumLarge,
    textAlign: 'center',
  },
  confirmMessage: {
    ...theme.fonts.secondary.small,
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default WordEditScreen;
