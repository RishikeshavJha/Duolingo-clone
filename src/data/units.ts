import { Unit } from '../types/learning';

export const UNITS: Unit[] = [
  {
    id: 'es-u1',
    languageCode: 'es',
    title: 'Unit 1: Spanish Basics',
    description: 'Learn simple greetings, introductions, and essential daily expressions.',
    unitNumber: 1,
    color: '#58CC02',
    lessonIds: ['es-l1', 'es-l2', 'es-l3']
  },
  {
    id: 'fr-u1',
    languageCode: 'fr',
    title: 'Unit 1: French Basics',
    description: 'Learn fundamental greetings, polite expressions, and everyday French.',
    unitNumber: 1,
    color: '#1CB0F6',
    lessonIds: ['fr-l1', 'fr-l2']
  },
  {
    id: 'ja-u1',
    languageCode: 'ja',
    title: 'Unit 1: Japanese Basics',
    description: 'Master basic Japanese greetings, polite expressions, and everyday words.',
    unitNumber: 1,
    color: '#FF4B4B',
    lessonIds: ['ja-l1', 'ja-l2']
  },
  {
    id: 'de-u1',
    languageCode: 'de',
    title: 'Unit 1: German Basics',
    description: 'Learn basic German greetings, introductions, and polite conversation.',
    unitNumber: 1,
    color: '#FF9600',
    lessonIds: ['de-l1', 'de-l2']
  }
];

export const getUnitsByLanguageCode = (languageCode: string): Unit[] => {
  return UNITS.filter(u => u.languageCode === languageCode);
};

export const getUnitById = (id: string): Unit | undefined => {
  return UNITS.find(u => u.id === id);
};
