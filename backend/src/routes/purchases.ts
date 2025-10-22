/**
 * Purchase routes
 * Endpoint: /api/purchases
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createPurchase, getPurchasesByProduct, createStore } from '../database.js';
import { Purchase, Store } from '../types.js';

const router = Router();

/**
 * POST /api/purchases
 * Record a new purchase
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const purchaseData = req.body;

    // Create or get store
    const store: Store = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      '@id': `https://pantry.app/stores/${uuidv4()}`,
      name: purchaseData.storeName,
      address: purchaseData.storeAddress
    };

    await createStore(store);

    const purchase: Purchase = {
      '@context': 'https://schema.org',
      '@type': 'Purchase',
      '@id': `https://pantry.app/purchases/${uuidv4()}`,
      product: purchaseData.productId,
      purchaseDate: purchaseData.purchaseDate || new Date().toISOString().split('T')[0],
      price: purchaseData.price,
      priceCurrency: purchaseData.priceCurrency || 'EUR',
      store: store
    };

    const created = await createPurchase(purchase);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

/**
 * GET /api/purchases/:productId
 * Get all purchases for a specific product
 */
router.get('/:productId', async (req: Request, res: Response) => {
  try {
    const purchases = await getPurchasesByProduct(req.params.productId);
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

export default router;
