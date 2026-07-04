import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fi from './locales/fi/translation.json';
import en from './locales/en/translation.json';

export const SUPPORTED_LANGUAGES = ['fi', 'en'] as const;
export type AppLanguage = typeof SUPPORTED_LANGUAGES[number];

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      fi: { translation: fi },
      en: { translation: en },
    },
    fallbackLng: 'fi',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: { escapeValue: false },
  });

export default i18n;
