/**
 * 에이전트가 일하는 과정을 시각적으로 보여주는 파이프라인.
 * - 로딩 중: 단계가 하나씩 활성화되며 진행
 * - 대시보드: 완료된 파이프라인을 요약으로 표시
 */

const PIPELINE = [
  { key: 'collect', label: '뉴스·시세 수집', icon: '📡', desc: '환율·금리·유가·실시간 뉴스' },
  { key: 'recognize', label: '포트폴리오 인식', icon: '🔍', desc: '종목 추출·매핑' },
  { key: 'pattern', label: '역사 패턴 매칭', icon: '📚', desc: '유사 국면·결과 비교' },
  { key: 'briefing', label: '맞춤 브리핑 생성', icon: '✍️', desc: '내 포트 기준 리포트' },
]

function Arrow({ active }) {
  return (
    <svg
      width="32"
      height="20"
      viewBox="0 0 32 20"
      className="shrink-0 text-mm-border"
      aria-hidden
    >
      <line
        x1="0"
        y1="10"
        x2="24"
        y2="10"
        stroke={active ? '#4361ee' : 'currentColor'}
        strokeWidth="2"
        strokeDasharray="6 4"
        className={active ? 'mm-flow-animate' : ''}
      />
      <polygon
        points="22,5 32,10 22,15"
        fill={active ? '#4361ee' : 'currentColor'}
      />
    </svg>
  )
}

export function AgentPipelineLive({ completed = 0 }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
      <div className="mb-8 text-center">
        <p className="font-data mb-2 text-[11px] font-medium uppercase tracking-[0.25em] text-mm-primary">
          에이전트 실행 중
        </p>
        <h2 className="text-xl font-extrabold text-mm-text sm:text-2xl">
          MacroMind가 일하고 있습니다
        </h2>
      </div>

      <div className="w-full max-w-3xl">
        {/* 수평 파이프라인 (lg) */}
        <div className="hidden items-center justify-center gap-0 lg:flex">
          {PIPELINE.map((step, i) => {
            const done = completed > i
            const active = completed === i
            return (
              <div key={step.key} className="flex items-center">
                <div
                  className={`flex w-[120px] flex-col items-center rounded-2xl border px-3 py-4 text-center transition-all ${
                    done
                      ? 'border-mm-primary/30 bg-gradient-to-b from-mm-primary/8 to-mm-cyan/5'
                      : active
                        ? 'border-mm-primary/50 bg-white shadow-lg shadow-mm-primary/10'
                        : 'border-mm-border bg-mm-alt/50 opacity-50'
                  }`}
                >
                  <span className={`text-2xl ${active ? 'mm-pulse' : ''}`}>
                    {step.icon}
                  </span>
                  <span
                    className={`mt-2 text-[11px] font-bold leading-tight ${
                      done || active ? 'text-mm-text' : 'text-mm-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                  {done && (
                    <span className="font-data mt-1 text-xs font-bold text-mm-primary">
                      ✓
                    </span>
                  )}
                  {active && (
                    <span className="font-data mm-cursor mt-1 text-xs text-mm-primary">
                      {' '}
                    </span>
                  )}
                </div>
                {i < PIPELINE.length - 1 && (
                  <Arrow active={done || active} />
                )}
              </div>
            )
          })}
        </div>

        {/* 수직 파이프라인 (< lg) */}
        <div className="space-y-3 lg:hidden">
          {PIPELINE.map((step, i) => {
            const done = completed > i
            const active = completed === i
            return (
              <div
                key={step.key}
                className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all ${
                  done
                    ? 'border-mm-primary/25 bg-gradient-to-r from-mm-primary/6 to-mm-cyan/5'
                    : active
                      ? 'border-mm-primary/40 bg-white shadow-lg shadow-mm-primary/10'
                      : 'border-mm-border bg-mm-alt/50 opacity-50'
                }`}
              >
                <span className={`text-2xl ${active ? 'mm-pulse' : ''}`}>
                  {step.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-bold ${
                      done || active ? 'text-mm-text' : 'text-mm-muted'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-mm-muted">{step.desc}</p>
                </div>
                {done && (
                  <span className="font-data text-lg font-bold text-mm-primary">
                    ✓
                  </span>
                )}
                {active && (
                  <span className="font-data mm-cursor text-sm text-mm-primary">
                    {' '}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <p className="font-data mt-10 max-w-md text-center text-xs leading-relaxed text-mm-muted">
        투자 판단은 본인 책임이며, 본 서비스는 정보 정리 목적입니다.
      </p>
    </div>
  )
}

export function AgentPipelineCompact({ contextMeta, lastBriefingAt }) {
  const srcCount = contextMeta?.sources?.length ?? 0
  const newsCount = contextMeta?.newsCount ?? 0
  const time = lastBriefingAt
    ? new Date(lastBriefingAt).toLocaleString('ko-KR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  return (
    <div className="overflow-x-auto rounded-2xl border border-mm-primary/15 bg-gradient-to-r from-mm-primary/[0.04] via-mm-cyan/[0.03] to-mm-primary/[0.04]">
      <div className="flex items-center gap-0 px-4 py-3 sm:px-5">
        {PIPELINE.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center px-2">
              <span className="text-base sm:text-lg">{step.icon}</span>
              <span className="mt-0.5 hidden text-[9px] font-semibold text-mm-muted sm:block">
                {step.label}
              </span>
            </div>
            {i < PIPELINE.length - 1 && (
              <svg
                width="20"
                height="12"
                viewBox="0 0 20 12"
                className="shrink-0 text-mm-primary/40"
                aria-hidden
              >
                <line
                  x1="0"
                  y1="6"
                  x2="14"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <polygon points="13,2 20,6 13,10" fill="currentColor" />
              </svg>
            )}
          </div>
        ))}
        <div className="ml-auto flex shrink-0 flex-col items-end pl-4">
          {time ? (
            <span className="font-data text-[10px] font-semibold text-mm-text">
              {time}
            </span>
          ) : null}
          <span className="font-data text-[10px] text-mm-muted">
            {srcCount > 0 ? `${srcCount}개 소스` : '대기 중'}
            {newsCount > 0 ? ` · 뉴스 ${newsCount}건` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
