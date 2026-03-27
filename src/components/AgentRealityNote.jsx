export default function AgentRealityNote() {
  return (
    <details className="mt-4 rounded-2xl border border-mm-border bg-mm-alt/80 px-5 py-4 text-sm text-mm-muted open:bg-white">
      <summary className="cursor-pointer font-semibold text-mm-text outline-none">
        이게 &quot;에이전트&quot; 맞아요?
      </summary>
      <div className="mt-3 space-y-2 leading-relaxed">
        <p>
          <strong className="text-mm-primary">MacroMind</strong>는 질문에 맞춰{' '}
          <strong className="text-mm-text">한 번에 구조화된 JSON·브리핑</strong>을
          만드는 <strong className="text-mm-text">에이전트 페르소나</strong>입니다.
        </p>
        <p>
          다만 <strong className="text-mm-text">엔지니어링 의미의 “에이전트”</strong>
          (도구를 여러 번 호출하고, 계획을 바꾸고, 메모리에 쌓는 루프)는{' '}
          <strong className="text-mm-warning">아직 아닙니다</strong>. 지금은 서버에서
          Gemini로 <strong className="text-mm-text">단일 브리핑 생성</strong>을 돌립니다.
        </p>
        <p className="text-xs text-mm-muted">
          뉴스·시세 API를 도구로 붙이면 진짜 에이전트 루프에 가까워집니다.
        </p>
      </div>
    </details>
  )
}
