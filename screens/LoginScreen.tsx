import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PrimaryButton from '@/components/core/PrimaryButton';
import { PRIMARY_BUTTON_STYLE } from '@/constants';
import { useAuth } from '@/providers/Auth';
import { ApiError } from '@/services/api';
import theme from '@/theme/defaultTheme';

const LoginScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError('Username and password are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'login') {
        await login(trimmedUser, password);
      } else {
        await register(trimmedUser, password);
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.title}>Portuguese Bits</Text>
        <View
          style={styles.card}
          accessible
          accessibilityRole="summary"
          accessibilityLabel="Portuguese Bits login">
          <Text style={styles.subtitle}>
            {mode === 'login' ? 'Log in to continue' : 'Create an account'}
          </Text>

          <Text nativeID="usernameLabel" style={styles.label}>
            Username
          </Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            accessibilityLabel="Username"
            accessibilityLabelledBy="usernameLabel"
            returnKeyType="next"
          />

          <Text nativeID="passwordLabel" style={styles.label}>
            Password
          </Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            accessibilityLabel="Password"
            accessibilityLabelledBy="passwordLabel"
            returnKeyType="done"
            onSubmitEditing={() => {
              void handleSubmit();
            }}
          />

          {error ? (
            <Text style={styles.error} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}

          {isSubmitting ? (
            <ActivityIndicator
              color={theme.colors.midnight}
              style={styles.spinner}
              accessibilityLabel="Signing in"
            />
          ) : (
            <PrimaryButton
              style={PRIMARY_BUTTON_STYLE.ACCENT}
              fullWidth
              handlePress={() => {
                void handleSubmit();
              }}>
              {mode === 'login' ? 'Log in' : 'Register'}
            </PrimaryButton>
          )}

          <PrimaryButton
            style={PRIMARY_BUTTON_STYLE.DEFAULT}
            fullWidth
            handlePress={() => {
              setMode((prev) => (prev === 'login' ? 'register' : 'login'));
              setError(null);
            }}>
            {mode === 'login' ? 'Need an account?' : 'Have an account?'}
          </PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.colors.linen,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.midnight,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  title: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.large,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.fonts.secondary.extraSmall,
    marginBottom: 16,
  },
  label: {
    alignSelf: 'flex-start',
    ...theme.fonts.secondary.extraSmall,
    marginTop: 4,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    backgroundColor: theme.colors.cloud,
    paddingHorizontal: 16,
    marginBottom: 8,
    color: theme.colors.midnight,
  },
  error: {
    color: theme.colors.chocolate,
    ...theme.fonts.secondary.extraSmall,
    textAlign: 'center',
    marginVertical: 4,
  },
  spinner: {
    marginVertical: 12,
  },
});

export default LoginScreen;
