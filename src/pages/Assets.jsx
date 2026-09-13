import { useState } from 'react'
import {
  Package, Plus, CheckCircle, XCircle, ArrowRightLeft,
  Eye, Hash, Link2, Shield, Clock, AlertCircle
} from 'lucide-react'
import { DEMO_ASSETS } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'

const TYPE_COLORS = {
  'Training Certificate': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Equipment License':    'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Government Record':    'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Digital Certificate':  'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'Software License':     'text-green-400 bg-green-500/10 border-green-500/20',
}

function sha256Demo(str) {
  // Deterministic fake hash based on string content for demo
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  const base = Math.abs(hash).toString(16).padStart(8, '0')
  return (base + base + base + base + base + base + base + base).slice(0, 64)
}

function AssetModal({ asset, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Package size={16} className="text-purple-400" /> Asset Details
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><XCircle size={18} /></button>
        </div>

        <div className="space-y-3 text-sm">
          {[
            { label: 'Asset ID', value: asset.id, mono: true },
            { label: 'Name', value: asset.name },
            { label: 'Type', value: asset.type },
            { label: 'Owner', value: asset.owner },
            { label: 'NFT Token ID', value: asset.tokenId, mono: true },
            { label: 'Blockchain Tx', value: asset.blockchainTx, mono: true },
            { label: 'Block Number', value: asset.blockNumber?.toString() || 'Pending' },
            { label: 'Created', value: new Date(asset.created).toLocaleString() },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-start justify-between gap-4 py-1.5 border-b border-white/5">
              <span className="text-gray-500 flex-shrink-0 w-32">{label}</span>
              <span className={`text-gray-200 text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-1.5 border-b border-white/5">
            <span className="text-gray-500">Blockchain Status</span>
            <StatusBadge status={asset.blockchainStatus} />
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-white/5">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={asset.status} />
          </div>

          {/* SHA-256 Hash */}
          <div className="bg-white/3 rounded-lg p-3 mt-2">
            <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
              <Hash size={11} /> SHA-256 Integrity Hash
            </div>
            <code className="text-xs text-green-400 break-all font-mono leading-relaxed">{asset.hash}</code>
          </div>

          {/* Metadata */}
          {asset.metadata && (
            <div className="bg-white/3 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1.5">Metadata</div>
              {Object.entries(asset.metadata).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-0.5">
                  <span className="text-gray-500 capitalize">{k}</span>
                  <span className="text-gray-300">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={onClose} className="btn-primary w-full justify-center mt-5">Close</button>
      </div>
    </div>
  )
}

function RegisterModal({ onClose, onRegistered }) {
  const [form, setForm] = useState({ name: '', type: 'Training Certificate', owner: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const register = async () => {
    if (!form.name || !form.owner) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const hash = sha256Demo(form.name + form.owner + Date.now())
    const asset = {
      id: `ASSET-${Date.now()}`,
      name: form.name,
      type: form.type,
      owner: form.owner,
      ownerId: 'DID-' + Date.now(),
      hash,
      tokenId: `NFT-NEW-${Date.now()}`,
      blockchainStatus: 'Confirmed',
      blockchainTx: '0x' + hash.slice(0, 40),
      blockNumber: Math.floor(Math.random() * 1000) + 19000000,
      created: new Date().toISOString(),
      status: 'Active',
      metadata: {},
    }
    setLoading(false)
    setResult(asset)
    onRegistered(asset)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Plus size={16} className="text-purple-400" /> Register Asset
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><XCircle size={18} /></button>
        </div>

        {!result ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Asset Name</label>
                <input className="input-field" placeholder="e.g. BEL Training Certificate" value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Asset Type</label>
                <select className="input-field" value={form.type} onChange={set('type')}>
                  {Object.keys(TYPE_COLORS).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Owner Name / DID</label>
                <input className="input-field" placeholder="e.g. Arjun Sharma" value={form.owner} onChange={set('owner')} />
              </div>
              <div className="text-xs text-gray-500 bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
                <Hash size={12} className="inline mr-1 text-purple-400" />
                A SHA-256 hash will be computed and stored as an NFT on the blockchain. This creates a tamper-proof record of ownership.
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={register} disabled={loading || !form.name || !form.owner} className="btn-primary flex-1 justify-center">
                {loading ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Registering...</> : 'Register Asset'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <CheckCircle size={36} className="text-emerald-400 mx-auto mb-2" />
              <div className="text-white font-semibold">Asset Registered</div>
              <div className="text-xs text-gray-500 mt-1">NFT minted and anchored on blockchain</div>
            </div>
            <div className="bg-white/3 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Token ID</span>
                <span className="font-mono text-xs text-purple-300">{result.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SHA-256</span>
                <span className="font-mono text-xs text-green-300">{result.hash.slice(0, 20)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Block</span>
                <span className="font-mono text-xs text-gray-300">{result.blockNumber}</span>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary w-full justify-center mt-4">Done</button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Assets() {
  const [assets, setAssets] = useState(DEMO_ASSETS)
  const [selected, setSelected] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [transferId, setTransferId] = useState(null)
  const [transferTo, setTransferTo] = useState('')

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.owner.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || a.status === filter
    return matchSearch && matchFilter
  })

  const handleTransfer = (id) => {
    if (!transferTo) return
    setAssets(prev => prev.map(a => a.id === id ? { ...a, owner: transferTo } : a))
    setTransferId(null)
    setTransferTo('')
  }

  const handleRevoke = (id) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: 'Revoked', blockchainStatus: 'Confirmed' } : a))
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <input className="input-field w-56" placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)} />
          {['All', 'Active', 'Revoked'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filter === f
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setShowRegister(true)} className="btn-primary">
          <Plus size={15} /> Register Asset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: assets.length, color: 'text-purple-400' },
          { label: 'Active', value: assets.filter(a => a.status === 'Active').length, color: 'text-emerald-400' },
          { label: 'On Blockchain', value: assets.filter(a => a.blockchainStatus === 'Confirmed').length, color: 'text-blue-400' },
          { label: 'Revoked', value: assets.filter(a => a.status === 'Revoked').length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Asset table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5 bg-white/2">
              <tr>
                {['Asset', 'Type', 'Owner', 'NFT Token', 'SHA-256 Hash', 'Blockchain', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => (
                <tr key={asset.id} className="hover:bg-white/2 transition-colors">
                  <td className="table-cell">
                    <div className="font-medium text-white text-sm">{asset.name}</div>
                    <div className="text-xs text-gray-500">{asset.id}</div>
                  </td>
                  <td className="table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[asset.type] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                      {asset.type}
                    </span>
                  </td>
                  <td className="table-cell text-gray-300 text-sm">{asset.owner}</td>
                  <td className="table-cell">
                    <code className="text-xs text-purple-300 font-mono">{asset.tokenId}</code>
                  </td>
                  <td className="table-cell">
                    <code className="text-xs text-green-400 font-mono">{asset.hash.slice(0, 16)}...</code>
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={asset.blockchainStatus} />
                  </td>
                  <td className="table-cell"><StatusBadge status={asset.status} /></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(asset)}
                        className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      {asset.status === 'Active' && (
                        <>
                          <button onClick={() => setTransferId(transferId === asset.id ? null : asset.id)}
                            className="p-1.5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors" title="Transfer">
                            <ArrowRightLeft size={14} />
                          </button>
                          <button onClick={() => handleRevoke(asset.id)}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Revoke">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                    {transferId === asset.id && (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          className="input-field py-1 text-xs w-32"
                          placeholder="New owner..."
                          value={transferTo}
                          onChange={e => setTransferTo(e.target.value)}
                        />
                        <button onClick={() => handleTransfer(asset.id)}
                          className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded">
                          Transfer
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package size={32} className="mx-auto mb-3 opacity-30" />
            No assets found.
          </div>
        )}
      </div>

      {/* Info */}
      <div className="glass-card p-4 bg-purple-500/5 border-purple-500/15">
        <div className="flex items-start gap-3">
          <Link2 size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-purple-300">NFT-Backed Ownership:</strong> Each asset is tokenized as an NFT on the blockchain. The SHA-256 hash
            of the asset document is stored on-chain — any modification to the document changes the hash, immediately flagging tampering.
            Asset transfers are recorded as blockchain transactions, creating an immutable ownership history.
          </div>
        </div>
      </div>

      {selected && <AssetModal asset={selected} onClose={() => setSelected(null)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRegistered={a => setAssets(prev => [a, ...prev])} />}
    </div>
  )
}
