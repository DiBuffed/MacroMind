/**
 * 백엔드 `/api/briefing` 호출 — API 키는 서버 .env에서만 관리합니다.
 * @param {{
 *   imageBase64?: string | null
 *   imageMediaType?: string
 *   textTickers?: string
 *   skipPortfolio?: boolean
 *   briefingIntent?: 'first' | 'daily'
 * }} opts
 */
export async function fetchMacroBriefing(opts) {
  const res = await fetch('/api/briefing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts ?? {}),
  })
  let payload = null
  try {
    payload = await res.json()
  } catch {
    throw new Error('서버 응답을 해석할 수 없습니다.')
  }
  if (!res.ok) {
    const msg =
      typeof payload?.error === 'string'
        ? payload.error
        : `서버 오류 (${res.status})`
    throw new Error(msg)
  }
  return payload
}
