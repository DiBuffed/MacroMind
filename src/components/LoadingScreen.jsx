import { useEffect, useState } from 'react'
import { LOADING_STEPS } from '../data/loadingSteps.js'

const STEP_MS = 1500

export default function LoadingScreen() {
  const [completed, setCompleted] = useState(0)

  useEffect(() => {
    if (completed >= LOADING_STEPS.length) return
    const t = setTimeout(() => setCompleted((c) => c + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [completed])

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <p className="font-data mb-8 text-xs tracking-[0.25em] text-mm-accent">
        AGENT RUNNING
      </p>
      <ul className="w-full max-w-lg space-y-4">
        {LOADING_STEPS.map((step, i) => {
          const done = completed > i
          const active = completed === i && completed < LOADING_STEPS.length
          return (
            <li
              key={step.text}
              className={`flex items-center gap-4 rounded-lg border px-4 py-3 transition ${
                done
                  ? 'border-mm-accent/40 bg-mm-accent-dim'
                  : active
                    ? 'border-mm-border bg-mm-surface'
                    : 'border-mm-border/50 bg-mm-bg/50 opacity-50'
              }`}
            >
              <span className="text-xl">{step.icon}</span>
              <span
                className={`flex-1 text-sm ${done ? 'text-mm-accent' : 'text-mm-muted'}`}
              >
                {step.text}
              </span>
              {done && (
                <span className="font-data text-mm-accent drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]">
                  ✓
                </span>
              )}
              {active && (
                <span className="font-data text-mm-accent mm-cursor text-sm"> </span>
              )}
            </li>
          )
        })}
      </ul>
      <p className="font-data mt-10 text-xs text-mm-muted">
        투자 판단은 본인 책임이며, 본 서비스는 정보 정리 목적입니다.
      </p>
    </div>
  )
}
