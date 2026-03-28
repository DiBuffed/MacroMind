import { useCallback, useEffect, useState } from 'react'
import { fetchMacroBriefing } from './api/briefingClient.js'
import { fetchMacroBriefingStream } from './api/briefingStreamClient.js'
import { MOCK_BRIEFING_RESPONSE } from './api/briefingMock.js'
import {
  clearPortfolioState,
  loadPortfolioState,
  savePortfolioState,
} from './lib/portfolioStorage.js'
import AppHeader from './components/AppHeader.jsx'
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
  const initialSaved = loadPortfolioState()
  const initialHistory = (() => {
    try {
      return JSON.parse(localStorage.getItem('mm_briefing_history') || '[]')
    } catch {
      return []
    }
  })()

  const [screen, setScreen] = useState(
    initialSaved?.cachedBriefing ? 'dashboard' : 'input',
  )
  const [agentProgress, setAgentProgress] = useState(null)

  const [briefingData, setBriefingData] = useState(
    initialSaved?.cachedBriefing ?? null,
  )
  const [usedMock, setUsedMock] = useState(false)
  const [contextMeta, setContextMeta] = useState(
    initialSaved?.lastContextMeta ?? null,
  )
  const [errorNote, setErrorNote] = useState(null)
  const [apiStatus, setApiStatus] = useState('checking')
  const [savedSession, setSavedSession] = useState(initialSaved)
  const [inputInitialTickers, setInputInitialTickers] = useState(
    initialSaved?.tickers || '',
  )
  const [history, setHistory] = useState(initialHistory)

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
    setAgentProgress({
      startedAt: Date.now(),
      completed: 0,
      currentStep: 'collect',
      tools: [],
      logs: [],
    })

    const STEP_INDEX = {
      collect: 0,
      recognize: 1,
      pattern: 2,
      briefing: 3,
    }

    const STEP_LABEL = {
      collect: '외부 데이터 수집',
      recognize: '입력 이해/정리',
      pattern: '역사·패턴 매칭',
      briefing: '브리핑 구성',
    }

    const tryStream = async () => {
      const out = await fetchMacroBriefingStream(opts, ({ event, data }) => {
        if (event === 'step') {
          if (data?.key === 'risk') {
            if (data?.status === 'start') {
              setAgentProgress((prev) => ({
                ...(prev ?? {}),
                currentStep: 'pattern',
              }))
            }
            return
          }
          if (data?.status === 'start') {
            setAgentProgress((prev) => ({
              ...(prev ?? {}),
              currentStep: data.key,
              logs: [
                ...(prev?.logs ?? []),
                {
                  ts: Date.now(),
                  level: 'info',
                  message: `단계 시작: ${STEP_LABEL[data.key] || data.key}`,
                },
              ].slice(-80),
            }))
          }
          if (data?.status === 'end') {
            const idx = STEP_INDEX[data.key]
            if (typeof idx === 'number') {
              setAgentProgress((prev) => ({
                ...(prev ?? {}),
                completed: Math.max(prev?.completed ?? 0, idx + 1),
                currentStep: data.key,
                logs: [
                  ...(prev?.logs ?? []),
                  {
                    ts: Date.now(),
                    level: 'ok',
                    message: `단계 완료: ${STEP_LABEL[data.key] || data.key} (${data.ms ?? ''}ms)`,
                  },
                ].slice(-80),
              }))
            }
          }
          if (data?.status === 'fail') {
            setAgentProgress((prev) => ({
              ...(prev ?? {}),
              currentStep: data.key,
              logs: [
                ...(prev?.logs ?? []),
                {
                  ts: Date.now(),
                  level: 'fail',
                  message: `단계 실패: ${STEP_LABEL[data.key] || data.key}`,
                },
              ].slice(-80),
            }))
          }
        }
        if (event === 'tool') {
          if (data?.name === 'gemini_generate' || data?.name === 'rate_limit_backoff') {
            return
          }
          setAgentProgress((prev) => ({
            ...(prev ?? {}),
            completed: prev?.completed ?? 0,
            tools: [...(prev?.tools ?? []), data].slice(-30),
            logs: [
              ...(prev?.logs ?? []),
              {
                ts: Date.now(),
                level: data?.status === 'fail' ? 'fail' : 'info',
                message: `도구: ${data?.name}${data?.status ? ` (${data.status})` : ''}`,
              },
            ].slice(-80),
          }))
        }
        if (event === 'log') {
          if (data?.step === 'risk') return
          setAgentProgress((prev) => ({
            ...(prev ?? {}),
            logs: [
              ...(prev?.logs ?? []),
              {
                ts: Date.now(),
                level: 'info',
                message: data?.message || String(data),
              },
            ].slice(-80),
          }))
        }
      })
      return { ok: true, data: out.data, usedMock: out.usedMock, contextMeta: out.contextMeta }
    }

    const minWait = new Promise((r) => setTimeout(r, 1200))

    const apiPromise = tryStream().catch(async () => {
      const r = await fetchMacroBriefing(opts)
      return { ok: true, ...r }
    })

    let out
    try {
      ;[out] = await Promise.all([apiPromise, minWait])
    } catch (e) {
      out = {
        ok: false,
        error: {
          message: e instanceof Error ? e.message : String(e),
        },
      }
    }
    if (!out.ok) {
      const fallbackData = { 
        ...MOCK_BRIEFING_RESPONSE,
        portfolio_tickers: opts.textTickers ? opts.textTickers.split(/[\s,]+/).filter(Boolean).slice(0, 10) : MOCK_BRIEFING_RESPONSE.portfolio_tickers
      }
      setBriefingData(fallbackData)
      setUsedMock(true)
      setContextMeta(null)
      setErrorNote(`분석 중 오류가 발생했습니다: ${out.error?.message || 'unknown'}. 임시 데이터를 표시합니다.`)
      setAgentProgress(null)
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

    const newEntry = {
      date: new Date().toISOString(),
      data: out.data,
      contextMeta: out.contextMeta ?? null,
    }
    const updatedHistory = [newEntry, ...history].slice(0, 10)
    try {
      localStorage.setItem('mm_briefing_history', JSON.stringify(updatedHistory))
    } catch {
      /* ignore */
    }
    setHistory(updatedHistory)
    setSavedSession(loadPortfolioState())
    setAgentProgress(null)
  }, [history])

  const handleRefreshFromStorage = useCallback(async () => {
    if (!savedSession) return
    setScreen('loading')
    await runBriefing({
      imageBase64: null,
      imageMediaType: 'image/jpeg',
      textTickers: savedSession.tickers,
      skipPortfolio: savedSession.tickers === '',
      briefingIntent: 'daily',
    })
    setScreen('dashboard')
  }, [runBriefing, savedSession])

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

  const handleEditHoldings = () => {
    const currentTickers = tickersToString(briefingData?.portfolio_tickers)
    setInputInitialTickers(currentTickers || savedSession?.tickers || inputInitialTickers || '')
    setScreen('input')
  }

  /* ── 종목 추가/삭제 (대시보드 내 실시간 관리) ── */
  const handleAddTicker = useCallback(
    async (newTicker) => {
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
    async (ticker) => {
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
    try {
      localStorage.removeItem('mm_briefing_history')
    } catch {
      /* ignore */
    }
    setBriefingData(null)
    setUsedMock(false)
    setContextMeta(null)
    setErrorNote(null)
    setSavedSession(null)
    setHistory([])
    setInputInitialTickers('')
    setScreen('input')
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-mm-page">
      <AppHeader apiStatus={apiStatus} screen={screen} />
      <div className="flex flex-1 flex-col">
        {screen === 'input' && (
          <PortfolioInputScreen
            initialTickers={inputInitialTickers}
            onSubmit={handlePortfolioSubmit}
            onSkip={handleSkipPortfolio}
            onCancel={handleContinueDashboard}
            hasSavedSession={Boolean(savedSession?.cachedBriefing)}
          />
        )}
        {screen === 'loading' && (
          <LoadingScreen
            completed={agentProgress?.completed}
            tools={agentProgress?.tools}
            logs={agentProgress?.logs}
            currentStep={agentProgress?.currentStep}
            startedAt={agentProgress?.startedAt}
          />
        )}
        {screen === 'dashboard' && briefingData && (
          <DashboardScreen
            data={briefingData}
            contextMeta={contextMeta}
            lastBriefingAt={savedSession?.lastBriefingAt}
            historyList={history}
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
