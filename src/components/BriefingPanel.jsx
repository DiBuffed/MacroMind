import RadioBriefing from './RadioBriefing.jsx'
import HistoricalPattern from './HistoricalPattern.jsx'

export default function BriefingPanel({ briefing, historicalPattern }) {
  return (
    <div className="rounded-lg border border-mm-border bg-mm-surface/40 p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">
        📻 오늘의 브리핑
      </h3>
      <RadioBriefing text={briefing} />
      <HistoricalPattern pattern={historicalPattern} />
    </div>
  )
}
