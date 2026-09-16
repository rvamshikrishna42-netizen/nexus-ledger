import React, { useState } from 'react'
import {
  Package, Plus, CheckCircle, XCircle, ArrowRightLeft,
  Eye, Hash, Link2, Shield, Clock, AlertCircle, Sparkles, ExternalLink
} from 'lucide-react'
import { DEMO_ASSETS } from '../data/demoData'
import StatusBadge from '../components/StatusBadge'
import { useTrustCore } from '../context/TrustCoreContext'

const SPECIFIED_3D_ASSETS = [
  {
    type: 'Certificate NFT',
    assetId: 'AST-CERT-001',
    name: 'Advanced Defense Cryptography Attestation',
    ownerDid: 'did:nexus:7a82e4f981b2c3d4e5f60718293a4b5c',
    shortDid: 'did:nexus:7a82e4f9...',
    nftTokenId: 'NFT-BEL-2024-001',
    blockchainStatus: 'CONFIRMED',
    hash: '0xa3f8c2d1e4b7f9a2c5d8e1f4b7c0a3d6',
    block: 18960001,
  },
  {
    type: 'Project NFT',
    assetId: 'AST-PROJ-002',
    name: 'BEL Quantum Mesh Architecture Spec',
    ownerDid: 'did:nexus:7a82e4f981b2c3d4e5f60718293a4b5c',
    shortDid: 'did:nexus:7a82e4f9...',
    nftTokenId: 'NFT-PRJ-2024-042',
    blockchainStatus: 'CONFIRMED',
    hash: '0xb6e9c2f5a8d1e4b7c0f3a6d9e2f5b8c1',
    block: 18961500,
  },
  {
    type: 'Digital Credential',
    assetId: 'AST-CRED-003',
    name: 'High-Clearance Autonomous Agent Key',
    ownerDid: 'did:nexus:7a82e4f981b2c3d4e5f60718293a4b5c',
    shortDid: 'did:nexus:7a82e4f9...',
    nftTokenId: 'NFT-CRD-2024-089',
    blockchainStatus: 'CONFIRMED',
    hash: '0xc9f2b5e8a1d4f7c0b3e6a9d2f5c8b1e4',
    block: 18963200,
  },
]

export default function Assets() {
  const { activeModule, setActiveModule } = useTrustCore()
  const [assets, setAssets] = useState(DEMO_ASSETS)
  const [hovered3DAsset, setHovered3DAsset] = useState(null)
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">
              DIGITAL ASSET REGISTRY • NFT PROVENANCE
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Digital Assets & Ownership
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Non-fungible sovereign assets anchored with cryptographic ownership proofs.
          </p>
        </div>
      </div>

      {/* 3D Floating Assets Section */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>3D Floating Sovereign Assets (Hover to Inspect)</span>
          <span className="text-[10px] text-cyan-400 flex items-center gap-1">
            <Sparkles size={12} />
            3D OWNERSHIP LINK ACTIVE
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {SPECIFIED_3D_ASSETS.map((asset, idx) => (
            <div
              key={asset.assetId}
              onMouseEnter={() => setHovered3DAsset(asset.assetId)}
              onMouseLeave={() => setHovered3DAsset(null)}
              className="p-5 rounded-2xl bg-[#070b18]/90 border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 transform hover:-translate-y-1 hover:rotate-1 shadow-xl hover:shadow-cyan-500/10 relative overflow-hidden group cursor-pointer"
            >
              {/* Holographic light sweep */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all"></div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                  {asset.type}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {asset.blockchainStatus}
                </span>
              </div>

              <div className="font-bold text-white text-sm mb-4 leading-snug">
                {asset.name}
              </div>

              <div className="space-y-2 text-xs border-t border-white/5 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Asset ID:</span>
                  <span className="text-gray-200 font-semibold">{asset.assetId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Owner DID:</span>
                  <span className="text-cyan-400 truncate max-w-[150px]" title={asset.ownerDid}>
                    {asset.shortDid}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">NFT Token ID:</span>
                  <span className="text-purple-300">{asset.nftTokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Block:</span>
                  <span className="text-gray-400">#{asset.block}</span>
                </div>
              </div>

              {/* Hover Ownership Connection Banner */}
              <div className="mt-4 pt-2.5 border-t border-white/5 text-[10px] text-emerald-400/90 flex items-center gap-1.5">
                <Shield size={12} />
                <span>Cryptographic Ownership Verified by Trust Core</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Asset Registry Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            All On-Chain Registered Digital Assets
          </div>
          <span className="text-xs text-gray-500">3,542 Total Minted</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#070b18]/90">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-400 uppercase">
              <tr>
                <th className="p-3.5">Asset</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Owner DID</th>
                <th className="p-3.5">NFT Token</th>
                <th className="p-3.5">SHA-256 Hash</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{asset.name}</div>
                    <div className="text-[10px] text-gray-500">{asset.id}</div>
                  </td>
                  <td className="p-3.5 text-gray-400">{asset.type}</td>
                  <td className="p-3.5 font-mono text-cyan-400 truncate max-w-[120px]">
                    did:nexus:{asset.owner.toLowerCase().replace(/\s+/g, '')}...
                  </td>
                  <td className="p-3.5 text-purple-300">{asset.tokenId}</td>
                  <td className="p-3.5 text-gray-500 truncate max-w-[120px] font-mono">
                    {asset.hash}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={asset.status} />
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
