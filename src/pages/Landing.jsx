import { Link } from 'react-router-dom'
import {
  Shield, Fingerprint, Package, Award, Brain, Link2,
  CheckCircle, ArrowRight, Lock, Eye, Zap, Globe,
  Server, Database, Cpu, Code, ChevronDown
} from 'lucide-react'

const FEATURES = [
  { icon: Fingerprint, color: 'blue', title: 'Decentralized Identity (DID)', desc: 'W3C-compliant self-sovereign identities anchored on blockchain. No central authority controls your identity.' },
  { icon: Shield, color: 'purple', title: 'Role-Based Access Control', desc: 'Fine-grained permission matrix with 5 roles and 18 permissions. Enforced at API level.' },
  { icon: Package, color: 'cyan', title: 'Digital Asset Management', desc: 'NFT-backed ownership records for certificates, licenses, and credentials with SHA-256 integrity.' },
  { icon: Award, color: 'green', title: 'Certificate Verification', desc: 'Instant tamper detection via cryptographic hash comparison against immutable blockchain records.' },
  { icon: Brain, color: 'orange', title: 'Risk Intelligence Engine', desc: 'Rule-based anomaly detection analyzing login patterns, device changes, and asset activity.' },
  { icon: Link2, color: 'indigo', title: 'Blockchain Auditability', desc: 'Every action produces an immutable audit trail. Solidity smart contracts on EVM-compatible chain.' },
]

const PROBLEMS = [
  'Centralized identity systems are single points of failure and breach',
  'Certificate fraud is rampant — paper and PDF certificates are trivially forged',
  'Digital assets lack verifiable, tamper-proof ownership records',
  'Access control is inconsistent and difficult to audit',
  'Security events are siloed — no unified intelligence view',
]

const STEPS = [
  { n: '01', title: 'Register Identity', desc: 'User creates a self-sovereign DID anchored on blockchain. Public key registered, private key never exposed.' },
  { n: '02', title: 'Issue Digital Asset', desc: 'Asset (certificate, license, record) is hashed using SHA-256 and the hash stored on-chain as an NFT.' },
  { n: '03', title: 'Verify & Authenticate', desc: 'Any party can verify the certificate by recomputing the hash and comparing against the blockchain record.' },
  { n: '04', title: 'Monitor & Audit', desc: 'Every action is logged to an immutable audit trail. Risk engine flags anomalies in real time.' },
]

const TECH_STACK = [
  { layer: 'Frontend', items: ['React 18', 'Vite', 'Tailwind CSS', 'React Router', 'Recharts'] },
  { layer: 'Backend', items: ['PHP 8.2', 'REST API', 'JWT Auth', 'BCrypt Hashing'] },
  { layer: 'Database', items: ['MySQL 8', 'Prepared Statements', 'ACID Transactions'] },
  { layer: 'Blockchain', items: ['Solidity', 'OpenZeppelin', 'Ethers.js', 'EVM Compatible'] },
  { layer: 'Security', items: ['SHA-256', 'RBAC', 'Device Fingerprint', 'Risk Engine'] },
]

