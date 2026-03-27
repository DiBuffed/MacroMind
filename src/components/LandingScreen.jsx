export default function LandingScreen({ onStart }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:py-24">
      <div className="max-w-2xl text-center">
        <span className="mm-pill mb-8 inline-block bg-mm-cyan/15 px-5 py-2 text-sm font-bold text-mm-primary">
          AI 거시경제 에이전트
        </span>
        <h1 className="mb-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-mm-text sm:text-5xl md:text-[3.25rem]">
          오늘 시장,
          <br />
          왜 이렇게 움직였을까요?
        </h1>
        <p className="mb-3 text-lg font-semibold leading-snug text-mm-text sm:text-xl">
          나한테 중요한 뉴스만, 내 종목 기준으로, 역사적 맥락과 함께.
        </p>
        <p className="mb-12 text-base text-mm-muted sm:text-lg">
          리스크 매트릭스로 거시 노출도를 숫자로, 분산 경고로 쏠림을 한눈에.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mm-pill bg-mm-primary px-10 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(67,97,238,0.28)] transition hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(67,97,238,0.35)] active:scale-[0.98]"
        >
          브리핑 시작하기 →
        </button>
        <p className="mt-5 text-sm text-mm-muted">
          포트폴리오 캡쳐 한 장 또는 종목 직접 입력
        </p>
      </div>
    </div>
  )
}
