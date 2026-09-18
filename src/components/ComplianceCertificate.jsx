import React, { useState, useRef } from 'react'
import { Award, Download, X, ShieldCheck, Hash, Calendar, Building2, CheckCircle } from 'lucide-react'
import { DEMO_AUDIT_LOGS, DEMO_BLOCKCHAIN_TXS } from '../data/demoData'

// Generate a deterministic certificate ID from current date + a hash fragment
function generateCertId() {
  const year = new Date().getFullYear()
  const fragment = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `NXL-COMP-${year}-${fragment}`
}

// Pick the most recent confirmed blockchain tx hash as the audit reference
function getAuditHashRef() {
  const confirmed = DEMO_BLOCKCHAIN_TXS.filter(tx => tx.status === 'Confirmed')
  if (confirmed.length > 0) return confirmed[confirmed.length - 1].hash
  const withHash = DEMO_AUDIT_LOGS.find(l => l.txHash && l.txHash !== 'null')
  if (withHash) return withHash.txHash
  return '0xf8b1d4e7a0c3f6b9e2a5d8f1b4c7e0a3d6f9b2e5'
}

export default function ComplianceCertificate({ onClose }) {
  const [certId] = useState(generateCertId)
  const [auditHash] = useState(getAuditHashRef)
  const printRef = useRef(null)

  const generatedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const STATUS_ITEMS = [
    { label: 'Identity Status', value: 'VERIFIED', color: 'text-emerald-400' },
    { label: 'Access Control', value: 'ACTIVE', color: 'text-emerald-400' },
    { label: 'Certificates', value: 'VERIFIED', color: 'text-emerald-400' },
    { label: 'Devices', value: 'TRUSTED', color: 'text-emerald-400' },
    { label: 'Security Events', value: 'MONITORED', color: 'text-cyan-400' },
    { label: 'Blockchain Audit', value: 'ENABLED', color: 'text-blue-400' },
  ]

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML
    if (!printContent) return
    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>NEXUS LEDGER — Security Compliance Certificate</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#111;padding:40px}
    .cert-wrapper{max-width:720px;margin:auto;border:2px solid #1e3a5f;border-radius:12px;overflow:hidden}
    .cert-header{background:linear-gradient(135deg,#0a0e1a,#0d1a33);color:#fff;padding:32px 36px;text-align:center}
    .cert-logo{font-size:11px;letter-spacing:3px;color:#60a5fa;margin-bottom:8px;font-weight:700}
    .cert-title{font-size:22px;font-weight:800;letter-spacing:.5px;margin-bottom:4px}
    .cert-subtitle{font-size:12px;color:#93c5fd;letter-spacing:1px}
    .cert-body{padding:32px 36px;background:#fff}
    .cert-org{text-align:center;margin-bottom:28px}
    .cert-org-label{font-size:10px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px}
    .cert-org-name{font-size:16px;font-weight:700;color:#1e3a5f}
    .cert-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}
    .cert-item{border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px}
    .cert-item-label{font-size:10px;color:#6b7280;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px}
    .cert-item-value{font-size:13px;font-weight:700;color:#059669}
    .cert-divider{border:none;border-top:1px solid #e5e7eb;margin:20px 0}
    .cert-hash-section{background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:16px}
    .cert-hash-title{font-size:10px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;font-weight:700}
    .cert-hash-label{font-size:10px;color:#6b7280;margin-bottom:2px}
    .cert-hash-value{font-size:11px;font-family:monospace;color:#1e3a5f;word-break:break-all;background:#fff;border:1px solid #e5e7eb;border-radius:4px;padding:6px 8px;margin-bottom:6px}
    .cert-notice{font-size:10px;color:#9ca3af;font-style:italic;margin-top:6px}
    .cert-footer{background:#f8fafc;border-top:1px solid #e5e7eb;padding:16px 36px;display:flex;justify-content:space-between;align-items:center}
    .cert-id{font-size:11px;font-family:monospace;color:#6b7280}
    .cert-date{font-size:11px;color:#6b7280}
    .cert-verified{font-size:11px;color:#059669;font-weight:700;display:flex;align-items:center;gap:4px}
    @media print{body{padding:0}@page{margin:20mm}}
  </style>
</head>
<body>
  <div class="cert-wrapper">
    <div class="cert-header">
      <div class="cert-logo">NEXUS LEDGER</div>
      <div class="cert-title">SECURITY COMPLIANCE CERTIFICATE</div>
      <div class="cert-subtitle">BLOCKCHAIN-BACKED ENTERPRISE COMPLIANCE</div>
    </div>
    <div class="cert-body">
      <div class="cert-org">
        <div class="cert-org-label">Organization</div>
        <div class="cert-org-name">NEXUS Demo Organization</div>
      </div>
      <div class="cert-grid">
        ${STATUS_ITEMS.map(i => `
          <div class="cert-item">
            <div class="cert-item-label">${i.label}</div>
            <div class="cert-item-value">${i.value}</div>
          </div>
        `).join('')}
      </div>
      <hr class="cert-divider"/>
      <div class="cert-hash-section">
        <div class="cert-hash-title">🔗 Blockchain Verification</div>
        <div class="cert-hash-label">Audit Record Hash (most recent confirmed transaction):</div>
        <div class="cert-hash-value">${auditHash}</div>
        <div class="cert-notice">This is an existing audit record hash from the NEXUS immutable ledger. It is not a new blockchain write — it references a previously confirmed transaction.</div>
      </div>
    </div>
    <div class="cert-footer">
      <div class="cert-id">Certificate ID: ${certId}</div>
      <div class="cert-verified">✓ NEXUS VERIFIED</div>
      <div class="cert-date">Generated: ${generatedDate}</div>
    </div>
  </div>
</body>
</html>`)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#070b18] shadow-2xl font-mono">

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0a0f24]/95 border-b border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Award size={18} className="text-cyan-400" />
            <span className="text-sm font-black text-white tracking-wider">GENERATE COMPLIANCE CERTIFICATE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close certificate"
          >
            <X size={16} />
          </button>
        </div>

        {/* Certificate Preview */}
        <div ref={printRef} className="p-6 space-y-5">

          {/* Header */}
          <div className="rounded-xl overflow-hidden border border-blue-500/20">
            <div className="bg-gradient-to-br from-[#0a0e1a] to-[#0d1a33] px-6 py-7 text-center border-b border-blue-500/20">
              <div className="text-[10px] text-blue-400 font-bold tracking-[3px] uppercase mb-2">NEXUS LEDGER</div>
              <h2 className="text-xl font-black text-white tracking-wide mb-1">SECURITY COMPLIANCE CERTIFICATE</h2>
              <div className="text-[11px] text-blue-300/70 tracking-widest uppercase">BLOCKCHAIN-BACKED ENTERPRISE COMPLIANCE</div>
            </div>

            {/* Org */}
            <div className="bg-[#080d1c] px-6 py-4 text-center border-b border-white/5">
              <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">Organization</div>
              <div className="text-base font-bold text-white">NEXUS Demo Organization</div>
            </div>

            {/* Status Grid */}
            <div className="bg-[#070b18] px-6 py-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STATUS_ITEMS.map(({ label, value, color }) => (
                  <div key={label} className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                    <div className={`text-xs font-black ${color} flex items-center gap-1.5`}>
                      <CheckCircle size={11} />
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="bg-[#080d1c]/80 px-6 py-4 border-t border-white/5">
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Hash size={12} />
                BLOCKCHAIN VERIFICATION
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-gray-500 mb-1">Audit Record Hash (existing confirmed transaction):</div>
                  <div className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-indigo-300 break-all leading-relaxed">
                    {auditHash}
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 italic leading-relaxed">
                  This references an existing confirmed transaction in the NEXUS immutable audit ledger.
                  No new blockchain write has been performed.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#0a0f24] px-6 py-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[10px] text-gray-500">
                Certificate ID: <span className="text-gray-300 font-bold">{certId}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                <ShieldCheck size={11} />
                NEXUS VERIFIED
              </div>
              <div className="text-[10px] text-gray-500 flex items-center gap-1">
                <Calendar size={11} />
                Generated: {generatedDate}
              </div>
            </div>
          </div>

        </div>

        {/* Download/Print Button */}
        <div className="sticky bottom-0 px-6 py-4 bg-[#0a0f24]/95 border-t border-white/5 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="text-[10px] text-gray-500 leading-relaxed">
            Uses browser print. Select "Save as PDF" in the print dialog to download.
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/30 hover:border-cyan-400 transition-all font-semibold text-sm active:scale-95"
          >
            <Download size={15} />
            DOWNLOAD CERTIFICATE
          </button>
        </div>
      </div>
    </div>
  )
}
