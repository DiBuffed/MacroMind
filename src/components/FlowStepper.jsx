const STEPS = [
  { key: 'landing', label: '시작' },
  { key: 'input', label: '포트폴리오 입력' },
  { key: 'loading', label: 'AI 분석' },
  { key: 'dashboard', label: '브리핑 결과' },
]

export default function FlowStepper({ screen }) {
  const idx = STEPS.findIndex((s) => s.key === screen)
  const current = idx >= 0 ? idx : 0
  const pct = ((current + 1) / STEPS.length) * 100

  return (
    <div className="border-b border-mm-border bg-mm-alt/90">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          {STEPS.map((step, i) => {
            const done = i < current
            const active = i === current
            return (
              <div
                key={step.key}
                className="flex min-w-0 flex-1 flex-col items-center text-center"
              >
                <span
                  className={`font-data mb-1.5 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition sm:h-9 sm:w-9 sm:text-xs ${
                    active
                      ? 'bg-mm-primary text-white shadow-md shadow-mm-primary/20'
                      : done
                        ? 'bg-mm-primary/12 text-mm-primary'
                        : 'bg-mm-border text-mm-muted'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span
                  className={`hidden text-[10px] font-medium leading-tight sm:block sm:text-[11px] ${
                    active ? 'text-mm-text' : 'text-mm-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-mm-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-mm-primary to-mm-cyan transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
