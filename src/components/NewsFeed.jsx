import { useState, useMemo } from 'react'
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
      className={`px-5 py-5 sm:px-6 transition-all duration-300 ${
        idx < totalCount - 1 ? 'border-b border-mm-border/50' : ''
      } ${expanded ? 'bg-mm-alt/30' : 'hover:bg-mm-alt/10'}`}
    >
      <div 
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* 헤더 */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={item.severity} />
            {item.region === 'domestic' ? (
              <span className="text-[10px] font-black text-mm-primary px-1.5 py-0.5 rounded border border-mm-primary/20 bg-mm-primary/5">국내</span>
            ) : (
              <span className="text-[10px] font-black text-mm-pink px-1.5 py-0.5 rounded border border-mm-pink/20 bg-mm-pink/5">해외</span>
            )}
            {item.macro_factors?.map((f) => (
              <MacroTag key={f} factorKey={f} />
            ))}
          </div>
          <span className={`text-xs transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </div>

        {/* 제목 */}
        <h4 className={`mb-1.5 text-[15px] font-bold leading-snug transition-colors ${expanded ? 'text-mm-primary' : 'text-mm-text'}`}>
          {item.headline}
        </h4>

        {/* 요약 */}
        <p className="mb-3 text-sm leading-relaxed text-mm-text/80">
          {item.summary}
        </p>

        {/* 영향 종목 (미리보기) */}
        {hasAffected && !expanded && (
          <div className="flex flex-wrap items-center gap-1.5 opacity-70">
            <span className="text-[9px] font-bold text-mm-muted uppercase">영향:</span>
            {item.affected_tickers.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] font-bold text-mm-text">{t}</span>
            ))}
            {item.affected_tickers.length > 3 && <span className="text-[10px]">...</span>}
          </div>
        )}
      </div>

      {/* 상세 내용 (펼쳐졌을 때만) */}
      {expanded && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* 파급효과 */}
          {item.ripple_effect ? (
            <div className="rounded-xl border border-mm-border bg-white px-4 py-3 shadow-sm">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-mm-primary">
                시장 파급 효과
              </p>
              <p className="text-sm leading-relaxed text-mm-text/85">
                {item.ripple_effect}
              </p>
            </div>
          ) : null}

          {/* 영향 종목 상세 */}
          {hasAffected && (
            <div className="rounded-xl border border-mm-border bg-white px-4 py-3 shadow-sm">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-mm-muted">
                영향을 받는 내 종목
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.affected_tickers.map((t) => (
                  <TickerChip key={t} name={t} />
                ))}
              </div>
              {hasImpact && (
                <div>
                  <p className="mb-1 text-[10px] font-bold text-mm-primary">분석 근거</p>
                  <p className="text-sm leading-relaxed text-mm-text/85 italic">
                    &quot;{item.impact_explanation}&quot;
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 과거 사례 */}
          {hasHistory ? (
            <div className="rounded-xl border border-mm-warning/20 bg-mm-warning/[0.02] px-4 py-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-mm-warning">
                과거 유사 사례 (Historical Echo)
              </p>
              <p className="text-sm leading-relaxed text-mm-text/85">
                {item.historical_echo}
              </p>
            </div>
          ) : null}
          
          <button 
            onClick={() => setExpanded(false)}
            className="w-full py-2 text-[10px] font-bold text-mm-muted hover:text-mm-text transition-colors uppercase tracking-widest"
          >
            상세 정보 접기 ▲
          </button>
        </div>
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

export default function NewsFeed({ newsFeed, portfolioTickers, onSelectNews, selectedIdx }) {
  const [activeRegion, setActiveRegion] = useState('all')
  const list = useMemo(
    () => (Array.isArray(newsFeed) ? newsFeed.filter((n) => n.headline) : []),
    [newsFeed],
  )

  const domesticNews = useMemo(() => list.filter((n) => n.region === 'domestic'), [list])
  const internationalNews = useMemo(
    () => list.filter((n) => n.region === 'international' || !n.region),
    [list],
  )

  const filteredList = useMemo(() => {
    if (activeRegion === 'domestic') return domesticNews
    if (activeRegion === 'international') return internationalNews
    return list
  }, [activeRegion, list, domesticNews, internationalNews])

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

      {/* 지역 필터 탭 */}
      <div className="flex p-1 bg-mm-alt rounded-xl border border-mm-border w-full">
        {[
          { id: 'all', label: '전체' },
          { id: 'domestic', label: '국내' },
          { id: 'international', label: '해외' }
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setActiveRegion(r.id)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeRegion === r.id 
                ? 'bg-white text-mm-primary shadow-sm ring-1 ring-mm-border' 
                : 'text-mm-muted hover:text-mm-text'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredList.map((item, i) => {
          const originalIdx = list.indexOf(item)
          const isActive = selectedIdx === originalIdx
          
          return (
            <div
              key={item.headline + i}
              onClick={() => onSelectNews(originalIdx)}
              className={`mm-card cursor-pointer border p-4 transition-all duration-200 ${
                isActive 
                  ? 'border-mm-primary bg-mm-primary/5 shadow-md' 
                  : 'border-mm-border bg-white hover:border-mm-primary/30'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    item.region === 'domestic' ? 'text-mm-primary bg-mm-primary/10' : 'text-mm-pink bg-mm-pink/10'
                  }`}>
                    {item.region === 'domestic' ? '국내' : '해외'}
                  </span>
                  <span className="text-[9px] font-bold text-mm-muted bg-mm-alt px-1.5 py-0.5 rounded">
                    {item.sector || '기타'}
                  </span>
                </div>
                <span className="text-[10px] text-mm-muted">8시간 전</span>
              </div>
              <h4 className={`text-sm font-bold leading-snug ${isActive ? 'text-mm-primary' : 'text-mm-text'}`}>
                {item.headline}
              </h4>
              <div className="mt-2 flex items-center gap-1.5">
                <span className={`text-[10px] font-bold ${item.severity === 'high' ? 'text-mm-pink' : 'text-mm-primary'}`}>
                  {item.severity === 'high' ? '0.5% 상승' : '변동'}
                </span>
                <span className="text-[10px] text-mm-muted truncate italic opacity-60">
                  {item.macro_factors?.[0]} 관련
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
