import { useState } from 'react'
import { MACRO_FACTOR_LABEL } from '../lib/macroFactorKeywords.js'

function SeverityBadge({ severity }) {
  const map = {
    high: { text: '중요', cls: 'bg-mm-pink/12 text-mm-pink border-mm-pink/25' },
    medium: {
      text: '주의',
      cls: 'bg-mm-yellow/15 text-mm-warning border-mm-yellow/30',
    },
    low: { text: '참고', cls: 'bg-mm-cyan/12 text-mm-primary border-mm-cyan/25' },
  }
  const s = map[severity] || map.low
  return (
    <span
      className={`font-data rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${s.cls}`}
    >
      {s.text}
    </span>
  )
}

function MacroTag({ factorKey }) {
  const label = MACRO_FACTOR_LABEL[factorKey] || factorKey
  return (
    <span className="rounded-md bg-mm-primary/8 px-1.5 py-0.5 text-[10px] font-semibold text-mm-primary">
      {label}
    </span>
  )
}

function TickerChip({ name }) {
  const hue = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <span
      className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-bold text-white"
      style={{ background: `hsl(${hue}, 55%, 54%)` }}
    >
      {name}
    </span>
  )
}

function NewsCard({ item, idx, totalCount }) {
  const [expanded, setExpanded] = useState(false)

  const hasAffected = item.affected_tickers?.length > 0
  const hasHistory = item.historical_echo?.trim()
  const hasImpact = item.impact_explanation?.trim()

  return (
    <article
      className={`px-5 py-5 sm:px-6 ${
        idx < totalCount - 1 ? 'border-b border-mm-border/50' : ''
      }`}
    >
      {/* 헤더 */}
      <div className="mb-2 flex flex-wrap items-start gap-2">
        <SeverityBadge severity={item.severity} />
        {item.macro_factors?.map((f) => (
          <MacroTag key={f} factorKey={f} />
        ))}
      </div>

      {/* 제목 */}
      <h4 className="mb-1.5 text-[15px] font-bold leading-snug text-mm-text">
        {item.headline}
      </h4>

      {/* 요약 */}
      <p className="mb-3 text-sm leading-relaxed text-mm-text/80">
        {item.summary}
      </p>

      {/* 파급효과 */}
      {item.ripple_effect ? (
        <div className="mb-3 rounded-xl border border-mm-border bg-mm-alt/50 px-4 py-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-mm-primary">
            파급 효과
          </p>
          <p className="text-sm leading-relaxed text-mm-text/85">
            {item.ripple_effect}
          </p>
        </div>
      ) : null}

      {/* 영향 종목 */}
      {hasAffected ? (
        <div className="mb-3">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-mm-muted">
              영향 종목
            </span>
            {item.affected_tickers.map((t) => (
              <TickerChip key={t} name={t} />
            ))}
          </div>
        </div>
      ) : null}

      {/* 펼치기 (역사 + 인과관계) */}
      {(hasHistory || hasImpact) && (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mb-2 text-xs font-semibold text-mm-primary underline-offset-4 hover:underline"
          >
            {expanded ? '접기 ▲' : '왜 영향을 받나요? · 과거 사례 보기 ▼'}
          </button>

          {expanded && (
            <div className="space-y-3 rounded-xl border border-mm-primary/15 bg-mm-primary/[0.03] px-4 py-4">
              {hasImpact ? (
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-mm-primary">
                    왜 내 종목에 영향이 있나요?
                  </p>
                  <p className="text-sm leading-relaxed text-mm-text/85">
                    {item.impact_explanation}
                  </p>
                </div>
              ) : null}
              {hasHistory ? (
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-mm-warning">
                    과거 유사 사례
                  </p>
                  <p className="text-sm leading-relaxed text-mm-text/85">
                    {item.historical_echo}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
    </article>
  )
}

function PortfolioImpactSummary({ newsFeed, portfolioTickers }) {
  if (!portfolioTickers?.length || !newsFeed?.length) return null

  const tickerHitCount = {}
  const highCount = newsFeed.filter((n) => n.severity === 'high').length

  for (const news of newsFeed) {
    for (const t of news.affected_tickers || []) {
      tickerHitCount[t] = (tickerHitCount[t] || 0) + 1
    }
  }

  const sorted = Object.entries(tickerHitCount).sort((a, b) => b[1] - a[1])
  if (!sorted.length) return null

  return (
    <div className="rounded-2xl border border-mm-warning/20 bg-gradient-to-r from-mm-warning/[0.06] to-mm-yellow/[0.04] px-5 py-4 sm:px-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-mm-warning">
        오늘 뉴스 → 내 종목 종합
      </p>
      <p className="text-sm leading-relaxed text-mm-text">
        오늘 뉴스 <strong>{newsFeed.length}건</strong> 중{' '}
        <strong className="text-mm-pink">{highCount}건이 중요</strong>로 판단되었고,
        내 종목 중{' '}
        {sorted.slice(0, 3).map(([name, count], i) => (
          <span key={name}>
            {i > 0 && ', '}
            <strong>{name}</strong>({count}건 연관)
          </span>
        ))}
        {sorted.length > 3 ? ` 외 ${sorted.length - 3}종목` : ''}이 언급되었습니다.
      </p>
    </div>
  )
}

export default function NewsFeed({ newsFeed, portfolioTickers }) {
  const list = Array.isArray(newsFeed) ? newsFeed.filter((n) => n.headline) : []

  if (!list.length) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-mm-border bg-mm-alt/40 px-6 py-12 text-center">
        <span className="mb-3 block text-3xl opacity-40">📰</span>
        <p className="text-sm font-semibold text-mm-text">아직 뉴스 피드가 비어 있어요</p>
        <p className="mt-1 text-xs text-mm-muted">
          &quot;오늘 다시 분석&quot;을 누르면 오늘 뉴스가 내 종목 렌즈로 채워집니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PortfolioImpactSummary
        newsFeed={list}
        portfolioTickers={portfolioTickers}
      />

      <div className="overflow-hidden rounded-2xl border border-mm-border bg-white shadow-mm-card">
        <div className="border-b border-mm-border bg-mm-alt/60 px-5 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-extrabold text-mm-text">
              오늘의 뉴스
            </h3>
            <span className="font-data rounded-full bg-mm-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-mm-primary">
              {list.length}건
            </span>
          </div>
          <p className="mt-0.5 text-xs text-mm-muted">
            각 뉴스의 파급효과·과거 사례·내 종목 영향을 확인하세요
          </p>
        </div>
        {list.map((item, i) => (
          <NewsCard
            key={item.headline + i}
            item={item}
            idx={i}
            totalCount={list.length}
          />
        ))}
      </div>
    </div>
  )
}
