import { Language } from '../types/learning';

export const LANGUAGES: Language[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    color: '#58CC02',
    learners: '28.4M',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    color: '#1CB0F6',
    learners: '19.4M',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    color: '#FF4B4B',
    learners: '12.7M',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    color: '#1CB0F6',
    learners: '9.3M',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    color: '#FF9600',
    learners: '8.1M',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    color: '#FF4B4B',
    learners: '7.4M',
  },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};
