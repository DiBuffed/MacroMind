export default function AppHeader({ apiStatus }) {
  const label =
    apiStatus === 'checking'
      ? '…'
      : apiStatus === 'live'
        ? '● Live'
        : '○ Demo'

  const title =
    apiStatus === 'live'
      ? '서버에 Gemini 키가 설정되어 있습니다.'
      : '서버에 GEMINI_API_KEY 없음 — 데모 데이터만 사용됩니다.'

  return (
    <header className="shrink-0 border-b border-mm-border/50 bg-mm-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="font-data text-sm font-medium tracking-[0.18em] text-mm-accent">
            MacroMind
          </span>
          <span className="hidden truncate text-xs text-mm-muted sm:inline">
            거시경제 브리핑 에이전트
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span
            className="font-data text-[10px] uppercase tracking-wider text-mm-muted/80"
            title={title}
          >
            {apiStatus === 'live' ? (
              <span className="text-mm-accent">{label}</span>
            ) : (
              <span>{label}</span>
            )}
          </span>
          <span className="font-data text-[10px] uppercase tracking-wider text-mm-muted/80">
            beta
          </span>
        </div>
      </div>
    </header>
  )
}
