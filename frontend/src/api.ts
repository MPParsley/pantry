/**
 * API client for Pantry backend
 */

import { Product, Recipe, ExpirationWarning, RecipeSuggestion } from './types';

const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Inventory
export const getInventory = () => fetchApi<Product[]>('/inventory');

export const getExpirationWarnings = (days: number = 7) =>
  fetchApi<ExpirationWarning[]>(`/inventory/warnings?days=${days}`);

export const createProduct = (product: Partial<Product>) =>
  fetchApi<Product>('/inventory', {
    method: 'POST',
    body: JSON.stringify(product)
  });

export const deleteProduct = (id: string) =>
  fetchApi<void>(`/inventory/${id}`, { method: 'DELETE' });

// Recipes
export const getRecipes = () => fetchApi<Recipe[]>('/recipes');

export const getRecipeSuggestions = (maxMissingIngredients: number = 0) =>
  fetchApi<RecipeSuggestion[]>(
    `/recipes/suggestions?maxMissingIngredients=${maxMissingIngredients}`
  );

export const createRecipe = (recipe: Partial<Recipe>) =>
  fetchApi<Recipe>('/recipes', {
    method: 'POST',
    body: JSON.stringify(recipe)
  });

// Lookup
export const checkProductAvailability = (name: string, barcode?: string) => {
  const params = new URLSearchParams({ name });
  if (barcode) params.append('barcode', barcode);
  return fetchApi<{ available: boolean; products: Product[] }>(
    `/lookup?${params.toString()}`
  );
};
