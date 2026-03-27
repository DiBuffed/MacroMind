import { useState } from 'react'
import MacroIndicatorBar from './MacroIndicatorBar.jsx'
import RiskMatrix from './RiskMatrix.jsx'
import BriefingPanel from './BriefingPanel.jsx'
import DiversificationWarning from './DiversificationWarning.jsx'
import OutlookSynthesisPanel from './OutlookSynthesisPanel.jsx'
import HoldingsGrid from './HoldingsGrid.jsx'
import QuickAddTicker from './QuickAddTicker.jsx'
import AgentRealityNote from './AgentRealityNote.jsx'
import MacroVariablesBoard from './MacroVariablesBoard.jsx'
import { AgentPipelineCompact } from './AgentPipeline.jsx'
import NewsFeed from './NewsFeed.jsx'

const SOURCE_LABEL = {
  frankfurter: 'ECB 환율',
  newsapi: 'NewsAPI',
  finnhub_news: 'Finnhub',
  fred: 'FRED',
  alphavantage: 'Alpha Vantage',
}

function formatBriefingTime(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return ''
  }
}

export default function DashboardScreen({
  data,
  contextMeta,
  lastBriefingAt,
  onRefreshToday,
  onEditHoldings,
  onReset,
  onAddTicker,
  onRemoveTicker,
  errorNote,
}) {
  const [tab, setTab] = useState('news')
  const [selectedTicker, setSelectedTicker] = useState(null)

  const hasPortfolio =
    Array.isArray(data?.portfolio_tickers) && data.portfolio_tickers.length > 0

  const tabs = [
    { key: 'news', label: '오늘 뉴스' },
    { key: 'portfolio', label: '내 종목' },
    { key: 'board', label: '변수 보드' },
    { key: 'risk', label: '리스크' },
    { key: 'outlook', label: '전망' },
  ]

  return (
    <div className="flex-1 bg-mm-page">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        {/* ── 상단 헤더 ── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold tracking-tight text-mm-text sm:text-3xl">
              오늘의 흐름, 내 종목 렌즈
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-mm-muted">
              뉴스·거시·역사·리스크를 한 화면에 묶었습니다. 시장은 복잡해도,{' '}
              <strong className="font-medium text-mm-text/90">
                내 종목과 어떻게 맞닿는지
              </strong>
              부터 보시면 됩니다.
            </p>
            {lastBriefingAt ? (
              <p className="font-data mt-1.5 text-xs text-mm-muted/70">
                마지막 분석: {formatBriefingTime(lastBriefingAt)}
              </p>
            ) : null}
            {errorNote && (
              <p className="mt-2 rounded-xl border border-mm-warning/30 bg-mm-warning/10 px-4 py-2 text-sm text-mm-warning">
                {errorNote}
              </p>
            )}
            {contextMeta?.sources?.length > 0 ? (
              <p className="mt-1.5 text-xs text-mm-muted/60">
                소스:{' '}
                {contextMeta.sources
                  .map((s) => SOURCE_LABEL[s] || s)
                  .join(' · ')}
                {contextMeta.newsCount
                  ? ` · 헤드라인 ${contextMeta.newsCount}건`
                  : ''}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={onRefreshToday}
              className="mm-pill bg-mm-primary px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-mm-primary/20 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              오늘 다시 분석
            </button>
            <button
              type="button"
              onClick={onEditHoldings}
              className="font-data rounded-full border border-mm-border bg-white px-4 py-2.5 text-xs font-semibold text-mm-muted transition hover:border-mm-primary/40 hover:text-mm-primary"
            >
              종목 수정
            </button>
            <button
              type="button"
              onClick={onReset}
              className="font-data rounded-full border border-mm-border bg-white px-4 py-2.5 text-xs font-semibold text-mm-muted transition hover:border-mm-pink/40 hover:text-mm-pink"
            >
              초기화
            </button>
          </div>
        </div>

        {/* ── 에이전트 파이프라인 (컴팩트) ── */}
        <section className="mb-4">
          <AgentPipelineCompact
            contextMeta={contextMeta}
            lastBriefingAt={lastBriefingAt}
          />
        </section>

        {/* ── 거시 지표 바 (항상 보임) ── */}
        <section className="mb-6">
          <MacroIndicatorBar indicators={data?.indicators} />
        </section>

        {/* ── 탭 네비게이션 ── */}
        <nav className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-mm-border bg-mm-alt/60 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`font-data flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                tab === t.key
                  ? 'bg-white text-mm-primary shadow-sm'
                  : 'text-mm-muted hover:text-mm-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* ── 오늘 뉴스 탭 ── */}
        {tab === 'news' && (
          <NewsFeed
            newsFeed={data?.news_feed}
            portfolioTickers={data?.portfolio_tickers}
          />
        )}

        {/* ── 변수 보드 (거시 히트맵 · 종목×축 · 역사) ── */}
        {tab === 'board' && (
          <MacroVariablesBoard data={data} hasPortfolio={hasPortfolio} />
        )}

        {/* ── 내 종목 탭 ── */}
        {tab === 'portfolio' && (
          <div className="space-y-6">
            {onAddTicker ? (
              <QuickAddTicker onAdd={onAddTicker} />
            ) : null}

            <HoldingsGrid
              tickers={data?.portfolio_tickers}
              stockDetails={data?.stock_details}
              riskMatrix={data?.risk_matrix}
              onRemoveTicker={onRemoveTicker}
              onSelectTicker={setSelectedTicker}
              selectedTicker={selectedTicker}
            />

            {/* 선택된 종목 디테일 */}
            {selectedTicker && data?.stock_details?.[selectedTicker] ? (
              <div className="mm-card p-5 sm:p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-mm-text">
                    {selectedTicker} 거시 맥락
                  </h4>
                  <button
                    type="button"
                    onClick={() => setSelectedTicker(null)}
                    className="text-xs text-mm-muted hover:text-mm-text"
                  >
                    닫기
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-mm-text/85">
                  {data.stock_details[selectedTicker]}
                </p>
              </div>
            ) : null}

            {data?.diversification_warning?.has_warning ? (
              <DiversificationWarning
                warning={data.diversification_warning}
              />
            ) : null}

            <AgentRealityNote />
          </div>
        )}

        {/* ── 리스크 탭 ── */}
        {tab === 'risk' && (
          <div className="space-y-6">
            <RiskMatrix riskMatrix={data?.risk_matrix} />
            {data?.diversification_warning?.has_warning ? (
              <DiversificationWarning
                warning={data.diversification_warning}
              />
            ) : null}
          </div>
        )}

        {/* ── 전망 탭 ── */}
        {tab === 'outlook' && (
          <div className="space-y-6">
            <BriefingPanel
              briefing={data?.briefing}
              historicalPattern={data?.historical_pattern}
              portfolioLens={hasPortfolio}
            />
            <OutlookSynthesisPanel
              macroOutlook={data?.macro_outlook}
              portfolioSynthesis={data?.portfolio_synthesis}
              hasPortfolio={hasPortfolio}
            />
            {!data?.macro_outlook?.summary && (
              <div className="rounded-2xl border-2 border-dashed border-mm-border bg-mm-alt/40 px-6 py-10 text-center">
                <p className="text-sm text-mm-muted">
                  &quot;오늘 다시 분석&quot;을 누르면 최신 뉴스·시세 기반으로 전망이 갱신됩니다.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
