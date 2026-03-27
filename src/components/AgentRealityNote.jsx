export default function AgentRealityNote() {
  return (
    <details className="mt-4 rounded border border-mm-border/60 bg-mm-surface/30 px-4 py-3 text-sm text-mm-muted open:bg-mm-surface/50">
      <summary className="cursor-pointer font-medium text-white/90 outline-none">
        이게 &quot;에이전트&quot; 맞아요?
      </summary>
      <div className="mt-3 space-y-2 leading-relaxed">
        <p>
          <strong className="text-mm-accent">MacroMind</strong>는 질문에 맞춰{' '}
          <strong className="text-white/90">한 번에 구조화된 JSON·브리핑</strong>을
          만드는 <strong className="text-white/90">에이전트 페르소나</strong>
          입니다. 화면·톤·연결도는 그 역할을 보여 주기 위한 것이에요.
        </p>
        <p>
          다만 <strong className="text-white/90">엔지니어링 의미의 “에이전트”</strong>
          (도구를 여러 번 호출하고, 스스로 계획을 바꾸고, 메모리에 쌓는 루프)는{' '}
          <strong className="text-mm-warning">아직 아닙니다</strong>. 지금은 서버에서
          Gemini로 <strong className="text-white/90">단일 브리핑 생성</strong>을
          돌리는 구조예요.
        </p>
        <p className="text-xs text-mm-muted/90">
          다음 단계로 뉴스/시세 API를 도구로 붙이고, 단계별로 호출·검증하는 루프를
          넣으면 진짜 에이전트에 훨씬 가까워집니다.
        </p>
      </div>
    </details>
  )
}
