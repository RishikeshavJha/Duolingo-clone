import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { type Language } from "../types/learning";

const memoryStorage = new Map<string, string>();

const expoStorage: StateStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web") {
        return typeof localStorage !== "undefined" ? localStorage.getItem(key) : memoryStorage.get(key) ?? null;
      }
      return (await SecureStore.getItemAsync(key)) ?? null;
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    memoryStorage.set(key, value);
    try {
      if (Platform.OS === "web") {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {
      // In-memory storage is updated as fallback
    }
  },
  removeItem: async (key: string): Promise<void> => {
    memoryStorage.delete(key);
    try {
      if (Platform.OS === "web") {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch {
      // In-memory storage is updated as fallback
    }
  },
};

interface LanguageState {
  selectedLanguage: Language | null;
  setLanguage: (language: Language) => void;
  clearLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      setLanguage: (language) => set({ selectedLanguage: language }),
      clearLanguage: () => set({ selectedLanguage: null }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => expoStorage),
    }
  )
);
