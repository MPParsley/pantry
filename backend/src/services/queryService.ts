/**
 * Query service for semantic queries on pantry data
 * Implements SPARQL-like functionality
 */

import { differenceInDays, parseISO } from 'date-fns';
import {
  Product,
  Recipe,
  UserProfile,
  ExpirationWarning,
  RecipeSuggestion,
  PriceComparison,
  DietType
} from '../types.js';
import {
  getAllProducts,
  getAllRecipes,
  getPurchasesByProduct,
  getUserProfile
} from '../database.js';

/**
 * Query 1: Welke producten vervallen binnen X dagen?
 */
export async function getExpiringProducts(days: number): Promise<ExpirationWarning[]> {
  const products = await getAllProducts();
  const today = new Date();
  const warnings: ExpirationWarning[] = [];

  for (const product of products) {
    const expiryDate = parseISO(product.expirationDate);
    const daysUntilExpiration = differenceInDays(expiryDate, today);

    if (daysUntilExpiration >= 0 && daysUntilExpiration <= days) {
      let severity: 'green' | 'orange' | 'red';
      if (daysUntilExpiration <= 1) {
        severity = 'red';
      } else if (daysUntilExpiration <= 3) {
        severity = 'orange';
      } else {
        severity = 'green';
      }

      warnings.push({
        product,
        daysUntilExpiration,
        severity
      });
    }
  }

  return warnings.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);
}

/**
 * Query 2: Wat kan ik eten met wat ik in huis heb?
 * Returns recipes that can be made with available ingredients
 */
export async function getRecipeSuggestions(
  maxMissingIngredients: number = 0
): Promise<RecipeSuggestion[]> {
  const products = await getAllProducts();
  const recipes = await getAllRecipes();
  const suggestions: RecipeSuggestion[] = [];

  // Build inventory of available ingredients (normalized to lowercase)
  const availableIngredients = new Set(
    products.map(p => p.name.toLowerCase())
  );

  for (const recipe of recipes) {
    const recipeIngredients = recipe.recipeIngredient.map(i => i.toLowerCase());
    const available: string[] = [];
    const missing: string[] = [];

    for (const ingredient of recipeIngredients) {
      // Simple matching - check if any product name contains the ingredient
      const isAvailable = Array.from(availableIngredients).some(inv =>
        inv.includes(ingredient) || ingredient.includes(inv)
      );

      if (isAvailable) {
        available.push(ingredient);
      } else {
        missing.push(ingredient);
      }
    }

    if (missing.length <= maxMissingIngredients) {
      const matchPercentage = (available.length / recipeIngredients.length) * 100;

      // Calculate priority score based on expiring ingredients
      let priorityScore = matchPercentage;
      const today = new Date();

      for (const product of products) {
        const productNameLower = product.name.toLowerCase();
        const usesProduct = available.some(ing => ing.includes(productNameLower));

        if (usesProduct) {
          const expiryDate = parseISO(product.expirationDate);
          const daysUntilExpiration = differenceInDays(expiryDate, today);

          // Boost priority for expiring products
          if (daysUntilExpiration <= 3) {
            priorityScore += 50;
          } else if (daysUntilExpiration <= 7) {
            priorityScore += 25;
          }
        }
      }

      suggestions.push({
        recipe,
        availableIngredients: available,
        missingIngredients: missing,
        matchPercentage,
        priorityScore
      });
    }
  }

  // Sort by priority score (highest first)
  return suggestions.sort((a, b) => b.priorityScore - a.priorityScore);
}

/**
 * Query 3: Welke recepten bevatten geen allergenen waarvoor ik gevoelig ben?
 */
export async function getRecipesByDiet(
  diet?: DietType,
  excludeAllergens?: string[]
): Promise<Recipe[]> {
  const recipes = await getAllRecipes();
  const userProfile = await getUserProfile();

  // Combine user profile allergies with query parameter
  const allergiesToExclude = new Set([
    ...(excludeAllergens || []),
    ...(userProfile?.allergies || [])
  ].map(a => a.toLowerCase()));

  return recipes.filter(recipe => {
    // Check diet compatibility
    if (diet && recipe.suitableForDiet) {
      if (!recipe.suitableForDiet.includes(diet)) {
        return false;
      }
    }

    // Check allergens
    if (allergiesToExclude.size > 0 && recipe.allergens) {
      const hasAllergen = recipe.allergens.some(allergen =>
        allergiesToExclude.has(allergen.toLowerCase())
      );
      if (hasAllergen) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Query 4: Waar heb ik het goedkoopst [product] gekocht?
 */
export async function getPriceComparison(productName: string): Promise<PriceComparison | null> {
  const products = await getAllProducts();
  const matchingProduct = products.find(
    p => p.name.toLowerCase() === productName.toLowerCase()
  );

  if (!matchingProduct) {
    return null;
  }

  const purchases = await getPurchasesByProduct(matchingProduct['@id']);

  if (purchases.length === 0) {
    return null;
  }

  const purchaseData = purchases.map(p => ({
    store: p.store.name,
    price: p.price,
    date: p.purchaseDate
  }));

  const prices = purchaseData.map(p => p.price);
  const lowestPrice = Math.min(...prices);
  const latestPrice = purchaseData[0].price; // Purchases are ordered by date DESC
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  return {
    productName: matchingProduct.name,
    purchases: purchaseData,
    lowestPrice,
    latestPrice,
    averagePrice
  };
}

/**
 * Query 5: Welke ingrediënten komen in meerdere producten voor?
 * (Simplified: which products share the same name/category)
 */
export async function getCommonIngredients(): Promise<Map<string, number>> {
  const products = await getAllProducts();
  const ingredientCount = new Map<string, number>();

  for (const product of products) {
    const ingredient = product.name.toLowerCase();
    ingredientCount.set(ingredient, (ingredientCount.get(ingredient) || 0) + 1);
  }

  // Filter to only ingredients that appear more than once
  const commonIngredients = new Map(
    Array.from(ingredientCount.entries()).filter(([_, count]) => count > 1)
  );

  return commonIngredients;
}

/**
 * Check if a product is in the pantry (for "Heb ik dit thuis?" feature)
 */
export async function checkProductAvailability(
  productName: string,
  barcode?: string
): Promise<{ available: boolean; products: Product[] }> {
  const products = await getAllProducts();

  const matches = products.filter(p => {
    if (barcode && p.barcode === barcode) {
      return true;
    }
    return p.name.toLowerCase().includes(productName.toLowerCase());
  });

  return {
    available: matches.length > 0,
    products: matches
  };
}

/**
 * Get products filtered by user preferences
 */
export async function getProductsForUser(userId?: string): Promise<Product[]> {
  const products = await getAllProducts();
  const userProfile = await getUserProfile();

  if (!userProfile) {
    return products;
  }

  // Filter out products that contain user's allergens
  return products.filter(product => {
    if (product.allergens && userProfile.allergies) {
      const hasAllergen = product.allergens.some(allergen =>
        userProfile.allergies.some(
          userAllergen => userAllergen.toLowerCase() === allergen.toLowerCase()
        )
      );
      if (hasAllergen) {
        return false;
      }
    }
    return true;
  });
}
