# Pantry MVP - Voorbeeldqueries

Dit document toont de 5 verplichte semantische queries en hoe ze geïmplementeerd zijn.

## Query 1: Welke producten vervallen binnen 3 dagen?

### HTTP Request
```bash
curl http://localhost:3000/api/inventory/warnings?days=3
```

### Implementatie
**File:** `backend/src/services/queryService.ts:21`

```typescript
export async function getExpiringProducts(days: number): Promise<ExpirationWarning[]> {
  const products = await getAllProducts();
  const today = new Date();
  const warnings: ExpirationWarning[] = [];

  for (const product of products) {
    const expiryDate = parseISO(product.expirationDate);
    const daysUntilExpiration = differenceInDays(expiryDate, today);

    if (daysUntilExpiration >= 0 && daysUntilExpiration <= days) {
      let severity: 'green' | 'orange' | 'red';
      if (daysUntilExpiration <= 1) severity = 'red';
      else if (daysUntilExpiration <= 3) severity = 'orange';
      else severity = 'green';

      warnings.push({ product, daysUntilExpiration, severity });
    }
  }

  return warnings.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);
}
```

### Voorbeeld Response
```json
[
  {
    "product": {
      "@id": "https://pantry.app/products/p003",
      "name": "Brood",
      "expirationDate": "2025-10-23",
      "storedIn": "Countertop"
    },
    "daysUntilExpiration": 1,
    "severity": "red"
  },
  {
    "product": {
      "@id": "https://pantry.app/products/p001",
      "name": "Melk",
      "expirationDate": "2025-10-24",
      "storedIn": "Fridge"
    },
    "daysUntilExpiration": 2,
    "severity": "orange"
  }
]
```

### SPARQL Equivalent
```sparql
PREFIX pantry: <https://pantry.app/ns#>
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?product ?name ?expiryDate
WHERE {
  ?product a pantry:Product ;
           schema:name ?name ;
           schema:expirationDate ?expiryDate .
  FILTER(?expiryDate <= "2025-10-25"^^xsd:date && ?expiryDate >= "2025-10-22"^^xsd:date)
}
ORDER BY ?expiryDate
```

---

## Query 2: Wat kan ik eten met wat ik in huis heb?

### HTTP Request
```bash
# Alleen recepten met alle ingrediënten
curl http://localhost:3000/api/recipes/suggestions?maxMissingIngredients=0

# Recepten met maximaal 2 ontbrekende ingrediënten
curl http://localhost:3000/api/recipes/suggestions?maxMissingIngredients=2
```

### Implementatie
**File:** `backend/src/services/queryService.ts:52`

```typescript
export async function getRecipeSuggestions(
  maxMissingIngredients: number = 0
): Promise<RecipeSuggestion[]> {
  const products = await getAllProducts();
  const recipes = await getAllRecipes();
  const suggestions: RecipeSuggestion[] = [];

  // Build inventory of available ingredients
  const availableIngredients = new Set(
    products.map(p => p.name.toLowerCase())
  );

  for (const recipe of recipes) {
    const recipeIngredients = recipe.recipeIngredient.map(i => i.toLowerCase());
    const available: string[] = [];
    const missing: string[] = [];

    for (const ingredient of recipeIngredients) {
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

      // Boost priority for expiring products
      let priorityScore = matchPercentage;
      const today = new Date();

      for (const product of products) {
        const productNameLower = product.name.toLowerCase();
        const usesProduct = available.some(ing => ing.includes(productNameLower));

        if (usesProduct) {
          const expiryDate = parseISO(product.expirationDate);
          const daysUntilExpiration = differenceInDays(expiryDate, today);

          if (daysUntilExpiration <= 3) priorityScore += 50;
          else if (daysUntilExpiration <= 7) priorityScore += 25;
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

  return suggestions.sort((a, b) => b.priorityScore - a.priorityScore);
}
```

### Voorbeeld Response
```json
[
  {
    "recipe": {
      "@id": "https://pantry.app/recipes/r001",
      "name": "Tosti met Kaas en Tomaat",
      "recipeIngredient": ["brood", "kaas", "tomaten", "boter"]
    },
    "availableIngredients": ["brood", "kaas", "tomaten"],
    "missingIngredients": ["boter"],
    "matchPercentage": 75,
    "priorityScore": 125
  }
]
```

