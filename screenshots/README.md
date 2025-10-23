# Pantry MVP - Screenshots & Demo

Deze directory bevat screenshots en demo's van de Pantry applicatie.

## 📸 Bestanden

### Standalone HTML Demo
**`demo.html`** - Volledig werkende UI demo zonder backend
- Open in browser: `file:///path/to/pantry/screenshots/demo.html`
- Of via HTTP server: `python3 -m http.server 8080` → http://localhost:8080/screenshots/demo.html
- Toont alle 4 tabs: Voorraad, Waarschuwingen, Recepten, Product Toevoegen
- Gebruikt echte data uit sample-data.jsonld
- Volledig responsive met TailwindCSS

### API Response Screenshots
**`api-responses/`** - JSON responses van alle API endpoints

| Bestand | Endpoint | Beschrijving |
|---------|----------|--------------|
| `01-inventory-all.json` | `GET /api/inventory` | Alle producten in voorraad (5 items) |
| `02-inventory-warnings.json` | `GET /api/inventory/warnings?days=7` | Vervaldatum waarschuwingen (4 items) |
| `03-recipe-suggestions.json` | `GET /api/recipes/suggestions` | Receptsuggesties op basis van voorraad |
| `04-diet-recipes-glutenfree.json` | `GET /api/diet/recipes?excludeAllergens=gluten` | Glutenvrije recepten |
| `05-price-comparison-melk.json` | `GET /api/lookup/price/Melk` | Prijsvergelijking voor Melk |
| `06-lookup-product.json` | `GET /api/lookup?name=melk` | Product beschikbaarheid check |

## 🎨 Demo HTML Features

### Screen 1: Voorraad Tab
- ✅ Producten gegroepeerd per locatie (Koelkast, Aanrecht)
- ✅ Kleurcodering: Rood (≤1 dag), Wit (>1 dag)
- ✅ Product cards met:
  - Naam en merk
  - Hoeveelheid en eenheid
  - Vervaldatum met dagen count
  - Allergenen warning
  - Delete knop (×)

### Screen 2: Waarschuwingen Tab
- ✅ Gesorteerd op urgentie (meest urgent eerst)
- ✅ Kleurgecodeerde waarschuwingen:
  - 🔴 Rood: "Dringend" (0-1 dagen)
  - 🟠 Oranje: "Binnenkort" (2-3 dagen)
  - 🟡 Geel: "Let op" (4-7 dagen)
- ✅ Tijdsindicatie: "VANDAAG!", "MORGEN!", "Nog X dagen"
- ✅ Tip box met link naar recepten

### Screen 3: Wat eten we? Tab
- ✅ Receptsuggestie met 75% match
- ✅ Match percentage indicator (groot, rechts)
- ✅ Recipe metadata (👥 porties, ⏱️ prep, 🔥 cook)
- ✅ Twee-kolom layout:
  - ✅ Beschikbaar ingrediënten (groen)
  - ❌ Ontbrekende ingrediënten (oranje)
- ✅ Expandable bereidingswijze (details)
- ✅ Dieet tags (VegetarianDiet) en allergeen warnings (⚠️ gluten, ⚠️ melk)

### Screen 4: Product Toevoegen Tab
- ✅ Volledig formulier met alle velden:
  - Productnaam * (required)
  - Merk
  - Categorie * (dropdown)
  - Locatie * (dropdown)
  - Hoeveelheid * + Eenheid *
  - Houdbaarheidsdatum * (date picker)
  - Barcode
  - Allergenen (komma gescheiden)
  - Dieet checkboxes (5 opties)
- ✅ Validatie (required fields gemarkeerd met *)
- ✅ Groene submit button

## 🖼️ Hoe Screenshots Maken

### Methode 1: Open demo.html in Browser

```bash
# Optie A: Direct openen
open screenshots/demo.html  # macOS
xdg-open screenshots/demo.html  # Linux
start screenshots/demo.html  # Windows

# Optie B: Via HTTP server
cd screenshots
python3 -m http.server 8080
# Open http://localhost:8080/demo.html

# Optie C: Via Node.js
npx http-server screenshots
# Open http://localhost:8080/demo.html
```

### Methode 2: Screenshot Tools

**Chrome/Edge DevTools:**
1. Open demo.html in browser
2. F12 → Open DevTools
3. Cmd/Ctrl + Shift + P
4. Type "Capture full size screenshot"
5. Hit Enter

**Firefox:**
1. Open demo.html
2. F12 → Open DevTools
3. Click screenshot icon (camera)
4. Choose "Save full page"

**macOS:**
- Full screen: `Cmd + Shift + 3`
- Selection: `Cmd + Shift + 4`
- Window: `Cmd + Shift + 4` → Space → click window

**Windows:**
- Snipping Tool: `Windows + Shift + S`
- Full screen: `PrtScn`

