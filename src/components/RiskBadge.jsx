export default function RiskBadge({ score, level }) {
  const getClass = (l) => {
    if (l === 'Critical' || score >= 80) return 'badge-red'
    if (l === 'High' || score >= 60) return 'badge-red'
    if (l === 'Medium' || score >= 40) return 'badge-yellow'
    return 'badge-green'
  }
  const label = level || (score >= 80 ? 'Critical' : score >= 60 ? 'High' : score >= 40 ? 'Medium' : 'Low')
  return (
    <span className={getClass(label)}>
      {score !== undefined ? `${score}/100` : label}
    </span>
  )
}
