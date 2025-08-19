# Domain Objects

This document describes the main logical entities (domain objects) in the comidas application. These objects represent the core concepts used throughout meal planning and recipe management features.

---

## 1. Week
Represents a planning period for meals.
- **Properties:**
  - `id`: Unique identifier
  - `title`: Editable name for the week
  - `status`: Current, Planned, or Completed
  - `meals`: List of Meal objects
  - `createdAt`: Timestamp of creation
  - `completedAt`: Timestamp when marked completed (optional)
- **Behavior:**
  - Can be created, edited, completed, and archived
  - Title is editable and persists
  - Status transitions: Planned → Current → Completed
  - Adding/removing meals updates the week

## 2. Meal
Represents a single meal entry within a week.
- **Properties:**
  - `id`: Unique identifier
  - `name`: Name of the meal
  - `completed`: Boolean indicating if the meal is marked as completed
  - `recipeId`: Optional link to a Recipe
- **Behavior:**
  - Can be added, edited, reordered, or removed from a week
  - Completion status can be toggled
  - May link to a recipe for details

## 3. Recipe
Represents a recipe in the database.
- **Properties:**
  - `id`: Unique identifier
  - `name`: Name of the recipe
  - `ingredients`: List of ingredients
  - `instructions`: Preparation steps
  - `tags`: Optional categorization (e.g., vegetarian, quick)
- **Behavior:**
  - Can be created, edited, and deleted
  - Can be linked to meals for planning
  - Searchable and browsable in the database

## 4. Language
Represents the user's selected language for localization.
- **Properties:**
  - `code`: Language code (e.g., 'en', 'es', 'nl')
  - `label`: Display name
- **Behavior:**
  - Selection updates all visible text
  - Persists across sessions

## 5. User Preferences
Represents persistent user settings.
- **Properties:**
  - `selectedLanguage`: Current language
  - Other configuration options as needed
- **Behavior:**
  - Preferences are saved and loaded automatically
  - Affect application behavior and display

---

These domain objects form the foundation for all functional features in the comidas application. They are designed to be implementation-agnostic and suitable for use by any agent or builder app.
