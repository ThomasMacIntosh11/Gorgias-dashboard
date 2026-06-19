# Gorgias CX — AI Adoption Dashboard

A 24-hour AI adoption performance dashboard for the Gorgias CX org. Built as a case study deliverable.

## What it shows

- **Headline KPIs** — High-adoption merchant share, onboarding completion rate, moderate→high conversion rate, median AI resolution rate. All with 24h deltas and progress to target.
- **Adoption Funnel** — Live distribution of merchants across the 5 adoption stages with 24h movement indicators and stage-level blockers.
- **24h Resolution Chart** — Hourly AI resolution rate and ticket volume across the merchant base.
- **Account Table** — Searchable, filterable account-level view with AI rate, intent count, renewal date, CSAT, and trend.
- **CSM Activity** — Per-rep view of proactive vs reactive engagement in the last 24h.
- **Product Signal Log** — AI-synthesized failure patterns from tickets and CSM notes, with triage status and aging alerts.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Recharts (data visualization)
- Lucide React (icons)
- No external UI library — custom CSS variables for theming

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repo
4. Render will auto-detect the `render.yaml` config
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Set environment: Node, free plan is sufficient

The `render.yaml` in the repo root handles this automatically if you use Render's Blueprint deployment.

## Data

All data is currently mock/simulated in `app/lib/data.ts`. In production, replace the data functions with API calls to:
- Gorgias merchant analytics API
- Your CRM (CSM account ownership)
- Internal ticketing data

## Structure

```
app/
  lib/data.ts          — Data layer (replace with real API calls)
  components/
    Sidebar.tsx         — Navigation
    KpiRow.tsx          — Headline KPI cards
    OverviewStats.tsx   — Summary stat strip
    FunnelView.tsx      — Adoption funnel visualization
    ResolutionChart.tsx — 24h hourly trend chart
    MerchantTable.tsx   — Filterable account table
    CsmPanel.tsx        — CSM performance view
    ProductSignalLog.tsx — Product signal tracker
  page.tsx             — Tab-based layout
  globals.css          — Design tokens + base styles
render.yaml            — Render deployment config
```
