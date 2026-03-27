import { useCallback, useEffect, useState } from 'react'
import { fetchMacroBriefing } from './api/briefingClient.js'
import { MOCK_BRIEFING_RESPONSE } from './api/briefingMock.js'
import {
  clearPortfolioState,
  loadPortfolioState,
  savePortfolioState,
} from './lib/portfolioStorage.js'
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

function tickersToString(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean).join(', ') : ''
}

export default function App() {
  const [screen, setScreen] = useState(() => {
    const s = loadPortfolioState()
    return s?.cachedBriefing ? 'dashboard' : 'landing'
  })
  const [briefingData, setBriefingData] = useState(() => {
    const s = loadPortfolioState()
    return s?.cachedBriefing ?? null
  })
  const [usedMock, setUsedMock] = useState(false)
  const [contextMeta, setContextMeta] = useState(() => {
    const s = loadPortfolioState()
    return s?.lastContextMeta ?? null
  })
  const [errorNote, setErrorNote] = useState(null)
  const [apiStatus, setApiStatus] = useState('checking')
  const [savedSession, setSavedSession] = useState(() => loadPortfolioState())
  const [inputInitialTickers, setInputInitialTickers] = useState('')

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
      setContextMeta(null)
      setErrorNote(`API 오류 — 데모 데이터를 표시합니다. (${out.error.message})`)
      return
    }
    setBriefingData(out.data)
    setUsedMock(out.usedMock)
    setContextMeta(out.contextMeta ?? null)

    savePortfolioState({
      tickers: opts.textTickers ?? '',
      skipPortfolio: Boolean(opts.skipPortfolio),
      cachedBriefing: out.data,
      lastContextMeta: out.contextMeta ?? null,
    })
    setSavedSession(loadPortfolioState())
  }, [])

  const handleRefreshFromStorage = useCallback(async () => {
    const s = loadPortfolioState()
    if (!s) return
    setScreen('loading')
    await runBriefing({
      imageBase64: null,
      imageMediaType: 'image/jpeg',
      textTickers: s.tickers,
      skipPortfolio: s.skipPortfolio,
      briefingIntent: 'daily',
    })
    setScreen('dashboard')
  }, [runBriefing])

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
      briefingIntent: 'first',
    })
    setScreen('dashboard')
  }

  const handleSkipPortfolio = async () => {
    setScreen('loading')
    await runBriefing({
      imageBase64: null,
      textTickers: '',
      skipPortfolio: true,
      briefingIntent: 'first',
    })
    setScreen('dashboard')
  }

  const handleContinueDashboard = () => {
    setScreen('dashboard')
  }

  const handleStartToInput = () => {
    const s = loadPortfolioState()
    setInputInitialTickers(s?.tickers ?? '')
    setScreen('input')
  }

  const handleEditHoldings = () => {
    const currentTickers = tickersToString(briefingData?.portfolio_tickers)
    const storedTickers = loadPortfolioState()?.tickers ?? ''
    setInputInitialTickers(currentTickers || storedTickers)
    setScreen('input')
  }

  /* ── 종목 추가/삭제 (대시보드 내 실시간 관리) ── */
  const handleAddTicker = useCallback(
    (newTicker) => {
      if (!briefingData) return
      const existing = Array.isArray(briefingData.portfolio_tickers)
        ? briefingData.portfolio_tickers
        : []
      if (existing.includes(newTicker)) return
      const updated = [...existing, newTicker]
      const newData = { ...briefingData, portfolio_tickers: updated }
      setBriefingData(newData)

      const s = loadPortfolioState()
      savePortfolioState({
        tickers: updated.join(', '),
        skipPortfolio: false,
        cachedBriefing: newData,
        lastContextMeta: s?.lastContextMeta ?? null,
      })
      setSavedSession(loadPortfolioState())
    },
    [briefingData],
  )

  const handleRemoveTicker = useCallback(
    (ticker) => {
      if (!briefingData) return
      const existing = Array.isArray(briefingData.portfolio_tickers)
        ? briefingData.portfolio_tickers
        : []
      const updated = existing.filter((t) => t !== ticker)
      const newDetails = { ...(briefingData.stock_details || {}) }
      delete newDetails[ticker]
      const newData = {
        ...briefingData,
        portfolio_tickers: updated,
        stock_details: newDetails,
      }
      setBriefingData(newData)

      const s = loadPortfolioState()
      savePortfolioState({
        tickers: updated.join(', '),
        skipPortfolio: updated.length === 0,
        cachedBriefing: newData,
        lastContextMeta: s?.lastContextMeta ?? null,
      })
      setSavedSession(loadPortfolioState())
    },
    [briefingData],
  )

  const handleReset = () => {
    clearPortfolioState()
    setBriefingData(null)
    setUsedMock(false)
    setContextMeta(null)
    setErrorNote(null)
    setSavedSession(null)
    setInputInitialTickers('')
    setScreen('landing')
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-mm-page">
      <AppHeader apiStatus={apiStatus} screen={screen} />
      <div className="flex flex-1 flex-col">
        {screen === 'landing' && (
          <LandingScreen
            onStart={handleStartToInput}
            savedSession={savedSession}
            onContinueDashboard={handleContinueDashboard}
            onRefreshToday={handleRefreshFromStorage}
          />
        )}
        {screen === 'input' && (
          <PortfolioInputScreen
            initialTickers={inputInitialTickers}
            onSubmit={handlePortfolioSubmit}
            onSkip={handleSkipPortfolio}
          />
        )}
        {screen === 'loading' && <LoadingScreen />}
        {screen === 'dashboard' && briefingData && (
          <DashboardScreen
            data={briefingData}
            contextMeta={contextMeta}
            lastBriefingAt={savedSession?.lastBriefingAt}
            onRefreshToday={handleRefreshFromStorage}
            onEditHoldings={handleEditHoldings}
            onAddTicker={handleAddTicker}
            onRemoveTicker={handleRemoveTicker}
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
