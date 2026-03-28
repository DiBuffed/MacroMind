import { GoogleGenerativeAI } from '@google/generative-ai'
import { MOCK_BRIEFING_RESPONSE } from '../src/api/briefingMock.js'
import { normalizeBriefingData } from '../src/api/briefingNormalize.js'
import { extractJsonFromText } from '../src/api/jsonExtract.js'
import { BRIEFING_SYSTEM_PROMPT, buildUserPrompt } from '../src/api/prompts.js'
import { fetchBriefingContext } from './context/fetchBriefingContext.mjs'

const DEFAULT_MODEL = 'gemini-2.0-flash'
const MODEL = process.env.GEMINI_MODEL || DEFAULT_MODEL

function nowMs() {
  return Date.now()
}

function isoNow() {
  return new Date().toISOString()
}

function emitSafe(emit, event, data) {
  try {
    emit?.({ event, data })
  } catch {
    /* ignore */
  }
}

function startTicker(emit, { event = 'log', intervalMs = 1200, buildData }) {
  const startedAt = nowMs()
  const id = setInterval(() => {
    emitSafe(emit, event, {
      ...(typeof buildData === 'function' ? buildData() : {}),
      t: nowMs() - startedAt,
    })
  }, intervalMs)
  return () => clearInterval(id)
}

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
export async function runGeminiBriefing(opts, emit) {
  const trace = {
    traceId: `trace_${Math.random().toString(16).slice(2)}`,
    startedAt: isoNow(),
    model: MODEL,
    steps: [],
    tools: [],
  }

  const key = (process.env.GEMINI_API_KEY || '').trim()
  if (!key) {
    const data = normalizeBriefingData(MOCK_BRIEFING_RESPONSE)
    emitSafe(emit, 'final', {
      ok: true,
      usedMock: true,
      data,
      contextMeta: { sources: [], newsCount: 0, trace },
    })
    return {
      data,
      usedMock: true,
      contextMeta: { sources: [], newsCount: 0, trace },
    }
  }

  const imageProvided = Boolean(opts?.imageBase64)

  let externalContext = ''
  let contextMeta = { sources: [], newsCount: 0, tools: [] }

  {
    const startedAt = nowMs()
    emitSafe(emit, 'step', { key: 'collect', status: 'start' })
    try {
      const ctx = await fetchBriefingContext((ev) => {
        if (ev?.event === 'tool') {
          trace.tools.push(ev.data)
          emitSafe(emit, 'tool', ev.data)
        }
      })
      externalContext = ctx.text
      contextMeta = ctx.meta
      const ms = nowMs() - startedAt
      trace.steps.push({ key: 'collect', status: 'ok', ms })
      emitSafe(emit, 'step', { key: 'collect', status: 'end', ms })
    } catch (e) {
      const ms = nowMs() - startedAt
      trace.steps.push({ key: 'collect', status: 'fail', ms, error: e?.message || String(e) })
      emitSafe(emit, 'step', { key: 'collect', status: 'fail', ms })
      console.warn('[briefing] 외부 컨텍스트 수집 실패:', e?.message || e)
    }
  }

  const briefingIntent = opts?.briefingIntent === 'daily' ? 'daily' : 'first'

  let userText = ''
  {
    const startedAt = nowMs()
    emitSafe(emit, 'step', { key: 'recognize', status: 'start' })
    userText = buildUserPrompt({
      imageProvided,
      textTickers: opts?.textTickers,
      skipPortfolio: Boolean(opts?.skipPortfolio),
      externalContext,
      briefingIntent,
    })
    const ms = nowMs() - startedAt
    trace.steps.push({ key: 'recognize', status: 'ok', ms })
    emitSafe(emit, 'step', { key: 'recognize', status: 'end', ms })
  }

  try {
    const genAI = new GoogleGenerativeAI(key)
    const modelCandidates = Array.from(
      new Set([
        MODEL,
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash',
      ]),
    ).filter(Boolean)

    const getModel = (modelName) =>
      genAI.getGenerativeModel({
        model: modelName,
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

    const MAX_RETRIES = 1
    let raw
    {
      const startedAt = nowMs()
      emitSafe(emit, 'step', { key: 'risk', status: 'start' })
      outer: for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        for (const modelName of modelCandidates) {
          let stop = null
          try {
            emitSafe(emit, 'tool', {
              name: 'gemini_generate',
              status: 'start',
              attempt: attempt + 1,
              model: modelName,
            })
            stop = startTicker(emit, {
              event: 'log',
              intervalMs: 1200,
              buildData: () => ({
                message: `AI 분석 중 (LLM 생성: ${modelName})`,
                step: 'risk',
                attempt: attempt + 1,
                model: modelName,
              }),
            })

            const result = await getModel(modelName).generateContent({
              contents: [{ role: 'user', parts }],
            })
            stop?.()
            raw = result.response.text()
            trace.model = modelName
            emitSafe(emit, 'tool', {
              name: 'gemini_generate',
              status: 'ok',
              attempt: attempt + 1,
              model: modelName,
              chars: raw.length,
            })
            break outer
          } catch (err) {
            stop?.()
            const msg = err?.message || String(err)
            const is429 = err?.status === 429 || msg.includes('429')
            const is404 =
              err?.status === 404 || msg.includes('404') || msg.includes('not found')

            emitSafe(emit, 'tool', {
              name: 'gemini_generate',
              status: 'fail',
              attempt: attempt + 1,
              model: modelName,
              message: msg,
            })

            if (is404) {
              emitSafe(emit, 'log', {
                message: `모델 미지원으로 변경 시도: ${modelName}`,
                step: 'risk',
                model: modelName,
              })
              continue
            }

            if (is429) {
              throw new Error('rate_limited')
            }
          }
        }
      }

      const ms = nowMs() - startedAt
      if (!raw) {
        trace.steps.push({ key: 'risk', status: 'fail', ms, error: 'no_model_succeeded' })
        emitSafe(emit, 'step', { key: 'risk', status: 'fail', ms })
        throw new Error('모든 모델 시도에 실패했습니다.')
      }
      trace.steps.push({ key: 'risk', status: 'ok', ms })
      emitSafe(emit, 'step', { key: 'risk', status: 'end', ms })
    }

    let parsed
    {
      const startedAt = nowMs()
      emitSafe(emit, 'step', { key: 'pattern', status: 'start' })
      try {
        parsed = JSON.parse(raw)
        emitSafe(emit, 'tool', { name: 'json_parse', status: 'ok' })
      } catch {
        parsed = extractJsonFromText(raw)
        emitSafe(emit, 'tool', { name: 'json_extract', status: parsed ? 'ok' : 'fail' })
      }
      const ms = nowMs() - startedAt
      trace.steps.push({ key: 'pattern', status: parsed ? 'ok' : 'fail', ms })
      emitSafe(emit, 'step', { key: 'pattern', status: parsed ? 'end' : 'fail', ms })
    }
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Gemini 응답에서 JSON을 파싱하지 못했습니다.')
    }

    const startedAt = nowMs()
    emitSafe(emit, 'step', { key: 'briefing', status: 'start' })
    const normalized = normalizeBriefingData(parsed)
    const ms = nowMs() - startedAt
    trace.steps.push({ key: 'briefing', status: 'ok', ms })
    emitSafe(emit, 'step', { key: 'briefing', status: 'end', ms })
    trace.endedAt = isoNow()
    trace.totalMs = trace.steps.reduce((acc, s) => acc + (s.ms || 0), 0)

    const finalMeta = { ...contextMeta, trace }
    emitSafe(emit, 'final', {
      ok: true,
      usedMock: false,
      data: normalized,
      contextMeta: finalMeta,
    })

    return {
      data: normalized,
      usedMock: false,
      contextMeta: finalMeta,
    }
  } catch (err) {
    const data = normalizeBriefingData(MOCK_BRIEFING_RESPONSE)
    trace.endedAt = isoNow()
    trace.totalMs = trace.steps.reduce((acc, s) => acc + (s.ms || 0), 0)
    const finalMeta = {
      ...contextMeta,
      trace,
      error: err instanceof Error ? err.message : String(err),
    }
    emitSafe(emit, 'final', {
      ok: true,
      usedMock: true,
      data,
      contextMeta: finalMeta,
    })
    return {
      data,
      usedMock: true,
      contextMeta: finalMeta,
    }
  }
}
