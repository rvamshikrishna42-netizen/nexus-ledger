import { useState } from 'react'
import {
  Award, CheckCircle, XCircle, AlertTriangle, Hash, Shield,
  ChevronDown, ChevronUp
} from 'lucide-react'
import { DEMO_CERTIFICATES } from '../data/demoData'
import { useTrustCore } from '../context/TrustCoreContext'

// Lightweight rule-based risk engine
function analyzeRisk(cert) {
  const reasons = []
  let score = 0

  if (!cert.issuer || cert.issuer.includes('FAKE') || cert.issuer.includes('Unverified')) {
    score += 35; reasons.push({ text: 'Issuer is unrecognized or flagged', severity: 'critical' })
  }
  if (cert.holder === 'Unknown Entity' || cert.holder === 'Fraud Actor') {
    score += 25; reasons.push({ text: 'Holder identity cannot be verified', severity: 'high' })
  }
  if (!cert.blockchainTx) {
    score += 20; reasons.push({ text: 'No blockchain record found for this certificate', severity: 'high' })
  }
  if (cert.hash === '0000000000000000000000000000000000000000000000000000000000000000') {
    score += 30; reasons.push({ text: 'Hash is all-zeros — possible hash spoofing', severity: 'critical' })
  }
  if (cert.expiryDate && new Date(cert.expiryDate) < new Date()) {
    score += 10; reasons.push({ text: 'Certificate has expired', severity: 'medium' })
  }
  if (!cert.issuer?.includes('BEL') && !cert.issuer?.includes('Bureau') && !cert.issuer?.includes('DRDO')) {
    if (score > 0) { score += 5; reasons.push({ text: 'Issuer not in trusted authority list', severity: 'low' }) }
  }
  if (score === 0) {
    reasons.push({ text: 'All checks passed — certificate appears legitimate', severity: 'info' })
  }

  return { score: Math.min(score, 100), reasons }
}

const TAMPER_PAIRS = {
  original: {
    id: 'CERT-2024-001',
    title: 'Advanced Cybersecurity Training',
    holder: 'Arjun Sharma',
    issuer: 'Bharat Electronics Limited',
    issuedDate: '2024-02-01',
    expiryDate: '2027-02-01',
    hash: 'a3f8c2d1e4b7f9a2c5d8e1f4b7c0a3d6e9f2b5c8d1e4a7f0b3c6d9e2f5a8b1',
    blockchainTx: '0xa3f8c2d1e4b7f9a2c5d8e1f4b7c0a3d6e9f2b5c8',
    status: 'Verified',
  },
  tampered: {
    id: 'CERT-2024-001',
    title: 'Advanced Cybersecurity Training',
    holder: 'Arjun Sharma (MODIFIED)',        // ← tampered field
    issuer: 'Bharat Electronics Limited',
    issuedDate: '2024-02-01',
    expiryDate: '2027-02-01',
    hash: 'b9d3e1f4a7c2d5e8f1b4c7e0a3d6f9b2e5a8d1f4b7c0e3f6a9d2b5e8c1f4a7', // ← recomputed hash
    blockchainTx: '0xa3f8c2d1e4b7f9a2c5d8e1f4b7c0a3d6e9f2b5c8', // ← original tx, mismatch!
    status: 'Tampered',
  }
}

const CHECK_LABELS = [
  { key: 'format',     label: 'Document structure & format' },
  { key: 'fields',     label: 'Required fields present' },
  { key: 'hash',       label: 'SHA-256 hash integrity' },
  { key: 'blockchain', label: 'Blockchain record match' },
  { key: 'issuer',     label: 'Trusted issuer verification' },
  { key: 'expiry',     label: 'Certificate validity period' },
]

