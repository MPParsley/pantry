#!/bin/bash

API_BASE="http://localhost:3000/api"

echo "=========================================="
echo "Pantry MVP - Query Tests"
echo "=========================================="
echo ""

echo "1️⃣  Producten die binnen 3 dagen vervallen:"
echo "   GET $API_BASE/inventory/warnings?days=3"
echo ""
curl -s "$API_BASE/inventory/warnings?days=3" | jq '.[] | {name: .product.name, days: .daysUntilExpiration, severity: .severity}'
echo ""
echo "----------------------------------------"
echo ""

echo "2️⃣  Receptsuggesties op basis van voorraad:"
echo "   GET $API_BASE/recipes/suggestions?maxMissingIngredients=2"
echo ""
curl -s "$API_BASE/recipes/suggestions?maxMissingIngredients=2" | jq '.[] | {recipe: .recipe.name, match: .matchPercentage, priority: .priorityScore, missing: .missingIngredients}'
echo ""
echo "----------------------------------------"
echo ""

echo "3️⃣  Recepten zonder allergenen (glutenvrij):"
echo "   GET $API_BASE/diet/recipes?excludeAllergens=gluten"
echo ""
curl -s "$API_BASE/diet/recipes?excludeAllergens=gluten" | jq '.[] | {name: .name, allergens: .allergens, diet: .suitableForDiet}'
echo ""
echo "----------------------------------------"
echo ""

echo "4️⃣  Prijsvergelijking voor Melk:"
echo "   GET $API_BASE/lookup/price/Melk"
echo ""
curl -s "$API_BASE/lookup/price/Melk" | jq '{product: .productName, lowest: .lowestPrice, latest: .latestPrice, average: .averagePrice, purchases: .purchases}'
echo ""
echo "----------------------------------------"
echo ""

echo "5️⃣  Heb ik melk thuis? (Winkelcheck):"
echo "   GET $API_BASE/lookup?name=melk"
echo ""
curl -s "$API_BASE/lookup?name=melk" | jq '{available: .available, count: (.products | length), products: [.products[] | {name: .name, brand: .brand, quantity: .quantity, unit: .unit}]}'
echo ""
echo "----------------------------------------"
echo ""

echo "✅ Bonus: Alle producten in voorraad:"
echo "   GET $API_BASE/inventory"
echo ""
curl -s "$API_BASE/inventory" | jq '.[] | {name: .name, category: .category, location: .storedIn, expires: .expirationDate}'
echo ""
echo "=========================================="
echo "🎉 Alle queries succesvol uitgevoerd!"
echo "=========================================="
