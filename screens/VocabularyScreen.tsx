import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from 'expo-router/react-navigation';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BackToHome from '@/components/BackToHome';
import ErrorCard from '@/components/ErrorCard';
import PrimaryButton from '@/components/core/PrimaryButton';
import { isDemoMode, PRIMARY_BUTTON_STYLE, SCREENS } from '@/constants';
import * as vocabApi from '@/services/vocabApi';
import theme from '@/theme/defaultTheme';
import type { VocabWord } from '@/types/api';

type SortMode = 'alphabetical' | 'oldest';

const VocabularyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [words, setWords] = useState<VocabWord[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [frenchFirst, setFrenchFirst] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('alphabetical');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const requestIdRef = useRef(0);
  const hasLoadedRef = useRef(false);

  const loadWords = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    // Only blank the list on the first fetch — keep existing rows visible on refocus.
    if (!hasLoadedRef.current) {
      setIsInitialLoading(true);
    }
    setError(null);
    try {
      const data = await vocabApi.getVocab();
      if (requestId !== requestIdRef.current) {
        return;
      }
      setWords(data);
      hasLoadedRef.current = true;
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      // Keep the existing list if a background refresh fails.
      if (!hasLoadedRef.current) {
        setError(
          err instanceof Error ? err.message : 'Failed to load vocabulary',
        );
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsInitialLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadWords();
    }, [loadWords]),
  );

  const sortedWords = useMemo(() => {
    const copy = [...words];
    if (sortMode === 'alphabetical') {
      const key = frenchFirst ? 'fr' : 'pt';
      copy.sort((a, b) =>
        a[key].localeCompare(b[key], undefined, { sensitivity: 'base' }),
      );
    } else {
      // MongoDB ObjectId encodes creation time — ascending = oldest first
      copy.sort((a, b) => a._id.localeCompare(b._id));
    }
    return copy;
  }, [words, sortMode, frenchFirst]);

  const handleAdd = () => {
    if (isDemoMode) {
      return;
    }
    navigation.navigate({
      name: SCREENS.WORD_EDIT,
      params: { mode: 'add' },
    });
  };

  const handleEdit = (word: VocabWord) => {
    if (isDemoMode) {
      return;
    }
    navigation.navigate({
      name: SCREENS.WORD_EDIT,
      params: {
        mode: 'edit',
        fr: word.fr,
        pt: word.pt,
        successStreak: word.successStreak ?? 0,
      },
    });
  };

  const selectSort = (mode: SortMode) => {
    setSortMode(mode);
    setSortMenuOpen(false);
  };

  const headerLabel = frenchFirst ? 'FR | PT' : 'PT | FR';

  return (
    <View style={styles.container}>
      <BackToHome />

      <View style={styles.headerBand}>
        <Pressable
          onPress={() => setFrenchFirst((prev) => !prev)}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel={`Display order ${headerLabel}. Tap to swap.`}
          accessibilityHint="Swaps which language appears first in the list">
          <Text style={styles.headerText}>{headerLabel}</Text>
        </Pressable>
        <Pressable
          onPress={() => setSortMenuOpen(true)}
          style={styles.sortButton}
          accessibilityRole="button"
          accessibilityLabel="Sort vocabulary list"
          accessibilityHint="Opens sort options"
          hitSlop={8}>
          <Ionicons
            name="swap-vertical-outline"
            size={22}
            color={theme.colors.midnight}
          />
        </Pressable>
      </View>

      {isInitialLoading ? (
        <View
          style={styles.loader}
          accessibilityRole="progressbar"
          accessibilityLabel="Loading vocabulary">
          <ActivityIndicator color={theme.colors.midnight} size="large" />
          <Text style={styles.loaderText}>Loading vocabulary…</Text>
        </View>
      ) : error ? (
        <ErrorCard message={error} onOk={() => setError(null)} />
      ) : (
        <FlatList
          data={sortedWords}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {isDemoMode
                ? 'No words available.'
                : 'No words yet. Add your first word.'}
            </Text>
          }
          renderItem={({ item }) => {
            const showLearned =
              !isDemoMode &&
              item.isLearned === true &&
              item.excludeFromQuiz === false;
            const left = frenchFirst ? item.fr : item.pt;
            const right = frenchFirst ? item.pt : item.fr;
            const label = `${left} equals ${right}${
              showLearned ? ', learned' : ''
            }`;

            if (isDemoMode) {
              return (
                <View style={styles.row} accessible accessibilityLabel={label}>
                  <Text style={styles.rowText}>
                    {left.toUpperCase()} = {right.toUpperCase()}
                  </Text>
                </View>
              );
            }

            return (
              <Pressable
                style={styles.row}
                onPress={() => handleEdit(item)}
                accessibilityRole="button"
                accessibilityLabel={label}>
                <Text style={styles.rowText}>
                  {left.toUpperCase()} = {right.toUpperCase()}
                </Text>
                {showLearned ? <Text style={styles.badge}>learned</Text> : null}
              </Pressable>
            );
          }}
        />
      )}

      {!isDemoMode ? (
        <View style={styles.footerBand}>
          <PrimaryButton
            style={PRIMARY_BUTTON_STYLE.ACCENT}
            handlePress={handleAdd}>
            ADD A NEW WORD
          </PrimaryButton>
        </View>
      ) : null}

      <Modal
        visible={sortMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSortMenuOpen(false)}>
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setSortMenuOpen(false)}
          accessibilityLabel="Close sort menu">
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>Sort by</Text>
            <Pressable
              style={[
                styles.menuOption,
                sortMode === 'alphabetical' && styles.menuOptionActive,
              ]}
              onPress={() => selectSort('alphabetical')}
              accessibilityRole="button"
              accessibilityState={{ selected: sortMode === 'alphabetical' }}
              accessibilityLabel="Alphabetical order">
              <Text style={styles.menuOptionText}>Alphabetical</Text>
            </Pressable>
            <Pressable
              style={[
                styles.menuOption,
                sortMode === 'oldest' && styles.menuOptionActive,
              ]}
              onPress={() => selectSort('oldest')}
              accessibilityRole="button"
              accessibilityState={{ selected: sortMode === 'oldest' }}
              accessibilityLabel="Oldest to most recent">
              <Text style={styles.menuOptionText}>Oldest to most recent</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  sortButton: {
    position: 'absolute',
    right: 16,
    bottom: 6,
    backgroundColor: theme.colors.linen,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBand: {
    position: 'relative',
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.pistachio,
    paddingVertical: 10,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.large,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
    flexGrow: 1,
    backgroundColor: 'rgba(244, 231, 212, 0.72)',
  },
  row: {
    backgroundColor: theme.colors.linen,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  rowText: {
    ...theme.fonts.secondary.small,
    flex: 1,
  },
  badge: {
    ...theme.fonts.secondary.extraSmall,
    backgroundColor: theme.colors.pistachio,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    overflow: 'hidden',
  },
  footerBand: {
    borderTopWidth: 3,
    borderTopColor: theme.colors.pistachio,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loaderText: {
    ...theme.fonts.secondary.small,
    color: theme.colors.midnight,
  },
  empty: {
    ...theme.fonts.secondary.small,
    textAlign: 'center',
    marginTop: 24,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 30, 30, 0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 16,
  },
  menuCard: {
    backgroundColor: theme.colors.linen,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    padding: 12,
    minWidth: 220,
    gap: 4,
  },
  menuTitle: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.mediumSmall,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  menuOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  menuOptionActive: {
    backgroundColor: theme.colors.pistachio,
  },
  menuOptionText: {
    ...theme.fonts.secondary.small,
  },
});

export default VocabularyScreen;
