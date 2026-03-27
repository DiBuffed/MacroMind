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
    <div className="bg-mm-alt/40 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
      <p className="font-data mb-2 text-[11px] font-medium uppercase tracking-[0.25em] text-mm-primary">
        Step 3 · 에이전트 분석
      </p>
      <h2 className="mb-10 text-center text-xl font-extrabold text-mm-text sm:text-2xl">
        브리핑을 준비하고 있어요
      </h2>
      <ul className="w-full max-w-lg space-y-3">
        {LOADING_STEPS.map((step, i) => {
          const done = completed > i
          const active = completed === i && completed < LOADING_STEPS.length
          return (
            <li
              key={step.text}
              className={`mm-card flex items-center gap-4 px-5 py-4 transition ${
                done
                  ? 'border-mm-primary/25 bg-gradient-to-r from-mm-primary/6 to-mm-cyan/5'
                  : active
                    ? 'border-mm-primary/30 shadow-mm-card-hover'
                    : 'opacity-55'
              }`}
            >
              <span className="text-2xl">{step.icon}</span>
              <span
                className={`flex-1 text-sm font-medium ${
                  done ? 'text-mm-text' : 'text-mm-muted'
                }`}
              >
                {step.text}
              </span>
              {done && (
                <span className="font-data text-lg font-bold text-mm-primary">
                  ✓
                </span>
              )}
              {active && (
                <span className="font-data text-mm-primary mm-cursor text-sm">
                  {' '}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <p className="font-data mt-12 max-w-md text-center text-xs leading-relaxed text-mm-muted">
        투자 판단은 본인 책임이며, 본 서비스는 정보 정리 목적입니다.
      </p>
    </div>
  )
}
