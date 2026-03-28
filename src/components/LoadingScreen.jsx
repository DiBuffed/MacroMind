import { useEffect, useState } from 'react'
import { AgentPipelineLive } from './AgentPipeline.jsx'

const STEP_COUNT = 4
const STEP_MS = 1600

function formatAgo(ms) {
  if (ms < 1000) return `${ms}ms`
  const sec = Math.floor(ms / 1000)
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  return `${min}m ${sec % 60}s`
}

const STEP_LABEL = {
  collect: '외부 데이터 수집',
  recognize: '입력 이해/정리',
  pattern: '역사·패턴 매칭',
  briefing: '브리핑 구성',
}

export default function LoadingScreen({
  completed: completedProp,
  tools = [],
  logs = [],
  currentStep,
  startedAt,
}) {
  const [completed, setCompleted] = useState(0)
  const isLive = typeof completedProp === 'number'
  const [now, setNow] = useState(0)

  useEffect(() => {
    if (isLive) return
    if (completed >= STEP_COUNT) return
    const t = setTimeout(() => setCompleted((c) => c + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [completed, isLive])

  useEffect(() => {
    if (!isLive) return
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [isLive])

  const displayCompleted = isLive ? completedProp : completed
  const elapsed = startedAt && now ? now - startedAt : 0
  const title = currentStep ? STEP_LABEL[currentStep] || currentStep : '에이전트 실행 중'

  return (
    <div className="flex flex-1 flex-col">
      <AgentPipelineLive completed={displayCompleted} />
      <div className="mx-auto w-full max-w-4xl px-4 pb-10 -mt-6">
        <div className="rounded-2xl border border-mm-border bg-white p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-mm-muted">에이전트 실행 중</p>
              <p className="mt-1 text-sm font-extrabold text-mm-text">{title}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-mm-primary animate-pulse"></span>
              <span className="font-data text-xs text-mm-muted">{formatAgo(elapsed)}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-mm-border bg-mm-alt/30 p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-mm-muted">최근 도구</p>
              <div className="mt-2 space-y-2">
                {(tools.length ? tools : []).slice(-6).reverse().map((t, idx) => (
                  <div key={`${t.name}-${idx}`} className="flex items-center justify-between text-xs">
                    <span className="font-bold text-mm-text">{t.name}</span>
                    <span className={`font-data ${t.status === 'fail' ? 'text-mm-pink' : 'text-mm-muted'}`}>
                      {t.status}{typeof t.ms === 'number' ? ` · ${t.ms}ms` : ''}
                    </span>
                  </div>
                ))}
                {!tools.length ? (
                  <p className="text-xs text-mm-muted">대기 중…</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-mm-border bg-mm-alt/30 p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-mm-muted">실시간 로그</p>
              <div className="mt-2 h-28 overflow-auto rounded-lg bg-white/70 p-2 font-data text-[11px] leading-relaxed text-mm-text">
                {logs.slice(-12).map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-mm-muted">{new Date(l.ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    <span className={l.level === 'fail' ? 'text-mm-pink font-bold' : l.level === 'ok' ? 'text-mm-primary font-bold' : ''}>
                      {l.message}
                    </span>
                  </div>
                ))}
                {!logs.length ? (
                  <div className="text-mm-muted">에이전트가 작업을 시작합니다…</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
