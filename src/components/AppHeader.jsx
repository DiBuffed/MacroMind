export default function AppHeader({ apiStatus, screen }) {
  const label =
    apiStatus === 'checking'
      ? '…'
      : apiStatus === 'live'
        ? 'Live'
        : 'Demo'

  const title =
    apiStatus === 'live'
      ? '서버에 Gemini 키가 설정되어 있습니다.'
      : '데모 모드 — .env에 GEMINI_API_KEY를 설정하세요.'

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-mm-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <span className="text-lg font-extrabold tracking-tight text-mm-text">
            Macro<span className="text-mm-primary">Mind</span>
          </span>
          {screen === 'dashboard' ? (
            <span className="font-data hidden rounded-md bg-mm-primary/8 px-2 py-0.5 text-[10px] font-bold text-mm-primary sm:inline-block">
              포트폴리오
            </span>
          ) : (
            <span className="hidden max-w-[15rem] truncate text-xs leading-snug text-mm-muted sm:inline-block">
              뉴스 → 거시 → 내 종목
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="/landing.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-data hidden rounded-full px-3 py-1.5 text-[11px] font-medium text-mm-muted transition hover:bg-mm-alt hover:text-mm-text sm:inline-block"
          >
            소개
          </a>
          <span
            className={`font-data rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              apiStatus === 'live'
                ? 'bg-mm-primary/10 text-mm-primary'
                : 'bg-mm-alt text-mm-muted'
            }`}
            title={title}
          >
            {label}
          </span>
        </div>
      </div>
    </header>
  )
}
