/**
 * Type definitions for Pantry MVP
 * Aligned with ontology.ttl and schema.org
 */

export type DietType =
  | 'VegetarianDiet'
  | 'VeganDiet'
  | 'GlutenFreeDiet'
  | 'LowLactoseDiet'
  | 'KetogenicDiet';

export type StorageLocation =
  | 'Fridge'
  | 'Freezer'
  | 'Pantry'
  | 'Countertop';

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
  '@context': string;
  '@type': 'Product';
  '@id': string;
  name: string;
  brand?: string;
  category: ProductCategory;
  quantity: number;
  unit: string; // 'stuks', 'gram', 'liter', etc.
  expirationDate: string; // ISO 8601 date
  storedIn: StorageLocation;
  barcode?: string;
  allergens?: string[];
  suitableForDiet?: DietType[];
  purchases?: Purchase[];
  addedAt: string; // ISO 8601 datetime
}

export interface Purchase {
  '@context': string;
  '@type': 'Purchase';
  '@id': string;
  product: string; // product @id reference
  purchaseDate: string; // ISO 8601 date
  price: number;
  priceCurrency: string; // 'EUR'
  store: Store;
}

export interface Store {
  '@context': string;
  '@type': 'Store';
  '@id': string;
  name: string;
  address?: string;
}

export interface Recipe {
  '@context': string;
  '@type': 'Recipe';
  '@id': string;
  name: string;
  description?: string;
  recipeIngredient: string[]; // List of ingredient names
  recipeInstructions: string;
  recipeYield: string; // e.g., "4 porties"
  prepTime?: string; // ISO 8601 duration
  cookTime?: string; // ISO 8601 duration
  allergens?: string[];
  suitableForDiet?: DietType[];
  image?: string;
}

export interface UserProfile {
  '@context': string;
  '@type': 'UserProfile';
  '@id': string;
  name: string;
  allergies: string[];
  diets: DietType[];
  expirationWarningDays: number; // Days before expiration to warn
}

export interface InventoryQuery {
  expiringSoon?: boolean;
  location?: StorageLocation;
  category?: ProductCategory;
  diet?: DietType;
}

export interface RecipeQuery {
  useInventory?: boolean; // Only recipes with available ingredients
  diet?: DietType;
  allergenFree?: string[]; // Exclude these allergens
  maxMissingIngredients?: number;
}

export interface PriceComparison {
  productName: string;
  purchases: Array<{
    store: string;
    price: number;
    date: string;
  }>;
  lowestPrice: number;
  latestPrice: number;
  averagePrice: number;
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
  priorityScore: number; // Higher if uses expiring products
}
