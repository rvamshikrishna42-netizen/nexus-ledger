import React, { useState } from 'react'
import {
  Fingerprint, Plus, CheckCircle, XCircle, Eye, RefreshCw,
  Copy, ExternalLink, Shield, Clock, Key, AlertCircle, Award, FileText, Check
} from 'lucide-react'
import { DEMO_DIDS } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import { useTrustCore } from '../context/TrustCoreContext'

const SPECIFIED_IDENTITY = {
  did: 'did:nexus:7a82e4f981b2c3d4e5f60718293a4b5c',
  shortDid: 'did:nexus:7a82e4f9...',
  status: 'VERIFIED',
  publicKey: '0x73c94a821e5b7290f1d48c3a91fc',
  shortPublicKey: '0x73c9...91fc',
  role: 'USER',
  keyType: 'Ed25519VerificationKey2020',
  issuer: 'Bharat Electronics Defense Authority',
  credentials: [
    { name: 'Academic Degree', issuer: 'National Defense Academy', status: 'VERIFIED', hash: '0x8f73...1a3c' },
    { name: 'Identity Document', issuer: 'UIDAI Sovereign Enclave', status: 'VERIFIED', hash: '0x3c9e...4a6b' },
    { name: 'Profile Certificate', issuer: 'BEL Security Clearance Registry', status: 'VERIFIED', hash: '0x7d2f...6b8a' },
    { name: 'Skill Certificate', issuer: 'Cyber Defense Center of Excellence', status: 'VERIFIED', hash: '0x2a4c...7c9e' },
  ]
}

export default function Identity() {
  const { activeModule, setActiveModule } = useTrustCore()
  const [dids, setDids] = useState(DEMO_DIDS)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
              DECENTRALIZED IDENTITY VAULT (W3C DID)
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Identity Vault & Credentials
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Cryptographic key pairs and verifiable credential attestations anchored to consensus.
          </p>
        </div>
      </div>

      {/* Featured Primary Sovereign Identity Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 via-[#070b18] to-emerald-600/5 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Fingerprint size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">DECENTRALIZED IDENTIFIER</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    {SPECIFIED_IDENTITY.status}
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <span>{SPECIFIED_IDENTITY.did}</span>
                  <button
                    onClick={() => copyToClipboard(SPECIFIED_IDENTITY.did)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Copy DID"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Core Metadata Table */}
            <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
              <div>
                <div className="text-[10px] text-gray-500 uppercase">PUBLIC KEY</div>
                <div className="text-xs font-bold text-cyan-400 truncate mt-0.5" title={SPECIFIED_IDENTITY.publicKey}>
                  {SPECIFIED_IDENTITY.publicKey}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 uppercase">ROLE</div>
                <div className="text-xs font-bold text-white mt-0.5">
                  {SPECIFIED_IDENTITY.role}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 uppercase">KEY SPECIFICATION</div>
                <div className="text-xs font-bold text-gray-300 mt-0.5">
                  {SPECIFIED_IDENTITY.keyType}
                </div>
              </div>
            </div>
          </div>

          {/* Holographic Verification Badge Indicator */}
          <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-center min-w-[220px]">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-2">
              <Shield size={20} />
            </div>
            <div className="text-xs font-bold text-emerald-400">3D HOLOGRAM ACTIVE</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Synchronized with 3D Trust Core</div>
          </div>
        </div>

        {/* Credentials Attached */}
        <div className="mt-6 pt-5 border-t border-white/5">
          <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
            Attested Credentials (4 Anchored)
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SPECIFIED_IDENTITY.credentials.map((cred) => (
              <div
                key={cred.name}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs font-bold text-white">{cred.name}</div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {cred.status}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 truncate mb-2">{cred.issuer}</div>
                <div className="text-[9px] text-gray-600 truncate">Hash: {cred.hash}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DID Registry Matrix */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Sovereign Enclave Identity Registry
        </div>
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#070b18]/90">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-400 uppercase">
              <tr>
                <th className="p-3.5">DID</th>
                <th className="p-3.5">Owner / Entity</th>
                <th className="p-3.5">Key Type</th>
                <th className="p-3.5">On-Chain Tx</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dids.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-bold text-cyan-400 truncate max-w-[180px]">
                    {item.did}
                  </td>
                  <td className="p-3.5 text-white">{item.owner}</td>
                  <td className="p-3.5 text-gray-400">{item.keyType}</td>
                  <td className="p-3.5 text-gray-500 truncate max-w-[140px]">{item.blockchainTx}</td>
                  <td className="p-3.5">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
