import { GoogleGenerativeAI } from '@google/generative-ai'
import { MOCK_BRIEFING_RESPONSE } from '../src/api/briefingMock.js'
import { normalizeBriefingData } from '../src/api/briefingNormalize.js'
import { extractJsonFromText } from '../src/api/jsonExtract.js'
import { BRIEFING_SYSTEM_PROMPT, buildUserPrompt } from '../src/api/prompts.js'

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
 * }} opts
 */
export async function runGeminiBriefing(opts) {
  const key = (process.env.GEMINI_API_KEY || '').trim()
  if (!key) {
    return {
      data: normalizeBriefingData(MOCK_BRIEFING_RESPONSE),
      usedMock: true,
    }
  }

  const imageProvided = Boolean(opts?.imageBase64)
  const userText = buildUserPrompt({
    imageProvided,
    textTickers: opts?.textTickers,
    skipPortfolio: Boolean(opts?.skipPortfolio),
  })

  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: BRIEFING_SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.35,
      maxOutputTokens: 8192,
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

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
  })

  const raw = result.response.text()
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = extractJsonFromText(raw)
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Gemini 응답에서 JSON을 파싱하지 못했습니다.')
  }

  return {
    data: normalizeBriefingData(parsed),
    usedMock: false,
  }
}
