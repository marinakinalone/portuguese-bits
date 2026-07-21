import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import BackToHome from '@/components/BackToHome';
import PrimaryButton from '@/components/core/PrimaryButton';
import { isDemoMode, PRIMARY_BUTTON_STYLE } from '@/constants';
import { useAuth } from '@/providers/Auth';
import theme from '@/theme/defaultTheme';
import { storageDelete, storageGet, storageSet } from '@/utils/storage';

const REMINDER_ENABLED_KEY = 'pb_reminder_enabled';
const REMINDER_HOUR_KEY = 'pb_reminder_hour';
const REMINDER_MINUTE_KEY = 'pb_reminder_minute';
const REMINDER_ID_KEY = 'pb_reminder_notification_id';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const SettingsScreen: React.FC = () => {
  const { logout } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState('18');
  const [minute, setMinute] = useState('00');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storedEnabled = await storageGet(REMINDER_ENABLED_KEY);
      const storedHour = await storageGet(REMINDER_HOUR_KEY);
      const storedMinute = await storageGet(REMINDER_MINUTE_KEY);
      setEnabled(storedEnabled === 'true');
      if (storedHour) {
        setHour(storedHour);
      }
      if (storedMinute) {
        setMinute(storedMinute);
      }
    })();
  }, []);

  const cancelExisting = async () => {
    const existingId = await storageGet(REMINDER_ID_KEY);
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
      await storageDelete(REMINDER_ID_KEY);
    }
  };

  const scheduleReminder = async (nextHour: number, nextMinute: number) => {
    const { status: permission } =
      await Notifications.requestPermissionsAsync();
    if (permission !== 'granted') {
      setStatus('Notification permission is required.');
      return false;
    }

    await cancelExisting();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Portuguese Bits',
        body: "Complete today's quiz to keep your streak!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: nextHour,
        minute: nextMinute,
      },
    });

    await storageSet(REMINDER_ID_KEY, id);
    return true;
  };

  const handleSave = async () => {
    const nextHour = Number(hour);
    const nextMinute = Number(minute);

    if (
      Number.isNaN(nextHour) ||
      Number.isNaN(nextMinute) ||
      nextHour < 0 ||
      nextHour > 23 ||
      nextMinute < 0 ||
      nextMinute > 59
    ) {
      setStatus('Enter a valid time (HH 0–23, MM 0–59).');
      return;
    }

    const hourStr = String(nextHour).padStart(2, '0');
    const minuteStr = String(nextMinute).padStart(2, '0');

    await storageSet(REMINDER_HOUR_KEY, hourStr);
    await storageSet(REMINDER_MINUTE_KEY, minuteStr);
    await storageSet(REMINDER_ENABLED_KEY, enabled ? 'true' : 'false');

    if (enabled) {
      const ok = await scheduleReminder(nextHour, nextMinute);
      if (ok) {
        setStatus(`Reminder set for ${hourStr}:${minuteStr} every day.`);
      }
    } else {
      await cancelExisting();
      setStatus('Reminder turned off.');
    }
  };

  return (
    <View style={styles.container}>
      <BackToHome />
      <Text style={styles.title} accessibilityRole="header">
        SETTINGS
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Daily quiz reminder</Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            accessibilityLabel="Enable daily quiz reminder"
          />
        </View>

        <Text style={styles.hint}>
          Remind me to complete a quiz every day at:
        </Text>
        <View style={styles.timeRow}>
          <TextInput
            style={styles.timeInput}
            value={hour}
            onChangeText={setHour}
            keyboardType="number-pad"
            maxLength={2}
            accessibilityLabel="Reminder hour"
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.timeInput}
            value={minute}
            onChangeText={setMinute}
            keyboardType="number-pad"
            maxLength={2}
            accessibilityLabel="Reminder minute"
          />
        </View>

        {Platform.OS === 'android' ? (
          <Text style={styles.platformNote}>
            Android may need notification permission for reminders.
          </Text>
        ) : null}

        {status ? (
          <Text style={styles.status} accessibilityRole="alert">
            {status}
          </Text>
        ) : null}

        <PrimaryButton
          style={PRIMARY_BUTTON_STYLE.ACCENT}
          fullWidth
          handlePress={() => {
            void handleSave();
          }}>
          SAVE
        </PrimaryButton>

        {!isDemoMode ? (
          <PrimaryButton
            style={PRIMARY_BUTTON_STYLE.WARNING}
            fullWidth
            handlePress={() => {
              void logout();
            }}>
            LOG OUT
          </PrimaryButton>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch',
  },
  title: {
    fontFamily: theme.fonts.primary.fontFamily,
    ...theme.fonts.primary.mediumLarge,
    marginVertical: 24,
    textAlign: 'center',
  },
  card: {
    width: '86%',
    maxWidth: 360,
    alignSelf: 'center',
    backgroundColor: theme.colors.linen,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.midnight,
    padding: 20,
    gap: 12,
    alignItems: 'stretch',
  },
  row: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...theme.fonts.secondary.small,
  },
  hint: {
    ...theme.fonts.secondary.extraSmall,
    alignSelf: 'stretch',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  timeInput: {
    width: 64,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.midnight,
    backgroundColor: theme.colors.cloud,
    textAlign: 'center',
    color: theme.colors.midnight,
    fontFamily: theme.fonts.secondary.fontFamily,
    fontSize: theme.fonts.secondary.small.fontSize,
  },
  colon: {
    ...theme.fonts.secondary.medium,
    marginHorizontal: 8,
  },
  platformNote: {
    ...theme.fonts.secondary.extraSmall,
    textAlign: 'center',
  },
  status: {
    ...theme.fonts.secondary.extraSmall,
    textAlign: 'center',
  },
});

export default SettingsScreen;