### Methode 3: Automated met Playwright (als browser beschikbaar)

```bash
# Installeer playwright
npm install -D playwright

# Install browsers
npx playwright install chromium

# Run screenshot script
node scripts/take-screenshots.js
```

## 📱 Responsive Views

De demo.html is responsive en toont goed op:
- **Desktop**: 3 kolommen voor product cards
- **Tablet**: 2 kolommen
- **Mobile**: 1 kolom, full-width

Test responsive views in DevTools:
- F12 → Toggle device toolbar (Cmd/Ctrl + Shift + M)
- Select device: iPhone 14, iPad, etc.

## 🎨 Color Scheme

| Kleur | Hex | Gebruik |
|-------|-----|---------|
| Green 600 | `#16a34a` | Headers, buttons, active states |
| Green 700 | `#15803d` | Button hover |
| Red 100 | `#fee2e2` | Urgente waarschuwingen background |
| Red 800 | `#991b1b` | Urgente waarschuwingen text |
| Orange 100 | `#fed7aa` | Binnenkort waarschuwingen background |
| Orange 800 | `#9a3412` | Binnenkort waarschuwingen text |
| Yellow 100 | `#fef3c7` | Let op waarschuwingen background |
| Yellow 800 | `#854d0e` | Let op waarschuwingen text |
| Gray 50 | `#f9fafb` | Page background |
| Gray 200 | `#e5e7eb` | Borders |
| White | `#ffffff` | Cards |

## 📊 API Response Voorbeelden

### Inventory Response (01-inventory-all.json)
```json
[
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://pantry.app/products/p001",
    "name": "Melk",
    "brand": "Campina",
    "category": "dairy",
    "quantity": 1,
    "unit": "liter",
    "expirationDate": "2025-10-24",
    "storedIn": "Fridge",
    "allergens": ["melk", "lactose"]
  }
  // ... 4 more products
]
```

### Warning Response (02-inventory-warnings.json)
```json
[
  {
    "product": { /* product object */ },
    "daysUntilExpiration": 0,
    "severity": "red"
  }
  // ... 3 more warnings
]
```

### Recipe Suggestion Response (03-recipe-suggestions.json)
```json
[
  {
    "recipe": {
      "name": "Tosti met Kaas en Tomaat",
      "recipeIngredient": ["brood", "kaas", "tomaten", "boter"]
    },
    "availableIngredients": ["brood", "kaas", "tomaten"],
    "missingIngredients": ["boter"],
    "matchPercentage": 75,
    "priorityScore": 150
  }
]
```

## 🔗 Links

- **Live Demo**: Open `demo.html` in je browser
- **API Documentatie**: http://localhost:3000/api (wanneer server draait)
- **Main README**: ../README.md
- **Quick Start**: ../QUICKSTART.md
- **Docker Gids**: ../DOCKER.md

## 📝 Notes

- **demo.html** is zelfstandig en vereist geen server
- Alle data is hardcoded uit `sample-data.jsonld`
- API response JSON bestanden zijn echte responses van de API
- Gebruik deze screenshots voor documentatie, presentaties, etc.
- De demo toont alle belangrijke features van de applicatie

## 🎯 Screenshot Checklist

Voor complete documentatie, maak screenshots van:

**Voorraad Tab:**
- [ ] Overview met alle producten
- [ ] Product card met rode achtergrond (Melk/Brood)
- [ ] Product card met witte achtergrond (Kaas)
- [ ] Koelkast section (4 producten)
- [ ] Aanrecht section (1 product)

**Waarschuwingen Tab:**
- [ ] Volledige lijst (4 waarschuwingen)
- [ ] Rode "Dringend" waarschuwing (Brood/Melk)
- [ ] Oranje "Binnenkort" waarschuwing (Tomaten)
- [ ] Gele "Let op" waarschuwing (Eieren)
- [ ] Tip box onderaan

**Recepten Tab:**
- [ ] Tosti recept ingeklapt
- [ ] Tosti recept uitgeklapt (bereidingswijze zichtbaar)
- [ ] 75% match indicator
- [ ] Beschikbaar vs Ontbreekt columns
- [ ] Dieet tags en allergeen warnings

**Product Toevoegen Tab:**
- [ ] Leeg formulier (alle velden zichtbaar)
- [ ] Formulier met sommige velden ingevuld
- [ ] Dropdown selecties (Categorie, Locatie)
- [ ] Dieet checkboxes
- [ ] Submit button

**API Responses:**
- [ ] 01-inventory-all.json (open in code editor met syntax highlighting)
- [ ] 02-inventory-warnings.json
- [ ] 03-recipe-suggestions.json
- [ ] Andere JSON responses

---

**Tip:** Open demo.html in een moderne browser (Chrome, Firefox, Safari, Edge) voor beste resultaten!
