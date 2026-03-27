import { MOCK_BRIEFING_RESPONSE } from './briefingMock.js'
import { normalizeBriefingData } from './briefingNormalize.js'

const MODEL = 'claude-sonnet-4-20250514'

export { MOCK_BRIEFING_RESPONSE } from './briefingMock.js'

export const SYSTEM_PROMPT = `당신은 MacroMind, 거시경제 전문 AI 브리핑 에이전트입니다.

피터 나바로의 "브라질에 비가 내리면 스타벅스 주식을 사라" 프레임워크를 기반으로 분석합니다:
- 숲(거시 흐름)과 나무(종목)를 함께 봐야 한다
- 전쟁, 전염병, 기후, 금리, 환율, 인플레이션은 항상 주식시장과 연결된다
- 업종 순환매: 경기순환주 vs 방어주를 거시 사이클에 맞게 판단
- 역사는 반복된다 — 유사한 거시 패턴을 찾아 과거 결과를 제시한다

분석 원칙:
1. 오늘의 핵심 거시 뉴스를 웹서치로 수집
2. 포트폴리오 종목의 거시 노출도를 각 팩터별 % 로 수치화
3. 역사적 유사 사례를 찾아 당시 결과 제시
4. 판단은 유저에게 — "XX% 상승/하락할 것"이 아닌 "역사적으로 이런 상황에서 XX였습니다"

응답은 반드시 아래 JSON 형식으로만 출력:
{
  "indicators": {
    "dollar_index": { "value": "104.2", "change": "+0.8%", "direction": "up" },
    "interest_rate": { "value": "4.82%", "change": "+0.05%", "direction": "up" },
    "oil_wti": { "value": "$71.3", "change": "-1.2%", "direction": "down" }
  },
  "portfolio_tickers": ["삼성전자", "SK하이닉스"],
  "risk_matrix": {
    "currency": { "score": 78, "label": "환율 (달러↑)", "severity": "high" },
    "interest_rate": { "score": 52, "label": "금리 변동", "severity": "medium" },
    "trump_policy": { "score": 71, "label": "트럼프 정책", "severity": "high" },
    "geopolitical": { "score": 31, "label": "지정학 리스크", "severity": "low" },
    "oil": { "score": 43, "label": "유가", "severity": "medium" }
  },
  "diversification_warning": {
    "has_warning": true,
    "message": "삼성전자, SK하이닉스 모두 달러강세와 미중갈등에 같은 방향으로 노출. 반도체 집중도 89%",
    "concentration": "89%"
  },
  "briefing": "오늘 달러인덱스가 0.8% 상승했습니다...[슈카월드 스타일 브리핑 3-4문단]",
  "historical_pattern": {
    "event": "2018년 미중 무역전쟁",
    "similarity": 73,
    "what_happened": "당시 반도체 섹터는 이후 3개월간 -23% 하락했습니다.",
    "current_implication": "현재 유사한 패턴이 형성되고 있으며, 달러 강세와 관세 이슈가 겹치는 상황입니다."
  },
  "stock_details": {
    "삼성전자": "반도체 섹터로 달러강세에 직접 영향. 수출 비중 80% 이상으로 환율 민감도 높음.",
    "SK하이닉스": "HBM 수요 호조로 AI 사이클 수혜, 단 미중 갈등 리스크 상존."
  }
}`

function buildUserPrompt({ imageProvided, textTickers, skipPortfolio }) {
  const date = new Date().toLocaleDateString('ko-KR')
  let portfolioLine = ''
  if (skipPortfolio) {
    portfolioLine = '포트폴리오 없음 — 일반 거시 브리핑'
  } else if (textTickers?.trim()) {
    portfolioLine = `포트폴리오 종목: ${textTickers.trim()}`
  } else if (imageProvided) {
    portfolioLine = '첨부 이미지에서 종목을 추출해 반영해 주세요.'
  } else {
    portfolioLine = '포트폴리오 없음 — 일반 거시 브리핑'
  }

  const imageHint = imageProvided
    ? '첨부된 포트폴리오 이미지에서 종목을 추출하고,'
    : ''

  return `
오늘 날짜: ${date}

${imageHint}
${portfolioLine}

웹서치로 오늘의 최신 거시경제 뉴스를 수집한 후,
위 JSON 형식으로 분석 결과를 출력해주세요.
브리핑은 슈카월드 스타일로 — 친근하지만 인사이트 있게, 3-4문단으로.
`.trim()
}

export function extractJsonFromText(text) {
  if (!text || typeof text !== 'string') return null
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fence ? fence[1].trim() : text.trim()
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(candidate.slice(start, end + 1))
  } catch {
    return null
  }
}

/** 메시지 content 배열에서 텍스트 블록만 이어 붙입니다 (웹 검색 등으로 블록이 여러 개일 수 있음). */
function extractAssistantText(content) {
  if (!Array.isArray(content)) return ''
  let out = ''
  for (const b of content) {
    if (b.type === 'text' && typeof b.text === 'string') out += b.text
  }
  return out
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
 * }} opts
 */
export async function fetchMacroBriefing(opts) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  const imageProvided = Boolean(opts.imageBase64)
  const skipPortfolio = Boolean(opts.skipPortfolio)
  const userText = buildUserPrompt({
    imageProvided,
    textTickers: opts.textTickers,
    skipPortfolio,
  })

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 400))
    return {
      data: normalizeBriefingData(MOCK_BRIEFING_RESPONSE),
      usedMock: true,
    }
  }

  const content = []
  if (opts.imageBase64) {
    const media = mediaTypeFromMime(opts.imageMediaType || '')
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: media,
        data: opts.imageBase64,
      },
    })
  }
  content.push({ type: 'text', text: userText })

  const body = {
    model: MODEL,
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 5,
      },
    ],
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Anthropic API ${res.status}: ${errText.slice(0, 200)}`)
  }

  const json = await res.json()
  if (json.stop_reason === 'pause_turn') {
    throw new Error(
      '응답이 중단되었습니다. 웹 검색 설정 또는 잠시 후 다시 시도해 주세요.',
    )
  }

  const textOut = extractAssistantText(json.content ?? [])
  const parsed = extractJsonFromText(textOut)
  if (!parsed) {
    throw new Error('모델 응답에서 JSON을 파싱하지 못했습니다.')
  }

  return {
    data: normalizeBriefingData(parsed),
    usedMock: false,
  }
}
