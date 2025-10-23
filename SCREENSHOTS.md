# Pantry MVP - Visual Guide & Screenshots

Dit document beschrijft alle UI screens van de Pantry applicatie.

## How to Make Screenshots Yourself

```bash
# 1. Start de applicatie
npx tsx backend/src/server.ts &
cd frontend && npm run dev

# 2. Open http://localhost:5173 in je browser
# 3. Gebruik browser screenshot tools:
#    - Chrome/Edge: F12 → Cmd/Ctrl+Shift+P → "Capture full size screenshot"
#    - Firefox: F12 → Screenshot tool
#    - macOS: Cmd+Shift+4 voor selectie
#    - Windows: Windows+Shift+S voor Snipping Tool
```

---

## Screen 1: Voorraad Tab (Inventory)

**URL:** `http://localhost:5173` (default tab)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Header: "Pantry" (groen)                                    │
│ Subtitle: "Slimme voorraadassistent"                        │
├─────────────────────────────────────────────────────────────┤
│ Navigation:                                                  │
│ [Voorraad (5)] [Waarschuwingen (4)] [Wat eten we? (1)] [+ Toevoegen]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Voorraad overzicht                    [Vernieuwen]          │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Koelkast (4)                                           │ │
│ ├──────────────┬──────────────┬──────────────┬───────────┤ │
│ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌────────┐│ │
│ │ │ Melk     │ │ │ Eieren   │ │ │ Tomaten  │ │ │ Kaas   ││ │
│ │ │ Campina  │ │ │ Rondeel  │ │ │          │ │ │Beemster││ │
│ │ │          │ │ │          │ │ │          │ │ │        ││ │
│ │ │ 1 liter  │ │ │ 6 stuks  │ │ │ 500 gram │ │ │200 gram││ │
│ │ │ Vervalt: │ │ │ Vervalt: │ │ │ Vervalt: │ │ │Vervalt:││ │
│ │ │2025-10-24│ │ │2025-10-30│ │ │2025-10-27│ │ │2025-11-││ │
│ │ │(1 dagen) │ │ │(7 dagen) │ │ │(4 dagen) │ │ │  10    ││ │
│ │ │  🔴      │ │ │          │ │ │          │ │ │        ││ │
│ │ │Allergenen│ │ │Allergenen│ │ │          │ │ │Allerg. ││ │
│ │ │melk,     │ │ │ei        │ │ │          │ │ │melk,   ││ │
│ │ │lactose   │ │ │          │ │ │          │ │ │lactose ││ │
│ │ └──────────┘ │ └──────────┘ │ └──────────┘ │ └────────┘│ │
│ └──────────────┴──────────────┴──────────────┴───────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Aanrecht (1)                                           │ │
│ ├──────────────┐                                         │ │
│ │ ┌──────────┐ │                                         │ │
│ │ │ Brood    │ │                                         │ │
│ │ │Bakker    │ │                                         │ │
│ │ │Bart      │ │                                         │ │
│ │ │ 1 stuks  │ │                                         │ │
│ │ │ Vervalt: │ │                                         │ │
│ │ │2025-10-23│ │                                         │ │
│ │ │(0 dagen) │ │                                         │ │
│ │ │  🔴      │ │                                         │ │
│ │ │Allergenen│ │                                         │ │
│ │ │gluten    │ │                                         │ │
│ │ └──────────┘ │                                         │ │
│ └──────────────┘                                         │ │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Producten gegroepeerd per opslaglocatie
- ✅ Kleurcodering: Rood (≤1 dag), Oranje (2-3 dagen), Geel (4-7 dagen)
- ✅ Allergenen duidelijk vermeld
- ✅ Delete knop (× rechts boven) per product
- ✅ Responsive grid layout (3 kolommen op desktop)

**Screenshot Checklist:**
- [ ] Screenshot van volledige pagina
- [ ] Close-up van product card (Melk) met rode achtergrond
- [ ] Close-up van product card (Kaas) met groene/witte achtergrond

---

## Screen 2: Waarschuwingen Tab (Expiration Warnings)

