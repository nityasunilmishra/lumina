'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Cpu,
  FileText,
  HeartPulse,
  Layers3,
  MonitorCog,
  MoreHorizontal,
  Network,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  UserRound,
  Wifi,
  X,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const patients = {
  A: { name: 'John Doe', age: 58, id: '#PX-88421', label: 'Case A · Chest X-Ray + Asthma History', diagnosis: 'Pneumonia / Infiltrate', confidence: '92%', urgency: 'High Urgency' },
  B: { name: 'Maria Chen', age: 42, id: '#PX-67310', label: 'Case B · ECG + Arrhythmia', diagnosis: 'Sinus Rhythm', confidence: '98%', urgency: 'Normal' },
  C: { name: 'Samuel Ortiz', age: 34, id: '#PX-32019', label: 'Case C · Skin Lesion', diagnosis: 'Benign Nevus', confidence: '89%', urgency: 'Review' },
}

const memoryData = [
  { time: '09:41:00', mb: 112 }, { time: '09:41:10', mb: 128 }, { time: '09:41:20', mb: 176 },
  { time: '09:41:30', mb: 842 }, { time: '09:41:40', mb: 1190 }, { time: '09:41:50', mb: 1126 },
  { time: '09:42:00', mb: 960 }, { time: '09:42:10', mb: 510 }, { time: '09:42:20', mb: 182 },
  { time: '09:42:30', mb: 136 }, { time: '09:42:40', mb: 121 }, { time: '09:42:50', mb: 118 },
]

function StatusDot({ tone = 'green' }: { tone?: 'green' | 'orange' | 'gray' }) {
  return <span className={`status-dot ${tone}`} aria-hidden="true" />
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action}</div>
}

