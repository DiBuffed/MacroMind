function similarityTone(similarity) {
  const s = Number(similarity) || 0
  if (s >= 70)
    return 'border-mm-primary/30 bg-mm-primary/8 text-mm-primary'
  if (s >= 40)
    return 'border-mm-yellow/40 bg-mm-yellow/15 text-mm-warning'
  return 'border-mm-pink/30 bg-mm-pink/8 text-mm-pink'
}

export default function HistoricalPattern({ pattern }) {
  if (!pattern?.event) return null
  return (
    <div className="mt-8 border-t border-mm-border pt-8">
      <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-mm-text">
        <span aria-hidden>🕰️</span> 역사적 패턴
      </h4>
      <div className="rounded-2xl border border-mm-border bg-mm-alt/60 p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-mm-text">{pattern.event}</span>
          <span
            className={`font-data rounded-full border px-3 py-0.5 text-xs font-bold ${similarityTone(pattern.similarity)}`}
          >
            유사도 {pattern.similarity}%
          </span>
        </div>
        <p className="text-sm leading-relaxed text-mm-muted">{pattern.what_happened}</p>
        <p className="mt-4 text-sm font-semibold text-mm-primary">
          그래서 지금은? {pattern.current_implication}
        </p>
      </div>
    </div>
  )
}
