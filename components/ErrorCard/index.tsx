import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '@/components/core/PrimaryButton';
import { PRIMARY_BUTTON_STYLE } from '@/constants';
import theme from '@/theme/defaultTheme';

type ErrorCardProps = {
  message: string;
  onOk: () => void;
};

const ErrorCard: React.FC<ErrorCardProps> = ({ message, onOk }) => {
  return (
    <View style={styles.overlay}>
      <View
        style={styles.card}
        accessible
        accessibilityRole="summary"
        accessibilityLabel={`Error. ${message}`}>
        <View style={styles.errorBar}>
          <Text style={styles.errorTitle}>ERROR</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        <PrimaryButton style={PRIMARY_BUTTON_STYLE.ACCENT} handlePress={onOk}>
          OK
        </PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 30, 30, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 20,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: theme.colors.linen,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.midnight,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 20,
  },
  errorBar: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.coral,
    paddingVertical: 12,
    alignItems: 'center',
  },
  errorTitle: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.mediumLarge,
  },
  message: {
    fontFamily: theme.fonts.primary.fontFamily,
    fontSize: theme.fonts.primary.mediumSmall.fontSize,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
    color: theme.colors.midnight,
  },
});

export default ErrorCard;
