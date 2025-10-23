# Pantry MVP - Quick Start Guide

Snelle setup om de applicatie te testen (2-5 minuten).

## Kies je setup methode

### 🐳 Optie A: Docker (Meest eenvoudig - 2 minuten)

**Vereisten:** Docker & Docker Compose

```bash
# Clone repository
git clone <repository-url>
cd pantry

# Start alles met één commando
docker compose up -d

# Open browser
# Frontend: http://localhost
# Backend: http://localhost:3000
```

**Klaar!** Alle services draaien nu in containers.

[Spring naar Docker sectie →](#docker-setup)

---

### 💻 Optie B: Lokale installatie (5 minuten)

**Vereisten:** Node.js 18+ en npm

## Installatie in 4 stappen

### 1. Installeer dependencies

```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Seed database met voorbeelddata

```bash
npx tsx backend/src/seed.ts
```

Je zou moeten zien:
```
✅ Created 3 stores
✅ Created 5 products
✅ Created 5 purchases
✅ Created 2 recipes
✅ Created user profile
```

### 3. Start de backend server

In een terminal:
```bash
npx tsx backend/src/server.ts
```

Je zou moeten zien:
```
╔═══════════════════════════════════════════════════════════╗
║   🍎 Pantry API Server                                   ║
║   Status: Running                                        ║
║   Port: 3000                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### 4. Start de frontend (in een nieuwe terminal)

```bash
cd frontend
npm run dev
```

Open browser: **http://localhost:5173**

## Test de 5 Semantische Queries

In een nieuwe terminal:

```bash
# Query 1: Producten die binnen 3 dagen vervallen
curl http://localhost:3000/api/inventory/warnings?days=3

# Query 2: Receptsuggesties op basis van voorraad
curl http://localhost:3000/api/recipes/suggestions?maxMissingIngredients=2

# Query 3: Recepten zonder gluten
curl "http://localhost:3000/api/diet/recipes?excludeAllergens=gluten"

# Query 4: Prijsvergelijking voor Melk
curl http://localhost:3000/api/lookup/price/Melk

# Query 5: Heb ik melk thuis?
curl "http://localhost:3000/api/lookup?name=melk"
```

Of gebruik het test script (vereist `jq`):
```bash
chmod +x test-all-queries.sh
./test-all-queries.sh
```

## Frontend Features

Open http://localhost:5173 en test:

1. **Voorraad tab**: Zie alle 5 producten gegroepeerd per locatie
2. **Waarschuwingen tab**: Zie producten die binnenkort vervallen (rood/oranje kleuren)
3. **Wat eten we? tab**: Zie 2 recepten met match percentages
4. **+ Toevoegen tab**: Voeg een nieuw product toe

## Voorbeelddata

De database bevat:

**Producten:**
- Melk (vervalt over 1 dag) 🔴
- Brood (vervalt vandaag) 🔴
- Eieren (vervalt over 7 dagen)
- Tomaten (vervalt over 4 dagen)
- Kaas (vervalt over 18 dagen)

**Recepten:**
- Tosti met Kaas en Tomaat (75% match - 1 ingrediënt ontbreekt: boter)
- Omelet met Tomaat (40% match - 3 ingrediënten ontbreken)

**Winkels:**
- Albert Heijn
- Jumbo
- Bakkerij van de Hoek

## API Endpoints Overzicht

| Endpoint | Beschrijving |
|----------|--------------|
| `GET /api/inventory` | Alle producten |
| `GET /api/inventory/warnings?days=7` | Vervaldatum waarschuwingen |
| `GET /api/recipes/suggestions` | Receptsuggesties |
| `GET /api/diet/recipes?diet=VeganDiet` | Recepten voor specifiek dieet |
| `GET /api/lookup?name=melk` | Check of product in voorraad is |
| `GET /api/lookup/price/Melk` | Prijsvergelijking |
| `POST /api/inventory` | Nieuw product toevoegen |

Volledige API docs: http://localhost:3000/api

## Semantische Data

De applicatie gebruikt:
- **JSON-LD** voor data formatting
- **schema.org** vocabularium voor producten/recepten
- **Custom pantry namespace** voor domeinspecifieke concepten

Zie `ontology.ttl` voor het volledige RDF schema.
Zie `sample-data.jsonld` voor voorbeelden in JSON-LD formaat.

## Wat nu?

- Lees `README.md` voor volledige documentatie
- Lees `test-queries.md` voor gedetailleerde query voorbeelden
- Bekijk `ontology.ttl` voor het semantisch datamodel
- Experimenteer met de API en frontend!

## Troubleshooting

**Database error?**
```bash
rm pantry.db
npx tsx backend/src/seed.ts
```

**Port 3000 already in use?**
```bash
# Kill het proces op poort 3000
kill $(lsof -ti:3000)
```

**Frontend build errors?**
```bash
cd frontend
rm -rf node_modules
npm install
```

---

## Docker Setup

### Start met Docker Compose

```bash
# 1. Clone repository (indien nog niet gedaan)
git clone <repository-url>
cd pantry

# 2. Start alle services
docker compose up -d

# 3. Check status
docker compose ps

# 4. Seed database (optioneel - voorbeelddata)
docker compose exec backend npx tsx backend/src/seed.ts
```

### Services

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api

### Handige Docker commando's

```bash
# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild en start
docker compose up --build

# Reset alles (inclusief database)
docker compose down -v
docker compose up -d
```

### Development met Docker

Start development mode met hot-reload:

```bash
docker compose -f docker-compose.dev.yml up
```

**Poorten:**
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:3000

### Pull Pre-built Images

In plaats van lokaal bouwen, pull images van GitHub Container Registry:

```bash
# Pull images
docker pull ghcr.io/mpparsley/pantry/backend:latest
docker pull ghcr.io/mpparsley/pantry/frontend:latest

# Start services
docker compose up -d
```

### Docker Troubleshooting

**Port already in use?**
```bash
# Change port in docker-compose.yml
ports:
  - "8080:80"  # Frontend op poort 8080
  - "3001:3000"  # Backend op poort 3001
```

**Database issues?**
```bash
# Reset database volume
docker compose down -v
docker compose up -d
docker compose exec backend npx tsx backend/src/seed.ts
```

**View container logs:**
```bash
docker compose logs backend
docker compose logs frontend
docker compose logs -f  # Follow mode
```

**Meer informatie:** Zie [DOCKER.md](DOCKER.md) voor complete Docker deployment gids.

---

**Happy coding!** 🚀
