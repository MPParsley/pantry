export type DietType =
  | 'VegetarianDiet'
  | 'VeganDiet'
  | 'GlutenFreeDiet'
  | 'LowLactoseDiet'
  | 'KetogenicDiet';

export type StorageLocation = 'Fridge' | 'Freezer' | 'Pantry' | 'Countertop';

export type ProductCategory =
  | 'dairy'
  | 'meat'
  | 'fish'
  | 'vegetables'
  | 'fruit'
  | 'grains'
  | 'bakery'
  | 'snacks'
  | 'beverages'
  | 'condiments'
  | 'other';

export interface Product {
  '@id': string;
  name: string;
  brand?: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  expirationDate: string;
  storedIn: StorageLocation;
  barcode?: string;
  allergens?: string[];
  suitableForDiet?: DietType[];
  addedAt: string;
}

export interface Recipe {
  '@id': string;
  name: string;
  description?: string;
  recipeIngredient: string[];
  recipeInstructions: string;
  recipeYield: string;
  prepTime?: string;
  cookTime?: string;
  allergens?: string[];
  suitableForDiet?: DietType[];
  image?: string;
}

export interface ExpirationWarning {
  product: Product;
  daysUntilExpiration: number;
  severity: 'green' | 'orange' | 'red';
}

export interface RecipeSuggestion {
  recipe: Recipe;
  availableIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
  priorityScore: number;
}
