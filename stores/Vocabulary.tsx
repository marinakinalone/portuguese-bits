import { create } from 'zustand';
import { Translation, TranslationList } from '@/constants';

const API_BASE_URL = 'https://portuguese-bits-server.vercel.app/vocab';

interface VocabularyStore {
  vocabulary: TranslationList;
  loading: boolean;
  error: string | null;

  // Actions
  fetchVocabulary: () => Promise<void>;
  fetchWords: (numberOfWords: number) => Promise<TranslationList>;
  addWord: (word: Translation, authToken?: string) => Promise<void>;
  updateWord: (
    fr: string,
    word: Translation,
    authToken?: string,
  ) => Promise<void>;
  deleteWord: (fr: string, authToken?: string) => Promise<void>;
  resetError: () => void;
}

const useVocabularyStore = create<VocabularyStore>((set, get) => ({
  vocabulary: [],
  loading: false,
  error: null,

  fetchVocabulary: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch vocabulary: ${response.statusText}`);
      }
      const data = await response.json();
      // Map API response to Translation format (strip _id field)
      const vocabulary: TranslationList = data.map(
        (item: { fr: string; pt: string; _id?: string }) => ({
          fr: item.fr,
          pt: item.pt,
        }),
      );
      set({ vocabulary, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
    }
  },

  fetchWords: async (numberOfWords: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/${numberOfWords}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch words: ${response.statusText}`);
      }
      const data = await response.json();

      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }

      // Map API response to Translation format (strip _id field)
      const words: TranslationList = data.map(
        (item: { fr: string; pt: string; _id?: string }) => ({
          fr: item.fr,
          pt: item.pt,
        }),
      );

      set({ loading: false });
      return words;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
      throw error;
    }
  },

  addWord: async (word: Translation, authToken?: string) => {
    set({ loading: true, error: null });
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(word),
      });

      if (!response.ok) {
        throw new Error(`Failed to add word: ${response.statusText}`);
      }

      // Refresh vocabulary list after adding
      await get().fetchVocabulary();
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
      throw error;
    }
  },

  updateWord: async (fr: string, word: Translation, authToken?: string) => {
    set({ loading: true, error: null });
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/${encodeURIComponent(fr)}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(word),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update word: ${response.statusText}`);
      }

      // Refresh vocabulary list after updating
      await get().fetchVocabulary();
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
      throw error;
    }
  },

  deleteWord: async (fr: string, authToken?: string) => {
    set({ loading: true, error: null });
    try {
      const headers: HeadersInit = {};

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/${encodeURIComponent(fr)}`,
        {
          method: 'DELETE',
          headers,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete word: ${response.statusText}`);
      }

      // Refresh vocabulary list after deleting
      await get().fetchVocabulary();
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
      throw error;
    }
  },

  resetError: () => set({ error: null }),
}));

export default useVocabularyStore;
