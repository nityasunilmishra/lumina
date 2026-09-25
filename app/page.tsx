'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  CircleHelp,
  Cpu,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
  Waves,
  X,
  Zap,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const patients = {
  A: { name: 'John Doe', age: 58, id: 'PX-88421', case: 'A / respiratory', primary: 'Pneumonia / infiltrate', score: '92%', history: 'Asthma + smoking history' },
  B: { name: 'Maria Chen', age: 42, id: 'PX-67310', case: 'B / cardiac', primary: 'Sinus rhythm', score: '98%', history: 'Hypertension documented' },
  C: { name: 'Samuel Ortiz', age: 34, id: 'PX-32019', case: 'C / dermatology', primary: 'Benign nevus', score: '89%', history: 'No prior lesion history' },
}

const memoryData = [
  { time: '09:41', mb: 118 }, { time: '09:41', mb: 164 }, { time: '09:41', mb: 842 },
  { time: '09:41', mb: 1190 }, { time: '09:42', mb: 960 }, { time: '09:42', mb: 510 },
  { time: '09:42', mb: 182 }, { time: '09:42', mb: 136 }, { time: '09:42', mb: 118 },
]

function Dot({ amber = false }: { amber?: boolean }) {
  return <span className={`status-dot ${amber ? 'amber' : ''}`} aria-hidden="true" />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label">{children}</p>
}

