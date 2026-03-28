export default function AgentTracePanel({ contextMeta }) {
  const trace = contextMeta?.trace
  const tools = Array.isArray(contextMeta?.tools) ? contextMeta.tools : trace?.tools
  const steps = Array.isArray(trace?.steps) ? trace.steps : []

  if (!trace && (!tools || tools.length === 0)) return null

  return (
    <div className="mm-card border border-mm-border bg-white p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-mm-text">에이전트 실행 로그</h4>
        <span className="font-data text-[10px] text-mm-muted">
          {trace?.totalMs ? `${trace.totalMs}ms` : ''}
        </span>
      </div>

      {steps.length ? (
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={`${s.key}-${i}`} className="flex items-center justify-between text-xs">
              <span className="font-bold text-mm-text">{s.key}</span>
              <span className="font-data text-mm-muted">
                {s.status}{typeof s.ms === 'number' ? ` · ${s.ms}ms` : ''}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {Array.isArray(tools) && tools.length ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs font-bold text-mm-primary">
            사용한 도구/소스 보기 ({tools.length})
          </summary>
          <div className="mt-3 space-y-2">
            {tools.map((t, i) => (
              <div key={`${t.name}-${i}`} className="flex items-center justify-between text-xs">
                <span className="font-bold text-mm-text">{t.name}</span>
                <span className="font-data text-mm-muted">
                  {t.status}{typeof t.ms === 'number' ? ` · ${t.ms}ms` : ''}
                </span>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  )
}

