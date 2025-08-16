// Service layer exports and initialization
// Provides convenient access to all storage services and sample data

import { LocalStorageService } from './LocalStorageService'
import { RecipeSchema, ComidasWeekSchema, FamilyMemberSchema } from '../types/schemas'
import type { Recipe, ComidasWeek, FamilyMember } from '../types/schemas'

// Storage keys for localStorage
const STORAGE_KEYS = {
  RECIPES: 'comidas_recipes',
  COMIDAS_WEEKS: 'comidas_weeks', 
  FAMILY_MEMBERS: 'comidas_family_members'
} as const

// Create service instances
export const recipeService = new LocalStorageService<Recipe>(
  STORAGE_KEYS.RECIPES,
  RecipeSchema
)

export const comidasWeekService = new LocalStorageService<ComidasWeek>(
  STORAGE_KEYS.COMIDAS_WEEKS,
  ComidasWeekSchema
)

export const familyMemberService = new LocalStorageService<FamilyMember>(
  STORAGE_KEYS.FAMILY_MEMBERS,
  FamilyMemberSchema
)

// Sample recipe data from architecture specification
const SAMPLE_RECIPES: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Albondigas de Marta",
    ingredients: `1 kg carne molida de res
2 huevos
Medio kilo de jitomate
Medio cebolla
Cilantro
Canela (ramo?)
Clavos`,
    steps: `Hervir el jitomate con media cebolla y una rama de cilantro, luego muelles en la licuadora y cuelas. Freír con poquito aceite, sal tanto azúcar, canela, 2 clavos, chipotle al gusto. Que espese

Carne crudo de res, 1 kilo, dos huevos, sal y pimienta. Hacer bolitas tamaño al gusto.

Hechas las bolas sin freír al caldo.`
  },
  {
    name: "Appelmoes", 
    ingredients: `1 kg appels
50 g suiker
35 ml water 
Citroenrasp
Kaneel en/of pigment`,
    steps: `Schil de appels, verwijder de klokhuizen en snijd de appel in grove stukken. Doe de appelstukjes met het water, het citroenrasp en de suiker in een pan en breng het op middelhoog vuur aan de kook. Laat de appels ongeveer 15 minuten zachtjes doorkoken en roer het mengsel daarbij af en toe om.

Wil je grove appelmoes, pureer de appel dan met een pureestamper, er zullen nog wat kleine stukjes appel te proeven zijn. Wil je een gladde appelmoes, gebruik dan een staafmixer om de moes glad te mixen. 
Breng de appelmoes tot slot op smaak met de kaneel of piment laat afkoelen.`
  },
  {
    name: "Broccoli Salad de Leon",
    ingredients: `500 g broccoli, cut into bite-sized florets
300 g peas, fresh or frozen
1/2 komkommer, cut into slim batons
200 g good-quality feta cheese, crumbled
50 g alfalfa
50 g toasted seeds (we use sesame, sunflower, flax and pumpkin)
1 avocado, cut into pieces
75 g quinoa
Small handful flat-leaf parsley, rough chopped
Small handful mint, rough chopped
2 dessert spoons lemon juice
4 dessert spoons extra virgin olive oil`,
    steps: `Put the quinoa in a small pan. Cover with cold water plus about an inch then let it gently simmer until the water's gone - about 15 minutes. Spread it on a tray to cool to room temperature.

Put an inch of hot water into a saucepan with a pinch of salt and cover it. Once boiling, drop in the broccoli and peas and put the lid back on. Drain after three minutes and run the veg under cold water to take all the heat out and keep them good and green.

Now build your salad in layers, starting with the first ingredient on the list and ending up with the dressing (but only dress it just before you eat it).`
  }
]

// Bootstrap function to initialize sample data
export async function initializeSampleData(): Promise<void> {
  try {
    const existingRecipes = await recipeService.getAll()
    
    if (existingRecipes.length === 0) {
      for (const recipe of SAMPLE_RECIPES) {
        await recipeService.create(recipe)
      }
      console.log('Sample recipes initialized successfully')
    }
  } catch (error) {
    console.error('Failed to initialize sample data:', error)
    throw error
  }
}

// Export service types for consumption
export type { Recipe, ComidasWeek, FamilyMember } from '../types/schemas'
export { StorageError, ValidationError } from './StorageService'
export type { StorageService, StorageServiceWithSearch } from './StorageService'