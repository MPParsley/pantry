/**
 * Database layer using SQLite with JSON-LD support
 */

import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { Product, Recipe, Purchase, Store, UserProfile } from './types.js';

const db = new sqlite3.Database('./pantry.db');

// Promisify database methods
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

/**
 * Initialize database schema
 */
export async function initDatabase(): Promise<void> {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      expirationDate TEXT NOT NULL,
      storedIn TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      productId TEXT NOT NULL,
      purchaseDate TEXT NOT NULL,
      price REAL NOT NULL,
      storeName TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for common queries
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_products_expiration ON products(expirationDate)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_products_location ON products(storedIn)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_purchases_product ON purchases(productId)`);

  console.log('✅ Database initialized');
}

// ============================================
// PRODUCT OPERATIONS
// ============================================

export async function createProduct(product: Product): Promise<Product> {
  const data = JSON.stringify(product);
  await dbRun(
    `INSERT INTO products (id, data, name, category, expirationDate, storedIn)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [product['@id'], data, product.name, product.category, product.expirationDate, product.storedIn]
  );
  return product;
}

export async function getProduct(id: string): Promise<Product | null> {
  const row = await dbGet(`SELECT data FROM products WHERE id = ?`, [id]);
  return row ? JSON.parse(row.data) : null;
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await dbAll(`SELECT data FROM products ORDER BY expirationDate ASC`);
  return rows.map((row: any) => JSON.parse(row.data));
}

export async function getProductsByLocation(location: string): Promise<Product[]> {
  const rows = await dbAll(
    `SELECT data FROM products WHERE storedIn = ? ORDER BY expirationDate ASC`,
    [location]
  );
  return rows.map((row: any) => JSON.parse(row.data));
}

export async function getProductsExpiringSoon(days: number): Promise<Product[]> {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  const targetDateStr = targetDate.toISOString().split('T')[0];

  const rows = await dbAll(
    `SELECT data FROM products
     WHERE expirationDate <= ? AND expirationDate >= date('now')
     ORDER BY expirationDate ASC`,
    [targetDateStr]
  );
  return rows.map((row: any) => JSON.parse(row.data));
}

export async function updateProduct(id: string, product: Product): Promise<Product> {
  const data = JSON.stringify(product);
  await dbRun(
    `UPDATE products
     SET data = ?, name = ?, category = ?, expirationDate = ?, storedIn = ?
     WHERE id = ?`,
    [data, product.name, product.category, product.expirationDate, product.storedIn, id]
  );
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  await dbRun(`DELETE FROM products WHERE id = ?`, [id]);
  await dbRun(`DELETE FROM purchases WHERE productId = ?`, [id]);
}

// ============================================
// RECIPE OPERATIONS
// ============================================

export async function createRecipe(recipe: Recipe): Promise<Recipe> {
  const data = JSON.stringify(recipe);
  await dbRun(
    `INSERT INTO recipes (id, data, name) VALUES (?, ?, ?)`,
    [recipe['@id'], data, recipe.name]
  );
  return recipe;
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const row = await dbGet(`SELECT data FROM recipes WHERE id = ?`, [id]);
  return row ? JSON.parse(row.data) : null;
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const rows = await dbAll(`SELECT data FROM recipes ORDER BY name ASC`);
  return rows.map((row: any) => JSON.parse(row.data));
}

export async function deleteRecipe(id: string): Promise<void> {
  await dbRun(`DELETE FROM recipes WHERE id = ?`, [id]);
}

// ============================================
// PURCHASE OPERATIONS
// ============================================

export async function createPurchase(purchase: Purchase): Promise<Purchase> {
  const data = JSON.stringify(purchase);
  await dbRun(
    `INSERT INTO purchases (id, data, productId, purchaseDate, price, storeName)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      purchase['@id'],
      data,
      purchase.product,
      purchase.purchaseDate,
      purchase.price,
      purchase.store.name
    ]
  );
  return purchase;
}

export async function getPurchasesByProduct(productId: string): Promise<Purchase[]> {
  const rows = await dbAll(
    `SELECT data FROM purchases WHERE productId = ? ORDER BY purchaseDate DESC`,
    [productId]
  );
  return rows.map((row: any) => JSON.parse(row.data));
}

// ============================================
// STORE OPERATIONS
// ============================================

export async function createStore(store: Store): Promise<Store> {
  const data = JSON.stringify(store);
  await dbRun(
    `INSERT OR REPLACE INTO stores (id, data, name) VALUES (?, ?, ?)`,
    [store['@id'], data, store.name]
  );
  return store;
}

export async function getStore(id: string): Promise<Store | null> {
  const row = await dbGet(`SELECT data FROM stores WHERE id = ?`, [id]);
  return row ? JSON.parse(row.data) : null;
}

export async function getAllStores(): Promise<Store[]> {
  const rows = await dbAll(`SELECT data FROM stores ORDER BY name ASC`);
  return rows.map((row: any) => JSON.parse(row.data));
}

// ============================================
// USER PROFILE OPERATIONS
// ============================================

export async function saveUserProfile(profile: UserProfile): Promise<UserProfile> {
  const data = JSON.stringify(profile);
  await dbRun(
    `INSERT OR REPLACE INTO user_profile (id, data, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)`,
    [profile['@id'], data]
  );
  return profile;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const row = await dbGet(`SELECT data FROM user_profile ORDER BY updated_at DESC LIMIT 1`);
  return row ? JSON.parse(row.data) : null;
}

// ============================================
// CLEANUP
// ============================================

export function closeDatabase(): void {
  db.close();
}
