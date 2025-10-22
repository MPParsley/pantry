# Pantry - Slimme Huishoudassistent MVP

Een semantisch rijke voorraadbeheersysteem gebouwd met Linked Data principes, schema.org vocabulair en moderne web technologieën.

## Overzicht

Pantry is een intelligente huishoudassistent die gebruikers helpt om:
- **Voedselvoorraad te beheren** met locatie-tracking (koelkast, vriezer, kast)
- **Houdbaarheidsdatums te volgen** met kleurgecodeerde waarschuwingen
- **Prijzen bij te houden** en vergelijkingen te maken tussen winkels
- **Receptsuggesties te krijgen** op basis van beschikbare voorraad
- **Dieetrestricties en allergieën** te respecteren

## Technologie Stack

### Backend
- **Node.js + TypeScript**: Type-safe backend ontwikkeling
- **Express**: REST API framework
- **SQLite**: Lichtgewicht relationele database voor MVP
- **JSON-LD**: Linked Data formaat voor semantische rijkdom
- **N3.js**: RDF triple processing library (beschikbaar voor uitbreiding)

### Frontend
- **React 18**: Component-based UI framework
- **TypeScript**: Type-safe frontend ontwikkeling
- **Vite**: Snelle build tool en dev server
- **TailwindCSS**: Utility-first CSS framework

### Semantisch
- **schema.org**: Primair vocabularium voor producten, recepten, winkels
- **Custom pantry namespace**: Uitbreiding voor specifieke domeinconcepten
- **JSON-LD context**: Machine-leesbare data met menselijke leesbaarheid

## Tech Stack Argumentatie

### Waarom deze stack?

1. **SQLite + JSON-LD Hybrid**
   - **Pro**: Eenvoudige setup zonder externe services, perfecte voor MVP
   - **Pro**: JSON-LD kolommen behouden semantische rijkdom
   - **Pro**: Eenvoudig migreerbaar naar triple store (Jena Fuseki, GraphDB)
   - **Alternatief**: Pure triple store zou meer SPARQL features bieden maar complexere setup vereisen

2. **Node.js/TypeScript**
   - **Pro**: Uniforme taal (JS/TS) voor front- en backend
   - **Pro**: Rijke ecosystem voor RDF/Linked Data (N3.js, rdflib.js)
   - **Pro**: JSON-LD native support
   - **Alternatief**: Python zou ook goed zijn (rdflib), maar minder frontend-backend synergie

3. **React + Vite**
   - **Pro**: Snelle development cycle, moderne DX
   - **Pro**: Component hergebruik
   - **Pro**: Grote community en ecosysteem
   - **Alternatief**: Vue/Svelte zouden ook werken, maar React heeft meer RDF tooling

## Installatie & Setup

### Vereisten
- Node.js 18+ en npm
- Git

### Stap 1: Clone repository
```bash
git clone <repository-url>
cd pantry
```

### Stap 2: Installeer dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### Stap 3: Seed database met voorbeelddata
```bash
npm run seed
```

### Stap 4: Start development servers
```bash
npm run dev
```

Dit start:
- Backend API op `http://localhost:3000`
- Frontend op `http://localhost:5173`

### Stap 5: Open browser
Navigeer naar `http://localhost:5173`

## Datamodel

### Ontologie (ontology.ttl)

Het semantisch datamodel gebruikt:

**Core Classes:**
- `pantry:Product` - Voedselproduct (subclass van schema:Product)
- `pantry:StorageLocation` - Opslaglocatie (Fridge, Freezer, Pantry, Countertop)
- `pantry:Purchase` - Aankoop record met prijs en winkel
- `pantry:UserProfile` - Gebruikersprofiel met dieet en allergieën
- `schema:Recipe` - Recept met ingrediënten en instructies
- `schema:Store` - Winkel waar product gekocht is

**Key Properties:**
- `pantry:storedIn` - Koppeling product → opslaglocatie
- `pantry:hasPurchase` - Koppeling product → aankoop
- `schema:expirationDate` - Houdbaarheidsdatum
- `schema:price`, `schema:priceCurrency` - Prijsinformatie
- `pantry:allergen` - Allergenen in product
- `schema:suitableForDiet` - Dieetcompatibiliteit

