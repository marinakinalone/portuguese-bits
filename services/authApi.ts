import { apiRequest } from '@/services/api';
import type { AuthMessage, AuthSuccess, UserProfile } from '@/types/api';

export function register(username: string, password: string) {
  return apiRequest<AuthMessage>('/auth/register', {
    method: 'POST',
    body: { username, password },
    auth: false,
  });
}

export function login(username: string, password: string) {
  return apiRequest<AuthSuccess>('/auth/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
  });
}

export function getMe(token?: string | null) {
  return apiRequest<UserProfile>('/auth/me', { token });
}
