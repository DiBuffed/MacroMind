function formatSavedAt(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return ''
  }
}

export default function LandingScreen({
  onStart,
  savedSession,
  onContinueDashboard,
  onRefreshToday,
}) {
  const hasSaved = Boolean(
    savedSession?.cachedBriefing && savedSession?.lastBriefingAt,
  )
  const tickersShort = savedSession?.skipPortfolio
    ? '거시만 보기'
    : (savedSession?.tickers || '').trim() || '종목 미입력'

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:py-20">
      <div className="max-w-2xl text-center">
        <span className="mm-pill mb-6 inline-block bg-mm-cyan/15 px-5 py-2 text-sm font-bold text-mm-primary">
          뉴스 → 거시 → 내 종목, 한 줄로
        </span>

        {hasSaved ? (
          /* ── 재방문: 바로 포트폴리오 홈으로 ── */
          <>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-mm-text sm:text-4xl">
              오늘 시장,
              <br />
              내 종목에선 어떻게 보이나요?
            </h1>
            <p className="mb-3 max-w-lg text-sm leading-relaxed text-mm-muted sm:text-base">
              오늘 뉴스·시세를 <strong className="font-semibold text-mm-text">내 포트 기준</strong>
              으로 갱신해 보세요. 거시·역사 맥락까지 한 번에 이어집니다.
            </p>
            <p className="mb-2 text-base text-mm-muted sm:text-lg">
              저장된 포트폴리오: <strong className="text-mm-text">{tickersShort}</strong>
            </p>
            <p className="mb-8 text-xs text-mm-muted">
              마지막 분석: {formatSavedAt(savedSession.lastBriefingAt)}
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={onRefreshToday}
                className="mm-pill bg-mm-primary px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(67,97,238,0.28)] transition hover:scale-[1.02] active:scale-[0.98]"
              >
                오늘 뉴스·시세로 갱신
              </button>
              <button
                type="button"
                onClick={onContinueDashboard}
                className="font-data rounded-full border border-mm-border bg-white px-8 py-4 text-sm font-semibold text-mm-text transition hover:border-mm-primary/40 hover:text-mm-primary"
              >
                이전 대시보드 보기
              </button>
            </div>
            <button
              type="button"
              onClick={onStart}
              className="mt-6 text-sm font-medium text-mm-muted underline-offset-4 transition hover:text-mm-primary hover:underline"
            >
              종목을 바꿔서 새로 시작 →
            </button>
          </>
        ) : (
          /* ── 첫 방문 ── */
          <>
            <h1 className="mb-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-mm-text sm:text-5xl md:text-[3.25rem]">
              뉴스는 봤는데,
              <br />
              왜 내 종목인지 모를 때
            </h1>
            <p className="mb-4 max-w-xl text-left text-base leading-relaxed text-mm-text/90 sm:mx-auto sm:text-center sm:text-lg">
              환율·금리·정책·역사가 동시에 얽힙니다. 공부할 시간은 없고, 그냥 두기엔 불안할
              때 —{' '}
              <strong className="font-semibold text-mm-text">
                오늘 이슈를 내 포트 기준으로 풀어
              </strong>{' '}
              드립니다.
            </p>
            <p className="mb-10 max-w-xl text-left text-base font-semibold leading-relaxed text-mm-primary sm:mx-auto sm:text-center sm:text-lg">
              종목만 알려 주세요. 뉴스부터 거시·역사까지 연결은 MacroMind가 합니다.
            </p>
            <button
              type="button"
              onClick={onStart}
              className="mm-pill bg-mm-primary px-10 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(67,97,238,0.28)] transition hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(67,97,238,0.35)] active:scale-[0.98]"
            >
              오늘 뉴스부터 연결하기 →
            </button>
            <p className="mt-5 text-sm text-mm-muted">
              종목 입력 또는 증권앱 캡처 한 장 — 30초면 시작
            </p>
          </>
        )}
      </div>
    </div>
  )
}
