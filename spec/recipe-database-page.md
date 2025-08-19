# Recipe Database Page

# Recipe Database Page Specification

## Goal
The Recipe Database page enables users to manage, browse, and search for recipes. It provides access to recipe details and supports linking recipes to meals in the meal planner.

## Sections and Functional Behavior

### 1. Recipe List Section
- Displays a list of recipes available in the database.
- Recipes are shown with their name and key summary information.
- The list updates automatically when recipes are added, edited, or deleted.
- Selecting a recipe displays its details in the Recipe Details section.

### 2. Search and Filter Section
- Allows users to search for recipes by name, ingredient, or tag.
- Search results update dynamically as the user types or changes filter criteria.
- Filtering options may include tags (e.g., vegetarian, quick) and ingredient inclusion/exclusion.

### 3. Recipe Details Section
- Shows detailed information for the selected recipe, including name, ingredients, instructions, and tags.
- Provides options to edit or delete the recipe.
- If the recipe is linked to a meal in the planner, this relationship is indicated.

### 4. Recipe Creation and Editing Section
- Allows users to create a new recipe or edit an existing one.
- Users can enter or modify the recipe name, ingredients, instructions, and tags.
- Changes are saved and reflected immediately in the Recipe List section.

### 5. Linking to Meal Planner Section
- Provides functionality to link a recipe to a meal in the meal planner.
- When a recipe is linked, the corresponding meal entry is updated to reference the recipe.
- Users can navigate to the Meal Planner page from a recipe to view or manage linked meals.

### 6. Accessibility and Responsiveness
- All interactive elements are accessible via keyboard and screen readers.
- The page layout adapts to different screen sizes and devices, ensuring usability on desktop and mobile.

## General Behavior
- All sections update dynamically in response to user actions and context changes.
- Navigation between sections and pages is seamless and preserves user context.
- The Recipe Database page does not expose domain-specific logic; it only provides entry points and summary information.

- All sections update dynamically in response to user actions and context changes.
- Navigation between sections and pages is seamless and preserves user context.
- The Recipe Database page does not expose domain-specific logic; it only provides entry points and summary information.

## User Flow: Adding a New Recipe

1. The user presses the "Add New Recipe" button.
2. The Recipe Creation section is displayed, showing input fields for recipe name, ingredients, instructions, and tags.
3. The user enters the required information into the input fields.
4. The user can optionally add or remove ingredients and tags using dedicated controls.
5. When the user presses the Save button:
	- The new recipe is validated (e.g., required fields must be filled).
	- If validation passes, the recipe is added to the database and immediately appears in the Recipe List section.
	- The Recipe Details section displays the newly created recipe.
	- If validation fails, an error message is shown and the user can correct the input.
6. The user can cancel the creation process at any time, which closes the Recipe Creation section without saving changes.

## User Flow: Editing a Recipe

1. The user selects a recipe from the Recipe List section or through search results.
2. The Recipe Details section displays the selected recipe's information.
3. The user presses the "Edit" button in the Recipe Details section.
4. The Recipe Creation and Editing section is displayed, pre-populated with the current recipe data (name, ingredients, instructions, and tags).
5. The user modifies any of the recipe information using the input fields and controls.
6. The user can add or remove ingredients and tags using dedicated controls.
7. When the user presses the Save button:
   - The modified recipe is validated (e.g., required fields must be filled).
   - If validation passes, the recipe is updated in the database and changes are immediately reflected in the Recipe List and Recipe Details sections.
   - If validation fails, an error message is shown and the user can correct the input.
8. The user can cancel the editing process at any time, which closes the Recipe Creation and Editing section without saving changes and returns to the Recipe Details view.

---
This specification is intended for implementation by any agent or builder app, focusing on functional requirements and user interactions rather than specific UI details.

We start with simple CRUD functionality. 

When entering the Recipe Database Page, we see a list of recipes and we can search.

First functionality will be bare bones but we will make it nicer later.

A recipe has the following properties
* Name -- so we can link to it from the Meal planner and display it there 
* ID or slug
* Ingredients -- for now just plain text, we can convert this to a more sophisticated list later
* Steps -- for now just plain text

## Sample recipes

For bootstrapping purposes, here are some sample recipes:

### Albondigas de Marta

- [ ] 1 kg carne molida de res
- [ ] 2 huevos
- [ ] Medio kilo de jitomate
- [ ] Medio cebolla
- [ ] Cilantro
- [ ] Canela (ramo?)
- [ ] Clavos

Hervir el jitomate con media cebolla y una rama de cilantro, luego muelles en la licuadora y cuelas. Freír con poquito aceite, sal tanto azúcar, canela, 2 clavos, chipotle al gusto. Que espese

Carne crudo de res, 1 kilo, dos huevos, sal y pimienta. Hacer bolitas tamaño al gusto.

Hechas las bolas sin freír al caldo.

### Appelmoes

- [ ] 1 kg appels
- [ ] 50 g suiker
- [ ] 35 ml water 
- [ ] Citroenrasp
- [ ] Kaneel en/of pigment

Schil de appels, verwijder de klokhuizen en snijd de appel in grove stukken. Doe de appelstukjes met het water, het citroenrasp en de suiker in een pan en breng het op middelhoog vuur aan de kook. Laat de appels ongeveer 15 minuten zachtjes doorkoken en roer het mengsel daarbij af en toe om.

Wil je grove appelmoes, pureer de appel dan met een pureestamper, er zullen nog wat kleine stukjes appel te proeven zijn. Wil je een gladde appelmoes, gebruik dan een staafmixer om de moes glad te mixen. 
Breng de appelmoes tot slot op smaak met de kaneel of piment laat afkoelen.

### Broccoli Salad de Leon

- [ ] 500 g broccoli, cut into bite-sized florets
- [ ] 300 g peas, fresh or frozen
- [ ] 1/2 komkommer, cut into slim batons
- [ ] 200 g good-quality feta cheese, crumbled
- [ ] 50 g alfalfa
- [ ] 50 g toasted seeds (we use sesame, sunflower, flax and pumpkin)
- [ ] 1 avocado, cut into pieces
- [ ] 75 g quinoa
- [ ] Small handful flat-leaf parsley, rough chopped
- [ ] Small handful mint, rough chopped
- [ ] 2 dessert spoons lemon juice
- [ ] 4 dessert spoons extra virgin olive oil

Put the quinoa in a small pan. Cover with cold water plus about an inch then let it gently simmer until the water's gone - about 15 minutes. Spread it on a tray to cool to room temperature.
Put an inch of hot water into a saucepan with a pinch of salt and cover it. Once boiling, drop in the broccoli and peas and put the lid back on. Drain after three minutes and run the veg under cold water to take all the heat out and keep them good and green.
Now build your salad in layers, starting with the first ingredient on the list and ending up with the dressing (but only dress it just before you eat it).
