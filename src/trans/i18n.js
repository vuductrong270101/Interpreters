import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationVi from './locales/vi/translation.json';
import translationEN from './locales/en/translation.json';
import translationKE from './locales/ke/translation.json';

const fallbackLng = ['vi'];
const availableLanguages = ['vi', 'en', 'ke'];

const resources = {
  vi: {
    translation: translationVi,
  },
  en: {
    translation: translationEN,
  },
  ke: {
    translation: translationKE,
  },
};

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,

    detection: {
      checkWhitelist: true,
    },

    debug: false,

    whitelist: availableLanguages,

    interpolation: {
      escapeValue: false,
    },

    // Sử dụng middleware để lưu ngôn ngữ vào cookie
    middleware: (lng) => {
      saveLanguageToCookie(lng);
    },
  });

export default i18n;
