import { GoogleGenerativeAI } from '@google/generative-ai'
import { MOCK_BRIEFING_RESPONSE } from '../src/api/briefingMock.js'
import { normalizeBriefingData } from '../src/api/briefingNormalize.js'
import { extractJsonFromText } from '../src/api/jsonExtract.js'
import { BRIEFING_SYSTEM_PROMPT, buildUserPrompt } from '../src/api/prompts.js'
import { fetchBriefingContext } from './context/fetchBriefingContext.mjs'

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

function mediaTypeFromMime(mime) {
  if (mime === 'image/png') return 'image/png'
  if (mime === 'image/webp') return 'image/webp'
  return 'image/jpeg'
}

/**
 * @param {{
 *   imageBase64?: string | null
 *   imageMediaType?: string
 *   textTickers?: string
 *   skipPortfolio?: boolean
 *   briefingIntent?: 'first' | 'daily'
 * }} opts
 */
export async function runGeminiBriefing(opts) {
  const key = (process.env.GEMINI_API_KEY || '').trim()
  if (!key) {
    return {
      data: normalizeBriefingData(MOCK_BRIEFING_RESPONSE),
      usedMock: true,
      contextMeta: { sources: [], newsCount: 0 },
    }
  }

  const imageProvided = Boolean(opts?.imageBase64)

  let externalContext = ''
  let contextMeta = { sources: [], newsCount: 0 }
  try {
    const ctx = await fetchBriefingContext()
    externalContext = ctx.text
    contextMeta = ctx.meta
  } catch (e) {
    console.warn('[briefing] 외부 컨텍스트 수집 실패:', e?.message || e)
  }

  const briefingIntent = opts?.briefingIntent === 'daily' ? 'daily' : 'first'

  const userText = buildUserPrompt({
    imageProvided,
    textTickers: opts?.textTickers,
    skipPortfolio: Boolean(opts?.skipPortfolio),
    externalContext,
    briefingIntent,
  })

  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: BRIEFING_SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.35,
      maxOutputTokens: 16384,
    },
  })

  const parts = []
  if (opts?.imageBase64) {
    const mime = mediaTypeFromMime(opts.imageMediaType || '')
    parts.push({
      inlineData: {
        mimeType: mime,
        data: opts.imageBase64,
      },
    })
  }
  parts.push({ text: userText })

  const MAX_RETRIES = 3
  let raw
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
      })
      raw = result.response.text()
      console.log(`[gemini] attempt ${attempt + 1} — response length: ${raw.length}`)
      break
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes('429')
      if (is429 && attempt < MAX_RETRIES - 1) {
        const wait = (attempt + 1) * 15
        console.warn(`[gemini] 429 rate limit — retry in ${wait}s (attempt ${attempt + 1})`)
        await new Promise((r) => setTimeout(r, wait * 1000))
      } else {
        throw err
      }
    }
  }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = extractJsonFromText(raw)
  }
  if (!parsed || typeof parsed !== 'object') {
    console.error('[gemini] parse failed. First 1000 chars:', raw?.slice(0, 1000))
    throw new Error('Gemini 응답에서 JSON을 파싱하지 못했습니다.')
  }

  return {
    data: normalizeBriefingData(parsed),
    usedMock: false,
    contextMeta,
  }
}