### Voorbeeld JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://pantry.app/products/p001",
  "name": "Melk",
  "brand": "Campina",
  "pantry:category": "dairy",
  "pantry:quantity": 1,
  "pantry:unit": "liter",
  "expirationDate": "2025-10-24",
  "pantry:storedIn": { "@id": "pantry:Fridge" },
  "pantry:allergen": ["melk", "lactose"],
  "suitableForDiet": []
}
```

Volledige voorbeelden in `sample-data.jsonld`.

## API Endpoints

### Inventory (`/api/inventory`)

| Method | Endpoint | Beschrijving | Query Params |
|--------|----------|--------------|--------------|
| GET | `/api/inventory` | Alle producten | `expiringSoon`, `location`, `category`, `diet` |
| GET | `/api/inventory/warnings` | Vervaldatum waarschuwingen | `days` (default: 7) |
| GET | `/api/inventory/:id` | Specifiek product | - |
| POST | `/api/inventory` | Nieuw product toevoegen | - |
| PUT | `/api/inventory/:id` | Product updaten | - |
| DELETE | `/api/inventory/:id` | Product verwijderen | - |

### Recipes (`/api/recipes`)

| Method | Endpoint | Beschrijving | Query Params |
|--------|----------|--------------|--------------|
| GET | `/api/recipes` | Alle recepten | `useInventory`, `diet`, `allergenFree`, `maxMissingIngredients` |
| GET | `/api/recipes/suggestions` | Receptsuggesties op basis voorraad | `maxMissingIngredients` |
| GET | `/api/recipes/:id` | Specifiek recept | - |
| POST | `/api/recipes` | Nieuw recept toevoegen | - |
| DELETE | `/api/recipes/:id` | Recept verwijderen | - |

### Lookup (`/api/lookup`)

| Method | Endpoint | Beschrijving | Query Params |
|--------|----------|--------------|--------------|
| GET | `/api/lookup` | "Heb ik dit thuis?" | `name`, `barcode` |
| GET | `/api/lookup/price/:productName` | Prijsvergelijking voor product | - |

### Diet (`/api/diet`)

| Method | Endpoint | Beschrijving | Query Params |
|--------|----------|--------------|--------------|
| GET | `/api/diet/recipes` | Recepten passend bij dieet | `diet`, `excludeAllergens` |
| GET | `/api/diet/profile` | Gebruikersprofiel ophalen | - |
| PUT | `/api/diet/profile` | Gebruikersprofiel updaten | - |

### Purchases (`/api/purchases`)

| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| POST | `/api/purchases` | Nieuwe aankoop registreren |
| GET | `/api/purchases/:productId` | Aankoopgeschiedenis per product |

## Semantische Queries

Het systeem kan de volgende SPARQL-achtige queries beantwoorden:

### 1. Welke producten vervallen binnen 3 dagen?

**Endpoint:** `GET /api/inventory/warnings?days=3`

**Implementatie:** backend/src/services/queryService.ts:21

```typescript
export async function getExpiringProducts(days: number): Promise<ExpirationWarning[]>
```

**Resultaat:**
```json
[
  {
    "product": { ... },
    "daysUntilExpiration": 2,
    "severity": "orange"
  }
]
```

### 2. Wat kan ik eten met wat ik in huis heb?

**Endpoint:** `GET /api/recipes/suggestions?maxMissingIngredients=0`

**Implementatie:** backend/src/services/queryService.ts:52

```typescript
export async function getRecipeSuggestions(maxMissingIngredients: number)
```

**Logica:**
- Match ingrediënten met voorraad
- Bereken match percentage
- Prioriteer recepten met bijna vervallende ingrediënten
- Sorteer op priority score

### 3. Welke recepten bevatten geen allergenen waarvoor ik gevoelig ben?

**Endpoint:** `GET /api/diet/recipes?excludeAllergens=noten,gluten`

**Implementatie:** backend/src/services/queryService.ts:111

```typescript
export async function getRecipesByDiet(diet?: DietType, excludeAllergens?: string[])
```

### 4. Waar heb ik het goedkoopst melk gekocht?

**Endpoint:** `GET /api/lookup/price/melk`

**Implementatie:** backend/src/services/queryService.ts:144

```typescript
export async function getPriceComparison(productName: string)
```

**Resultaat:**
```json
{
  "productName": "Melk",
  "purchases": [
    { "store": "Albert Heijn", "price": 1.29, "date": "2025-10-15" },
    { "store": "Jumbo", "price": 1.35, "date": "2025-10-10" }
  ],
  "lowestPrice": 1.29,
  "latestPrice": 1.29,
  "averagePrice": 1.32
}
```

### 5. Welke ingrediënten komen in meerdere producten voor?

**Endpoint:** Interne query

**Implementatie:** backend/src/services/queryService.ts:178

```typescript
export async function getCommonIngredients(): Promise<Map<string, number>>
```

## Functionele Features

### 1. Voorraadbeheer
- Producten toevoegen met alle attributen
- Categoriseren (zuivel, vlees, groente, etc.)
- Locatie tracking (koelkast, vriezer, kast, aanrecht)
- Hoeveelheid en eenheid tracking
- Barcode support (toekomst: Open Food Facts integratie)

### 2. Vervaldatum Waarschuwingen
- Kleurenindicatie:
  - 🔴 Rood: ≤ 1 dag
  - 🟠 Oranje: 2-3 dagen
  - 🟡 Geel: 4-7 dagen
  - ✅ Groen: > 7 dagen
- Configureerbare waarschuwingsperiode per gebruiker
- Visuele dashboards met urgentie

### 3. Prijslog & Vergelijking
- Aankoopdatum, winkel en prijs tracking
- Historische prijstrends
- Laagste prijs identificatie
- Gemiddelde prijs berekening

### 4. Receptsuggesties
- Automatische matching met voorraad
- Prioritering van bijna vervallende producten
- Toon ontbrekende ingrediënten
- Match percentage berekening
- Support voor "maximaal X ontbrekende ingrediënten"

### 5. Allergenen & Dieetinfo
- Product-niveau allergeen tracking
- Recept-niveau allergeen aggregatie
- Dieetfiltering (vegetarisch, veganistisch, glutenvrij, etc.)
- Gebruikersprofiel met dieetvoorkeuren
- Automatische filtering op basis van profiel

### 6. Winkelcheck
- "Heb ik dit thuis?" functionaliteit
- Zoeken op naam of barcode
- Directe voorraadcontrole voor slim winkelen

## Voorbeelddata

Het systeem bevat voorbeelddata met:

**5 Producten:**
1. Melk (Campina) - vervalt 2025-10-24
2. Eieren (Rondeel) - vervalt 2025-10-30
3. Brood (Bakker Bart) - vervalt 2025-10-23
4. Tomaten - vervalt 2025-10-27
5. Kaas (Beemster) - vervalt 2025-11-10

**2 Recepten:**
1. Tosti met Kaas en Tomaat
   - Ingrediënten: brood, kaas, tomaten, boter
   - Match: Hoog (meeste ingrediënten aanwezig)

2. Omelet met Tomaat
   - Ingrediënten: eieren, tomaten, zout, peper, olijfolie
   - Match: Gedeeltelijk

**Aankopen:**
- Prijshistorie voor elk product
- Verschillende winkels (Albert Heijn, Jumbo, Bakkerij van de Hoek)

**Gebruikersprofiel:**
- Allergie: noten
- Dieet: Vegetarisch
- Waarschuwing: 7 dagen voor vervaldatum

## Uitbreidingsmogelijkheden

### Korte termijn
1. **Barcode scanning**: Integratie met Open Food Facts API
2. **Notificaties**: Push notifications voor vervaldatums
3. **Boodschappenlijst**: Automatische lijst op basis van recepten
4. **Meerdere gebruikers**: Multi-user support met eigen profielen

### Lange termijn
1. **Triple Store migratie**: Overstap naar Apache Jena Fuseki of GraphDB
2. **SPARQL Endpoint**: Directe SPARQL queries voor advanced users
3. **Linked Open Data**: Koppeling met DBpedia, Wikidata voor voedingsinformatie
4. **ML suggesties**: Machine learning voor betere receptsuggesties
5. **Mobiele app**: Native iOS/Android apps
6. **IoT integratie**: Smart koelkast integratie

## Ontwikkeling

### Project Structuur
```
pantry/
├── backend/
│   ├── src/
│   │   ├── database.ts          # Database layer
│   │   ├── server.ts            # Express server
│   │   ├── types.ts             # TypeScript types
│   │   ├── seed.ts              # Database seeding
│   │   ├── routes/              # API routes
│   │   │   ├── inventory.ts
│   │   │   ├── recipes.ts
│   │   │   ├── lookup.ts
│   │   │   ├── diet.ts
│   │   │   └── purchases.ts
│   │   └── services/
│   │       └── queryService.ts  # Semantische queries
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Hoofd component
│   │   ├── api.ts               # API client
│   │   ├── types.ts             # TypeScript types
│   │   └── components/          # React componenten
│   │       ├── InventoryList.tsx
│   │       ├── ExpirationWarnings.tsx
│   │       ├── RecipeSuggestions.tsx
│   │       └── AddProductForm.tsx
│   ├── index.html
│   └── vite.config.ts
├── ontology.ttl                 # RDF ontologie
├── sample-data.jsonld           # Voorbeelddata in JSON-LD
├── package.json
└── README.md
```

### Scripts
```bash
# Development
npm run dev              # Start backend + frontend
npm run dev:backend      # Alleen backend
npm run dev:frontend     # Alleen frontend

# Build
npm run build            # Build alles
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend

# Production
npm start                # Start production build

# Database
npm run seed             # Seed database met voorbeelddata
```

### Testing
```bash
# Test API endpoints
curl http://localhost:3000/api/inventory
curl http://localhost:3000/api/inventory/warnings?days=7
curl http://localhost:3000/api/recipes/suggestions
```

## Licentie

MIT License - Zie LICENSE bestand voor details.

## Credits

- **Schema.org**: Vocabularium voor producten, recepten, winkels
- **RDF/Linked Data**: W3C standaarden
- **Open Food Facts**: Inspiratie voor product data (toekomstige integratie)

---

**Ontwikkeld als MVP voor semantisch rijke huishoudapplicaties.**
**Gebouwd met Linked Data principes en moderne web technologieën.**
