export default function LandingScreen({ onStart }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center">
        <p className="font-data mb-4 text-xs tracking-[0.2em] text-mm-accent/80">
          MACRO BRIEFING AGENT
        </p>
        <h1 className="mb-5 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          오늘 시장, 왜 이렇게 움직였는지 아세요?
        </h1>
        <p className="mb-10 text-lg text-mm-muted">
          내 포트폴리오 기준 거시경제 브리핑 — 매일 아침
        </p>
        <button
          type="button"
          onClick={onStart}
          className="font-data rounded border border-mm-accent/40 bg-mm-accent-dim px-8 py-3.5 text-sm font-medium text-mm-accent shadow-[0_0_24px_rgba(0,255,136,0.15)] transition hover:border-mm-accent hover:bg-mm-accent/10"
        >
          브리핑 시작하기
        </button>
      </div>
    </div>
  )
}
