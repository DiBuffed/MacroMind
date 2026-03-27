import MacroIndicatorBar from './MacroIndicatorBar.jsx'
import PortfolioRiskNetwork from './PortfolioRiskNetwork.jsx'
import AgentRealityNote from './AgentRealityNote.jsx'
import RiskMatrix from './RiskMatrix.jsx'
import BriefingPanel from './BriefingPanel.jsx'
import DiversificationWarning from './DiversificationWarning.jsx'
import StockTabs from './StockTabs.jsx'
import HistoryPlaceholder from './HistoryPlaceholder.jsx'

export default function DashboardScreen({ data, onReset, errorNote }) {
  const hasPortfolio =
    Array.isArray(data?.portfolio_tickers) && data.portfolio_tickers.length > 0

  return (
    <div className="flex-1 bg-mm-page">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-data mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-mm-primary">
              Step 4
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-mm-text">
              브리핑 대시보드
            </h2>
            <p className="mt-2 text-sm text-mm-muted">
              거시 지표 → 연결도 → 브리핑 → 리스크 → 분산 → 종목 딥다이브 순으로 읽으면
              됩니다.
            </p>
            {errorNote && (
              <p className="mt-3 rounded-xl border border-mm-warning/30 bg-mm-warning/10 px-4 py-2 text-sm text-mm-warning">
                {errorNote}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onReset}
            className="font-data rounded-full border border-mm-border bg-white px-5 py-2.5 text-xs font-semibold text-mm-muted shadow-sm transition hover:border-mm-primary/40 hover:text-mm-primary"
          >
            처음으로
          </button>
        </div>

        {/* ① 거시 지표 */}
        <section className="mb-10">
          <MacroIndicatorBar indicators={data?.indicators} />
        </section>

        {/* ② 연결도 + 에이전트 설명 */}
        <section className="mb-10">
          <PortfolioRiskNetwork
            riskMatrix={data?.risk_matrix}
            tickers={data?.portfolio_tickers}
          />
          <AgentRealityNote />
        </section>

        {/* ③ 브리핑 */}
        <section className="mb-10">
          <BriefingPanel
            briefing={data?.briefing}
            historicalPattern={data?.historical_pattern}
            portfolioLens={hasPortfolio}
          />
        </section>

        {/* ④ 리스크 매트릭스 (막대) */}
        <section className="mb-10">
          <RiskMatrix riskMatrix={data?.risk_matrix} />
        </section>

        {/* ⑤ 분산 경고 */}
        {data?.diversification_warning?.has_warning ? (
          <section className="mb-10">
            <DiversificationWarning warning={data.diversification_warning} />
          </section>
        ) : null}

        {/* ⑥ 종목 딥다이브 */}
        <StockTabs
          tickers={data?.portfolio_tickers}
          stockDetails={data?.stock_details}
        />

        {/* ⑦ 히스토리 (준비 중) */}
        <HistoryPlaceholder />
      </div>
    </div>
  )
}
