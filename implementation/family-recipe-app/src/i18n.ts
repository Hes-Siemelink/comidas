import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "hello": "Hello World",
      "welcome": "Welcome to the Family Recipe App"
    }
  },
  es: {
    translation: {
      "hello": "Hola Mundo",
      "welcome": "Bienvenido a la App de Recetas Familiares"
    }
  },
  nl: {
    translation: {
      "hello": "Hallo Wereld",
      "welcome": "Welkom bij de Familie Recepten App"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