**URL:** `http://localhost:5173` → klik "Waarschuwingen"

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Vervaldatum waarschuwingen                                  │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔴 Brood                              [Dringend]        │ │
│ │                                                         │ │
│ │    Merk: Bakker Bart                                   │ │
│ │    Vervaldatum: 2025-10-23                             │ │
│ │    Vervalt VANDAAG!                                    │ │
│ │    Locatie: Countertop • 1 stuks                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔴 Melk                               [Dringend]        │ │
│ │                                                         │ │
│ │    Merk: Campina                                       │ │
│ │    Vervaldatum: 2025-10-24                             │ │
│ │    Vervalt MORGEN!                                     │ │
│ │    Locatie: Fridge • 1 liter                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🟠 Tomaten                            [Binnenkort]      │ │
│ │                                                         │ │
│ │    Vervaldatum: 2025-10-27                             │ │
│ │    Nog 4 dagen                                         │ │
│ │    Locatie: Fridge • 500 gram                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 💡 Tip                                                  │ │
│ │                                                         │ │
│ │ Kijk bij "Wat eten we?" voor recepten die deze        │ │
│ │ ingrediënten gebruiken!                                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Gesorteerd op urgentie (meest urgent eerst)
- ✅ Kleurgecodeerde emoji's en borders
- ✅ Duidelijke labels: "Dringend", "Binnenkort", "Let op"
- ✅ Tijdsindicatie: "VANDAAG!", "MORGEN!", "Nog X dagen"
- ✅ Tip box met link naar recepten

**Screenshot Checklist:**
- [ ] Screenshot van volledige waarschuwingen lijst
- [ ] Close-up van rode "Dringend" waarschuwing
- [ ] Screenshot bij geen waarschuwingen (leeg state met ✅)

---

## Screen 3: Wat eten we? Tab (Recipe Suggestions)

**URL:** `http://localhost:5173` → klik "Wat eten we?"

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Wat eten we?                                                │
│ Recepten op basis van wat je in huis hebt. Producten die   │
│ binnenkort vervallen krijgen voorrang.                      │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Tosti met Kaas en Tomaat                          75%   │ │
│ │ Klassieke Nederlandse tosti met kaas en verse tomaat    │ │
│ │                                                   Match  │ │
│ │                                                          │ │
│ │ 👥 1 portie   ⏱️ Prep: PT5M   🔥 Cook: PT5M            │ │
│ │                                                          │ │
│ │ ┌────────────────────────┬───────────────────────────┐  │ │
│ │ │ ✅ Beschikbaar (3)     │ ❌ Ontbreekt (1)         │  │ │
│ │ │ • brood                │ • boter                  │  │ │
│ │ │ • kaas                 │                          │  │ │
│ │ │ • tomaten              │                          │  │ │
│ │ └────────────────────────┴───────────────────────────┘  │ │
│ │                                                          │ │
│ │ ▼ Bereidingswijze                                       │ │
│ │   1. Verwarm de tosti-ijzer of pan.                    │ │
│ │   2. Besmeer het brood met boter.                      │ │
│ │   3. Beleg met kaas en plakjes tomaat.                 │ │
│ │   4. Grill tot het brood knapperig is...              │ │
│ │                                                          │ │
│ │ [VegetarianDiet] [⚠️ gluten] [⚠️ melk]                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Omelet met Tomaat                                 40%   │ │
│ │ Gezonde omelet met verse tomaat                  Match  │ │
│ │                                                          │ │
│ │ 👥 1 portie   ⏱️ Prep: PT5M   🔥 Cook: PT7M            │ │
│ │                                                          │ │
│ │ ┌────────────────────────┬───────────────────────────┐  │ │
│ │ │ ✅ Beschikbaar (2)     │ ❌ Ontbreekt (3)         │  │ │
│ │ │ • eieren               │ • zout                   │  │ │
│ │ │ • tomaten              │ • peper                  │  │ │
│ │ │                        │ • olijfolie              │  │ │
│ │ └────────────────────────┴───────────────────────────┘  │ │
│ │                                                          │ │
│ │ [VegetarianDiet] [GlutenFreeDiet] [⚠️ ei]             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Match percentage (groot, rechts boven)
- ✅ Recipe metadata (porties, prep time, cook time)
- ✅ Twee-kolom layout: Beschikbaar vs Ontbreekt
- ✅ Expandable bereidingswijze (details)
- ✅ Dieet tags en allergeen warnings
- ✅ Prioritering op bijna vervallende producten

**Screenshot Checklist:**
- [ ] Screenshot van volledige receptenlijst
- [ ] Screenshot van uitgevouwen recept met bereidingswijze
- [ ] Screenshot van 100% match (indien beschikbaar)
- [ ] Screenshot van lege state (geen recepten)

