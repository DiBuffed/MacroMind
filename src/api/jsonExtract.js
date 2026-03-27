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
