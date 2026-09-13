import { useState } from 'react'
import {
  Link2, CheckCircle, Clock, Search, ExternalLink,
  Hash, Layers, Zap, Copy, ChevronDown, ChevronUp
} from 'lucide-react'
import { DEMO_BLOCKCHAIN_TXS } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'

const ACTION_COLORS = {
  REGISTER_ASSET:  'text-purple-400 bg-purple-500/10 border-purple-500/20',
  REGISTER_CERT:   'text-green-400 bg-green-500/10 border-green-500/20',
  REGISTER_DID:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
  TRANSFER_ASSET:  'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  AUDIT_RECORD:    'text-gray-400 bg-gray-500/10 border-gray-500/20',
  VERIFY_CERT:     'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
}

const SMART_CONTRACTS = [
  { name: 'NexusIdentity',    address: '0xBELContract...a91c', type: 'DID Registry',        functions: ['registerDID()', 'verifyDID()', 'deactivateDID()'] },
  { name: 'NexusAsset',       address: '0xNFTContract...b82d', type: 'NFT Asset Registry',  functions: ['registerAsset()', 'transferAsset()', 'revokeAsset()'] },
  { name: 'NexusCertificate', address: '0xCertContract...c73e',type: 'Certificate Ledger',  functions: ['storeCertHash()', 'verifyCertHash()'] },
  { name: 'NexusAudit',       address: '0xAuditLog...c91d',   type: 'Audit Trail',          functions: ['logAction()', 'queryLogs()'] },
]

function TxModal({ tx, onClose }) {
  const [copied, setCopied] = useState(false)
  const copy = (v) => { navigator.clipboard.writeText(v).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Link2 size={16} className="text-blue-400" /> Transaction Details
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="space-y-3 text-sm">
          {[
            { label: 'Transaction Hash', value: tx.hash, mono: true },
            { label: 'Block Number', value: tx.block?.toString() || 'Pending' },
            { label: 'From', value: tx.from, mono: true },
            { label: 'To', value: tx.to, mono: true },
            { label: 'Action', value: tx.action },
            { label: 'Gas Used', value: tx.gas?.toLocaleString() || '0' },
            { label: 'Timestamp', value: new Date(tx.timestamp).toLocaleString() },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-start justify-between gap-4 py-1.5 border-b border-white/5">
              <span className="text-gray-500 flex-shrink-0 w-36">{label}</span>
              <span className={`text-gray-200 text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={tx.status} />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={() => copy(tx.hash)} className="btn-secondary flex-1 justify-center text-sm">
            <Copy size={14} /> {copied ? 'Copied!' : 'Copy Hash'}
          </button>
          <button onClick={onClose} className="btn-primary flex-1 justify-center text-sm">Close</button>
        </div>

        <div className="mt-3 text-xs text-center text-yellow-500">
          ⚠ DEMO BLOCKCHAIN — This is simulated transaction data. Not connected to a live network.
        </div>
      </div>
    </div>
  )
}

export default function Blockchain() {
  const [txs] = useState(DEMO_BLOCKCHAIN_TXS)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [showContracts, setShowContracts] = useState(false)
  const [filterAction, setFilterAction] = useState('All')

  const uniqueActions = ['All', ...new Set(txs.map(t => t.action))]

  const filtered = txs.filter(tx => {
    const matchSearch = tx.hash.includes(search) || tx.action.includes(search) || tx.from.includes(search)
    const matchAction = filterAction === 'All' || tx.action === filterAction
    return matchSearch && matchAction
  })

  const latestBlock = Math.max(...txs.filter(t => t.block).map(t => t.block))
  const confirmedCount = txs.filter(t => t.status === 'Confirmed').length

  return (
    <div className="space-y-5">
      {/* Demo mode banner */}
      <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <Zap size={18} className="text-yellow-400 flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold text-yellow-400">DEMO BLOCKCHAIN MODE</div>
          <div className="text-xs text-yellow-300/70 mt-0.5">
            Transaction data is simulated. Connect MetaMask and deploy contracts for live blockchain interaction.
            Smart contracts are written in Solidity and compatible with any EVM chain (Ethereum, Polygon, Sepolia testnet).
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Transactions', value: txs.length, color: 'text-blue-400', icon: Link2 },
          { label: 'Confirmed', value: confirmedCount, color: 'text-emerald-400', icon: CheckCircle },
          { label: 'Pending', value: txs.filter(t => t.status === 'Pending').length, color: 'text-yellow-400', icon: Clock },
          { label: 'Latest Block', value: latestBlock?.toLocaleString(), color: 'text-purple-400', icon: Layers },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={15} className={color} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
            <div className={`text-xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Smart contracts */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Hash size={15} className="text-blue-400" /> Smart Contracts
          </h3>
          <button onClick={() => setShowContracts(!showContracts)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            {showContracts ? <><ChevronUp size={12} />Hide</> : <><ChevronDown size={12} />Show</>}
          </button>
        </div>
        {showContracts && (
          <div className="grid md:grid-cols-2 gap-3 mt-2">
            {SMART_CONTRACTS.map(sc => (
              <div key={sc.name} className="p-4 bg-white/3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-blue-300 text-sm">{sc.name}</div>
                  <span className="badge-blue text-xs">{sc.type}</span>
                </div>
                <code className="text-xs text-gray-500 font-mono block mb-2">{sc.address}</code>
                <div className="flex flex-wrap gap-1">
                  {sc.functions.map(fn => (
                    <code key={fn} className="text-xs bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/10">{fn}</code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction explorer */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
          <Search size={15} className="text-cyan-400" /> Transaction Explorer
        </h3>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            className="input-field w-72"
            placeholder="Search by hash, action, address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2 flex-wrap">
            {uniqueActions.map(a => (
              <button key={a} onClick={() => setFilterAction(a)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filterAction === a
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                  : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5 bg-white/2">
              <tr>
                {['Tx Hash', 'Block', 'From', 'To', 'Action', 'Gas', 'Timestamp', 'Status'].map(h => (
                  <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.hash} onClick={() => setSelected(tx)}
                  className="hover:bg-white/3 cursor-pointer transition-colors">
                  <td className="table-cell">
                    <code className="text-xs text-blue-300 font-mono">{tx.hash.slice(0, 14)}...</code>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <Layers size={12} className="text-purple-400" />
                      <span className="text-purple-300 text-xs font-mono">{tx.block?.toLocaleString() || '—'}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <code className="text-xs text-gray-400 font-mono">{tx.from.slice(0, 16)}...</code>
                  </td>
                  <td className="table-cell">
                    <code className="text-xs text-gray-400 font-mono">{tx.to.slice(0, 16)}...</code>
                  </td>
                  <td className="table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${ACTION_COLORS[tx.action] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                      {tx.action}
                    </span>
                  </td>
                  <td className="table-cell text-xs text-gray-500 font-mono">{tx.gas?.toLocaleString() || '0'}</td>
                  <td className="table-cell text-xs text-gray-500 font-mono">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </td>
                  <td className="table-cell"><StatusBadge status={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Link2 size={28} className="mx-auto mb-2 opacity-30" />
            No transactions found.
          </div>
        )}
      </div>

      {selected && <TxModal tx={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
