import { ArrowDown, ArrowRight, Users, Smartphone, Globe, Server, Database, Link2, Shield, Brain, FileText } from 'lucide-react'

const LAYERS = [
  {
    id: 'user',
    label: 'Users / Clients',
    sublabel: 'Browser, Mobile, API Consumer',
    color: 'blue',
    icon: Users,
    nodes: ['Web Browser', 'Mobile App', 'API Client'],
  },
  {
    id: 'frontend',
    label: 'React Frontend',
    sublabel: 'Vite + Tailwind + React Router',
    color: 'cyan',
    icon: Globe,
    nodes: ['Dashboard', 'Identity Vault', 'Certificate Verify', 'RBAC', 'Assets', 'Blockchain Explorer'],
  },
  {
    id: 'auth',
    label: 'Authentication Layer',
    sublabel: 'JWT + BCrypt + Session Management',
    color: 'purple',
    icon: Shield,
    nodes: ['Login / Register', 'JWT Token', 'Role Enforcement', 'Session Expiry'],
  },
  {
    id: 'api',
    label: 'PHP REST API',
    sublabel: 'PHP 8.2 + Input Validation + Rate Limiting',
    color: 'orange',
    icon: Server,
    nodes: ['/api/auth', '/api/dids', '/api/assets', '/api/certificates', '/api/devices', '/api/audit'],
  },
  {
    id: 'security',
    label: 'Security Engine',
    sublabel: 'Risk Analysis + Anomaly Detection + RBAC',
    color: 'red',
    icon: Brain,
    nodes: ['Risk Scorer', 'Anomaly Rules', 'Device Fingerprint', 'SHA-256 Verify'],
  },
  {
    id: 'db',
    label: 'MySQL Database',
    sublabel: 'Prepared Statements + ACID Transactions',
    color: 'green',
    icon: Database,
    nodes: ['users', 'dids', 'assets', 'certificates', 'devices', 'audit_logs'],
  },
  {
    id: 'blockchain',
    label: 'Blockchain Layer',
    sublabel: 'Solidity + Ethers.js + EVM Compatible',
    color: 'indigo',
    icon: Link2,
    nodes: ['NexusIdentity.sol', 'NexusAsset.sol', 'NexusCertificate.sol', 'NexusAudit.sol'],
  },
  {
    id: 'audit',
    label: 'Audit Trail',
    sublabel: 'Immutable + Searchable + Exportable',
    color: 'teal',
    icon: FileText,
    nodes: ['Login Events', 'Asset Actions', 'Cert Verifications', 'Role Changes'],
  },
]

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   text: 'text-blue-400',   node: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   text: 'text-cyan-400',   node: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/25', text: 'text-purple-400', node: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/25', text: 'text-orange-400', node: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/25',    text: 'text-red-400',    node: 'bg-red-500/10 text-red-300 border-red-500/20' },
  green:  { bg: 'bg-emerald-500/10',border: 'border-emerald-500/25',text: 'text-emerald-400',node: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/25', text: 'text-indigo-400', node: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
  teal:   { bg: 'bg-teal-500/10',   border: 'border-teal-500/25',   text: 'text-teal-400',   node: 'bg-teal-500/10 text-teal-300 border-teal-500/20' },
}

const CROSS_CUTTING = [
  { label: 'DID Management', color: 'blue', desc: 'W3C-compliant decentralized identifiers anchored on blockchain' },
  { label: 'RBAC', color: 'purple', desc: '5 roles, 18 permissions enforced at every API endpoint' },
  { label: 'Digital Assets', color: 'orange', desc: 'NFT-tokenized ownership records with SHA-256 integrity hashes' },
  { label: 'Certificate Verification', color: 'green', desc: 'Hash-based tamper detection with risk scoring engine' },
  { label: 'Device Trust', color: 'cyan', desc: 'Pseudonymous device fingerprinting and trust scoring' },
]

export default function Architecture() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main flow */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <ArrowDown size={15} className="text-blue-400" /> System Architecture Flow
          </h3>
          <div className="space-y-2">
            {LAYERS.map((layer, i) => {
              const c = COLOR_MAP[layer.color]
              const Icon = layer.icon
              return (
                <div key={layer.id}>
                  <div className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={15} className={c.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm ${c.text}`}>{layer.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{layer.sublabel}</div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {layer.nodes.map(n => (
                            <span key={n} className={`text-xs px-2 py-0.5 rounded border ${c.node}`}>{n}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {i < LAYERS.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown size={16} className="text-gray-600" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-5">
          {/* Cross-cutting concerns */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4 text-sm">Cross-Cutting Concerns</h3>
            <div className="space-y-3">
              {CROSS_CUTTING.map(({ label, color, desc }) => {
                const c = COLOR_MAP[color]
                return (
                  <div key={label} className={`p-3 rounded-lg border ${c.bg} ${c.border}`}>
                    <div className={`text-xs font-semibold mb-1 ${c.text}`}>{label}</div>
                    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Security features */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4 text-sm">Security Features</h3>
            <div className="space-y-2">
              {[
                ['SHA-256 Hash Verification', 'green'],
                ['Blockchain Immutability', 'blue'],
                ['JWT Authentication', 'purple'],
                ['BCrypt Password Hashing', 'orange'],
                ['Input Validation & Sanitization', 'cyan'],
                ['Prepared SQL Statements', 'green'],
                ['Role-Based Authorization', 'red'],
                ['Device Trust Scoring', 'indigo'],
                ['Anomaly Detection Rules', 'yellow'],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-2 text-xs text-gray-300">
                  <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500 flex-shrink-0`}></span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Data flow */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4 text-sm">Key Data Flows</h3>
            <div className="space-y-3 text-xs text-gray-400">
              {[
                ['Certificate Verification', 'Upload → Hash → Compare On-Chain → Score → Report'],
                ['DID Registration', 'Generate Key Pair → Anchor DID → Store Public Key'],
                ['Asset Registration', 'Hash Asset → Mint NFT → Store On-Chain → Audit Log'],
                ['Authentication', 'Credentials → Hash Match → JWT Issue → RBAC Check'],
              ].map(([title, flow]) => (
                <div key={title} className="p-2.5 bg-white/3 rounded-lg border border-white/5">
                  <div className="font-semibold text-white mb-1">{title}</div>
                  <div className="leading-relaxed">{flow}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
