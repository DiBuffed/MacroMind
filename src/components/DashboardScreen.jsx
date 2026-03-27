import MacroIndicatorBar from './MacroIndicatorBar.jsx'
import RiskMatrix from './RiskMatrix.jsx'
import BriefingPanel from './BriefingPanel.jsx'
import StockTabs from './StockTabs.jsx'

export default function DashboardScreen({ data, onReset, errorNote }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
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

      <MacroIndicatorBar indicators={data?.indicators} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <RiskMatrix
          riskMatrix={data?.risk_matrix}
          diversificationWarning={data?.diversification_warning}
        />
        <BriefingPanel
          briefing={data?.briefing}
          historicalPattern={data?.historical_pattern}
        />
      </div>

      <StockTabs
        tickers={data?.portfolio_tickers}
        stockDetails={data?.stock_details}
      />
    </div>
  )
}
