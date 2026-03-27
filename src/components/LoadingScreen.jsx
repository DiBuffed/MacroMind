import { useEffect, useState } from 'react'
import { AgentPipelineLive } from './AgentPipeline.jsx'

const STEP_COUNT = 5
const STEP_MS = 1600

export default function LoadingScreen() {
  const [completed, setCompleted] = useState(0)

  useEffect(() => {
    if (completed >= STEP_COUNT) return
    const t = setTimeout(() => setCompleted((c) => c + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [completed])

  return <AgentPipelineLive completed={completed} />
}
