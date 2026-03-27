import RadioBriefing from './RadioBriefing.jsx'
import HistoricalPattern from './HistoricalPattern.jsx'

export default function BriefingPanel({
  briefing,
  historicalPattern,
  portfolioLens,
}) {
  return (
    <div className="mm-card p-6 sm:p-8">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-mm-primary">
        오늘의 거시 브리핑
      </p>
      {portfolioLens ? (
        <h3 className="mb-1 text-xl font-extrabold text-mm-text">
          내 포트폴리오 관점
        </h3>
      ) : (
        <h3 className="mb-1 text-xl font-extrabold text-mm-text">시장 전체 맥락</h3>
      )}
      <p className="mb-6 text-sm text-mm-muted">
        {portfolioLens
          ? '오늘 뉴스를 내 종목·리스크 노출도에 맞춰 요약합니다.'
          : '포트폴리오 없이 일반 거시 흐름을 정리합니다.'}
      </p>
      <RadioBriefing text={briefing} />
      <HistoricalPattern pattern={historicalPattern} />
    </div>
  )
}
