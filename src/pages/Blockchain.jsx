import React, { useState } from 'react'
import {
  Link2, CheckCircle, Clock, Search, ExternalLink,
  Hash, Layers, Zap, Copy, ChevronDown, ChevronUp, Radio, Send, Database
} from 'lucide-react'
import { DEMO_BLOCKCHAIN_TXS } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import { useTrustCore } from '../context/TrustCoreContext'

const RECENT_BLOCKS = [
  { blockNumber: 18951824, txCount: 89, timestamp: '12 seconds ago', hash: '0x2a4c6e8f0b1d3f5a7c9e1b3d5f7a9c1e0b2d4f6a', gasUsed: '4,120,490', miner: 'BEL Defense Node Alpha' },
  { blockNumber: 18951823, txCount: 128, timestamp: '24 seconds ago', hash: '0x7f3a91c4b2e6d0f1a3c5e7b9d2f4a6c8e1b3d5f0', gasUsed: '6,890,210', miner: 'BEL Defense Node Beta' },
  { blockNumber: 18951822, txCount: 42, timestamp: '36 seconds ago', hash: '0x3c9e1b7a5f2d8e0c4a6b1d3f5e7c9a0b2d4f6a8c', gasUsed: '2,940,150', miner: 'BEL Defense Node Gamma' },
]

export default function Blockchain() {
  const { emitTransaction } = useTrustCore()
  const [txs, setTxs] = useState(DEMO_BLOCKCHAIN_TXS)
  const [blocks, setBlocks] = useState(RECENT_BLOCKS)
  const [search, setSearch] = useState('')
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [copiedHash, setCopiedHash] = useState('')

  const handleBroadcast = () => {
    setIsBroadcasting(true)
    const newTxHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    
    // Trigger 3D particle packet traveling through the chain!
    emitTransaction(newTxHash)

    setTimeout(() => {
      const nextBlockNum = blocks[0].blockNumber + 1
      const newBlock = {
        blockNumber: nextBlockNum,
        txCount: 1,
        timestamp: 'Just now',
        hash: newTxHash,
        gasUsed: '210,000',
        miner: 'BEL Defense Node Alpha',
      }
      const newTx = {
        id: `TX-${Date.now().toString().slice(-4)}`,
        hash: newTxHash,
        from: 'did:nexus:7a82e4f9...',
        to: 'NexusSecurityRegistry',
        action: 'EMIT_TRANSACTION',
        block: nextBlockNum,
        gas: 210000,
        status: 'Confirmed',
        timestamp: new Date().toISOString(),
      }
      setBlocks([newBlock, ...blocks])
      setTxs([newTx, ...txs])
      setIsBroadcasting(false)
    }, 900)
  }

  const copyHash = (h) => {
    navigator.clipboard.writeText(h).catch(() => {})
    setCopiedHash(h)
    setTimeout(() => setCopiedHash(''), 1500)
  }

  const filtered = txs.filter((t) =>
    t.hash.toLowerCase().includes(search.toLowerCase()) ||
    t.action.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">
              CONSENSUS LEDGER • EVM SYNCHRONIZED
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Blockchain Explorer & Blocks
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Decentralized consensus blocks and live transaction propagation telemetry.
          </p>
        </div>

        {/* Broadcast Trigger Button */}
        <button
          onClick={handleBroadcast}
          disabled={isBroadcasting}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <Send size={14} className={isBroadcasting ? 'animate-spin' : ''} />
          <span>{isBroadcasting ? 'Broadcasting Particle...' : 'Broadcast Consensus Tx'}</span>
        </button>
      </div>

      {/* 3D Linked Blocks Carousel */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Recent Synchronized 3D Blocks (Live Chain)</span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            3D CHAIN PROPAGATING
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {blocks.slice(0, 3).map((b, idx) => (
            <div
              key={b.blockNumber}
              className="p-5 rounded-xl bg-[#070b18]/90 border border-blue-500/20 hover:border-blue-500/40 transition-colors relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-white">
                  Block #{b.blockNumber}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {b.txCount} txs
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-400 mb-3">
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span className="text-gray-300">{b.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Miner:</span>
                  <span className="text-gray-300 truncate max-w-[140px]">{b.miner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Used:</span>
                  <span className="text-cyan-400">{b.gasUsed}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-gray-500 truncate max-w-[200px]" title={b.hash}>
                  Hash: {b.hash.substring(0, 16)}...
                </span>
                <button
                  onClick={() => copyHash(b.hash)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Consensus Transactions Stream
          </div>
          <div className="text-[11px] text-gray-500">
            Showing {filtered.length} transactions
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#070b18]/90">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-400 uppercase">
              <tr>
                <th className="p-3.5">Tx Hash</th>
                <th className="p-3.5">Block</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Sender</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-mono text-cyan-400 truncate max-w-[180px]">
                    {t.hash}
                  </td>
                  <td className="p-3.5 text-white">#{t.block}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                      {t.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-400 truncate max-w-[140px]">{t.from}</td>
                  <td className="p-3.5">
                    <StatusBadge status={t.status} />
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
