function severityClass(severity) {
  if (severity === 'high') return 'mm-risk-high'
  if (severity === 'medium') return 'mm-risk-medium'
  return 'mm-risk-low'
}

function severityTierKo(severity) {
  if (severity === 'high') return { text: '고위험', emoji: '⚠️' }
  if (severity === 'medium') return { text: '중간', emoji: null }
  return { text: '낮음', emoji: null }
}

function asciiBar(pct) {
  const n = Math.min(10, Math.max(0, Math.round(Number(pct) / 10)))
  return `${'█'.repeat(n)}${'░'.repeat(10 - n)}`
}

export default function RiskBar({ label, score, severity }) {
  const safe = Math.min(100, Math.max(0, Number(score) || 0))
  const tier = severityTierKo(severity)

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-medium text-mm-text">{label}</span>
        <span className="flex items-center gap-2">
          <span className="font-data font-semibold text-mm-primary">{safe}%</span>
          <span className="font-data shrink-0 text-[11px] text-mm-muted">
            {tier.emoji ? `${tier.emoji} ` : ''}
            {tier.text}
          </span>
        </span>
      </div>
      <div className="font-data mb-1 text-[10px] leading-none tracking-tight text-mm-muted">
        {asciiBar(safe)}
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-mm-border/80">
        <div
          key={safe}
          className={`mm-risk-bar-inner h-full rounded-full ${severityClass(severity)}`}
          style={{ '--mm-risk-pct': `${safe}%` }}
        />
      </div>
    </div>
  )
}
