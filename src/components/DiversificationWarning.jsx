export default function DiversificationWarning({ warning }) {
  if (!warning?.has_warning) return null
  return (
    <div className="mt-6 rounded-lg border border-mm-warning/60 bg-mm-warning/10 p-4">
      <p className="font-data mb-1 text-xs uppercase tracking-wider text-mm-warning">
        분산 경고
      </p>
      <p className="text-sm leading-relaxed text-white/90">{warning.message}</p>
      {warning.concentration && (
        <p className="font-data mt-2 text-xs text-mm-warning/90">
          섹터 집중도 {warning.concentration}
        </p>
      )}
    </div>
  )
}
