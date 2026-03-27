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
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">브리핑 대시보드</h2>
          {errorNote && (
            <p className="mt-2 text-sm text-mm-warning">{errorNote}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="font-data rounded border border-mm-border px-4 py-2 text-xs text-mm-muted hover:border-mm-accent/40 hover:text-mm-accent"
        >
          처음으로
        </button>
      </div>

      <section className="mb-10">
        <MacroIndicatorBar indicators={data?.indicators} />
      </section>

      <section className="mb-10">
        <PortfolioRiskNetwork
          riskMatrix={data?.risk_matrix}
          tickers={data?.portfolio_tickers}
        />
        <AgentRealityNote />
      </section>

      <section className="mb-10">
        <BriefingPanel
          briefing={data?.briefing}
          historicalPattern={data?.historical_pattern}
          portfolioLens={hasPortfolio}
        />
      </section>

      <section className="mb-10">
        <RiskMatrix riskMatrix={data?.risk_matrix} />
      </section>

      {data?.diversification_warning?.has_warning ? (
        <section className="mb-10">
          <DiversificationWarning warning={data.diversification_warning} />
        </section>
      ) : null}

      <StockTabs
        tickers={data?.portfolio_tickers}
        stockDetails={data?.stock_details}
      />

      <HistoryPlaceholder />
    </div>
  )
}
