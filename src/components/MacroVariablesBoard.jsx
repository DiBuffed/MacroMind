import MacroSnapshotHeatmap from './MacroSnapshotHeatmap.jsx'
import StockMacroLinkMatrix from './StockMacroLinkMatrix.jsx'
import HistoricalPattern from './HistoricalPattern.jsx'

export default function MacroVariablesBoard({
  data,
  hasPortfolio,
}) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-mm-primary/15 bg-gradient-to-br from-mm-primary/[0.04] to-mm-cyan/[0.03] px-5 py-5 sm:px-7 sm:py-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-mm-primary">
          변수 보드
        </p>
        <h3 className="text-lg font-extrabold text-mm-text sm:text-xl">
          변수는 동시에 움직입니다. 한 화면에서 잡아 보세요
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-mm-muted">
          <strong className="font-semibold text-mm-text">
            환율·금리·정책·지정학·유가
          </strong>
          로 리스크를 숫자로 보고, 역사 패턴·종목 설명과 같은 줄로 이어집니다. 매일
          &quot;오늘 다시 분석&quot;으로 갱신하세요.
        </p>
      </div>

      <section>
        <h4 className="mb-3 text-sm font-extrabold text-mm-text">
          거시 노출도 히트맵
        </h4>
        <MacroSnapshotHeatmap riskMatrix={data?.risk_matrix} />
      </section>

      {hasPortfolio ? (
        <section>
          <h4 className="mb-3 text-sm font-extrabold text-mm-text">
            종목 × 거시 축 연결
          </h4>
          <StockMacroLinkMatrix
            tickers={data?.portfolio_tickers}
            stockDetails={data?.stock_details}
          />
        </section>
      ) : null}

      <section>
        <h4 className="mb-3 text-sm font-extrabold text-mm-text">
          역사적 패턴 (브리핑 내)
        </h4>
        <div className="mm-card overflow-hidden p-5 sm:p-6">
          <HistoricalPattern pattern={data?.historical_pattern} />
          {!data?.historical_pattern?.event ? (
            <p className="text-sm text-mm-muted">
              브리핑을 생성하면 유사 국면·역사 비교가 여기에 채워집니다.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
