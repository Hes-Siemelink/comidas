import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "hello": "Hello World",
      "welcome": "Welcome to Comidas",
      "app": {
        "title": "Comidas",
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
        "description": "Browse and manage your family recipes.",
        "browseAll": "Browse All Recipes",
        "addNew": "Add New Recipe",
        "browseAllAriaLabel": "Browse all family recipes",
        "addNewAriaLabel": "Add a new recipe to the collection",
        "loading": "Loading recipes...",
        "errorTitle": "Error loading recipes",
        "noRecipes": "No recipes found. Add your first recipe to get started!",
        "noSearchResults": "No recipes found for \"{{query}}\"",
        "searchResults": "Found {{count}} recipe(s) for \"{{query}}\"",
        "view": "View",
        "edit": "Edit",
        "viewRecipe": "View recipe details",
        "editRecipe": "Edit recipe",
        "lastUpdated": "Last updated",
        "search": {
          "placeholder": "Search recipes by name...",
          "button": "Search recipes",
          "search": "Search",
          "clear": "Clear search"
        },
        "form": {
          "addTitle": "Add New Recipe",
          "editTitle": "Edit Recipe",
          "name": "Recipe Name",
          "namePlaceholder": "Enter recipe name",
          "nameRequired": "Recipe name is required",
          "ingredients": "Ingredients",
          "ingredientsPlaceholder": "List ingredients, one per line",
          "ingredientsRequired": "Ingredients are required",
          "steps": "Cooking Steps",
          "stepsPlaceholder": "Describe the cooking steps",
          "stepsRequired": "Steps are required",
          "cancel": "Cancel",
          "saveButton": "Save Recipe",
          "updateButton": "Update Recipe",
          "saving": "Saving...",
          "updating": "Updating..."
        }
      },
      "planner": {
        "title": "Meal Planner",
        "description": "Plan your weekly family meals.",
        "viewFull": "View Full Planner",
        "planThisWeek": "Plan This Week",
        "viewFullAriaLabel": "View the complete meal planning interface",
        "planThisWeekAriaLabel": "Start planning meals for this week",
        "quickForm": {
          "noWeek": "Create a new week to start planning meals",
          "placeholder": "Type meal and press Enter...",
          "addMealHint": "Type a meal name and press Enter to add"
        },
        "week": {
          "createNew": "Create New Comidas Week",
          "createDescription": "Start planning meals for this week - add as many as you need!",
          "loading": "Loading week data...",
          "mealCount": "Number of meals (3-7):",
          "create": "Create Week",
          "current": "Current Week",
          "created": "Created {{date}}",
          "completed": "completed",
          "complete": "Complete Week",
          "confirmComplete": "Complete this week and archive it?",
          "addMeals": "Add Meals",
          "mealList": "Meal List"
        },
        "meal": {
          "markComplete": "Mark meal as complete",
          "markIncomplete": "Mark meal as incomplete",
          "assignedTo": "Assigned to: {{name}}",
          "delete": "Delete meal",
          "confirmDelete": "Delete this meal?"
        }
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
      "welcome": "Bienvenido a Comidas",
      "app": {
        "title": "Comidas",
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
        "title": "Base de datos de recetas",
        "description": "Navega y gestiona tus recetas familiares.",
        "browseAll": "Ver todas las recetas",
        "addNew": "Agregar nueva receta",
        "browseAllAriaLabel": "Ver todas las recetas familiares",
        "addNewAriaLabel": "Agregar una nueva receta a la colección",
        "loading": "Cargando recetas...",
        "errorTitle": "Error al cargar recetas",
        "noRecipes": "No se encontraron recetas. ¡Agrega tu primera receta para comenzar!",
        "noSearchResults": "No se encontraron recetas para \"{{query}}\"",
        "searchResults": "Se encontraron {{count}} receta(s) para \"{{query}}\"",
        "view": "Ver",
        "edit": "Editar",
        "viewRecipe": "Ver detalles de la receta",
        "editRecipe": "Editar receta",
        "lastUpdated": "Última actualización",
        "search": {
          "placeholder": "Buscar recetas por nombre...",
          "button": "Buscar recetas",
          "search": "Buscar",
          "clear": "Limpiar búsqueda"
        },
        "form": {
          "addTitle": "Agregar Nueva Receta",
          "editTitle": "Editar Receta",
          "name": "Nombre de la Receta",
          "namePlaceholder": "Ingresa el nombre de la receta",
          "nameRequired": "El nombre de la receta es requerido",
          "ingredients": "Ingredientes",
          "ingredientsPlaceholder": "Lista los ingredientes, uno por línea",
          "ingredientsRequired": "Los ingredientes son requeridos",
          "steps": "Pasos de Cocción",
          "stepsPlaceholder": "Describe los pasos de cocción",
          "stepsRequired": "Los pasos son requeridos",
          "cancel": "Cancelar",
          "saveButton": "Guardar Receta",
          "updateButton": "Actualizar Receta",
          "saving": "Guardando...",
          "updating": "Actualizando..."
        }
      },
      "planner": {
        "title": "Planificador de comidas",
        "description": "Planifica tus comidas familiares semanales.",
        "viewFull": "Ver planificador completo",
        "planThisWeek": "Planificar esta semana",
        "viewFullAriaLabel": "Ver la interfaz completa de planificación de comidas",
        "planThisWeekAriaLabel": "Comenzar a planificar comidas para esta semana",
        "quickForm": {
          "noWeek": "Crear una nueva semana para comenzar a planificar comidas",
          "placeholder": "Escriba la comida y presione Enter...",
          "addMealHint": "Escriba el nombre de una comida y presione Enter para agregar"
        },
        "week": {
          "createNew": "Crear nueva semana comidas",
          "createDescription": "Comienza a planificar comidas para esta semana - ¡agrega tantas como necesites!",
          "loading": "Cargando datos de la semana...",
          "mealCount": "Número de comidas (3-7):",
          "create": "Crear semana",
          "current": "Semana actual",
          "created": "Creada {{date}}",
          "completed": "completada",
          "complete": "Completar semana",
          "confirmComplete": "¿Completar esta semana y archivarla?",
          "addMeals": "Agregar comidas",
          "mealList": "Lista de comidas"
        },
        "meal": {
          "markComplete": "Marcar comida como completada",
          "markIncomplete": "Marcar comida como incompleta",
          "assignedTo": "Asignada a: {{name}}",
          "delete": "Eliminar comida",
          "confirmDelete": "¿Eliminar esta comida?"
        }
      },
      "cooking": {
        "title": "Asistente de cocina",
        "description": "Guía paso a paso para cocinar y temporizadores."
      }
    }
  },
  nl: {
    translation: {
      "hello": "Hallo Wereld",
      "welcome": "Welkom bij Comidas",
      "app": {
        "title": "Comidas",
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
        "description": "Blader door en beheer je familierecepten.",
        "browseAll": "Alle recepten bekijken",
        "addNew": "Nieuw recept toevoegen",
        "browseAllAriaLabel": "Alle familierecepten bekijken",
        "addNewAriaLabel": "Een nieuw recept toevoegen aan de collectie",
        "loading": "Recepten laden...",
        "errorTitle": "Fout bij het laden van recepten",
        "noRecipes": "Geen recepten gevonden. Voeg je eerste recept toe om te beginnen!",
        "noSearchResults": "Geen recepten gevonden voor \"{{query}}\"",
        "searchResults": "{{count}} recept(en) gevonden voor \"{{query}}\"",
        "view": "Bekijken",
        "edit": "Bewerken",
        "viewRecipe": "Receptdetails bekijken",
        "editRecipe": "Recept bewerken",
        "lastUpdated": "Laatst bijgewerkt",
        "search": {
          "placeholder": "Zoek recepten op naam...",
          "button": "Recepten zoeken",
          "search": "Zoeken",
          "clear": "Zoekopdracht wissen"
        },
        "form": {
          "addTitle": "Nieuw Recept Toevoegen",
          "editTitle": "Recept Bewerken",
          "name": "Receptnaam",
          "namePlaceholder": "Voer de receptnaam in",
          "nameRequired": "Receptnaam is verplicht",
          "ingredients": "Ingrediënten",
          "ingredientsPlaceholder": "Lijst ingrediënten, één per regel",
          "ingredientsRequired": "Ingrediënten zijn verplicht",
          "steps": "Kookstappen",
          "stepsPlaceholder": "Beschrijf de kookstappen",
          "stepsRequired": "Stappen zijn verplicht",
          "cancel": "Annuleren",
          "saveButton": "Recept Opslaan",
          "updateButton": "Recept Bijwerken",
          "saving": "Opslaan...",
          "updating": "Bijwerken..."
        }
      },
      "planner": {
        "title": "Maaltijdplanner",
        "description": "Plan je wekelijkse familiemaaltijden.",
        "viewFull": "Volledige planner bekijken",
        "planThisWeek": "Deze week plannen",
        "viewFullAriaLabel": "De volledige maaltijdplannings-interface bekijken",
        "planThisWeekAriaLabel": "Begin met het plannen van maaltijden voor deze week",
        "quickForm": {
          "noWeek": "Maak een nieuwe week aan om maaltijden te plannen",
          "placeholder": "Typ maaltijd en druk op Enter...",
          "addMealHint": "Typ een maaltijdnaam en druk op Enter om toe te voegen"
        },
        "week": {
          "createNew": "Nieuwe comidas week maken",
          "createDescription": "Begin met het plannen van maaltijden voor deze week - voeg er zoveel toe als je nodig hebt!",
          "loading": "Weekgegevens laden...",
          "mealCount": "Aantal maaltijden (3-7):",
          "create": "Week maken",
          "current": "Huidige week",
          "created": "Gemaakt {{date}}",
          "completed": "voltooid",
          "complete": "Week voltooien",
          "confirmComplete": "Deze week voltooien en archiveren?",
          "addMeals": "Maaltijden toevoegen",
          "mealList": "Maaltijdlijst"
        },
        "meal": {
          "markComplete": "Maaltijd als voltooid markeren",
          "markIncomplete": "Maaltijd als onvoltooid markeren",
          "assignedTo": "Toegewezen aan: {{name}}",
          "delete": "Maaltijd verwijderen",
          "confirmDelete": "Deze maaltijd verwijderen?"
        }
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
