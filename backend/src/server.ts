/**
 * Pantry API Server
 * Main entry point
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initDatabase } from './database.js';

// Import routes
import inventoryRoutes from './routes/inventory.js';
import recipeRoutes from './routes/recipes.js';
import lookupRoutes from './routes/lookup.js';
import dietRoutes from './routes/diet.js';
import purchaseRoutes from './routes/purchases.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/lookup', lookupRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/purchases', purchaseRoutes);

// API documentation
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'Pantry API',
    version: '1.0.0',
    description: 'Smart household pantry assistant with Linked Data capabilities',
    endpoints: {
      inventory: {
        'GET /api/inventory': 'Get all products (filters: expiringSoon, location, category, diet)',
        'GET /api/inventory/warnings': 'Get expiration warnings (query: days)',
        'GET /api/inventory/:id': 'Get specific product',
        'POST /api/inventory': 'Add new product',
        'PUT /api/inventory/:id': 'Update product',
        'DELETE /api/inventory/:id': 'Delete product'
      },
      recipes: {
        'GET /api/recipes': 'Get all recipes (filters: useInventory, diet, allergenFree, maxMissingIngredients)',
        'GET /api/recipes/suggestions': 'Get recipe suggestions based on inventory',
        'GET /api/recipes/:id': 'Get specific recipe',
        'POST /api/recipes': 'Add new recipe',
        'DELETE /api/recipes/:id': 'Delete recipe'
      },
      lookup: {
        'GET /api/lookup': 'Check if product is in inventory (query: name, barcode)',
        'GET /api/lookup/price/:productName': 'Get price comparison for product'
      },
      diet: {
        'GET /api/diet/recipes': 'Get recipes for diet (query: diet, excludeAllergens)',
        'GET /api/diet/profile': 'Get user diet profile',
        'PUT /api/diet/profile': 'Update user diet profile'
      },
      purchases: {
        'POST /api/purchases': 'Record a new purchase',
        'GET /api/purchases/:productId': 'Get purchase history for product'
      }
    },
    linkedData: {
      ontology: 'See ontology.ttl for RDF schema',
      context: 'Uses schema.org and custom pantry namespace',
      sampleData: 'See sample-data.jsonld for examples'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🍎 Pantry API Server                                   ║
║                                                           ║
║   Status: Running                                        ║
║   Port: ${PORT}                                            ║
║   URL: http://localhost:${PORT}                            ║
║                                                           ║
║   API Docs: http://localhost:${PORT}/api                   ║
║   Health: http://localhost:${PORT}/health                  ║
║                                                           ║
║   Using Linked Data with schema.org + pantry ontology    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
