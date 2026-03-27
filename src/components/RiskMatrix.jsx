import RiskBar from './RiskBar.jsx'
import DiversificationWarning from './DiversificationWarning.jsx'

const ORDER = [
  'currency',
  'interest_rate',
  'trump_policy',
  'geopolitical',
  'oil',
]

export default function RiskMatrix({ riskMatrix, diversificationWarning }) {
  return (
    <div className="rounded-lg border border-mm-border bg-mm-surface/40 p-5">
      <h3 className="mb-5 text-lg font-semibold text-white">
        내 포트폴리오 거시 노출도
      </h3>
      <div className="space-y-4">
        {ORDER.map((key) => {
          const row = riskMatrix?.[key]
          if (!row) return null
          return (
            <RiskBar
              key={key}
              label={row.label}
              score={row.score}
              severity={row.severity}
            />
          )
        })}
      </div>
      <DiversificationWarning warning={diversificationWarning} />
    </div>
  )
}
