export default function AppHeader() {
  return (
    <header className="shrink-0 border-b border-mm-border/50 bg-mm-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-baseline gap-3">
          <span className="font-data text-sm font-medium tracking-[0.18em] text-mm-accent">
            MacroMind
          </span>
          <span className="hidden text-xs text-mm-muted sm:inline">
            거시경제 브리핑 에이전트
          </span>
        </div>
        <span className="font-data text-[10px] uppercase tracking-wider text-mm-muted/80">
          beta
        </span>
      </div>
    </header>
  )
}
