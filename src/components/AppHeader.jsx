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

  const onLanding = screen === 'landing'

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-mm-border/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <span className="text-lg font-extrabold tracking-tight text-mm-text">
            Macro<span className="text-mm-primary">Mind</span>
          </span>
          <span className="hidden text-xs text-mm-muted sm:inline">
            AI 거시경제 브리핑
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="/landing.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-data hidden rounded-full px-3 py-1.5 text-[11px] font-medium text-mm-muted transition hover:bg-mm-alt hover:text-mm-text sm:inline-block"
          >
            소개 페이지
          </a>
          <span
            className="font-data rounded-full bg-mm-alt px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-mm-muted"
            title={title}
          >
            {apiStatus === 'live' ? (
              <span className="text-mm-primary">{label}</span>
            ) : (
              <span>{label}</span>
            )}
          </span>
        </div>
      </div>
      {!onLanding ? null : (
        <p className="mx-auto hidden max-w-6xl px-4 pb-3 text-center text-xs text-mm-muted sm:block sm:px-6">
          나한테 중요한 뉴스만 · 내 종목 기준 · 역사적 맥락과 함께
        </p>
      )}
    </header>
  )
}
