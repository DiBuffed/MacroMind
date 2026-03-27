import { useCallback, useState } from 'react'
import {
  fetchMacroBriefing,
  MOCK_BRIEFING_RESPONSE,
} from './api/claudeAgent.js'
import AppHeader from './components/AppHeader.jsx'
import LandingScreen from './components/LandingScreen.jsx'
import PortfolioInputScreen from './components/PortfolioInputScreen.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import DashboardScreen from './components/DashboardScreen.jsx'

const MIN_LOADING_MS = 9000

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('파일을 읽을 수 없습니다.'))
        return
      }
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('파일 읽기 실패'))
    reader.readAsDataURL(file)
  })
}

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [briefingData, setBriefingData] = useState(null)
  const [usedMock, setUsedMock] = useState(false)
  const [errorNote, setErrorNote] = useState(null)

  const runBriefing = useCallback(async (opts) => {
    setErrorNote(null)
    const minWait = new Promise((r) => setTimeout(r, MIN_LOADING_MS))
    const apiPromise = fetchMacroBriefing(opts)
      .then((r) => ({ ok: true, ...r }))
      .catch((e) => ({
        ok: false,
        error: e instanceof Error ? e : new Error(String(e)),
      }))
    const [out] = await Promise.all([apiPromise, minWait])
    if (!out.ok) {
      setBriefingData(MOCK_BRIEFING_RESPONSE)
      setUsedMock(true)
      setErrorNote(`API 오류 — 데모 데이터를 표시합니다. (${out.error.message})`)
      return
    }
    setBriefingData(out.data)
    setUsedMock(out.usedMock)
  }, [])

  const handlePortfolioSubmit = async ({ tickers, file }) => {
    setScreen('loading')
    let imageBase64 = null
    let imageMediaType = 'image/jpeg'
    if (file) {
      imageBase64 = await readFileAsBase64(file)
      imageMediaType = file.type || 'image/jpeg'
    }
    await runBriefing({
      imageBase64,
      imageMediaType,
      textTickers: tickers,
      skipPortfolio: false,
    })
    setScreen('dashboard')
  }

  const handleSkipPortfolio = async () => {
    setScreen('loading')
    await runBriefing({
      imageBase64: null,
      textTickers: '',
      skipPortfolio: true,
    })
    setScreen('dashboard')
  }

  const handleReset = () => {
    setBriefingData(null)
    setUsedMock(false)
    setErrorNote(null)
    setScreen('landing')
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-mm-bg">
      <AppHeader />
      <div className="flex flex-1 flex-col">
        {screen === 'landing' && (
          <LandingScreen onStart={() => setScreen('input')} />
        )}
        {screen === 'input' && (
          <PortfolioInputScreen
            onSubmit={handlePortfolioSubmit}
            onSkip={handleSkipPortfolio}
          />
        )}
        {screen === 'loading' && <LoadingScreen />}
        {screen === 'dashboard' && briefingData && (
          <DashboardScreen
            data={briefingData}
            onReset={handleReset}
            errorNote={
              errorNote ||
              (usedMock && !import.meta.env.VITE_ANTHROPIC_API_KEY
                ? '데모 모드 — .env에 VITE_ANTHROPIC_API_KEY를 설정하면 실제 브리핑을 호출합니다.'
                : null)
            }
          />
        )}
      </div>
    </div>
  )
}