function Xray({ heatmap }: { heatmap: boolean }) {
  return <div className="scan-stage">
    <div className="scan-meta"><span>INPUT / CXR_PA_2024-08-19.DCM</span><span>512 × 512 PX</span></div>
    <svg viewBox="0 0 500 320" role="img" aria-label="Stylized chest scan with explainability overlay">
      <defs><radialGradient id="lung" cx="50%" cy="45%" r="65%"><stop stopColor="#d5e7e9" stopOpacity=".92"/><stop offset="1" stopColor="#6d9294" stopOpacity=".2"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="11"/></filter></defs>
      <rect width="500" height="320" fill="#0c1b21"/><path d="M250 27C208 40 177 86 174 139c-3 57 15 120 61 152l15-8 15 8c46-32 64-95 61-152-3-53-34-99-76-112Z" fill="#a3c0c0" opacity=".13"/>
      <path d="M237 53c-35 13-57 53-55 101 2 57 23 93 55 113 12-36 13-151 0-214Z" fill="url(#lung)"/><path d="M263 53c35 13 57 53 55 101-2 57-23 93-55 113-12-36-13-151 0-214Z" fill="url(#lung)"/>
      <path d="M250 38v274M205 61c35 45 42 159 22 246M295 61c-35 45-42 159-22 246" stroke="#e7f5f3" strokeOpacity=".58" fill="none" strokeWidth="3"/>
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M187 ${72 + i * 21}Q250 ${54 + i * 18}313 ${72 + i * 21}`} stroke="#d6e7e7" strokeOpacity=".22" fill="none" strokeWidth="2"/>)}
      {heatmap && <><ellipse cx="209" cy="196" rx="45" ry="54" fill="#ffb14a" opacity=".58" filter="url(#blur)"/><ellipse cx="292" cy="164" rx="34" ry="47" fill="#ff5b57" opacity=".5" filter="url(#blur)"/><circle cx="207" cy="193" r="13" fill="#ffc86a" opacity=".8"/></>}
    </svg>
    <div className="scan-legend"><span><i className="hot"/> activation</span><span><i className="cool"/> baseline</span><strong>Grad-CAM {heatmap ? 'ON' : 'OFF'}</strong></div>
  </div>
}

export default function Page() {
  const [caseKey, setCaseKey] = useState<keyof typeof patients>('A')
  const [heatmap, setHeatmap] = useState(true)
  const [activeTab, setActiveTab] = useState('Scan')
  const [running, setRunning] = useState(false)
  const [noticeVisible, setNoticeVisible] = useState(true)
  const [helpOpen, setHelpOpen] = useState(false)
  const [activeModel, setActiveModel] = useState('LUNGS')
  const [activeSection, setActiveSection] = useState('Overview')
  const [runResult, setRunResult] = useState<{ runId: string; finding: string; confidence: string; routedEvidence: string[] } | null>(null)
  const patient = patients[caseKey]
  const execute = async () => {
    setRunning(true)
    setRunResult(null)
    try {
      const response = await fetch('/api/screening', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ caseKey }) })
      if (!response.ok) throw new Error('Screening request failed')
      const result = await response.json()
      setRunResult(result)
    } catch {
      setRunResult({ runId: 'LOCAL-DEMO', finding: patient.primary, confidence: patient.score, routedEvidence: ['Evidence queue', 'Clinical history'] })
    } finally {
      setRunning(false)
    }
  }
  const modelDetails: Record<string, string> = { LUNGS: 'MobileNetV3 · ONNX INT8 · 118 MB', BRAIN: 'ResNet18 · FP16 · staged for routing', HEART: 'ECGNet · quantized · signal ready', SKIN: 'EfficientNet · INT8 · lesion classifier' }

  return <main className="app-shell">
    {noticeVisible && <div className="safety-bar"><span><AlertTriangle /> SCREENING &amp; DECISION SUPPORT</span><strong>NOT AUTONOMOUS DIAGNOSIS</strong><button aria-label="Dismiss notice" onClick={() => setNoticeVisible(false)}><X /></button></div>}
    <header className="command-bar"><div className="wordmark"><div className="mark"><Waves /></div><div><strong>CLINIQ<span>/</span>OS</strong><small>MULTIMODAL CLINICAL INTELLIGENCE</small></div></div><div className="command-center"><span>WORKSPACE</span><strong>LIVE SCREENING / EL-04</strong></div><div className="operator"><Dot /><span>CPU NODE 01 · ONLINE</span><div className="operator-avatar">RM</div><ChevronDown /></div></header>

    <div className="workspace">
      <aside className="rail"><div className="rail-section"><SectionLabel>COMMAND</SectionLabel><button className={`rail-link ${activeSection === 'Overview' ? 'active' : ''}`} onClick={() => setActiveSection('Overview')}><LayoutDashboard /> Overview</button><button className={`rail-link ${activeSection === 'Orchestration' ? 'active' : ''}`} onClick={() => setActiveSection('Orchestration')}><Network /> Orchestration <em>06</em></button><button className={`rail-link ${activeSection === 'Patient records' ? 'active' : ''}`} onClick={() => setActiveSection('Patient records')}><FileText /> Patient records</button><button className={`rail-link ${activeSection === 'Runtime health' ? 'active' : ''}`} onClick={() => setActiveSection('Runtime health')}><Cpu /> Runtime health</button></div><div className="rail-bottom"><div className="rail-section"><SectionLabel>DEMO MODE</SectionLabel><div className="offline"><span className="offline-icon"><Zap /></span><div><strong>Edge / offline</strong><small>ONNX runtime ready</small></div><span className="switch on" /></div></div><div className="build">CLINIQ OS 2.4.1<br/><span>BUILD 06 · 24H SPRINT</span></div></div></aside>

      <section className="main-content">
        <div className="hero-row"><div><div className="kicker"><span className="kicker-line"/> PATIENT-CENTRIC SCREENING</div><h1>One patient.<br/><span>Six models.</span> One clear signal.</h1><p className="hero-copy">A constrained-compute clinical copilot that routes only the evidence required, unloads every model after inference, and grounds every finding in patient history.</p></div><div className="hero-actions"><button className="help" onClick={() => setHelpOpen(true)}><CircleHelp /> How it works</button><button className="execute" onClick={execute} disabled={running}><Play /> {running ? 'Running pipeline' : 'Run screening'} <ArrowRight /></button>{runResult && <div className="run-confirmation" role="status"><Dot /> <span><strong>{runResult.runId}</strong> · {runResult.confidence} confidence</span></div>}</div></div>

        <div className="patient-strip"><div className="patient-main"><div className="patient-face"><UserRound /></div><div><SectionLabel>ACTIVE PATIENT / CASE {patient.case}</SectionLabel><h2>{patient.name}</h2><p>{patient.age} years · <span className="mono">{patient.id}</span></p></div></div><div className="patient-context"><span>CLINICAL CONTEXT</span><strong>{patient.history}</strong></div><div className="case-control"><label htmlFor="case">DEMO CASE</label><select id="case" value={caseKey} onChange={(e) => setCaseKey(e.target.value as keyof typeof patients)}><option value="A">A · Chest X-ray</option><option value="B">B · ECG + Brain</option><option value="C">C · Skin lesion</option></select></div><div className="ready"><Dot /><span>READY</span></div></div>

        <div className="dashboard-grid">
          <section className="card telemetry"><div className="card-head"><div><SectionLabel>01 / RUNTIME TELEMETRY</SectionLabel><h3>Dynamic model offloading</h3></div><span className="live-tag"><Dot /> LIVE</span></div><div className="telemetry-stat"><div><strong>118</strong><span>MB current footprint</span></div><div className="peak"><span>PEAK LOAD</span><strong>1.2 GB <small>↓ 90.1%</small></strong></div></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={memoryData} margin={{ top: 8, right: 4, left: -25, bottom: 0 }}><defs><linearGradient id="memoryFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#55d6c0" stopOpacity=".36"/><stop offset="1" stopColor="#55d6c0" stopOpacity="0"/></linearGradient></defs><XAxis dataKey="time" tick={{ fill: '#6d8589', fontSize: 9 }} axisLine={false} tickLine={false}/><YAxis domain={[0, 1300]} ticks={[0, 600, 1200]} tick={{ fill: '#6d8589', fontSize: 9 }} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ background: '#15272c', border: '1px solid #355157', color: '#dceae8', fontSize: 11 }} formatter={(value) => [`${value} MB`, 'RAM']} /><Area type="monotone" dataKey="mb" stroke="#68d9c2" strokeWidth={2} fill="url(#memoryFill)"/></AreaChart></ResponsiveContainer></div><div className="telemetry-note"><span><i className="up"/> {modelDetails[activeModel]}</span><span><i className="down"/> gc.collect() / unloaded</span></div><div className="model-pills"><button className={`model-pill ${activeModel === 'LUNGS' ? 'active' : ''}`} onClick={() => setActiveModel('LUNGS')}><Activity /> LUNGS <small>ONNX INT8</small><b>{activeModel === 'LUNGS' ? 'ACTIVE' : 'READY'}</b></button><button className={`model-pill ${activeModel === 'BRAIN' ? 'active' : ''}`} onClick={() => setActiveModel('BRAIN')}><Brain /> BRAIN <small>FP16</small><b>{activeModel === 'BRAIN' ? 'ACTIVE' : 'READY'}</b></button><button className={`model-pill ${activeModel === 'HEART' ? 'active' : ''}`} onClick={() => setActiveModel('HEART')}><HeartPulse /> HEART <small>ECGNET</small><b>{activeModel === 'HEART' ? 'ACTIVE' : 'READY'}</b></button><button className={`model-pill ${activeModel === 'SKIN' ? 'active' : ''}`} onClick={() => setActiveModel('SKIN')}><Sparkles /> SKIN <small>INT8</small><b>{activeModel === 'SKIN' ? 'ACTIVE' : 'READY'}</b></button></div></section>

          <section className="card findings"><div className="card-head"><div><SectionLabel>02 / SYNTHESIS LAYER</SectionLabel><h3>Unified clinical signal</h3></div><span className="confidence">96% <small>overall</small></span></div><div className="finding-callout"><div className="finding-icon"><AlertTriangle /></div><div><strong>{patient.primary}</strong><span>Primary finding · requires clinical correlation</span></div><b>{patient.score}</b></div><div className="finding-list"><div><span><Activity /> Respiratory / X-ray</span><strong>{caseKey === 'A' ? 'Pneumonia / infiltrate' : 'No acute finding'}</strong><em className={caseKey === 'A' ? 'warn' : ''}>{caseKey === 'A' ? 'HIGH' : 'NORMAL'}</em></div><div><span><HeartPulse /> Cardiac / ECG</span><strong>Sinus rhythm</strong><em>98%</em></div><div><span><FileText /> History / RAG</span><strong>{patient.history}</strong><em className="verified"><Check /> VERIFIED</em></div></div><div className="review-banner"><ShieldCheck /><span><strong>Human review gate enabled</strong><small>Low confidence or urgent findings route to a physician.</small></span><ArrowRight /></div></section>
        </div>

        <div className="bottom-grid"><section className="card evidence"><div className="card-head"><div><SectionLabel>03 / EVIDENCE LAYER</SectionLabel><h3>Explainable inputs</h3></div><button className="upload"><Upload /> Add evidence</button></div><div className="tabs">{['Scan', 'ECG signal', 'Patient history'].map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}{tab === 'Scan' && <i />}</button>)}</div>{activeTab === 'Scan' ? <><div className="evidence-toolbar"><span><span className="file-icon"><FileText /></span> CXR_PA_2024-08-19 <small>2.4 MB · DICOM</small></span><button className={`heatmap-toggle ${heatmap ? 'on' : ''}`} onClick={() => setHeatmap(!heatmap)} aria-pressed={heatmap}><span /> Grad-CAM heatmap</button></div><Xray heatmap={heatmap} /></> : <div className="placeholder"><FileText /><strong>{activeTab === 'ECG signal' ? 'ECG signal trace' : 'Patient history index'}</strong><span>Evidence is ready in the routed source document.</span></div>}</section>

          <section className="card assessment"><div className="card-head"><div><SectionLabel>04 / RAG TRACEABILITY</SectionLabel><h3>Assessment with receipts</h3></div><span className="trace"><Waves /> TRACEABLE</span></div><div className="assessment-body"><div className="assessment-copy"><div className="ai-badge"><Sparkles /> SYNTHESIS OUTPUT</div><h4>“Findings indicate a probable <mark>right lower lobe infiltrate</mark> consistent with pneumonia.”</h4><p>The radiographic pattern correlates with the patient&apos;s documented respiratory history. Cardiac rhythm appears normal with no acute arrhythmia detected.</p><div className="generated"><span><span className="status-dot" /> GENERATED 09:42:52</span><span><ShieldCheck /> HUMAN REVIEW REQUIRED</span></div></div><div className="sources"><div className="source-title"><FileText /> SOURCE CITATIONS <span>02</span></div><button><b>01</b><span><strong>Chest X-ray report</strong><small>Radiology · Doc #1, Pg 2</small></span><ArrowRight /></button><button><b>02</b><span><strong>Patient history</strong><small>Pulmonology · Doc #2, Pg 4</small></span><ArrowRight /></button><blockquote>“Patient diagnosed with chronic asthma in 2018. Maintenance therapy ongoing.”<cite>[Doc #2, Pg 4]</cite></blockquote></div></div></section></div>
        <footer><span><ShieldCheck /> SECURE SESSION · DATA ENCRYPTED</span><span>Built for the 24-hour sprint <Dot /></span></footer>
        {activeSection !== 'Overview' && <div className="section-toast" role="status"><strong>{activeSection}</strong><span>Demo view selected · patient context stays synchronized.</span><button onClick={() => setActiveSection('Overview')} aria-label="Return to overview"><X /></button></div>}
      </section>
    </div>
    {helpOpen && <div className="help-backdrop" role="presentation" onClick={() => setHelpOpen(false)}><section className="help-panel" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={(event) => event.stopPropagation()}><button className="help-close" onClick={() => setHelpOpen(false)} aria-label="Close how it works"><X /></button><SectionLabel>LIVE DEMO FLOW</SectionLabel><h2 id="help-title">Evidence in. Signal out.</h2><p>Switch cases, activate a model, or run the screening pipeline to show how ClinIQ routes only the evidence needed for the clinical question.</p><div className="help-steps"><span><b>01</b>Select a case</span><span><b>02</b>Inspect routed evidence</span><span><b>03</b>Review with receipts</span></div><button className="execute" onClick={() => { setHelpOpen(false); execute() }}><Play /> Run the live demo <ArrowRight /></button></section></div>}
  </main>
}
