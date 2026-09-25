import { NextResponse } from 'next/server'

const patientSignals = {
  A: { finding: 'Pneumonia / infiltrate', confidence: '92%', route: ['Chest X-ray', 'Patient history', 'Respiratory model'] },
  B: { finding: 'Sinus rhythm', confidence: '98%', route: ['ECG signal', 'Cardiac model', 'Medication history'] },
  C: { finding: 'Benign nevus', confidence: '89%', route: ['Skin image', 'Dermatology model', 'Prior lesion history'] },
} as const

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const caseKey = body.caseKey as keyof typeof patientSignals
  const signal = patientSignals[caseKey] ?? patientSignals.A

  await new Promise((resolve) => setTimeout(resolve, 650))

  return NextResponse.json({
    ok: true,
    runId: `RUN-${Date.now().toString(36).toUpperCase()}`,
    status: 'review_required',
    finding: signal.finding,
    confidence: signal.confidence,
    routedEvidence: signal.route,
    telemetry: { currentMb: 118, peakMb: 1210, reclaimedPercent: 90.1 },
    completedAt: new Date().toISOString(),
  })
}
