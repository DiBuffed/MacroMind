import RiskBar from './RiskBar.jsx'

const ORDER = [
  'currency',
  'interest_rate',
  'trump_policy',
  'geopolitical',
  'oil',
]

export default function RiskMatrix({ riskMatrix }) {
  return (
    <div className="rounded-lg border border-mm-border bg-mm-surface/40 p-5">
      <p className="font-data mb-1 text-xs uppercase tracking-wider text-mm-accent">
        리스크 매트릭스
      </p>
      <h3 className="mb-1 text-lg font-semibold text-white">
        내 포트폴리오 거시 노출도
      </h3>
      <p className="mb-5 text-xs text-mm-muted">
        환율·금리·정책·전쟁·유가 각각이 포트폴리오에 얼마나 민감한지 0~100%로 요약합니다.
      </p>
      <div className="space-y-5">
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
    </div>
  )
}
