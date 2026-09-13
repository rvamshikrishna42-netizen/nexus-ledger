export default function StatusBadge({ status }) {
  const map = {
    Active: 'badge-green',
    Verified: 'badge-green',
    Confirmed: 'badge-green',
    Known: 'badge-blue',
    Success: 'badge-green',
    Info: 'badge-blue',
    Low: 'badge-green',
    Pending: 'badge-yellow',
    New: 'badge-purple',
    Medium: 'badge-yellow',
    Suspicious: 'badge-yellow',
    High: 'badge-red',
    Revoked: 'badge-gray',
    Deactivated: 'badge-gray',
    Failed: 'badge-red',
    Tampered: 'badge-red',
    Critical: 'badge-red',
    Alert: 'badge-red',
    Unverified: 'badge-gray',
  }
  const cls = map[status] || 'badge-gray'
  return <span className={cls}>{status}</span>
}
