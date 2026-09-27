# Lumina

Lumina is a hackathon project built as a fast prototype for an AI-powered clinical decision support dashboard. It demonstrates how multiple models, telemetry signals, and evidence routing can be presented in a single, human-friendly interface for rapid screening workflows.

The app simulates a clinical intelligence workflow where patient records, imaging inputs, and risk signals are orchestrated through a lightweight dashboard, with a demo screening API that returns evidence-based findings and review status.

## Why Lumina?

Healthcare workflows often involve fragmented systems, multiple model outputs, and limited visibility into how evidence is being routed. Lumina explores a simplified solution:

- unify screening signals in one dashboard
- route evidence through a model orchestration layer
- surface explanations and patient context clearly
- keep the interface fast, accessible, and demo-friendly for a hackathon sprint

## Features

- Interactive clinical dashboard UI
- Simulated patient case selection
- Model routing and runtime telemetry visualizations
- Explainability overlay for image-based screening
- Evidence and traceability panel
- Demo screening API endpoint for case simulation
- Responsive, modern UI built with Next.js and Tailwind CSS

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts
- shadcn-inspired component patterns

## Project Structure

```text
lumina/
├── app/
│   ├── api/
│   │   └── screening/
│   │       └── route.ts
│   ├── [section]/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
│   └── utils.ts
├── public/
├── .gitignore
├── components.json
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## Demo API

The project includes a demo API route at:

- `POST /api/screening`

This endpoint simulates a case-based clinical screening result and returns:

- patient case key
- detected finding
- confidence score
- routed evidence chain
- telemetry metadata
- review requirement status

Example response shape:

```json
{
  "ok": true,
  "mode": "demo",
  "runId": "RUN-ABC123",
  "caseKey": "A",
  "status": "review_required",
  "finding": "Pneumonia / infiltrate",
  "confidence": "92%",
  "routedEvidence": ["Chest X-ray", "Patient history", "Respiratory model"],
  "telemetry": {
    "currentMb": 118,
    "peakMb": 1210,
    "reclaimedPercent": 90.1
  }
}
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Install dependencies

```bash
pnpm install
```

### Run the app locally

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

### Production build

```bash
pnpm build
pnpm start
```

## Available Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

## Notes

This is a hackathon project intended to demonstrate a concept and rapid product exploration rather than a production-ready clinical system. The app uses demo data and simulated routing logic to showcase the user experience and architecture behind AI-assisted triage and evidence review.

## License

This project does not currently include a formal license file in the repository.

## Acknowledgements

Built for rapid experimentation, storytelling, and prototype validation during a hackathon sprint.
