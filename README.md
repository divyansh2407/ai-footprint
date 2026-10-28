# AI Footprint — Full-stack starter

A climate-tech dashboard for exploring **estimated** AI inference electricity, water and carbon impacts. Includes a React frontend, Express REST API, transparent calculation assumptions, scenario simulator, saved calculation history, and purposeful hover/scroll motion.

> Scientific integrity: token counts alone do not reveal real-world energy use. The included model factors are explicitly labelled **illustrative demo assumptions**, not measured provider data. Replace them with sourced, versioned factors before using results for research or public claims.

## Stack
- Frontend: React, Vite, React Router, Framer Motion, Recharts, Lucide
- Backend: Node.js, Express, JSON-file persistence (no external database needed for local run)
- API: `/api/health`, `/api/models`, `/api/calculate`, `/api/history`, `/api/simulator`
- UI: responsive forest-green / warm-white / sage palette, hover states, reduced-motion support

## Requirements
- Node.js 20+ recommended
- npm

## Run locally
From the project root:

```bash
npm install
npm --prefix server install
npm --prefix client install
npm run dev
```

Open the Vite URL shown in the terminal (normally http://localhost:5173). The frontend proxies `/api` to `http://localhost:5000`.

Build the frontend:
```bash
npm run build
```

Run the API alone:
```bash
npm run start
```

## Architecture
```text
ai-footprint/
├── client/
│   ├── src/
│   │   ├── components/      # Sidebar, layout, metric cards, charts
│   │   ├── pages/           # Overview, Calculator, Simulator, Research, Guide
│   │   ├── lib/api.js       # API client
│   │   ├── styles.css       # Design tokens, responsive styles, motion system
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── routes/          # REST endpoints
│   │   ├── services/        # Calculation logic and assumptions
│   │   ├── data/            # Model factors and scenario assumptions
│   │   ├── storage.js       # Local JSON persistence
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Calculation model
For each request:
- input energy = input tokens / 1,000 × input kWh factor per 1,000 tokens
- output energy = output tokens / 1,000 × output kWh factor per 1,000 tokens
- total energy = (input energy + output energy) × requests
- estimated carbon = total energy × grid carbon intensity (gCO₂e/kWh)
- estimated water = total energy × water intensity (L/kWh)

All factors in the bundled demo dataset are illustrative placeholders. Water intensity is configured as a single scenario factor and should be replaced with a documented boundary (e.g. direct cooling water vs. broader water footprint). The app exposes factor notes and uncertainty labels in the UI and API.

## Persistence
Calculation history is stored in `server/data/history.json`, created automatically on first save. This is suitable for a local demo, not a multi-user production deployment. For production, replace with PostgreSQL or another database and add authentication, rate limiting, validation, observability, and deployment secrets.

## Environment variables
Optional `PORT` (defaults to 5000), `CLIENT_ORIGIN` (defaults to `http://localhost:5173`).

## Useful API examples
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/models
curl -X POST http://localhost:5000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"modelId":"demo-balanced","inputTokens":1000,"outputTokens":500,"requests":100,"gridCarbonIntensity":400,"waterIntensity":1.2}'
```

## Before presenting results as factual
1. Replace every illustrative factor with traceable evidence.
2. Record source URL, publication date, hardware/model scope, measurement boundary, and factor version.
3. Distinguish inference energy from facility overhead; avoid double-counting PUE.
4. Document whether water is direct, indirect, consumptive, or withdrawn.
5. State uncertainty and avoid false precision.