---

## Screen 4: Product Toevoegen Tab (Add Product)

**URL:** `http://localhost:5173` → klik "+ Toevoegen"

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Product toevoegen                                           │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │ Productnaam *                                           │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ bijv. Melk                                          │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ Merk                                                    │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ bijv. Campina                                       │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ Categorie *           Locatie *                         │ │
│ │ ┌──────────────────┐  ┌──────────────────┐             │ │
│ │ │ Zuivel        ▼ │  │ Koelkast      ▼ │             │ │
│ │ └──────────────────┘  └──────────────────┘             │ │
│ │                                                         │ │
│ │ Hoeveelheid *         Eenheid *                         │ │
│ │ ┌──────────────────┐  ┌──────────────────┐             │ │
│ │ │ 1                │  │ stuks, liter...  │             │ │
│ │ └──────────────────┘  └──────────────────┘             │ │
│ │                                                         │ │
│ │ Houdbaarheidsdatum *                                    │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ [date picker]                                       │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ Barcode                                                 │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ bijv. 8710400043287                                 │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ Allergenen (komma gescheiden)                           │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ bijv. melk, lactose                                 │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ Geschikt voor dieet                                     │ │
│ │ ☐ Vegetarisch                                          │ │
│ │ ☐ Veganistisch                                         │ │
│ │ ☐ Glutenvrij                                           │ │
│ │ ☐ Lactosearm                                           │ │
│ │ ☐ Ketogeen                                             │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │         Product toevoegen                           │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Volledige formulier voor product toevoegen
- ✅ Required fields gemarkeerd met *
- ✅ Dropdown selecties voor categorie en locatie
- ✅ Date picker voor vervaldatum
- ✅ Checkboxes voor dieet opties
- ✅ Placeholder tekst voor alle velden
- ✅ Validatie (required fields)

**Screenshot Checklist:**
- [ ] Screenshot van leeg formulier
- [ ] Screenshot van ingevuld formulier (voor submit)
- [ ] Screenshot van formulier met geselecteerde checkboxes
- [ ] Screenshot na succesvolle submit (redirect naar voorraad)

---

## API Response Screenshots

