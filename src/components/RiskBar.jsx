import { useEffect, useState } from 'react'

function severityColor(severity) {
  if (severity === 'high') return 'bg-mm-warning'
  if (severity === 'medium') return 'bg-yellow-400'
  return 'bg-mm-accent'
}

export default function RiskBar({ label, score, severity }) {
  const [width, setWidth] = useState(0)
  const safe = Math.min(100, Math.max(0, Number(score) || 0))

  useEffect(() => {
    const t = requestAnimationFrame(() => setWidth(safe))
    return () => cancelAnimationFrame(t)
  }, [safe])

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-mm-muted">{label}</span>
        <span className="font-data text-mm-accent">{safe}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-mm-border">
        <div
          className={`h-full rounded transition-all duration-1000 ease-out ${severityColor(severity)}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
