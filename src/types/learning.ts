export type LanguageCode = "es" | "fr" | "ja" | "de" | "ko" | "zh";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  color: string;
  /** Display learner count, e.g. "28.4M" */
  learners?: string;
}

export type ActivityType =
  | "vocabulary"
  | "translate"
  | "multiple-choice"
  | "listen";

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation: string;
  emoji?: string;
}

export interface Phrase {
  text: string;
  translation: string;
  pronunciation: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  question: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
}

export interface LessonGoal {
  title: string;
  description: string;
}

export interface AITeacherPrompt {
  characterName: string;
  systemPrompt: string;
  introMessage: string;
  topics: string[];
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: Activity[];
  aiTeacherPrompt: AITeacherPrompt;
}

export interface Unit {
  id: string;
  languageCode: LanguageCode;
  title: string;
  description: string;
  unitNumber: number;
  color: string;
  lessonIds: string[];
}
