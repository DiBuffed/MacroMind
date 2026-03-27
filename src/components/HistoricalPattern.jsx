function similarityTone(similarity) {
  const s = Number(similarity) || 0
  if (s >= 70) return 'border-mm-accent/50 bg-mm-accent/10 text-mm-accent'
  if (s >= 40)
    return 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300'
  return 'border-mm-warning/40 bg-mm-warning/10 text-mm-warning'
}

export default function HistoricalPattern({ pattern }) {
  if (!pattern?.event) return null
  return (
    <div className="mt-8 border-t border-mm-border pt-6">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <span aria-hidden>🕰️</span> 역사적 패턴
      </h4>
      <div className="rounded-lg border border-mm-border bg-mm-bg/60 p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-medium text-white">{pattern.event}</span>
          <span
            className={`font-data rounded border px-2 py-0.5 text-xs ${similarityTone(pattern.similarity)}`}
          >
            유사도 {pattern.similarity}%
          </span>
        </div>
        <p className="text-sm leading-relaxed text-mm-muted">
          {pattern.what_happened}
        </p>
        <p className="mt-3 text-sm font-medium text-mm-accent/90">
          그래서 지금은? {pattern.current_implication}
        </p>
      </div>
    </div>
  )
}
