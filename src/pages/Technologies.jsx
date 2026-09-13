import { CheckCircle, ExternalLink } from 'lucide-react'

const STACK = [
  {
    category: 'Frontend',
    color: 'blue',
    items: [
      { name: 'React 18', version: '18.2.0', role: 'UI Framework', why: 'Component-based architecture with hooks for state management', link: 'https://react.dev' },
      { name: 'Vite', version: '5.1.0', role: 'Build Tool', why: 'Fast HMR and optimized production builds', link: 'https://vitejs.dev' },
      { name: 'Tailwind CSS', version: '3.4.1', role: 'Styling', why: 'Utility-first CSS for rapid professional UI development', link: 'https://tailwindcss.com' },
      { name: 'React Router', version: '6.22.0', role: 'Routing', why: 'Declarative client-side routing with protected routes', link: 'https://reactrouter.com' },
      { name: 'Recharts', version: '2.12.0', role: 'Charts', why: 'Composable, responsive chart components for security analytics', link: 'https://recharts.org' },
      { name: 'Lucide React', version: '0.344.0', role: 'Icons', why: 'Clean, consistent icon set for professional UI', link: 'https://lucide.dev' },
    ]
  },
  {
    category: 'Backend',
    color: 'purple',
    items: [
      { name: 'PHP 8.2', version: '8.2+', role: 'Server Language', why: 'Widely deployed, production-ready REST API development', link: 'https://php.net' },
      { name: 'MySQL 8', version: '8.0+', role: 'Database', why: 'ACID-compliant relational database for structured data', link: 'https://mysql.com' },
      { name: 'PDO + Prepared Statements', version: 'Built-in', role: 'SQL Security', why: 'Prevents SQL injection at the data layer', link: 'https://php.net/pdo' },
      { name: 'JWT (JSON Web Tokens)', version: 'RFC 7519', role: 'Authentication', why: 'Stateless, cryptographically signed session tokens', link: 'https://jwt.io' },
      { name: 'BCrypt', version: 'Built-in', role: 'Password Hashing', why: 'Adaptive, salted hashing resistant to brute-force', link: 'https://php.net/password_hash' },
    ]
  },
  {
    category: 'Blockchain',
    color: 'cyan',
    items: [
      { name: 'Solidity', version: '0.8.20', role: 'Smart Contracts', why: 'Industry-standard EVM smart contract language', link: 'https://soliditylang.org' },
      { name: 'OpenZeppelin', version: '5.0.0', role: 'Contract Standards', why: 'Audited ERC-721 NFT contracts and access control', link: 'https://openzeppelin.com' },
      { name: 'Ethers.js', version: '6.10.0', role: 'Blockchain Client', why: 'TypeScript-ready library for EVM chain interaction', link: 'https://ethers.org' },
      { name: 'EVM Compatible', version: 'Any EVM', role: 'Deployment Target', why: 'Deploy on Ethereum, Polygon, BNB, Sepolia testnet', link: 'https://ethereum.org' },
      { name: 'MetaMask', version: 'Browser', role: 'Wallet', why: 'User wallet for signing transactions (optional for demo)', link: 'https://metamask.io' },
    ]
  },
  {
    category: 'Security',
    color: 'orange',
    items: [
      { name: 'SHA-256', version: 'WebCrypto API', role: 'Hash Function', why: 'Cryptographic hash for certificate tamper detection', link: 'https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto' },
      { name: 'W3C DID Standard', version: 'v1.0', role: 'Identity Standard', why: 'International standard for decentralized identifiers', link: 'https://www.w3.org/TR/did-core/' },
      { name: 'Ed25519', version: 'RFC 8037', role: 'Key Pair Algorithm', why: 'Modern elliptic curve for DID key pairs', link: 'https://ed25519.cr.yp.to' },
      { name: 'Rule-Based Risk Engine', version: 'Custom', role: 'Anomaly Detection', why: 'Structured rule engine designed for future ML extension', link: '#' },
      { name: 'RBAC (Role-Based Access)', version: 'Custom', role: 'Authorization', why: '5 roles, 18 permissions enforced at every API endpoint', link: '#' },
    ]
  },
]

const COLOR_MAP = {
  blue:   'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
  purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
  cyan:   'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
  orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400',
}

export default function Technologies() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-5 bg-gradient-to-br from-blue-600/5 to-purple-600/5 border-blue-500/15">
        <h2 className="text-xl font-bold text-white mb-2">Technology Stack</h2>
        <p className="text-sm text-gray-400">
          Nexus Ledger is built with production-grade, open-source technologies chosen for security,
          reliability, and alignment with the SIH problem statement requirements.
          Every technology choice is justified for the BEL defense and enterprise context.
        </p>
      </div>

      {STACK.map(({ category, color, items }) => (
        <div key={category} className="glass-card overflow-hidden">
          <div className={`p-4 border-b border-white/5 bg-gradient-to-r ${COLOR_MAP[color]}`}>
            <h3 className={`font-bold text-lg`}>{category}</h3>
          </div>
          <div className="divide-y divide-white/5">
            {items.map(({ name, version, role, why, link }) => (
              <div key={name} className="flex items-start gap-4 p-4 hover:bg-white/2 transition-colors">
                <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-white">{name}</span>
                    <code className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">v{version}</code>
                    <span className={`text-xs px-2 py-0.5 rounded-full border bg-gradient-to-r ${COLOR_MAP[color]}`}>{role}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">{why}</p>
                </div>
                {link !== '#' && (
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors flex-shrink-0">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Compliance note */}
      <div className="glass-card p-5 bg-blue-500/5 border-blue-500/15">
        <h3 className="font-semibold text-white mb-3">Standards Compliance</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { std: 'W3C DID Core v1.0', desc: 'Decentralized identifier format and resolution', color: 'blue' },
            { std: 'ISO 27001 Principles', desc: 'Information security management framework', color: 'green' },
            { std: 'NIST CSF', desc: 'Cybersecurity framework alignment', color: 'purple' },
            { std: 'ERC-721 (NFT)', desc: 'Non-fungible token standard for asset ownership', color: 'cyan' },
            { std: 'OWASP Top 10', desc: 'Mitigations for most common web vulnerabilities', color: 'orange' },
            { std: 'RFC 7519 (JWT)', desc: 'JSON Web Token specification for auth', color: 'indigo' },
          ].map(({ std, desc, color }) => (
            <div key={std} className={`p-3 rounded-lg border bg-gradient-to-br ${COLOR_MAP[color] || ''}`}>
              <div className="text-sm font-semibold text-white mb-1">{std}</div>
              <div className="text-xs text-gray-400">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
