import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "hello": "Hello World",
      "welcome": "Welcome to the Family Recipe App",
      "app": {
        "title": "Family Recipe App",
        "description": "Record recipes, plan family meals and have a handy assistant while cooking!"
      },
      "home": {
        "features": {
          "title": "Main Features"
        }
      },
      "nav": {
        "home": "Home",
        "recipes": "Recipes",
        "planner": "Planner",
        "cooking": "Cooking"
      },
      "recipes": {
        "title": "Recipe Database",
        "description": "Browse and manage your family recipes."
      },
      "planner": {
        "title": "Meal Planner",
        "description": "Plan your weekly family meals."
      },
      "cooking": {
        "title": "Cooking Assistant",
        "description": "Step-by-step cooking guidance and timers."
      }
    }
  },
  es: {
    translation: {
      "hello": "Hola Mundo",
      "welcome": "Bienvenido a la App de Recetas Familiares",
      "app": {
        "title": "App de Recetas Familiares",
        "description": "¡Registra recetas, planifica comidas familiares y ten un asistente útil mientras cocinas!"
      },
      "home": {
        "features": {
          "title": "Características Principales"
        }
      },
      "nav": {
        "home": "Inicio",
        "recipes": "Recetas",
        "planner": "Planificador",
        "cooking": "Cocina"
      },
      "recipes": {
        "title": "Base de Datos de Recetas",
        "description": "Navega y gestiona tus recetas familiares."
      },
      "planner": {
        "title": "Planificador de Comidas",
        "description": "Planifica tus comidas familiares semanales."
      },
      "cooking": {
        "title": "Asistente de Cocina",
        "description": "Guía paso a paso para cocinar y temporizadores."
      }
    }
  },
  nl: {
    translation: {
      "hello": "Hallo Wereld",
      "welcome": "Welkom bij de Familie Recepten App",
      "app": {
        "title": "Familie Recepten App",
        "description": "Leg recepten vast, plan familiemaaltijden en heb een handige assistent tijdens het koken!"
      },
      "home": {
        "features": {
          "title": "Hoofdfuncties"
        }
      },
      "nav": {
        "home": "Thuis",
        "recipes": "Recepten",
        "planner": "Planner",
        "cooking": "Koken"
      },
      "recipes": {
        "title": "Receptendatabase",
        "description": "Blader door en beheer je familierecepten."
      },
      "planner": {
        "title": "Maaltijdplanner",
        "description": "Plan je wekelijkse familiemaaltijden."
      },
      "cooking": {
        "title": "Kookassistent",
        "description": "Stap-voor-stap kookbegeleiding en timers."
      }
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
