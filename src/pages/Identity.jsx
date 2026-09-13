import { useState } from 'react'
import {
  Fingerprint, Plus, CheckCircle, XCircle, Eye, RefreshCw,
  Copy, ExternalLink, Shield, Clock, Key, AlertCircle
} from 'lucide-react'
import { DEMO_DIDS } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'

function generateDID() {
  return 'did:nexus:' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

function QRDisplay({ did }) {
  // Simple visual QR placeholder using the DID hash to create a grid pattern
  const chars = did.replace('did:nexus:', '')
  const grid = Array.from({ length: 10 }, (_, r) =>
    Array.from({ length: 10 }, (_, c) => {
      const idx = (r * 10 + c) % chars.length
      return parseInt(chars[idx], 16) > 7
    })
  )
  return (
    <div className="inline-block p-3 bg-white rounded-lg">
      {grid.map((row, r) => (
        <div key={r} className="flex">
          {row.map((filled, c) => (
            <div key={c} className={`w-3 h-3 ${filled ? 'bg-[#0a0e1a]' : 'bg-white'}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

function DIDModal({ did, onClose }) {
  const [copied, setCopied] = useState(false)
  const copy = (text) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Fingerprint size={16} className="text-blue-400" /> DID Details
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><XCircle size={18} /></button>
        </div>

        {/* QR */}
        <div className="flex justify-center mb-5">
          <div className="text-center">
            <QRDisplay did={did.did} />
            <div className="text-xs text-gray-500 mt-2">Verification QR</div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {[
            { label: 'DID', value: did.did, mono: true },
            { label: 'Owner', value: did.owner },
            { label: 'Email', value: did.email },
            { label: 'Method', value: did.method },
            { label: 'Key Type', value: did.keyType, mono: true },
            { label: 'Public Key', value: did.publicKey, mono: true },
            { label: 'Blockchain Tx', value: did.blockchainTx, mono: true },
            { label: 'Block Number', value: did.blockNumber?.toString() || 'Pending' },
            { label: 'Created', value: new Date(did.created).toLocaleString() },
            { label: 'Last Verified', value: did.lastVerified ? new Date(did.lastVerified).toLocaleString() : 'Not verified' },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-start justify-between gap-4 py-1.5 border-b border-white/5">
              <span className="text-gray-500 flex-shrink-0 w-32">{label}</span>
              <span className={`text-gray-200 text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-1.5 border-b border-white/5">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={did.status} />
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-500">Verified</span>
            {did.verified
              ? <span className="badge-green"><CheckCircle size={10} /> Verified</span>
              : <span className="badge-yellow"><Clock size={10} /> Pending</span>
            }
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={() => copy(did.did)} className="btn-secondary flex-1 justify-center text-sm">
            <Copy size={14} /> {copied ? 'Copied!' : 'Copy DID'}
          </button>
          <button onClick={onClose} className="btn-primary flex-1 justify-center text-sm">Close</button>
        </div>
      </div>
    </div>
  )
}

function CreateDIDModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const create = async () => {
    if (!name || !email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const newDID = {
      id: `DID-${Date.now()}`,
      did: generateDID(),
      owner: name,
      email,
      status: 'Active',
      verified: false,
      created: new Date().toISOString(),
      lastVerified: null,
      method: 'nexus-v1',
      publicKey: '',
      keyType: 'Ed25519VerificationKey2020',
      blockchainTx: '0x' + Array.from({length:40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      blockNumber: Math.floor(Math.random() * 1000) + 19000000,
    }
    newDID.publicKey = newDID.did + '#key-1'
    setLoading(false)
    setResult(newDID)
    onCreated(newDID)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Plus size={16} className="text-blue-400" /> Create New DID
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><XCircle size={18} /></button>
        </div>

        {!result ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                <input className="input-field" placeholder="e.g. Arjun Sharma" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                <input className="input-field" placeholder="arjun@bel.gov.in" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="text-xs text-gray-500 bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                <Key size={12} className="inline mr-1 text-blue-400" />
                A public/private key pair will be generated. The private key is never stored — only the public key is anchored on the blockchain.
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={create} disabled={loading || !name || !email} className="btn-primary flex-1 justify-center">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Anchoring...</>
                ) : 'Create DID'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <CheckCircle size={36} className="text-emerald-400 mx-auto mb-2" />
              <div className="text-white font-semibold">DID Created Successfully</div>
              <div className="text-xs text-gray-500 mt-1">Anchored on blockchain (Demo Mode)</div>
            </div>
            <div className="bg-white/3 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">DID</span>
                <span className="font-mono text-xs text-blue-300 break-all text-right max-w-xs">{result.did}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Block</span>
                <span className="font-mono text-xs text-gray-300">{result.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tx Hash</span>
                <span className="font-mono text-xs text-gray-300 break-all text-right max-w-xs">{result.blockchainTx.slice(0, 20)}...</span>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary w-full justify-center mt-4">Done</button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Identity() {
  const [dids, setDids] = useState(DEMO_DIDS)
  const [selected, setSelected] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [verifying, setVerifying] = useState(null)
  const [filter, setFilter] = useState('All')

  const filtered = dids.filter(d => {
    const matchSearch = d.did.includes(search) || d.owner.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || d.status === filter
    return matchSearch && matchFilter
  })

  const handleVerify = async (id) => {
    setVerifying(id)
    await new Promise(r => setTimeout(r, 1000))
    setDids(prev => prev.map(d => d.id === id ? { ...d, verified: true, lastVerified: new Date().toISOString() } : d))
    setVerifying(null)
  }

  const handleDeactivate = (id) => {
    setDids(prev => prev.map(d => d.id === id ? { ...d, status: 'Deactivated', verified: false } : d))
  }

  const handleCreated = (newDID) => {
    setDids(prev => [newDID, ...prev])
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            className="input-field w-64"
            placeholder="Search by DID, owner, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {['All', 'Active', 'Deactivated'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filter === f
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                : 'border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={15} /> Create DID
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total DIDs', value: dids.length, color: 'text-blue-400' },
          { label: 'Active', value: dids.filter(d => d.status === 'Active').length, color: 'text-emerald-400' },
          { label: 'Verified', value: dids.filter(d => d.verified).length, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* DID table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5 bg-white/2">
              <tr>
                {['DID Identifier', 'Owner', 'Method', 'Status', 'Verified', 'Created', 'Actions'].map(h => (
                  <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(did => (
                <tr key={did.id} className="hover:bg-white/2 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Fingerprint size={14} className="text-blue-400 flex-shrink-0" />
                      <code className="text-xs text-blue-300 font-mono">
                        {did.did.slice(0, 28)}...
                      </code>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-white">{did.owner}</div>
                    <div className="text-xs text-gray-500">{did.email}</div>
                  </td>
                  <td className="table-cell">
                    <code className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">{did.method}</code>
                  </td>
                  <td className="table-cell"><StatusBadge status={did.status} /></td>
                  <td className="table-cell">
                    {did.verified
                      ? <span className="badge-green"><CheckCircle size={10} />Verified</span>
                      : <span className="badge-yellow"><Clock size={10} />Pending</span>
                    }
                  </td>
                  <td className="table-cell text-xs text-gray-500 font-mono">
                    {new Date(did.created).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(did)} className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="View Details">
                        <Eye size={14} />
                      </button>
                      {!did.verified && did.status === 'Active' && (
                        <button onClick={() => handleVerify(did.id)} disabled={verifying === did.id}
                          className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors" title="Verify">
                          <RefreshCw size={14} className={verifying === did.id ? 'animate-spin' : ''} />
                        </button>
                      )}
                      {did.status === 'Active' && (
                        <button onClick={() => handleDeactivate(did.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Deactivate">
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Fingerprint size={32} className="mx-auto mb-3 opacity-30" />
            No identities found.
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="glass-card p-4 bg-blue-500/5 border-blue-500/15">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-blue-300">W3C DID Standard:</strong> All identities follow the W3C Decentralized Identifier specification (did:nexus method).
            Each DID is anchored on the blockchain at creation. Private keys are never stored — only the public verification key is recorded on-chain.
            Verification is performed by checking the DID document against the blockchain record.
          </div>
        </div>
      </div>

      {selected && <DIDModal did={selected} onClose={() => setSelected(null)} />}
      {showCreate && <CreateDIDModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
    </div>
  )
}
