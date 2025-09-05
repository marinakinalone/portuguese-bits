import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InteractiveHeader from '@/components/InteractiveHeader';
import PrimaryButton from '@/components/core/PrimaryButton';
import { LANGUAGES, PRIMARY_BUTTON_STYLE } from '@/constants';
import theme from '@/theme/defaultTheme';

const { FR, PT } = LANGUAGES;

const titles = {
  version: `${FR} | ${PT}`,
  theme: `${PT} | ${FR}`,
};

const VocabularyScreen = () => {
  const [translationType, setTranslationType] = useState(titles.version);

  const toggleTranslationType = () => {
    setTranslationType((prevTranslationType) =>
      prevTranslationType === titles.version ? titles.theme : titles.version,
    );
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
        <Text>Words</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.ACCENT}
          handlePress={() => true}>
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
});

export default VocabularyScreen;
