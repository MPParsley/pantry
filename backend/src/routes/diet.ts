/**
 * Diet routes
 * Endpoint: /api/diet
 */

import { Router, Request, Response } from 'express';
import { getRecipesByDiet } from '../services/queryService.js';
import { getUserProfile, saveUserProfile } from '../database.js';
import { UserProfile, DietType } from '../types.js';

const router = Router();

/**
 * GET /api/diet/recipes
 * Get recipes suitable for user's diet preferences
 * Query params: diet, excludeAllergens
 */
router.get('/recipes', async (req: Request, res: Response) => {
  try {
    const diet = req.query.diet as DietType | undefined;
    const excludeAllergens = req.query.excludeAllergens
      ? (req.query.excludeAllergens as string).split(',')
      : undefined;

    const recipes = await getRecipesByDiet(diet, excludeAllergens);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching diet recipes:', error);
    res.status(500).json({ error: 'Failed to fetch diet recipes' });
  }
});

/**
 * GET /api/diet/profile
 * Get user's diet profile
 */
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const profile = await getUserProfile();
    res.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

/**
 * PUT /api/diet/profile
 * Update user's diet profile
 */
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const profileData = req.body;

    const profile: UserProfile = {
      '@context': 'https://pantry.app/ns#',
      '@type': 'UserProfile',
      '@id': 'https://pantry.app/users/default',
      name: profileData.name || 'Default User',
      allergies: profileData.allergies || [],
      diets: profileData.diets || [],
      expirationWarningDays: profileData.expirationWarningDays || 7
    };

    const saved = await saveUserProfile(profile);
    res.json(saved);
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ error: 'Failed to save user profile' });
  }
});

export default router;
