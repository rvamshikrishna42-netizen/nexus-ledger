import { AlertTriangle } from 'lucide-react'

export default function DemoBanner() {
  return (
    <div className="demo-banner">
      <AlertTriangle size={14} />
      <span>DEMO MODE — All data is simulated. No real blockchain or database connection.</span>
    </div>
  )
}
