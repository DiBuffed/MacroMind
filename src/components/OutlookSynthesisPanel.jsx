export default function OutlookSynthesisPanel({
  macroOutlook,
  portfolioSynthesis,
  hasPortfolio,
}) {
  const summary = macroOutlook?.summary?.trim()
  const scenarios = Array.isArray(macroOutlook?.scenarios)
    ? macroOutlook.scenarios.filter(Boolean)
    : []
  const watchFactors = Array.isArray(macroOutlook?.watch_factors)
    ? macroOutlook.watch_factors.filter(Boolean)
    : []

  const synthesis = typeof portfolioSynthesis === 'string' ? portfolioSynthesis.trim() : ''

  if (!summary && !synthesis && scenarios.length === 0 && watchFactors.length === 0) {
    return null
  }

  return (
    <section className="mm-card mb-10 p-6 sm:p-8">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-mm-primary">
        전망 · 종합
      </p>
      <h3 className="mb-1 text-xl font-extrabold text-mm-text">
        거시 시나리오와 포트폴리오 시사점
      </h3>
      <p className="mb-6 text-sm text-mm-muted">
        미래는 확정이 아니라 시나리오입니다. 아래는 오늘 데이터·뉴스 맥락에서의 정리이며 투자
        권유가 아닙니다.
      </p>

      {summary ? (
        <div className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-mm-text">
          {summary}
        </div>
      ) : null}

      {scenarios.length > 0 ? (
        <div className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-mm-muted">
            시나리오 스케치
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-mm-text">
            {scenarios.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {watchFactors.length > 0 ? (
        <div className="mb-6 rounded-xl border border-mm-border bg-mm-alt/40 px-4 py-3">
          <p className="mb-2 text-xs font-bold text-mm-primary">이번 주·단기 체크</p>
          <ul className="flex flex-wrap gap-2">
            {watchFactors.map((w, i) => (
              <li
                key={i}
                className="font-data rounded-full border border-mm-border bg-white px-3 py-1 text-xs text-mm-text"
              >
                {w}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasPortfolio && synthesis ? (
        <div className="rounded-xl border border-mm-primary/20 bg-mm-primary/[0.04] p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-mm-primary">
            내 종목 바구니 종합
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-mm-text">
            {synthesis}
          </p>
        </div>
      ) : null}
    </section>
  )
}