function XrayIllustration({ heatmap }: { heatmap: boolean }) {
  return <div className="xray-frame" aria-label="Chest X-ray preview">
    <div className="xray-label">AP / PORTABLE <span>•</span> 09:41:27</div>
    <svg viewBox="0 0 430 300" role="img" aria-label="Stylized chest X-ray showing lungs">
      <defs>
        <radialGradient id="lung" cx="50%" cy="44%" r="62%"><stop offset="0" stopColor="#d8e6e9" stopOpacity=".9"/><stop offset="1" stopColor="#54717a" stopOpacity=".3"/></radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="7" /></filter>
        <linearGradient id="bone" x1="0" x2="1"><stop stopColor="#d9e7e8" stopOpacity=".2"/><stop offset=".5" stopColor="#eff8f7" stopOpacity=".9"/><stop offset="1" stopColor="#d9e7e8" stopOpacity=".2"/></linearGradient>
      </defs>
      <rect width="430" height="300" fill="#14252d"/>
      <path d="M215 32 C182 44 158 72 150 106 C142 142 142 207 166 260 L214 278 L264 260 C287 208 287 142 279 106 C270 71 246 44 215 32Z" fill="#829b9f" opacity=".16"/>
      <path d="M205 61 C175 69 157 106 159 151 C161 205 178 232 207 246 C216 213 216 119 205 61Z" fill="url(#lung)"/>
      <path d="M225 61 C255 69 273 106 271 151 C269 205 252 232 223 246 C214 213 214 119 225 61Z" fill="url(#lung)"/>
      <path d="M215 43 L215 262 M183 55 C203 91 205 206 188 248 M247 55 C227 91 225 206 242 248" stroke="url(#bone)" strokeWidth="3" fill="none" opacity=".8"/>
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${170 - i * 2} ${78 + i * 20} Q215 ${66 + i * 17} ${260 + i * 2} ${78 + i * 20}`} stroke="#d9e7e8" strokeOpacity=".23" fill="none" strokeWidth="2" />)}
      <path d="M205 247 Q215 260 225 247" stroke="#f1faf9" strokeOpacity=".5" fill="none" strokeWidth="3"/>
      {heatmap && <><ellipse cx="178" cy="169" rx="33" ry="45" fill="#ef8b4d" opacity=".55" filter="url(#glow)"/><ellipse cx="246" cy="149" rx="26" ry="40" fill="#f2505f" opacity=".5" filter="url(#glow)"/><ellipse cx="184" cy="170" rx="26" ry="36" fill="#ec5f4f" opacity=".42"/></>}
    </svg>
    <div className="xray-scale"><span>R</span><span>PA</span><span>L</span></div>
    <div className="heatmap-legend"><span><i className="legend-hot"/> High activation</span><span><i className="legend-cool"/> Low activation</span></div>
  </div>
}

export default function Page() {
  const [caseKey, setCaseKey] = useState<keyof typeof patients>('A')
  const [heatmap, setHeatmap] = useState(true)
  const [activeTab, setActiveTab] = useState('Chest X-Ray')
  const [citation, setCitation] = useState('Doc #2, Pg 4')
  const [running, setRunning] = useState(false)
  const patient = patients[caseKey]
  const tabs = ['Chest X-Ray', 'ECG Signal', 'Patient History']
  const activePatients = useMemo(() => caseKey === 'B' ? ['Heart'] : ['Heart'], [caseKey])

  function execute() {
    setRunning(true)
    window.setTimeout(() => setRunning(false), 1800)
  }

  return <main className="clinical-app">
    <div className="disclaimer"><AlertTriangle /> <strong>Screening &amp; Decision Support System</strong><span>— Not Autonomous Diagnosis</span><button aria-label="Dismiss disclaimer"><X /></button></div>
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Stethoscope /></div><div><strong>Med<span>Lens</span> AI</strong><small>CLINICAL INTELLIGENCE PLATFORM</small></div></div>
      <div className="topbar-meta"><span className="live-pill"><StatusDot /> SYSTEM OPERATIONAL</span><span className="divider"/><span className="user-meta"><span className="avatar">DR</span> Dr. Riley Morgan <ChevronDown /></span></div>
    </header>

    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-label">WORKSPACE</div>
        <nav><a className="nav-item selected"><ScanLine /> Screening <span>01</span></a><a className="nav-item"><Layers3 /> Patient Cases <span>03</span></a><a className="nav-item"><Network /> Model Registry</a><a className="nav-item"><MonitorCog /> System Health</a></nav>
        <div className="sidebar-bottom"><div className="sidebar-label">SESSION</div><div className="session-card"><div className="session-icon"><ShieldCheck /></div><div><strong>HIPAA Secure</strong><small>Session encrypted</small></div><StatusDot /></div><p className="version">MEDLENS AI v2.4.1 <span>·</span> EL-04</p></div>
      </aside>

      <section className="content">
        <div className="page-head"><div><p className="eyebrow">MULTIMODAL SCREENING / EL-04</p><h1>Clinical Intelligence Workspace</h1><p className="subhead">Orchestrate AI models, synthesize findings, and maintain a traceable clinical record.</p></div><div className="head-actions"><button className="icon-button" aria-label="Help"><CircleHelp /></button><button className="primary-button" onClick={execute} disabled={running}><Zap /> {running ? 'Running screening…' : 'Execute Multimodal Screening'} <ArrowUpRight /></button></div></div>

        <div className="patient-bar"><div className="patient-heading"><div className="patient-avatar"><UserRound /></div><div><span>ACTIVE PATIENT</span><strong>{patient.name}</strong></div></div><div className="patient-stats"><div><span>AGE</span><strong>{patient.age} <em>yrs</em></strong></div><div><span>PATIENT ID</span><strong className="mono">{patient.id}</strong></div><div className="case-select"><span>CASE PRESET</span><select value={caseKey} onChange={e => setCaseKey(e.target.value as keyof typeof patients)} aria-label="Select patient case"><option value="A">Case A · Chest X-Ray + Asthma History</option><option value="B">Case B · ECG + Arrhythmia</option><option value="C">Case C · Skin Lesion</option></select></div></div><div className="patient-status"><StatusDot /><span>SCREENING READY</span></div></div>

        <div className="grid-two main-grid">
          <section className="panel orchestrator"><SectionHeading eyebrow="MODEL ORCHESTRATOR" title="Dynamic Resource Allocation" action={<span className="small-status"><StatusDot /> LIVE MONITORING</span>} />
            <div className="chart-top"><div><strong>Real-Time System Memory Footprint <small>(MB)</small></strong><p><span className="chart-line-key"/> Model lifecycle telemetry</p></div><div className="ram-readout"><strong>118 <small>MB</small></strong><span>Current footprint</span></div></div>
            <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={memoryData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}><defs><linearGradient id="ramFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#23b8a4" stopOpacity=".32"/><stop offset="100%" stopColor="#23b8a4" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e6edf0" vertical={false}/><XAxis dataKey="time" tick={{ fontSize: 10, fill: '#819099' }} tickLine={false} axisLine={false} interval={2}/><YAxis domain={[0, 1300]} ticks={[0, 300, 600, 900, 1200]} tick={{ fontSize: 10, fill: '#819099' }} tickLine={false} axisLine={false}/><Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #dce6e9', boxShadow: '0 6px 20px #17323c15', fontSize: 12 }} formatter={(value) => [`${value} MB`, 'Memory']}/><Area type="monotone" dataKey="mb" stroke="#18a994" strokeWidth={2.5} fill="url(#ramFill)"/></AreaChart></ResponsiveContainer><div className="offload-note"><span>↑ MobileNetV3 loaded</span><span>↓ gc.collect() / offloaded</span></div></div>
            <div className="model-list"><div className="model-item"><div className="model-icon lung-icon"><Activity /></div><div><strong>Lungs <small>· MobileNetV3</small></strong><span>Dynamic vision model</span></div><span className="model-badge gray">Unloaded</span></div><div className="model-item"><div className="model-icon brain-icon"><Brain /></div><div><strong>Brain <small>· BioBERT</small></strong><span>Clinical NLP model</span></div><span className="model-badge gray">Unloaded</span></div><div className="model-item"><div className="model-icon heart-icon"><HeartPulse /></div><div><strong>Heart <small>· ECGNet</small></strong><span>Signal classification</span></div><span className="model-badge green">Active</span></div><div className="model-item"><div className="model-icon skin-icon"><Sparkles /></div><div><strong>Skin <small>· EfficientNet</small></strong><span>Dermatology vision model</span></div><span className="model-badge gray">Unloaded</span></div></div>
          </section>

          <section className="panel findings"><SectionHeading eyebrow="UNIFIED CLINICAL OUTPUT" title="Clinical Findings" action={<button className="more-button" aria-label="More options"><MoreHorizontal /></button>} /><div className="finding-summary"><div className="summary-icon"><AlertTriangle /></div><div><strong>1 finding requires attention</strong><span>Cross-modal synthesis complete · 09:42:52</span></div><span className="confidence-pill">96% overall confidence</span></div><div className="table-wrap"><table><thead><tr><th>MODALITY</th><th>DETECTED CONDITION</th><th>CONFIDENCE</th><th>ACTION</th></tr></thead><tbody><tr><td><span className="modality"><span className="table-icon orange"><Activity /></span>Respiratory <small>X-Ray</small></span></td><td><strong>{caseKey === 'B' ? 'Clear lung fields' : caseKey === 'C' ? 'No acute findings' : 'Pneumonia / Infiltrate'}</strong></td><td><strong className="score alert">{caseKey === 'A' ? '92%' : caseKey === 'B' ? '94%' : '89%'}</strong></td><td><span className={`action-badge ${caseKey === 'A' ? 'urgent' : 'normal'}`}>{caseKey === 'A' ? 'High Urgency' : 'Review'}</span></td></tr><tr><td><span className="modality"><span className="table-icon purple"><HeartPulse /></span>Heart <small>ECG</small></span></td><td><strong>{caseKey === 'B' ? 'Sinus Rhythm' : 'Sinus Rhythm'}</strong></td><td><strong className="score good">98%</strong></td><td><span className="action-badge normal">Normal</span></td></tr><tr><td><span className="modality"><span className="table-icon blue"><FileText /></span>History <small>PDF RAG</small></span></td><td><strong>Prior Chronic Asthma <small>(2018)</small></strong></td><td><strong className="score verified"><Check /> Verified</strong></td><td><span className="action-badge context">Historical Context</span></td></tr></tbody></table></div></section>
        </div>

        <div className="grid-two lower-grid">
          <section className="panel viewer"><SectionHeading eyebrow="MULTIMODAL INPUTS" title="Evidence Viewer" action={<button className="upload-button"><Upload /> Upload evidence</button>} /><div className="tabs">{tabs.map(tab => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}{tab === 'Chest X-Ray' && <span className="tab-dot"/>}</button>)}</div>{activeTab === 'Chest X-Ray' ? <><div className="viewer-toolbar"><span><span className="file-dot"/> CXR_PA_2024-08-19.dcm <small>2.4 MB · DICOM</small></span><button className={`toggle ${heatmap ? 'on' : ''}`} onClick={() => setHeatmap(!heatmap)} aria-pressed={heatmap}><span/><span>Grad-CAM Explainability Heatmap</span></button></div><XrayIllustration heatmap={heatmap}/></> : <div className="empty-view"><FileText /><strong>{activeTab === 'ECG Signal' ? 'ECG Signal Trace' : 'Patient History PDF'}</strong><span>Evidence preview available in the source document tab.</span></div>}</section>

          <section className="panel rag"><SectionHeading eyebrow="PATIENT-CENTRIC RAG TRACEABILITY" title="Synthesized Assessment" action={<span className="trace-pill"><Wifi /> TRACEABLE</span>} /><div className="assessment"><div className="assessment-copy"><div className="ai-label"><Sparkles /> AI SYNTHESIZED ASSESSMENT</div><h3>Findings indicate a probable <mark>right lower lobe infiltrate</mark> consistent with pneumonia.</h3><p>This finding is supported by the radiographic pattern and the patient&apos;s documented history of chronic asthma. Cardiac rhythm appears normal with no acute arrhythmia detected.</p><div className="assessment-footer"><span><Clock3 /> Generated 09:42:52</span><span><ShieldCheck /> Human review required</span></div></div><div className="citations"><div className="ai-label"><FileText /> SOURCE DOCUMENT CITATIONS</div><button className={`citation ${citation === 'Doc #1, Pg 2' ? 'selected' : ''}`} onClick={() => setCitation('Doc #1, Pg 2')}><span className="citation-num">01</span><span><strong>Chest X-Ray Report</strong><small>Doc #1, Pg 2 · Radiology</small></span><ArrowUpRight /></button><button className={`citation ${citation === 'Doc #2, Pg 4' ? 'selected' : ''}`} onClick={() => setCitation('Doc #2, Pg 4')}><span className="citation-num">02</span><span><strong>Patient History</strong><small>Doc #2, Pg 4 · Pulmonology</small></span><ArrowUpRight /></button><div className="snippet"><span className="quote-mark">“</span><p>{citation === 'Doc #2, Pg 4' ? 'Patient diagnosed with chronic asthma in 2018. Maintenance therapy ongoing; no prior hospitalizations.' : 'Patchy opacity noted in the right lower lobe. Recommend clinical correlation and follow-up.'}</p><span className="snippet-ref">[{citation}]</span></div></div></div></section>
        </div>
        <footer className="footer"><span><ShieldCheck /> All data encrypted in transit and at rest</span><span>Last model sync: 2 min ago <span className="status-dot green"/></span></footer>
      </section>
    </div>
  </main>
}
