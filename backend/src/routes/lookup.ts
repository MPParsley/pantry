/**
 * Lookup routes
 * Endpoint: /api/lookup
 * For "Heb ik dit thuis?" functionality
 */

import { Router, Request, Response } from 'express';
import { checkProductAvailability, getPriceComparison } from '../services/queryService.js';

const router = Router();

/**
 * GET /api/lookup
 * Check if a product is available in inventory
 * Query params: name, barcode
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { name, barcode } = req.query;

    if (!name && !barcode) {
      return res.status(400).json({ error: 'Please provide name or barcode parameter' });
    }

    const result = await checkProductAvailability(
      (name as string) || '',
      barcode as string
    );

    res.json(result);
  } catch (error) {
    console.error('Error looking up product:', error);
    res.status(500).json({ error: 'Failed to lookup product' });
  }
});

/**
 * GET /api/lookup/price/:productName
 * Get price comparison for a product
 */
router.get('/price/:productName', async (req: Request, res: Response) => {
  try {
    const comparison = await getPriceComparison(req.params.productName);

    if (!comparison) {
      return res.status(404).json({ error: 'No price data found for this product' });
    }

    res.json(comparison);
  } catch (error) {
    console.error('Error fetching price comparison:', error);
    res.status(500).json({ error: 'Failed to fetch price comparison' });
  }
});

export default router;
