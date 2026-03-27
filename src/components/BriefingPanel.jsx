import RadioBriefing from './RadioBriefing.jsx'
import HistoricalPattern from './HistoricalPattern.jsx'

export default function BriefingPanel({
  briefing,
  historicalPattern,
  portfolioLens,
}) {
  return (
    <div className="rounded-lg border border-mm-border bg-mm-surface/40 p-5">
      <p className="font-data mb-1 text-xs uppercase tracking-wider text-mm-accent">
        오늘의 거시 브리핑
      </p>
      {portfolioLens ? (
        <h3 className="mb-1 text-lg font-semibold text-white">
          내 포트폴리오 관점
        </h3>
      ) : (
        <h3 className="mb-1 text-lg font-semibold text-white">시장 전체 맥락</h3>
      )}
      <p className="mb-4 text-xs text-mm-muted">
        {portfolioLens
          ? '오늘 뉴스를 내 종목·리스크 노출도에 맞춰 요약합니다.'
          : '포트폴리오 없이 일반 거시 흐름을 정리합니다.'}
      </p>
      <RadioBriefing text={briefing} />
      <HistoricalPattern pattern={historicalPattern} />
    </div>
  )
}
