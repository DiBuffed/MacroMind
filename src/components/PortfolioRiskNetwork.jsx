const RISK_ORDER = [
  'currency',
  'interest_rate',
  'trump_policy',
  'geopolitical',
  'oil',
]

function shorten(text, max = 10) {
  if (!text || typeof text !== 'string') return ''
  const t = text.trim()
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}

function severityStroke(sev) {
  if (sev === 'high') return 'rgba(247, 37, 133, 0.88)'
  if (sev === 'medium') return 'rgba(255, 209, 102, 0.95)'
  return 'rgba(76, 201, 240, 0.9)'
}

export default function PortfolioRiskNetwork({ riskMatrix, tickers }) {
  const list = Array.isArray(tickers) ? tickers.filter(Boolean) : []
  const shown = list.slice(0, 6)
  const extra = list.length - shown.length

  const cx = 200
  const cy = 200
  const rRisk = 132
  const rTicker = 62

  const risks = RISK_ORDER.map((key) => {
    const row = riskMatrix?.[key]
    if (!row) return null
    return { key, ...row }
  }).filter(Boolean)

  const nRisk = risks.length || 1
  const riskNodes = risks.map((row, i) => {
    const a = -Math.PI / 2 + (i * (2 * Math.PI)) / nRisk
    return {
      ...row,
      x: cx + rRisk * Math.cos(a),
      y: cy + rRisk * Math.sin(a),
    }
  })

  const tickerNodes = shown.map((name, j) => {
    const a = -Math.PI / 2 + (j * (2 * Math.PI)) / (shown.length || 1)
    return {
      name,
      x: cx + rTicker * Math.cos(a),
      y: cy + rTicker * Math.sin(a),
    }
  })

  return (
    <div className="mm-card p-5 sm:p-6">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-mm-primary">
        연결도
      </p>
      <h3 className="mb-1 text-xl font-extrabold text-mm-text">
        포트폴리오 · 거시 요인 네트워크
      </h3>
      <p className="mb-5 text-sm text-mm-muted">
        중심은 내 포트폴리오, 바깥 노드는 거시 리스크 축입니다. 선 굵기·색은 노출도(%)와
        심각도를 반영합니다.
      </p>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 400 400"
          className="mx-auto h-auto w-full max-w-md"
          role="img"
          aria-label="포트폴리오와 거시 리스크 요인 연결도"
        >
          <defs>
            <filter id="mm-net-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {riskNodes.map((node) => {
            const w = 1.2 + (Number(node.score) || 0) / 45
            return (
              <line
                key={node.key}
                x1={cx}
                y1={cy}
                x2={node.x}
                y2={node.y}
                stroke={severityStroke(node.severity)}
                strokeWidth={w}
                strokeLinecap="round"
                opacity={0.45 + (Number(node.score) || 0) / 280}
              />
            )
          })}

          {tickerNodes.map((t) => (
            <line
              key={t.name}
              x1={cx}
              y1={cy}
              x2={t.x}
              y2={t.y}
              stroke="rgba(102, 102, 119, 0.35)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          ))}

          {riskNodes.map((node) => {
            const r = 10 + (Number(node.score) || 0) / 14
            return (
              <g key={node.key}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill="#ffffff"
                  stroke={severityStroke(node.severity)}
                  strokeWidth={2}
                  filter="url(#mm-net-glow)"
                />
                <text
                  x={node.x}
                  y={node.y - r - 8}
                  textAnchor="middle"
                  fill="#666677"
                  style={{
                    fontSize: '10px',
                    fontFamily: 'inherit',
                  }}
                >
                  {shorten(node.label, 9)}
                </text>
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#4361ee"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  {Math.min(100, Math.max(0, Number(node.score) || 0))}%
                </text>
              </g>
            )
          })}

          {tickerNodes.map((t) => (
            <g key={t.name}>
              <circle
                cx={t.x}
                cy={t.y}
                r={14}
                fill="#ffffff"
                stroke="rgba(76, 201, 240, 0.65)"
                strokeWidth={1.5}
              />
              <text
                x={t.x}
                y={t.y + 4}
                textAnchor="middle"
                fill="#1a1a2e"
                style={{ fontSize: '9px', fontWeight: 600 }}
              >
                {shorten(t.name, 5)}
              </text>
            </g>
          ))}

          <circle
            cx={cx}
            cy={cy}
            r={28}
            fill="#ffffff"
            stroke="rgba(67, 97, 238, 0.45)"
            strokeWidth={2.5}
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#1a1a2e"
            style={{ fontSize: '11px', fontWeight: 800 }}
          >
            포트폴리오
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fill="#666677"
            style={{ fontSize: '9px' }}
          >
            중심
          </text>
        </svg>
      </div>

      {extra > 0 && (
        <p className="font-data mt-2 text-center text-[10px] text-mm-muted">
          종목 {extra}개는 아래 탭에서 확인
        </p>
      )}
    </div>
  )
}
