import {
  MACRO_FACTOR_LABEL,
  MACRO_FACTOR_ORDER,
  textMentionsFactor,
} from '../lib/macroFactorKeywords.js'

function Cell({ linked }) {
  if (linked) {
    return (
      <span
        className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-emerald-500/15 text-xs font-bold text-emerald-700"
        title="종목 설명에 해당 거시 요인이 직접 언급됨"
      >
        연결
      </span>
    )
  }
  return (
    <span
      className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-mm-border/60 text-xs font-medium text-mm-muted"
      title="직접 언급 없음 — 포트폴리오 공통 노출도는 위 히트맵 참고"
    >
      간접
    </span>
  )
}

export default function StockMacroLinkMatrix({ tickers, stockDetails }) {
  const list = Array.isArray(tickers) ? tickers.filter(Boolean) : []

  if (!list.length) {
    return (
      <p className="rounded-xl border border-dashed border-mm-border bg-mm-alt/40 px-4 py-6 text-center text-sm text-mm-muted">
        종목이 있으면 거시 축과의 텍스트 연결이 표시됩니다.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-mm-border bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-mm-border bg-mm-alt/70">
            <th className="sticky left-0 z-[1] bg-mm-alt/95 px-4 py-3 font-bold text-mm-text">
              종목
            </th>
            {MACRO_FACTOR_ORDER.map((key) => (
              <th
                key={key}
                className="px-2 py-3 text-center text-xs font-bold text-mm-muted"
              >
                {MACRO_FACTOR_LABEL[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((t) => {
            const detail = stockDetails?.[t] || ''
            return (
              <tr key={t} className="border-b border-mm-border/80 last:border-0">
                <td className="sticky left-0 z-[1] bg-white px-4 py-2.5 font-semibold text-mm-text">
                  {t}
                </td>
                {MACRO_FACTOR_ORDER.map((key) => (
                  <td key={key} className="px-2 py-2">
                    <Cell linked={textMentionsFactor(detail, key)} />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="border-t border-mm-border bg-mm-alt/50 px-4 py-2.5 text-[11px] leading-relaxed text-mm-muted">
        &quot;연결&quot;은 브리핑에 포함된 종목 설명 문장에 해당 거시 키워드가 있을 때만
        표시합니다. 세밀한 민감도 수치는 향후 브리핑 스키마 확장 시 보강할 수 있습니다.
      </p>
    </div>
  )
}
