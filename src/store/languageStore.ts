import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type Language } from "../types/learning";

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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
