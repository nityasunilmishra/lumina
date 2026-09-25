import { NextResponse } from 'next/server'

const patientSignals = {
  A: { finding: 'Pneumonia / infiltrate', confidence: '92%', route: ['Chest X-ray', 'Patient history', 'Respiratory model'] },
  B: { finding: 'Sinus rhythm', confidence: '98%', route: ['ECG signal', 'Cardiac model', 'Medication history'] },
  C: { finding: 'Benign nevus', confidence: '89%', route: ['Skin image', 'Dermatology model', 'Prior lesion history'] },
} as const

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: 'demo',
    service: 'cliniq-screening-orchestrator',
    status: 'online',
    availableCases: Object.keys(patientSignals),
    capabilities: ['evidence-routing', 'model-simulation', 'human-review-gate'],
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const requestedCase = typeof body.caseKey === 'string' ? body.caseKey : 'A'
  const caseKey = (requestedCase in patientSignals ? requestedCase : 'A') as keyof typeof patientSignals
  const signal = patientSignals[caseKey]

  await new Promise((resolve) => setTimeout(resolve, 650))

  return NextResponse.json({
    ok: true,
    mode: 'demo',
    runId: `RUN-${Date.now().toString(36).toUpperCase()}`,
    caseKey,
    status: 'review_required',
    finding: signal.finding,
    confidence: signal.confidence,
    routedEvidence: signal.route,
    telemetry: { currentMb: 118, peakMb: 1210, reclaimedPercent: 90.1 },
    review: { required: true, reason: 'Clinical decision support requires physician correlation.' },
    completedAt: new Date().toISOString(),
  })
}
