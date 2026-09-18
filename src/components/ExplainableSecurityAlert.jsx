import React from 'react'
import { AlertTriangle, Info, ShieldAlert, CheckCircle, XCircle, Clock } from 'lucide-react'

/**
 * Generates an explanation from existing application data.
 * No hard-coded single alert — factors are derived from the
 * actual riskScore, unknownDeviceDetected, anomaly objects, etc.
 */
export function generateAlertExplanation({ riskScore, threatLevel, unknownDeviceDetected, anomaly, lockdownStatus }) {
  const factors = []

  // From anomaly object (when used per-row)
  if (anomaly) {
    if (anomaly.rule === 'BRUTE_FORCE_DETECTED') factors.push('Multiple failed login attempts detected')
    if (anomaly.rule === 'OFF_HOURS_ACTIVITY') factors.push('Activity occurred outside normal business hours')
    if (anomaly.rule === 'NEW_DEVICE_DETECTED') factors.push('Login from a previously unseen device')
    if (anomaly.rule === 'CERT_TAMPERING_DETECTED') factors.push('Certificate hash mismatch — possible document tampering')
    if (anomaly.rule === 'IP_CHANGE_DETECTED') factors.push('Authentication from an unusual IP address')
    if (anomaly.rule === 'DID_VERIFY_FAILURE') factors.push('DID verification failed repeatedly — possible identity spoofing')
    if (anomaly.details) factors.push(anomaly.details)
  }

  // From global application state
  if (unknownDeviceDetected) factors.push('Unknown device detected on the network')
  if (riskScore >= 80) factors.push(`Elevated behavioral risk score (${riskScore}/100)`)
  else if (riskScore >= 50) factors.push(`Moderate behavioral risk score (${riskScore}/100)`)
  if (lockdownStatus === 'active') factors.push('Emergency lockdown is currently active')

  // Deduplicate
  const unique = [...new Set(factors)]
  if (unique.length === 0) unique.push('Limited behavioral evidence available')

  // Recommended action based on severity
  const score = anomaly?.score ?? riskScore
  let recommendedAction
  if (score >= 80 || threatLevel === 'critical') {
    recommendedAction = 'Restrict access and investigate immediately'
  } else if (score >= 60 || threatLevel === 'elevated') {
    recommendedAction = 'Require step-up verification and review activity'
  } else if (score >= 35) {
    recommendedAction = 'Require additional verification'
  } else {
    recommendedAction = 'Continue monitoring'
  }

  const severity = anomaly?.riskLevel ?? (
    threatLevel === 'critical' ? 'Critical' :
    threatLevel === 'elevated' ? 'High' : 'Low'
  )

  return { factors: unique, recommendedAction, severity, score }
}

const SEVERITY_STYLES = {
  Critical: { border: 'border-red-500/40', bg: 'bg-red-500/8', icon: XCircle, iconColor: 'text-red-400', label: 'bg-red-500/20 text-red-300 border-red-500/40', header: 'text-red-400' },
  High:     { border: 'border-orange-500/40', bg: 'bg-orange-500/8', icon: ShieldAlert, iconColor: 'text-orange-400', label: 'bg-orange-500/20 text-orange-300 border-orange-500/40', header: 'text-orange-400' },
  Medium:   { border: 'border-amber-500/40', bg: 'bg-amber-500/8', icon: AlertTriangle, iconColor: 'text-amber-400', label: 'bg-amber-500/20 text-amber-300 border-amber-500/40', header: 'text-amber-400' },
  Low:      { border: 'border-blue-500/30', bg: 'bg-blue-500/5', icon: Info, iconColor: 'text-blue-400', label: 'bg-blue-500/15 text-blue-300 border-blue-500/30', header: 'text-blue-400' },
}

/**
 * ExplainableSecurityAlert
 *
 * Props:
 *   title        - string, e.g. "HIGH RISK ACTIVITY"
 *   riskScore    - number (0-100)
 *   threatLevel  - 'low' | 'elevated' | 'critical'
 *   unknownDeviceDetected - boolean
 *   anomaly      - optional anomaly object from DEMO_ANOMALIES
 *   lockdownStatus - optional lockdown state string
 *   compact      - boolean, shows condensed view (for lists)
 */
export default function ExplainableSecurityAlert({
  title,
  riskScore = 0,
  threatLevel = 'low',
  unknownDeviceDetected = false,
  anomaly = null,
  lockdownStatus = 'inactive',
  compact = false,
}) {
  const { factors, recommendedAction, severity, score } = generateAlertExplanation({
    riskScore, threatLevel, unknownDeviceDetected, anomaly, lockdownStatus,
  })

  const style = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.Low
  const SeverityIcon = style.icon

  const timestamp = anomaly?.timestamp
    ? new Date(anomaly.timestamp).toLocaleString('en-IN', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : new Date().toLocaleString('en-IN', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })

  if (compact) {
    return (
      <div className={`p-3 rounded-xl border ${style.border} ${style.bg} font-mono`}>
        <div className="flex items-start gap-2.5">
          <SeverityIcon size={15} className={`${style.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`text-xs font-bold ${style.header} truncate`}>
                {title || anomaly?.type || 'SECURITY ALERT'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-bold flex-shrink-0 ${style.label}`}>
                {severity.toUpperCase()}
              </span>
            </div>
            <div className="text-[11px] text-gray-400 mb-1.5">
              Risk Score: <span className={`font-bold ${style.header}`}>{score}/100</span>
            </div>
            <div className="space-y-0.5">
              {factors.slice(0, 2).map((f, i) => (
                <div key={i} className="text-[10px] text-gray-400 flex items-start gap-1.5">
                  <span className="text-gray-600 mt-0.5">•</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-1.5 text-[10px] text-gray-500 flex items-center gap-1">
              <CheckCircle size={10} className="text-emerald-400/70" />
              <span className="text-gray-300">{recommendedAction}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border ${style.border} overflow-hidden font-mono`}>
      {/* Header */}
      <div className={`px-5 py-3 flex items-center justify-between gap-3 border-b ${style.border} ${style.bg}`}>
        <div className="flex items-center gap-2.5">
          <SeverityIcon size={16} className={style.iconColor} />
          <span className={`text-sm font-black tracking-wider ${style.header}`}>
            {title || anomaly?.type || 'SECURITY ALERT'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded border font-bold ${style.label}`}>
            {severity.toUpperCase()}
          </span>
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <Clock size={10} />
            {timestamp}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 bg-[#070b18]/80 space-y-4">
        {/* Risk Score */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">RISK SCORE</div>
            <div className={`text-2xl font-black ${style.header}`}>{score}<span className="text-sm font-normal text-gray-500">/100</span></div>
          </div>
          {anomaly?.user && (
            <div className="border-l border-white/5 pl-4">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">ENTITY</div>
              <div className="text-sm text-gray-200 font-semibold">{anomaly.user}</div>
            </div>
          )}
        </div>

        {/* WHY section */}
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-3 h-px bg-gray-600"></span>
            WHY?
            <span className="flex-1 h-px bg-white/5"></span>
          </div>
          <div className="space-y-1.5">
            {factors.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className={`mt-0.5 flex-shrink-0 ${style.iconColor}`}>•</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Action */}
        <div className="pt-3 border-t border-white/5">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-3 h-px bg-gray-600"></span>
            RECOMMENDED ACTION
            <span className="flex-1 h-px bg-white/5"></span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
            <span className="text-emerald-300 font-semibold">{recommendedAction}</span>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-500 italic">
            Analysis by NEXUS rule-based risk intelligence engine — not a machine-learning model.
          </div>
        </div>
      </div>
    </div>
  )
}
