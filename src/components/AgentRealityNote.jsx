export default function AgentRealityNote() {
  return (
    <details className="mt-4 rounded-2xl border border-mm-border bg-mm-alt/80 px-5 py-4 text-sm text-mm-muted open:bg-white">
      <summary className="cursor-pointer font-semibold text-mm-text outline-none">
        MacroMind가 뭘 해 주나요?
      </summary>
      <div className="mt-3 space-y-2.5 leading-relaxed">
        <p>
          뉴스는 매일 오는데, 끊어 읽으면 내 종목과 연결이 안 보입니다.{' '}
          <strong className="text-mm-text">MacroMind</strong>는 오늘 이슈를{' '}
          <strong className="text-mm-text">내 포트 기준</strong>으로 묶습니다 — 뉴스·시세
          수집, 거시 리스크, 역사 패턴까지 한 흐름으로요.
        </p>
        <p>
          챗봇처럼 질문만 받는 게 아니라, <strong className="text-mm-primary">판단 재료</strong>
          를 만들어 두는 에이전트입니다. 종목을 한 번 넣으면 매번 그 렌즈로 갱신됩니다.
        </p>
        <p className="text-xs text-mm-muted">
          투자 권유가 아니라 정보 정리 목적입니다.
        </p>
      </div>
    </details>
  )
}
