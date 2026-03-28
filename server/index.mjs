import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { runGeminiBriefing } from './geminiBriefing.mjs'

const PORT = Number(process.env.PORT || 8787)
const app = express()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '15mb' }))

app.get('/api/health', (_req, res) => {
  const hasKey = Boolean((process.env.GEMINI_API_KEY || '').trim())
  res.json({
    ok: true,
    provider: 'gemini',
    hasKey,
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    integrations: {
      frankfurter: true,
      google_news_rss: true,
      newsapi: Boolean((process.env.NEWS_API_KEY || '').trim()),
      finnhub: Boolean((process.env.FINNHUB_API_KEY || '').trim()),
      fred: Boolean((process.env.FRED_API_KEY || '').trim()),
      alphaVantage: Boolean((process.env.ALPHA_VANTAGE_KEY || '').trim()),
    },
  })
})

app.post('/api/briefing', async (req, res) => {
  try {
    const out = await runGeminiBriefing(req.body || {})
    res.json(out)
  } catch (err) {
    console.error('[briefing]', err)
    res.status(500).json({
      error: err instanceof Error ? err.message : '브리핑 생성 실패',
    })
  }
})

app.post('/api/briefing/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  const send = (event, data) => {
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  const heartbeat = setInterval(() => {
    res.write(`: ping\n\n`)
  }, 15000)

  try {
    await runGeminiBriefing(req.body || {}, ({ event, data }) => {
      send(event || 'message', data)
    })
  } catch (err) {
    console.error('[briefing/stream]', err)
    const msg = err instanceof Error ? err.message : '브리핑 생성 실패'
    send('error', { message: msg })
    send('final', { ok: false, error: { message: msg } })
  } finally {
    clearInterval(heartbeat)
    res.end()
  }
})

app.listen(PORT, () => {
  console.log(`[MacroMind API] http://localhost:${PORT}`)
})
