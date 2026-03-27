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

app.listen(PORT, () => {
  console.log(`[MacroMind API] http://localhost:${PORT}`)
})
