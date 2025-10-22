/**
 * Recipe routes
 * Endpoint: /api/recipes
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createRecipe, getRecipe, getAllRecipes, deleteRecipe } from '../database.js';
import { getRecipeSuggestions, getRecipesByDiet } from '../services/queryService.js';
import { Recipe, RecipeQuery } from '../types.js';

const router = Router();

/**
 * GET /api/recipes
 * Get all recipes with optional filters
 * Query params: useInventory, diet, allergenFree, maxMissingIngredients
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = req.query as unknown as RecipeQuery;

    if (query.useInventory) {
      // Return recipe suggestions based on available inventory
      const maxMissing = query.maxMissingIngredients || 0;
      const suggestions = await getRecipeSuggestions(maxMissing);
      res.json(suggestions);
    } else if (query.diet || query.allergenFree) {
      // Filter by diet and allergens
      const allergens = query.allergenFree
        ? (Array.isArray(query.allergenFree) ? query.allergenFree : [query.allergenFree])
        : undefined;
      const recipes = await getRecipesByDiet(query.diet, allergens);
      res.json(recipes);
    } else {
      // Return all recipes
      const recipes = await getAllRecipes();
      res.json(recipes);
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

/**
 * GET /api/recipes/suggestions
 * Get recipe suggestions based on current inventory
 * Query params: maxMissingIngredients (default: 0)
 */
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const maxMissing = parseInt(req.query.maxMissingIngredients as string) || 0;
    const suggestions = await getRecipeSuggestions(maxMissing);
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch recipe suggestions' });
  }
});

/**
 * GET /api/recipes/:id
 * Get a specific recipe by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const recipe = await getRecipe(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

/**
 * POST /api/recipes
 * Create a new recipe
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const recipeData = req.body;

    const recipe: Recipe = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      '@id': `https://pantry.app/recipes/${uuidv4()}`,
      name: recipeData.name,
      description: recipeData.description,
      recipeIngredient: recipeData.recipeIngredient,
      recipeInstructions: recipeData.recipeInstructions,
      recipeYield: recipeData.recipeYield,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      allergens: recipeData.allergens || [],
      suitableForDiet: recipeData.suitableForDiet || [],
      image: recipeData.image
    };

    const created = await createRecipe(recipe);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

/**
 * DELETE /api/recipes/:id
 * Delete a recipe
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const existing = await getRecipe(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await deleteRecipe(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;
