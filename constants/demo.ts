const demoFlag = (process.env.EXPO_PUBLIC_DEMO_MODE ?? '')
  .trim()
  .toLowerCase();

export const isDemoMode = demoFlag === 'true' || demoFlag === '1';

export const DEMO_GUEST_USER = {
  username: 'guest',
  quizStreak: 0,
  lastQuizCompletedDate: null,
  completedToday: false,
} as const;