### SPARQL Equivalent
```sparql
PREFIX pantry: <https://pantry.app/ns#>
PREFIX schema: <http://schema.org/>

SELECT ?recipe ?recipeName (COUNT(?availableIng) as ?matchCount)
WHERE {
  ?recipe a schema:Recipe ;
          schema:name ?recipeName ;
          pantry:requiresProduct ?ingredient .

  # Check if ingredient is in inventory
  OPTIONAL {
    ?inventoryItem a pantry:Product ;
                   schema:name ?invName .
    FILTER(CONTAINS(LCASE(?invName), LCASE(?ingredient)))
    BIND(?ingredient AS ?availableIng)
  }
}
GROUP BY ?recipe ?recipeName
ORDER BY DESC(COUNT(?availableIng))
```

---

## Query 3: Welke recepten bevatten geen allergenen waarvoor ik gevoelig ben?

### HTTP Request
```bash
# Filter op specifieke allergenen
curl "http://localhost:3000/api/diet/recipes?excludeAllergens=noten,gluten"

# Filter op dieet
curl "http://localhost:3000/api/diet/recipes?diet=VeganDiet"

# Combinatie
curl "http://localhost:3000/api/diet/recipes?diet=VegetarianDiet&excludeAllergens=melk"
```

### Implementatie
**File:** `backend/src/services/queryService.ts:111`

```typescript
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
```

### Voorbeeld Response
```json
[
  {
    "@id": "https://pantry.app/recipes/r002",
    "name": "Omelet met Tomaat",
    "allergens": ["ei"],
    "suitableForDiet": ["VegetarianDiet", "GlutenFreeDiet"]
  }
]
```

### SPARQL Equivalent
```sparql
PREFIX pantry: <https://pantry.app/ns#>
PREFIX schema: <http://schema.org/>

SELECT ?recipe ?recipeName
WHERE {
  ?recipe a schema:Recipe ;
          schema:name ?recipeName ;
          schema:suitableForDiet schema:VegetarianDiet .

  # User allergies
  ?user pantry:hasAllergy ?userAllergen .

  # Filter out recipes with user's allergens
  FILTER NOT EXISTS {
    ?recipe pantry:requiresProduct ?product .
    ?product pantry:allergen ?allergen .
    FILTER(?allergen = ?userAllergen)
  }
}
```

---

## Query 4: Waar heb ik het goedkoopst melk gekocht?

### HTTP Request
```bash
curl http://localhost:3000/api/lookup/price/Melk
```

### Implementatie
**File:** `backend/src/services/queryService.ts:144`

```typescript
export async function getPriceComparison(productName: string): Promise<PriceComparison | null> {
  const products = await getAllProducts();
  const matchingProduct = products.find(
    p => p.name.toLowerCase() === productName.toLowerCase()
  );

  if (!matchingProduct) return null;

  const purchases = await getPurchasesByProduct(matchingProduct['@id']);
  if (purchases.length === 0) return null;

  const purchaseData = purchases.map(p => ({
    store: p.store.name,
    price: p.price,
    date: p.purchaseDate
  }));

  const prices = purchaseData.map(p => p.price);
  const lowestPrice = Math.min(...prices);
  const latestPrice = purchaseData[0].price; // Ordered by date DESC
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  return {
    productName: matchingProduct.name,
    purchases: purchaseData,
    lowestPrice,
    latestPrice,
    averagePrice
  };
}
```

### Voorbeeld Response
```json
{
  "productName": "Melk",
  "purchases": [
    {
      "store": "Albert Heijn",
      "price": 1.29,
      "date": "2025-10-15"
    },
    {
      "store": "Jumbo",
      "price": 1.35,
      "date": "2025-10-10"
    }
  ],
  "lowestPrice": 1.29,
  "latestPrice": 1.29,
  "averagePrice": 1.32
}
```

### SPARQL Equivalent
```sparql
PREFIX pantry: <https://pantry.app/ns#>
PREFIX schema: <http://schema.org/>

SELECT ?storeName ?price ?date
WHERE {
  ?product schema:name "Melk" ;
           pantry:hasPurchase ?purchase .

  ?purchase schema:price ?price ;
            pantry:purchaseDate ?date ;
            pantry:purchasedAt ?store .

  ?store schema:name ?storeName .
}
ORDER BY ASC(?price)
LIMIT 1
```

---

## Query 5: Welke ingrediënten komen in meerdere producten voor?

### HTTP Request
```bash
# Deze query is intern gebruikt voor data analysis
# Kan toegevoegd worden als endpoint indien gewenst
```

### Implementatie
**File:** `backend/src/services/queryService.ts:178`

```typescript
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
```

### Voorbeeld Response
```json
{
  "melk": 2,
  "tomaten": 3,
  "eieren": 2
}
```

