import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';

const resources = {
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const changeLanguage = async (language: string): Promise<void> => {
  await i18n.changeLanguage(language);
};

export const getCurrentLanguage = (): string => {
  return i18n.language;
};

export const getSupportedLanguages = (): string[] => {
  return Object.keys(resources);
};

export default i18n;
