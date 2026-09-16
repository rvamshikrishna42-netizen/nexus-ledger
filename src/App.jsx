import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TrustCoreProvider } from './context/TrustCoreContext'
import Layout from './components/Layout'

// Public pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

// App pages
import Dashboard from './pages/Dashboard'
import Identity from './pages/Identity'
import RBAC from './pages/RBAC'
import Assets from './pages/Assets'
import Certificates from './pages/Certificates'
import Devices from './pages/Devices'
import Anomalies from './pages/Anomalies'
import Security from './pages/Security'
import Blockchain from './pages/Blockchain'
import Audit from './pages/Audit'
import Analytics from './pages/Analytics'
import Architecture from './pages/Architecture'
import Technologies from './pages/Technologies'
import AppSettings from './pages/Settings'

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected — all share the Layout shell */}
      <Route element={<Layout title="Dashboard" subtitle="Security Operations Center" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<Layout title="Identity Vault" subtitle="Decentralized Identity Management" />}>
        <Route path="/identity" element={<Identity />} />
      </Route>
      <Route element={<Layout title="Access Control" subtitle="Role-Based Permission Matrix" />}>
        <Route path="/rbac" element={<RBAC />} />
      </Route>
      <Route element={<Layout title="Digital Assets" subtitle="NFT-Backed Asset Registry" />}>
        <Route path="/assets" element={<Assets />} />
      </Route>
      <Route element={<Layout title="Certificate Verification" subtitle="SHA-256 Hash & Tamper Detection" />}>
        <Route path="/certificates" element={<Certificates />} />
      </Route>
      <Route element={<Layout title="Device Trust" subtitle="Pseudonymous Device Registry" />}>
        <Route path="/devices" element={<Devices />} />
      </Route>
      <Route element={<Layout title="Anomaly Detection" subtitle="Rule-Based Risk Intelligence" />}>
        <Route path="/anomalies" element={<Anomalies />} />
      </Route>
      <Route element={<Layout title="Security Center" subtitle="SOC Command View" />}>
        <Route path="/security" element={<Security />} />
      </Route>
      <Route element={<Layout title="Blockchain Explorer" subtitle="Immutable Transaction Ledger" />}>
        <Route path="/blockchain" element={<Blockchain />} />
      </Route>
      <Route element={<Layout title="Audit Trail" subtitle="Tamper-Proof Activity Logs" />}>
        <Route path="/audit" element={<Audit />} />
      </Route>
      <Route element={<Layout title="Analytics" subtitle="Security Intelligence Dashboard" />}>
        <Route path="/analytics" element={<Analytics />} />
      </Route>
      <Route element={<Layout title="System Architecture" subtitle="Platform Design Overview" />}>
        <Route path="/architecture" element={<Architecture />} />
      </Route>
      <Route element={<Layout title="Technology Stack" subtitle="Components & Libraries" />}>
        <Route path="/technologies" element={<Technologies />} />
      </Route>
      <Route element={<Layout title="Settings" subtitle="Account & System Preferences" />}>
        <Route path="/settings" element={<AppSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TrustCoreProvider>
          <AppRoutes />
        </TrustCoreProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
