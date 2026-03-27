/** risk_matrix 키 ↔ 브리핑/종목 텍스트에서 찾을 키워드 (한글) */
export const MACRO_FACTOR_ORDER = [
  'currency',
  'interest_rate',
  'trump_policy',
  'geopolitical',
  'oil',
]

export const MACRO_FACTOR_LABEL = {
  currency: '환율',
  interest_rate: '금리',
  trump_policy: '정책·관세',
  geopolitical: '지정학',
  oil: '유가',
}

export const MACRO_KEYWORDS = {
  currency: ['환율', '달러', '달러인덱스', '원화', '환차', '수출', 'FX'],
  interest_rate: ['금리', '채권', 'FOMC', '국채', '금리인상', '금리인하', '스프레드'],
  trump_policy: ['트럼프', '관세', '재정', '무역', '규제', 'IRA'],
  geopolitical: ['지정학', '전쟁', '미중', '분쟁', '대만', '중국', '러시아'],
  oil: ['유가', 'WTI', '원유', '에너지', '석유', 'OPEC'],
}

/**
 * @param {string} text
 * @param {string} factorKey
 */
export function textMentionsFactor(text, factorKey) {
  if (!text || typeof text !== 'string') return false
  const keys = MACRO_KEYWORDS[factorKey]
  if (!keys) return false
  const lower = text.toLowerCase()
  return keys.some((k) => text.includes(k) || lower.includes(k.toLowerCase()))
}
