/**
 * Inventory routes
 * Endpoint: /api/inventory
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  createProduct,
  getProduct,
  getAllProducts,
  getProductsByLocation,
  updateProduct,
  deleteProduct,
  getProductsExpiringSoon
} from '../database.js';
import { getExpiringProducts, getProductsForUser } from '../services/queryService.js';
import { Product, InventoryQuery } from '../types.js';

const router = Router();

/**
 * GET /api/inventory
 * Get all products with optional filters
 * Query params: expiringSoon, location, category, diet
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = req.query as unknown as InventoryQuery;

    let products: Product[];

    if (query.expiringSoon) {
      const warnings = await getExpiringProducts(7); // 7 days default
      products = warnings.map(w => w.product);
    } else if (query.location) {
      products = await getProductsByLocation(query.location);
    } else {
      products = await getAllProducts();
    }

    // Filter by category if specified
    if (query.category) {
      products = products.filter(p => p.category === query.category);
    }

    // Filter by user diet preferences
    if (query.diet) {
      products = products.filter(
        p => p.suitableForDiet && p.suitableForDiet.includes(query.diet as any)
      );
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

/**
 * GET /api/inventory/warnings
 * Get expiration warnings
 * Query params: days (default: 7)
 */
router.get('/warnings', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const warnings = await getExpiringProducts(days);
    res.json(warnings);
  } catch (error) {
    console.error('Error fetching warnings:', error);
    res.status(500).json({ error: 'Failed to fetch warnings' });
  }
});

/**
 * GET /api/inventory/:id
 * Get a specific product by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * POST /api/inventory
 * Create a new product
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    const product: Product = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `https://pantry.app/products/${uuidv4()}`,
      name: productData.name,
      brand: productData.brand,
      category: productData.category,
      quantity: productData.quantity,
      unit: productData.unit,
      expirationDate: productData.expirationDate,
      storedIn: productData.storedIn,
      barcode: productData.barcode,
      allergens: productData.allergens || [],
      suitableForDiet: productData.suitableForDiet || [],
      purchases: [],
      addedAt: new Date().toISOString()
    };

    const created = await createProduct(product);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/inventory/:id
 * Update an existing product
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const existing = await getProduct(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updated: Product = {
      ...existing,
      ...req.body,
      '@id': req.params.id // Ensure ID doesn't change
    };

    const result = await updateProduct(req.params.id, updated);
    res.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/inventory/:id
 * Delete a product
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const existing = await getProduct(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