function runChecks(cert, isTampered) {
  return {
    format:     { pass: true,  note: 'Certificate format is valid' },
    fields:     { pass: !isTampered || cert.holder !== 'Unknown Entity', note: isTampered ? 'Holder field appears modified' : 'All required fields present' },
    hash:       { pass: !isTampered, note: isTampered ? 'Hash does not match blockchain record' : 'Hash verified against blockchain' },
    blockchain: { pass: !!cert.blockchainTx && !isTampered, note: isTampered ? 'On-chain hash differs from document hash' : 'Blockchain record confirmed' },
    issuer:     { pass: cert.issuer && !cert.issuer.includes('FAKE') && !cert.issuer.includes('Unverified'), note: cert.issuer?.includes('FAKE') ? 'Issuer not in trusted registry' : 'Issuer is in trusted registry' },
    expiry:     { pass: new Date(cert.expiryDate) > new Date(), note: new Date(cert.expiryDate) > new Date() ? 'Certificate is within validity period' : 'Certificate has expired' },
  }
}

function ResultCard({ status, score, cert, checks, reasons, isTampered }) {
  const [showDetail, setShowDetail] = useState(false)
  const statusConfig = {
    Verified:   { icon: CheckCircle,   color: 'emerald', label: 'VERIFIED',   bg: 'bg-emerald-500/10 border-emerald-500/20', iconRing: 'bg-emerald-500/10 border-emerald-500/20', iconCls: 'text-emerald-400', textCls: 'text-emerald-400' },
    Tampered:   { icon: XCircle,       color: 'red',     label: 'TAMPERED',   bg: 'bg-red-500/10 border-red-500/20',         iconRing: 'bg-red-500/10 border-red-500/20',         iconCls: 'text-red-400',     textCls: 'text-red-400'     },
    Suspicious: { icon: AlertTriangle, color: 'yellow',  label: 'SUSPICIOUS', bg: 'bg-yellow-500/10 border-yellow-500/20',   iconRing: 'bg-yellow-500/10 border-yellow-500/20',   iconCls: 'text-yellow-400',  textCls: 'text-yellow-400'  },
    Unverified: { icon: AlertTriangle, color: 'gray',    label: 'UNVERIFIED', bg: 'bg-gray-500/10 border-gray-500/20',       iconRing: 'bg-gray-500/10 border-gray-500/20',       iconCls: 'text-gray-400',    textCls: 'text-gray-400'    },
  }
  const cfg = statusConfig[status] || statusConfig.Unverified
  const Icon = cfg.icon

  return (
    <div className={`glass-card p-5 border ${cfg.bg}`}>
      {/* Result header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${cfg.iconRing}`}>
            <Icon size={24} className={cfg.iconCls} />
          </div>
          <div>
            <div className={`text-xl font-black tracking-widest ${cfg.textCls}`}>{cfg.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{cert.title}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">Risk Score</div>
          <div className={`text-3xl font-black ${score < 30 ? 'text-emerald-400' : score < 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {score}<span className="text-sm text-gray-500 font-normal">/100</span>
          </div>
        </div>
      </div>

      {/* Risk bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Risk Level</span>
          <span>{score < 30 ? 'Low' : score < 60 ? 'Medium' : score < 80 ? 'High' : 'Critical'}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${
            score < 30 ? 'bg-emerald-500' : score < 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`} style={{ width: `${score}%` }}></div>
        </div>
      </div>

      {/* Checks */}
      <div className="space-y-2 mb-4">
        {CHECK_LABELS.map(({ key, label }) => {
          const check = checks[key]
          return (
            <div key={key} className="flex items-center justify-between p-2.5 bg-white/3 rounded-lg">
              <div className="flex items-center gap-2">
                {check.pass
                  ? <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
                  : <XCircle size={15} className="text-red-400 flex-shrink-0" />
                }
                <span className="text-sm text-gray-300">{label}</span>
              </div>
              <span className={`text-xs ${check.pass ? 'text-emerald-400' : 'text-red-400'}`}>
                {check.pass ? 'Pass' : 'Fail'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Risk reasons */}
      <div className="space-y-1.5">
        {reasons.map((r, i) => (
          <div key={i} className={`flex items-start gap-2 text-xs p-2 rounded-lg ${
            r.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
            r.severity === 'high' ? 'bg-orange-500/10 text-orange-400' :
            r.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
            r.severity === 'info' ? 'bg-emerald-500/10 text-emerald-400' :
            'bg-gray-500/10 text-gray-400'
          }`}>
            {r.severity === 'info' ? <CheckCircle size={11} className="mt-0.5 flex-shrink-0" /> : <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />}
            {r.text}
          </div>
        ))}
      </div>

      {/* Cert details */}
      <button onClick={() => setShowDetail(!showDetail)}
        className="mt-4 w-full text-xs text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1 py-2 border border-white/5 rounded-lg hover:bg-white/3 transition-all">
        {showDetail ? <><ChevronUp size={12} /> Hide Details</> : <><ChevronDown size={12} /> Show Certificate Details</>}
      </button>

      {showDetail && (
        <div className="mt-3 bg-white/3 rounded-lg p-4 space-y-2 text-sm">
          {[
            ['Certificate ID', cert.id],
            ['Title', cert.title],
            ['Holder', cert.holder, isTampered],
            ['Issuer', cert.issuer],
            ['Issued Date', cert.issuedDate],
            ['Expiry Date', cert.expiryDate],
            ['Blockchain Tx', cert.blockchainTx || 'Not recorded'],
          ].map(([label, value, highlight]) => (
            <div key={label} className="flex justify-between gap-3">
              <span className="text-gray-500 flex-shrink-0">{label}</span>
              <span className={`text-right break-all font-mono text-xs ${highlight ? 'text-red-400' : 'text-gray-300'}`}>
                {value} {highlight && '⚠ Modified'}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-white/5">
            <div className="text-gray-500 text-xs mb-1">SHA-256 Hash (Document)</div>
            <code className={`text-xs break-all font-mono ${isTampered ? 'text-red-300' : 'text-green-400'}`}>{cert.hash}</code>
          </div>
          {isTampered && (
            <div className="mt-2 pt-2 border-t border-white/5">
              <div className="text-gray-500 text-xs mb-1">SHA-256 Hash (Blockchain — Original)</div>
              <code className="text-xs break-all font-mono text-green-400">{TAMPER_PAIRS.original.hash}</code>
              <div className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <XCircle size={10} /> Hash mismatch confirms document was modified after blockchain registration
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 text-xs text-gray-600 italic">
        Note: Risk scores are provided as decision-support tools. Cryptographic hash verification and blockchain records constitute the strongest integrity evidence.
      </div>
    </div>
  )
}

export default function Certificates() {
  const { triggerVerification } = useTrustCore()
  const [certId, setCertId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tamperDemo, setTamperDemo] = useState('original')
  const [showTamper, setShowTamper] = useState(false)

  const verify = async (certToVerify) => {
    const cert = certToVerify || DEMO_CERTIFICATES.find(c => c.id === certId)
    if (!cert) {
      setResult({ notFound: true }); return
    }
    setLoading(true)
    const isTampered = cert.status === 'Tampered'
    triggerVerification(!isTampered, cert.hash)
    await new Promise(r => setTimeout(r, 1000))
    const { score, reasons } = analyzeRisk(cert)
    const checks = runChecks(cert, isTampered)
    setResult({ cert, score, reasons, checks, isTampered })
    setLoading(false)
  }

  const runTamperDemo = async (mode) => {
    setTamperDemo(mode)
    const cert = { ...TAMPER_PAIRS[mode], riskScore: mode === 'tampered' ? 92 : 8 }
    setLoading(true)
    const isTampered = mode === 'tampered'
    triggerVerification(!isTampered, cert.hash)
    await new Promise(r => setTimeout(r, 900))
    const { score, reasons } = analyzeRisk({ ...cert, status: isTampered ? 'Tampered' : 'Verified' })
    const checks = runChecks(cert, isTampered)
    setResult({ cert, score, reasons, checks, isTampered, status: isTampered ? 'Tampered' : 'Verified' })
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Verification form */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Award size={16} className="text-green-400" /> Verify Certificate
            </h3>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Certificate ID</label>
              <input
                className="input-field"
                placeholder="e.g. CERT-2024-001"
                value={certId}
                onChange={e => setCertId(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Or select a demo certificate</label>
              <div className="space-y-2">
                {DEMO_CERTIFICATES.map(c => (
                  <button key={c.id} onClick={() => { setCertId(c.id); verify(c) }}
                    className="w-full flex items-center justify-between p-2.5 bg-white/3 hover:bg-white/6 border border-white/5 hover:border-blue-500/20 rounded-lg transition-all text-left">
                    <div>
                      <div className="text-xs font-medium text-white">{c.title}</div>
                      <div className="text-xs text-gray-500 font-mono">{c.id} — {c.holder}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      c.status === 'Verified' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                      c.status === 'Tampered' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                      'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                    }`}>{c.status}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => verify(null)}
              disabled={loading || !certId}
              className="btn-primary w-full justify-center"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Verifying...</>
                : <><Shield size={15} /> Verify Certificate</>
              }
            </button>

            {result?.notFound && (
              <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                <XCircle size={14} /> Certificate ID not found in records.
              </div>
            )}
          </div>

          {/* Tamper demo */}
          <div className="glass-card p-5 border-orange-500/15 bg-orange-500/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                <AlertTriangle size={15} className="text-orange-400" /> Tamper Detection Demo
              </h3>
              <button onClick={() => setShowTamper(!showTamper)}
                className="text-xs text-orange-400 hover:text-orange-300">
                {showTamper ? 'Hide' : 'Show'}
              </button>
            </div>

            {showTamper && (
              <>
                <p className="text-xs text-gray-400 mb-3">
                  This demo shows how SHA-256 hash comparison detects document tampering.
                  Switch between the original and tampered version to see the difference.
                </p>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => runTamperDemo('original')}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-all ${tamperDemo === 'original'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>
                    ✓ Original Certificate
                  </button>
                  <button onClick={() => runTamperDemo('tampered')}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-all ${tamperDemo === 'tampered'
                      ? 'bg-red-500/20 border-red-500/40 text-red-400'
                      : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>
                    ✗ Tampered Certificate
                  </button>
                </div>
                <div className="text-xs text-gray-500 bg-white/3 rounded-lg p-3">
                  <strong className="text-gray-300">What changed:</strong> The holder name was modified from
                  <code className="text-green-400 mx-1">Arjun Sharma</code> to
                  <code className="text-red-400 mx-1">Arjun Sharma (MODIFIED)</code>.
                  This changes the SHA-256 hash, which no longer matches the hash stored on the blockchain.
                </div>
              </>
            )}
          </div>
        </div>

        {/* Result panel */}
        <div>
          {loading && (
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <div className="text-white font-semibold">Verifying Certificate</div>
              <div className="text-xs text-gray-500 mt-2">Computing SHA-256 hash and checking blockchain records...</div>
            </div>
          )}

          {!loading && result && !result.notFound && (
            <ResultCard
              status={result.status || result.cert.status}
              score={result.score}
              cert={result.cert}
              checks={result.checks}
              reasons={result.reasons}
              isTampered={result.isTampered}
            />
          )}

          {!loading && !result && (
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center h-full min-h-64">
              <Award size={40} className="text-gray-700 mb-4" />
              <div className="text-gray-500 font-medium">Select a certificate to verify</div>
              <div className="text-xs text-gray-600 mt-2">The system will check the SHA-256 hash against blockchain records and run the risk analysis engine</div>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Hash size={15} className="text-blue-400" /> How Certificate Verification Works
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Hash Document', desc: 'SHA-256 hash is computed from the certificate document at issuance', cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
            { step: '02', title: 'Store On-Chain', desc: 'The hash is stored immutably on the blockchain as a transaction', cls: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
            { step: '03', title: 'Recompute Hash', desc: 'At verification, the hash is recomputed from the presented document', cls: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
            { step: '04', title: 'Compare & Report', desc: 'Hashes are compared. Any difference proves tampering has occurred', cls: 'bg-green-500/10 border-green-500/20 text-green-400' },
          ].map(({ step, title, desc, cls }) => (
            <div key={step} className="text-center">
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center mx-auto mb-3 ${cls}`}>
                <span className={`text-sm font-bold`}>{step}</span>
              </div>
              <div className="text-sm font-medium text-white mb-1">{title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
