export default function DiversificationWarning({ warning }) {
  if (!warning?.has_warning) return null
  return (
    <section className="rounded-2xl border border-mm-warning/25 bg-gradient-to-br from-mm-warning/10 to-mm-yellow/5 p-6 sm:p-8">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-mm-warning">
        <span aria-hidden>⚠️</span> 분산도 경고
      </h3>
      <p className="text-sm leading-relaxed text-mm-text">{warning.message}</p>
      {warning.concentration && (
        <p className="font-data mt-4 inline-block rounded-full border border-mm-warning/30 bg-white/80 px-3 py-1.5 text-xs font-bold text-mm-warning">
          섹터 집중도 {warning.concentration}
        </p>
      )}
    </section>
  )
}
