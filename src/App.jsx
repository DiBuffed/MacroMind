import { useCallback, useEffect, useState } from 'react'
import { fetchMacroBriefing } from './api/briefingClient.js'
import { MOCK_BRIEFING_RESPONSE } from './api/briefingMock.js'
import AppHeader from './components/AppHeader.jsx'
import FlowStepper from './components/FlowStepper.jsx'
import LandingScreen from './components/LandingScreen.jsx'
import PortfolioInputScreen from './components/PortfolioInputScreen.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import DashboardScreen from './components/DashboardScreen.jsx'

const MIN_LOADING_MS = 9000

/**
 * Flow: ① 랜딩 → ② 포트폴리오 입력 → ③ 에이전트 분석(로딩) → ④ 대시보드
 * (종목 탭·히스토리는 ④ 안에서)
 */
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
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((j) => {
        setApiStatus(j?.hasKey ? 'live' : 'demo')
      })
      .catch(() => setApiStatus('demo'))
  }, [])

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
      setBriefingData({ ...MOCK_BRIEFING_RESPONSE })
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
    <div className="flex min-h-[100dvh] flex-col bg-mm-page">
      <AppHeader apiStatus={apiStatus} screen={screen} />
      <FlowStepper screen={screen} />
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
              (usedMock && apiStatus === 'demo'
                ? '데모 모드 — 서버에 GEMINI_API_KEY를 넣으면 실제 브리핑이 생성됩니다. (개발: 프로젝트 루트 .env)'
                : null)
            }
          />
        )}
      </div>
    </div>
  )
}