### GET /api/inventory

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
    "barcode": "8710400043287",
    "allergens": ["melk", "lactose"],
    "suitableForDiet": [],
    "addedAt": "2025-10-15T10:30:00Z"
  }
  // ... more products
]
```

### GET /api/inventory/warnings?days=7

```json
[
  {
    "product": { /* product object */ },
    "daysUntilExpiration": 0,
    "severity": "red"
  },
  {
    "product": { /* product object */ },
    "daysUntilExpiration": 1,
    "severity": "red"
  }
]
```

### GET /api/recipes/suggestions?maxMissingIngredients=2

```json
[
  {
    "recipe": {
      "@type": "Recipe",
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

---

## UI Color Scheme

**Primary Colors:**
- **Green**: `#16a34a` (green-600) - Headers, buttons, active state
- **Green Light**: `#dcfce7` (green-100) - Hover states
- **Green Dark**: `#15803d` (green-700) - Button hover

**Severity Colors:**
- **Red**: `#fee2e2` (red-100) background, `#991b1b` (red-800) text - ≤1 day
- **Orange**: `#fed7aa` (orange-100) background, `#9a3412` (orange-800) text - 2-3 days
- **Yellow**: `#fef3c7` (yellow-100) background, `#854d0e` (yellow-800) text - 4-7 days

**Neutral Colors:**
- **Gray 50**: `#f9fafb` - Background
- **Gray 200**: `#e5e7eb` - Borders
- **Gray 600**: `#4b5563` - Secondary text
- **Gray 900**: `#111827` - Primary text
- **White**: `#ffffff` - Cards

**Semantic Colors:**
- **Blue**: Info boxes, tips
- **Green tags**: Available ingredients, suitable diet
- **Orange tags**: Allergen warnings

---

## Responsive Breakpoints

- **Mobile**: < 768px (1 kolom)
- **Tablet**: 768px - 1024px (2 kolommen)
- **Desktop**: > 1024px (3 kolommen)

**Mobile-specific features:**
- Stacked layout voor product cards
- Full-width buttons
- Simplified navigation (mogelijk hamburger menu)
- Touch-friendly tap targets (min 44px)

---

## Accessibility Features

- ✅ Semantic HTML (header, nav, main, footer)
- ✅ ARIA labels voor navigatie
- ✅ Keyboard navigation support
- ✅ Color contrast ratio > 4.5:1
- ✅ Focus states visible
- ✅ Alt text voor belangrijke UI elementen

---

## How to Create Professional Screenshots

### Method 1: Browser DevTools (Best Quality)

```bash
# Chrome/Edge
1. Open http://localhost:5173
2. F12 → Open DevTools
3. Cmd/Ctrl + Shift + P
4. Type "Capture full size screenshot"
5. Hit Enter

# Firefox
1. Open http://localhost:5173
2. F12 → Open DevTools
3. Click screenshot icon (camera)
4. Choose "Save full page"
```

### Method 2: macOS Built-in

```bash
# Full screen
Cmd + Shift + 3

# Selection
Cmd + Shift + 4

# Window
Cmd + Shift + 4 → then Space → click window
```

### Method 3: Windows Built-in

```bash
# Snipping Tool
Windows + Shift + S

# Full screen
PrtScn
```

### Method 4: Third-party Tools

- **Lightshot** (Windows/Mac) - https://app.prntscr.com/
- **Greenshot** (Windows) - https://getgreenshot.org/
- **Skitch** (Mac) - For annotations
- **ShareX** (Windows) - Advanced features

---

## Screenshot Naming Convention

Voor organisatie, gebruik deze naming:

```
pantry-screenshot-01-voorraad-overview.png
pantry-screenshot-02-voorraad-product-card-red.png
pantry-screenshot-03-waarschuwingen-full.png
pantry-screenshot-04-waarschuwingen-dringend-detail.png
pantry-screenshot-05-recepten-list.png
pantry-screenshot-06-recepten-expanded.png
pantry-screenshot-07-add-product-empty.png
pantry-screenshot-08-add-product-filled.png
pantry-screenshot-09-api-inventory-json.png
pantry-screenshot-10-api-warnings-json.png
```

---

## Tips voor Mooie Screenshots

1. **Clear browser cache** voor consistente rendering
2. **Gebruik incognito mode** voor schone UI (geen extensions)
3. **Set viewport size** voor consistente dimensies (1920x1080)
4. **Seed database** eerst voor mooie voorbeelddata
5. **Zoom 100%** in browser (Cmd/Ctrl + 0)
6. **Hide scrollbars** via browser settings indien mogelijk
7. **Add sample data** voor meer realistische screenshots
8. **Different states**: Empty, loading, populated, error
9. **Mobile view**: Use DevTools device emulation

---

## Checklist voor Complete Screenshot Set

**Voorraad Tab:**
- [ ] Overview met alle producten
- [ ] Product card met rode achtergrond (bijna vervallen)
- [ ] Product card met groene achtergrond (vers)
- [ ] Lege state (geen producten)
- [ ] Delete confirmation modal

**Waarschuwingen Tab:**
- [ ] Lijst met meerdere waarschuwingen
- [ ] Rode "Dringend" waarschuwing detail
- [ ] Oranje "Binnenkort" waarschuwing
- [ ] Gele "Let op" waarschuwing
- [ ] Lege state met ✅ "Alles is vers!"

**Recepten Tab:**
- [ ] Receptenlijst met match percentages
- [ ] Recept ingeklapt (collapsed)
- [ ] Recept uitgeklapt met bereidingswijze
- [ ] 100% match indicator (indien beschikbaar)
- [ ] Lege state (geen recepten beschikbaar)

**Product Toevoegen:**
- [ ] Leeg formulier
- [ ] Formulier half ingevuld
- [ ] Formulier compleet ingevuld
- [ ] Formulier met validatie errors
- [ ] Success state na toevoegen

**API Responses:**
- [ ] /api/inventory JSON response
- [ ] /api/inventory/warnings JSON response
- [ ] /api/recipes/suggestions JSON response
- [ ] /api/diet/recipes JSON response
- [ ] /api/lookup JSON response

**Mobile Views:**
- [ ] Voorraad op mobile (portrait)
- [ ] Waarschuwingen op mobile
- [ ] Formulier op mobile
- [ ] Responsive layout breakpoints

---

Wil je dat ik de applicatie lokaal start en specifieke instructies geef voor het maken van screenshots?
