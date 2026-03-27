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
    <div className="mm-card p-6 sm:p-8">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-mm-primary">
        리스크 매트릭스
      </p>
      <h3 className="mb-1 text-xl font-extrabold tracking-tight text-mm-text">
        내 포트폴리오 거시 노출도
      </h3>
      <p className="mb-6 text-sm text-mm-muted">
        환율·금리·정책·전쟁·유가 각각이 포트폴리오에 얼마나 민감한지 0~100%로 요약합니다.
      </p>
      <div className="space-y-6">
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
