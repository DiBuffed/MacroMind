import { useMemo, useState } from 'react'
import MacroIndicatorBar from './MacroIndicatorBar.jsx'
import RiskMatrix from './RiskMatrix.jsx'
import BriefingPanel from './BriefingPanel.jsx'
import DiversificationWarning from './DiversificationWarning.jsx'
import OutlookSynthesisPanel from './OutlookSynthesisPanel.jsx'
import HoldingsGrid from './HoldingsGrid.jsx'
import QuickAddTicker from './QuickAddTicker.jsx'
import AgentRealityNote from './AgentRealityNote.jsx'
import AgentTracePanel from './AgentTracePanel.jsx'
import MacroVariablesBoard from './MacroVariablesBoard.jsx'
import { AgentPipelineCompact } from './AgentPipeline.jsx'
import NewsFeed from './NewsFeed.jsx'
import NewsDetail from './NewsDetail.jsx'

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
  historyList = [],
  onRefreshToday,
  onEditHoldings,
  onReset,
  onAddTicker,
  onRemoveTicker,
}) {
  const [tab, setTab] = useState('news')
  const [selectedTicker, setSelectedTicker] = useState(null)

  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null)
  const [selectedNewsIdx, setSelectedNewsIdx] = useState(0)

  const selectedEntry = useMemo(() => {
    if (!selectedHistoryDate) return null
    return historyList.find((h) => h.date === selectedHistoryDate) ?? null
  }, [historyList, selectedHistoryDate])

  const viewData = selectedEntry?.data ?? data
  const viewMeta = selectedEntry?.contextMeta ?? contextMeta
  const viewDate = selectedEntry?.date ?? lastBriefingAt

  const safeSelectedNewsIdx = useMemo(() => {
    const len = Array.isArray(viewData?.news_feed) ? viewData.news_feed.length : 0
    if (len <= 0) return 0
    if (selectedNewsIdx < 0) return 0
    if (selectedNewsIdx >= len) return 0
    return selectedNewsIdx
  }, [selectedNewsIdx, viewData])

  const hasPortfolio =
    Array.isArray(viewData?.portfolio_tickers) && viewData.portfolio_tickers.length > 0

  const tabs = [
    { key: 'news', label: '뉴스(9시)' },
    { key: 'board', label: '변수 보드' },
    { key: 'risk', label: '리스크' },
    { key: 'outlook', label: '전망' },
  ]

  return (
    <div className="flex-1 bg-mm-page">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        {/* ── 상단 헤더 ── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-mm-border pb-6">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold tracking-tight text-mm-text sm:text-3xl">
              MacroMind 에이전트 브리핑
              <span className="ml-3 inline-block rounded-lg bg-[#ffd166] px-2 py-0.5 text-[10px] font-black text-white">BETA</span>
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-mm-muted">
              에이전트가 오늘의 <strong className="font-medium text-mm-text/90">뉴스 → 흐름(거시/섹터) → 내 종목</strong>을 연결해 정리합니다.
            </p>
            {viewDate ? (
              <p className="font-data mt-1.5 text-xs text-mm-muted/70">
                마지막 분석: {formatBriefingTime(viewDate)}
              </p>
            ) : null}
            {viewMeta?.sources?.length > 0 ? (
              <p className="mt-1.5 text-xs text-mm-muted/60">
                소스:{' '}
                {viewMeta.sources
                  .map((s) => SOURCE_LABEL[s] || s)
                  .join(' · ')}
                {viewMeta.newsCount
                  ? ` · 헤드라인 ${viewMeta.newsCount}건`
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
            contextMeta={viewMeta}
            lastBriefingAt={viewDate}
          />
        </section>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* ── 왼쪽: 메인 분석 패널 ── */}
          <main className="flex-1 min-w-0">
            {/* ── 거시 지표 바 (항상 보임) ── */}
            <section className="mb-6">
              <MacroIndicatorBar indicators={viewData?.indicators} />
            </section>

            {/* ── 탭 네비게이션 ── */}
            <div className="flex flex-col gap-4 mb-6">
              {historyList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <span className="text-[10px] font-black text-mm-muted uppercase shrink-0">히스토리:</span>
                  {historyList.map((entry, i) => {
                    const isActive = selectedHistoryDate
                      ? selectedHistoryDate === entry.date
                      : i === 0
                    const d = new Date(entry.date)
                    return (
                      <button
                        key={entry.date}
                        onClick={() => setSelectedHistoryDate(i === 0 ? null : entry.date)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 ${
                          isActive 
                            ? 'bg-mm-primary text-white shadow-sm' 
                            : 'bg-mm-alt text-mm-muted hover:bg-mm-border'
                        }`}
                      >
                        {i === 0 ? '최신' : `${d.getMonth()+1}/${d.getDate()}`}
                      </button>
                    )
                  })}
                </div>
              )}
              
              <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-mm-border bg-mm-alt/60 p-1">
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
            </div>

            {/* ── 탭 컨텐츠 ── */}
            <div className="space-y-6">
              {tab === 'news' && (
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                  {/* 왼쪽: 뉴스 리스트 (토스 스타일 Master) */}
                  <div className="w-full lg:w-80 shrink-0">
                    <NewsFeed
                      newsFeed={viewData?.news_feed}
                      portfolioTickers={viewData?.portfolio_tickers}
                      onSelectNews={setSelectedNewsIdx}
                      selectedIdx={safeSelectedNewsIdx}
                    />
                  </div>
                  
                  {/* 중앙: 뉴스 상세 분석 (토스 스타일 Detail) */}
                  <div className="flex-1 min-w-0">
                    <NewsDetail 
                      item={viewData?.news_feed?.[safeSelectedNewsIdx]} 
                    />
                  </div>
                </div>
              )}

              {tab === 'board' && (
                <MacroVariablesBoard data={viewData} hasPortfolio={hasPortfolio} />
              )}

              {tab === 'risk' && (
                <div className="space-y-6">
                  <RiskMatrix riskMatrix={viewData?.risk_matrix} />
                  {viewData?.diversification_warning?.has_warning ? (
                    <DiversificationWarning
                      warning={viewData.diversification_warning}
                    />
                  ) : null}
                </div>
              )}

              {tab === 'outlook' && (
                <div className="space-y-6">
                  <BriefingPanel
                    briefing={viewData?.briefing}
                    historicalPattern={viewData?.historical_pattern}
                    portfolioLens={hasPortfolio}
                  />
                  <OutlookSynthesisPanel
                    macroOutlook={viewData?.macro_outlook}
                    portfolioSynthesis={viewData?.portfolio_synthesis}
                    hasPortfolio={hasPortfolio}
                  />
                </div>
              )}
            </div>
          </main>

          {/* ── 오른쪽: 보유 종목 및 상세 관리 (사이드바) ── */}
          <aside className="w-full shrink-0 lg:w-80 space-y-6">
            <div className="mm-card sticky top-24 overflow-hidden bg-white p-5 sm:p-6">
              <div className="mb-4">
                <h4 className="text-sm font-extrabold text-mm-text uppercase tracking-wider">
                  내 투자
                </h4>
              </div>

              <div className="space-y-6">
                {onAddTicker ? (
                  <QuickAddTicker onAdd={onAddTicker} />
                ) : null}

                <HoldingsGrid
                  tickers={viewData?.portfolio_tickers}
                  stockDetails={viewData?.stock_details}
                  riskMatrix={viewData?.risk_matrix}
                  onRemoveTicker={onRemoveTicker}
                  onSelectTicker={setSelectedTicker}
                  selectedTicker={selectedTicker}
                />

                {/* 선택된 종목 디테일 */}
                {selectedTicker && viewData?.stock_details?.[selectedTicker] ? (
                  <div className="rounded-xl border border-mm-primary/20 bg-mm-primary/[0.03] p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-xs font-black text-mm-primary uppercase">
                        {selectedTicker} 분석
                      </h4>
                      <button
                        type="button"
                        onClick={() => setSelectedTicker(null)}
                        className="text-[10px] font-bold text-mm-muted hover:text-mm-text"
                      >
                        닫기
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed text-mm-text/85">
                      {viewData.stock_details[selectedTicker]}
                    </p>
                  </div>
                ) : null}

                {viewData?.diversification_warning?.has_warning ? (
                  <DiversificationWarning
                    warning={viewData.diversification_warning}
                  />
                ) : null}

                <AgentTracePanel contextMeta={viewMeta} />

                <AgentRealityNote />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
