export default function DiversificationWarning({ warning }) {
  if (!warning?.has_warning) return null
  return (
    <section className="rounded-lg border border-mm-warning/50 bg-gradient-to-b from-mm-warning/12 to-mm-bg/40 p-5">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-mm-warning">
        <span aria-hidden>⚠️</span> 분산도 경고
      </h3>
      <p className="text-sm leading-relaxed text-white/90">{warning.message}</p>
      {warning.concentration && (
        <p className="font-data mt-3 inline-block rounded border border-mm-warning/40 bg-mm-warning/10 px-2 py-1 text-xs text-mm-warning">
          섹터 집중도 {warning.concentration}
        </p>
      )}
    </section>
  )
}
