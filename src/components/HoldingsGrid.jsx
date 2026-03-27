import { useMemo, useState } from 'react'
import {
  MACRO_FACTOR_LABEL,
  MACRO_FACTOR_ORDER,
  textMentionsFactor,
} from '../lib/macroFactorKeywords.js'

function severityDot(severity) {
  if (severity === 'high') return 'bg-mm-pink'
  if (severity === 'medium') return 'bg-mm-yellow'
  return 'bg-mm-cyan'
}

function topRiskForTicker(riskMatrix) {
  if (!riskMatrix || typeof riskMatrix !== 'object') return null
  let top = null
  for (const [, v] of Object.entries(riskMatrix)) {
    if (!v?.score) continue
    if (!top || v.score > top.score) top = v
  }
  return top
}

function TickerAvatar({ name }) {
  const letter = (name || '?')[0]
  const hue = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-sm"
      style={{ background: `hsl(${hue}, 55%, 54%)` }}
    >
      {letter}
    </div>
  )
}

function MacroTags({ detail }) {
  const tags = useMemo(() => {
    if (!detail) return []
    return MACRO_FACTOR_ORDER
      .filter((key) => textMentionsFactor(detail, key))
      .map((key) => MACRO_FACTOR_LABEL[key])
  }, [detail])

  if (!tags.length) return null
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-md bg-mm-primary/8 px-1.5 py-0.5 text-[10px] font-semibold text-mm-primary"
        >
          {t}
        </span>
      ))}
    </div>
  )
}

export default function HoldingsGrid({
  tickers,
  stockDetails,
  riskMatrix,
  onRemoveTicker,
  onSelectTicker,
  selectedTicker,
}) {
  const list = useMemo(
    () => (Array.isArray(tickers) ? tickers.filter(Boolean) : []),
    [tickers],
  )

  const [hoveredIdx, setHoveredIdx] = useState(-1)
  const topRisk = topRiskForTicker(riskMatrix)

  if (!list.length) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-mm-border bg-mm-alt/40 px-6 py-12 text-center">
        <span className="mb-3 block text-3xl opacity-40">📋</span>
        <p className="text-sm font-semibold text-mm-text">
          아직 등록된 종목이 없습니다
        </p>
        <p className="mt-1 text-xs text-mm-muted">
          위에서 종목을 추가하거나, &quot;종목 수정&quot;을 눌러 등록하세요.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-mm-border bg-white shadow-mm-card">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-mm-border bg-mm-alt/60 px-5 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-extrabold text-mm-text">내 보유종목</h3>
          <span className="font-data rounded-full bg-mm-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-mm-primary">
            {list.length}종목
          </span>
        </div>
        {topRisk ? (
          <span className="flex items-center gap-1.5 text-xs text-mm-muted">
            최대 노출
            <span
              className={`inline-block h-2 w-2 rounded-full ${severityDot(topRisk.severity)}`}
            />
            <span className="font-data font-semibold text-mm-text">
              {topRisk.label} {topRisk.score}%
            </span>
          </span>
        ) : null}
      </div>

      {/* 리스트 */}
      <ul>
        {list.map((ticker, i) => {
          const detail = stockDetails?.[ticker]
          const isLast = i === list.length - 1
          const isSelected = selectedTicker === ticker
          return (
            <li
              key={ticker}
              className={`group flex items-start gap-3.5 px-5 py-4 transition sm:gap-4 sm:px-6 ${
                !isLast ? 'border-b border-mm-border/50' : ''
              } ${isSelected ? 'bg-mm-primary/[0.04]' : 'hover:bg-mm-alt/50'}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(-1)}
            >
              {/* 순위 */}
              <span className="font-data mt-1 hidden w-5 shrink-0 text-right text-xs font-semibold text-mm-muted sm:block">
                {i + 1}
              </span>

              {/* 아바타 */}
              <TickerAvatar name={ticker} />

              {/* 종목 정보 */}
              <button
                type="button"
                onClick={() => onSelectTicker?.(ticker)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-bold text-mm-text">
                  {ticker}
                </p>
                {detail ? (
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-mm-muted">
                    {detail}
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-mm-muted/50">
                    &quot;오늘 다시 분석&quot;을 하면 거시 맥락이 채워집니다
                  </p>
                )}
                <MacroTags detail={detail} />
              </button>

              {/* 삭제 */}
              {onRemoveTicker && (hoveredIdx === i || isSelected) ? (
                <button
                  type="button"
                  onClick={() => onRemoveTicker(ticker)}
                  className="mt-1 shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-mm-pink opacity-0 transition group-hover:opacity-100"
                  title="종목 제거"
                >
                  ✕
                </button>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
