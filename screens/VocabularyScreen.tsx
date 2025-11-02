import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import InteractiveHeader from '@/components/InteractiveHeader';
import VocabularyList from '@/components/VocabularyList';
import PrimaryButton from '@/components/core/PrimaryButton';
import { LANGUAGES, PRIMARY_BUTTON_STYLE, SCREENS } from '@/constants';
import useVocabularyStore from '@/stores/Vocabulary';
import theme from '@/theme/defaultTheme';

const { FR, PT } = LANGUAGES;

const titles = {
  version: `${FR} | ${PT}`,
  theme: `${PT} | ${FR}`,
};

const VocabularyScreen = () => {
  const navigation = useNavigation();
  const [translationType, setTranslationType] = useState(titles.version);
  const {
    vocabulary,
    loading,
    error,
    fetchVocabulary,
    deleteWord,
    resetError,
  } = useVocabularyStore();

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: resetError }]);
    }
  }, [error, resetError]);

  const toggleTranslationType = () => {
    setTranslationType((prevTranslationType) =>
      prevTranslationType === titles.version ? titles.theme : titles.version,
    );
  };

  const handleAddWord = () => {
    navigation.navigate(SCREENS.ADD as never);
  };

  const handleEditWord = (word: { fr: string; pt: string }) => {
    navigation.navigate({
      name: SCREENS.EDIT,
      params: { id: word.fr, word: JSON.stringify(word) },
    } as never);
  };

  const handleDeleteWord = (fr: string) => {
    Alert.alert('Delete Word', `Are you sure you want to delete "${fr}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // TODO: Add authToken when authentication is implemented
            await deleteWord(fr);
          } catch (_err) {
            Alert.alert('Error', 'Failed to delete word');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <InteractiveHeader
          header={translationType}
          setHeader={toggleTranslationType}
        />
      </View>
      <View style={styles.vocabulary}>
        {loading && vocabulary.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.basil} />
            <Text style={styles.loadingText}>Loading vocabulary...</Text>
          </View>
        ) : (
          <VocabularyList
            vocabulary={vocabulary}
            translationType={translationType}
            onEdit={handleEditWord}
            onDelete={handleDeleteWord}
          />
        )}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.ACCENT}
          handlePress={handleAddWord}>
          ADD A NEW WORD
        </PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexShrink: 0,
    flexGrow: 0,
    marginTop: 40,
    width: '100%',
  },
  vocabulary: {
    flex: 1,
    width: '100%',
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderColor: theme.colors.basil,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.snow,
  },
  footer: {
    flexShrink: 0,
    flexGrow: 0,
    width: '100%',
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.basil,
    fontFamily: theme.fonts.primary.fontFamily,
  },
});

export default VocabularyScreen;