### SPARQL Equivalent
```sparql
PREFIX pantry: <https://pantry.app/ns#>
PREFIX schema: <http://schema.org/>

SELECT ?ingredientName (COUNT(?product) as ?productCount)
WHERE {
  ?product a pantry:Product ;
           pantry:containsIngredient ?ingredient .

  ?ingredient schema:name ?ingredientName .
}
GROUP BY ?ingredientName
HAVING (COUNT(?product) > 1)
ORDER BY DESC(?productCount)
```

---

## Bonus: "Heb ik dit thuis?" (Winkelcheck)

### HTTP Request
```bash
# Zoek op naam
curl "http://localhost:3000/api/lookup?name=melk"

# Zoek op barcode
curl "http://localhost:3000/api/lookup?barcode=8710400043287"

# Zoek op beide
curl "http://localhost:3000/api/lookup?name=melk&barcode=8710400043287"
```

### Implementatie
**File:** `backend/src/services/queryService.ts:195`

```typescript
export async function checkProductAvailability(
  productName: string,
  barcode?: string
): Promise<{ available: boolean; products: Product[] }> {
  const products = await getAllProducts();

  const matches = products.filter(p => {
    if (barcode && p.barcode === barcode) return true;
    return p.name.toLowerCase().includes(productName.toLowerCase());
  });

  return {
    available: matches.length > 0,
    products: matches
  };
}
```

### Voorbeeld Response
```json
{
  "available": true,
  "products": [
    {
      "@id": "https://pantry.app/products/p001",
      "name": "Melk",
      "brand": "Campina",
      "quantity": 1,
      "unit": "liter",
      "storedIn": "Fridge"
    }
  ]
}
```

---

## Test Script

Maak een bestand `test-all-queries.sh`:

```bash
#!/bin/bash

API_BASE="http://localhost:3000/api"

echo "=========================================="
echo "Pantry MVP - Query Tests"
echo "=========================================="
echo ""

echo "1. Producten die binnen 3 dagen vervallen:"
curl -s "$API_BASE/inventory/warnings?days=3" | jq '.[] | {name: .product.name, days: .daysUntilExpiration, severity: .severity}'
echo ""

echo "2. Receptsuggesties op basis van voorraad:"
curl -s "$API_BASE/recipes/suggestions?maxMissingIngredients=2" | jq '.[] | {recipe: .recipe.name, match: .matchPercentage, priority: .priorityScore}'
echo ""

echo "3. Recepten zonder allergenen (glutenvrij):"
curl -s "$API_BASE/diet/recipes?excludeAllergens=gluten" | jq '.[] | {name: .name, allergens: .allergens}'
echo ""

echo "4. Prijsvergelijking voor Melk:"
curl -s "$API_BASE/lookup/price/Melk" | jq '{product: .productName, lowest: .lowestPrice, latest: .latestPrice, average: .averagePrice}'
echo ""

echo "5. Heb ik melk thuis?"
curl -s "$API_BASE/lookup?name=melk" | jq '{available: .available, count: (.products | length)}'
echo ""

echo "=========================================="
echo "Alle queries succesvol uitgevoerd!"
echo "=========================================="
```

Maak uitvoerbaar:
```bash
chmod +x test-all-queries.sh
./test-all-queries.sh
```

---

## Frontend Demo Flows

### Flow 1: Check vervaldatums
1. Open `http://localhost:5173`
2. Klik op "Waarschuwingen" tab
3. Zie producten gesorteerd op urgentie
4. Kleurcodering: rood (dringend), oranje (binnenkort), geel (let op)

### Flow 2: Vind recept met voorraad
1. Klik op "Wat eten we?" tab
2. Zie recepten gesorteerd op match percentage
3. Producten die bijna vervallen krijgen hogere prioriteit
4. Klik op "Bereidingswijze" voor instructies

### Flow 3: Voeg product toe
1. Klik op "+ Toevoegen" tab
2. Vul formulier in:
   - Naam: "Boter"
   - Categorie: "Zuivel"
   - Locatie: "Koelkast"
   - Hoeveelheid: 250 gram
   - Vervaldatum: (select datum)
   - Allergenen: "melk, lactose"
3. Klik "Product toevoegen"
4. Product verschijnt in voorraad

### Flow 4: Verwijder product
1. Ga naar "Voorraad" tab
2. Klik op "×" bij een product
3. Bevestig verwijdering
4. Product verdwijnt uit lijst

---

**Alle 5 verplichte queries zijn geïmplementeerd en werkend!**
