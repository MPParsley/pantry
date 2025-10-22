/**
 * Seed script to populate database with sample data
 */

import {
  initDatabase,
  createProduct,
  createRecipe,
  createPurchase,
  createStore,
  saveUserProfile,
  closeDatabase
} from './database.js';
import { Product, Recipe, Purchase, Store, UserProfile } from './types.js';

async function seed() {
  console.log('🌱 Seeding database with sample data...\n');

  await initDatabase();

  // Create stores
  const stores: Store[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Store',
      '@id': 'https://pantry.app/stores/s001',
      name: 'Albert Heijn',
      address: 'Kalverstraat 123, Amsterdam'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Store',
      '@id': 'https://pantry.app/stores/s002',
      name: 'Jumbo',
      address: 'Hoofdstraat 45, Utrecht'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Store',
      '@id': 'https://pantry.app/stores/s003',
      name: 'Bakkerij van de Hoek',
      address: 'Dorpsplein 7, Haarlem'
    }
  ];

  for (const store of stores) {
    await createStore(store);
  }
  console.log(`✅ Created ${stores.length} stores`);

  // Create products
  const products: Product[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': 'https://pantry.app/products/p001',
      name: 'Melk',
      brand: 'Campina',
      category: 'dairy',
      quantity: 1,
      unit: 'liter',
      expirationDate: '2025-10-24',
      storedIn: 'Fridge',
      barcode: '8710400043287',
      allergens: ['melk', 'lactose'],
      suitableForDiet: [],
      addedAt: '2025-10-15T10:30:00Z'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': 'https://pantry.app/products/p002',
      name: 'Eieren',
      brand: 'Rondeel',
      category: 'dairy',
      quantity: 6,
      unit: 'stuks',
      expirationDate: '2025-10-30',
      storedIn: 'Fridge',
      barcode: '8710400123456',
      allergens: ['ei'],
      suitableForDiet: ['VegetarianDiet'],
      addedAt: '2025-10-18T14:00:00Z'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': 'https://pantry.app/products/p003',
      name: 'Brood',
      brand: 'Bakker Bart',
      category: 'bakery',
      quantity: 1,
      unit: 'stuks',
      expirationDate: '2025-10-23',
      storedIn: 'Countertop',
      allergens: ['gluten'],
      suitableForDiet: ['VegetarianDiet'],
      addedAt: '2025-10-22T08:15:00Z'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': 'https://pantry.app/products/p004',
      name: 'Tomaten',
      category: 'vegetables',
      quantity: 500,
      unit: 'gram',
      expirationDate: '2025-10-27',
      storedIn: 'Fridge',
      allergens: [],
      suitableForDiet: ['VegetarianDiet', 'VeganDiet', 'GlutenFreeDiet'],
      addedAt: '2025-10-20T16:00:00Z'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': 'https://pantry.app/products/p005',
      name: 'Kaas',
      brand: 'Beemster',
      category: 'dairy',
      quantity: 200,
      unit: 'gram',
      expirationDate: '2025-11-10',
      storedIn: 'Fridge',
      barcode: '8710400567890',
      allergens: ['melk', 'lactose'],
      suitableForDiet: ['VegetarianDiet'],
      addedAt: '2025-10-19T12:00:00Z'
    }
  ];

  for (const product of products) {
    await createProduct(product);
  }
  console.log(`✅ Created ${products.length} products`);

  // Create purchases
  const purchases: Purchase[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Purchase',
      '@id': 'https://pantry.app/purchases/pur001',
      product: 'https://pantry.app/products/p001',
      purchaseDate: '2025-10-15',
      price: 1.29,
      priceCurrency: 'EUR',
      store: stores[0]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Purchase',
      '@id': 'https://pantry.app/purchases/pur002',
      product: 'https://pantry.app/products/p002',
      purchaseDate: '2025-10-18',
      price: 3.49,
      priceCurrency: 'EUR',
      store: stores[1]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Purchase',
      '@id': 'https://pantry.app/purchases/pur003',
      product: 'https://pantry.app/products/p003',
      purchaseDate: '2025-10-22',
      price: 2.15,
      priceCurrency: 'EUR',
      store: stores[2]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Purchase',
      '@id': 'https://pantry.app/purchases/pur004',
      product: 'https://pantry.app/products/p004',
      purchaseDate: '2025-10-20',
      price: 1.99,
      priceCurrency: 'EUR',
      store: stores[0]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Purchase',
      '@id': 'https://pantry.app/purchases/pur005',
      product: 'https://pantry.app/products/p005',
      purchaseDate: '2025-10-19',
      price: 4.29,
      priceCurrency: 'EUR',
      store: stores[1]
    }
  ];

  for (const purchase of purchases) {
    await createPurchase(purchase);
  }
  console.log(`✅ Created ${purchases.length} purchases`);

  // Create recipes
  const recipes: Recipe[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      '@id': 'https://pantry.app/recipes/r001',
      name: 'Tosti met Kaas en Tomaat',
      description: 'Klassieke Nederlandse tosti met kaas en verse tomaat',
      recipeIngredient: ['brood', 'kaas', 'tomaten', 'boter'],
      recipeInstructions:
        "1. Verwarm de tosti-ijzer of pan. 2. Besmeer het brood met boter. 3. Beleg met kaas en plakjes tomaat. 4. Grill tot het brood knapperig is en de kaas gesmolten. 5. Serveer warm.",
      recipeYield: '1 portie',
      prepTime: 'PT5M',
      cookTime: 'PT5M',
      allergens: ['gluten', 'melk'],
      suitableForDiet: ['VegetarianDiet']
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      '@id': 'https://pantry.app/recipes/r002',
      name: 'Omelet met Tomaat',
      description: 'Gezonde omelet met verse tomaat',
      recipeIngredient: ['eieren', 'tomaten', 'zout', 'peper', 'olijfolie'],
      recipeInstructions:
        "1. Klop 2-3 eieren los met zout en peper. 2. Snijd tomaten in blokjes. 3. Verhit olijfolie in een pan. 4. Giet het ei in de pan en laat stollen. 5. Voeg tomatenblokjes toe. 6. Vouw de omelet dubbel en serveer.",
      recipeYield: '1 portie',
      prepTime: 'PT5M',
      cookTime: 'PT7M',
      allergens: ['ei'],
      suitableForDiet: ['VegetarianDiet', 'GlutenFreeDiet']
    }
  ];

  for (const recipe of recipes) {
    await createRecipe(recipe);
  }
  console.log(`✅ Created ${recipes.length} recipes`);

  // Create user profile
  const userProfile: UserProfile = {
    '@context': 'https://pantry.app/ns#',
    '@type': 'UserProfile',
    '@id': 'https://pantry.app/users/default',
    name: 'Default User',
    allergies: ['noten'],
    diets: ['VegetarianDiet'],
    expirationWarningDays: 7
  };

  await saveUserProfile(userProfile);
  console.log('✅ Created user profile\n');

  console.log('✅ Database seeded successfully!\n');

  closeDatabase();
}

seed().catch(error => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