const colorMap = {
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
  cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
  green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
  orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/20 text-orange-400',
  indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
                <polygon points="32,6 54,18 54,46 32,58 10,46 10,18" stroke="white" strokeWidth="3" fill="none"/>
                <circle cx="32" cy="32" r="7" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-white">NEXUS LEDGER</span>
            <span className="hidden sm:block text-xs bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">SIH 2024</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#features" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Architecture</a>
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">Login</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            PS 26125 — Bharat Electronics Limited (BEL)
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            NEXUS{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              LEDGER
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
            Decentralized Identity. Intelligent Security. Verifiable Ownership.
          </p>
          <p className="text-base text-gray-500 mb-10 max-w-2xl mx-auto">
            A blockchain-secured platform for identity management, digital asset ownership, certificate verification,
            and role-based access control — built for BEL's defense and enterprise ecosystem.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              Launch Platform <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-base">
              Demo Login
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'SHA-256 Integrity', value: '256-bit', icon: Lock },
              { label: 'Security Score', value: '92/100', icon: Shield },
              { label: 'Smart Contracts', value: 'EVM', icon: Code },
              { label: 'RBAC Roles', value: '5 Roles', icon: Eye },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass-card p-4 text-center">
                <Icon size={20} className="mx-auto mb-2 text-blue-400" />
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-2">The Problem</div>
            <h2 className="text-3xl font-bold text-white">Why Centralized Systems Fail</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {PROBLEMS.map((p, i) => (
              <div key={i} className="flex gap-3 glass-card p-4">
                <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Core Features</div>
            <h2 className="text-3xl font-bold text-white">Everything You Need</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className={`glass-card-hover p-5 bg-gradient-to-br ${colorMap[color]}`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} border flex items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">How It Works</div>
            <h2 className="text-3xl font-bold text-white">Four Simple Steps</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="glass-card p-5 relative">
                <div className="text-4xl font-black text-blue-500/20 mb-3">{n}</div>
                <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2">Architecture</div>
            <h2 className="text-3xl font-bold text-white">System Design</h2>
          </div>
          <div className="glass-card p-6">
            <div className="flex flex-col items-center gap-2 font-mono text-sm">
              {[
                { label: 'React Frontend', color: 'blue', sub: 'Vite + Tailwind CSS' },
                { label: 'Authentication Layer', color: 'purple', sub: 'JWT + BCrypt + RBAC' },
                { label: 'PHP REST API', color: 'cyan', sub: 'PHP 8.2 + Input Validation' },
                { label: 'Security Engine', color: 'orange', sub: 'Risk Rules + Anomaly Detection' },
                { label: 'MySQL Database', color: 'green', sub: 'Prepared Statements + ACID' },
                { label: 'Blockchain Layer', color: 'indigo', sub: 'Solidity + Ethers.js + EVM' },
                { label: 'Audit Trail', color: 'blue', sub: 'Immutable + Queryable' },
              ].map((layer, i) => (
                <div key={i} className="w-full flex flex-col items-center">
                  <div className={`w-full max-w-xs text-center py-2.5 px-4 rounded-lg border text-xs
                    ${layer.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                      layer.color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' :
                      layer.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' :
                      layer.color === 'orange' ? 'bg-orange-500/10 border-orange-500/20 text-orange-300' :
                      layer.color === 'green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                      'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'}`}>
                    <div className="font-semibold">{layer.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{layer.sub}</div>
                  </div>
                  {i < 6 && <div className="h-4 w-px bg-white/10"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2">Technology Stack</div>
            <h2 className="text-3xl font-bold text-white">Built With Modern Tech</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {TECH_STACK.map(({ layer, items }) => (
              <div key={layer} className="glass-card p-4">
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">{layer}</div>
                {items.map(item => (
                  <div key={item} className="flex items-center gap-2 py-1">
                    <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIH Banner */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto glass-card p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/5 border-blue-500/20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-4">
            <Zap size={14} />
            Smart India Hackathon 2024
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">PS 26125 — Bharat Electronics Limited</h2>
          <p className="text-gray-400 mb-2 text-sm">Theme: Blockchain & Cybersecurity</p>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Blockchain-Based Secure Platform for Identity, Access Control, and Digital Asset Management.
            Addressing BEL's need for a tamper-proof, decentralized system for managing sensitive credentials and assets.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary px-6 py-2.5">
              Launch Demo <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-2.5">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 64 64" fill="none">
                <polygon points="32,6 54,18 54,46 32,58 10,46 10,18" stroke="white" strokeWidth="4" fill="none"/>
                <circle cx="32" cy="32" r="8" fill="white"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">NEXUS LEDGER</span>
            <span className="text-sm text-gray-500">— SIH 2024 MVP</span>
          </div>
          <div className="text-xs text-gray-600">
            Built for PS 26125 — Bharat Electronics Limited (BEL) — Blockchain & Cybersecurity
          </div>
        </div>
      </footer>
    </div>
  )
}
