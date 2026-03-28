export async function fetchMacroBriefingStream(opts, onEvent) {
  const res = await fetch('/api/briefing/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts || {}),
  })

  if (!res.ok || !res.body) {
    throw new Error(`stream_http_${res.status}`)
  }

  const decoder = new TextDecoder('utf-8')
  const reader = res.body.getReader()
  let buffer = ''
  let finalPayload = null

  const emit = (event, data) => {
    try {
      onEvent?.({ event, data })
    } catch {
      /* ignore */
    }
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    while (true) {
      const sep = buffer.indexOf('\n\n')
      if (sep === -1) break
      const chunk = buffer.slice(0, sep)
      buffer = buffer.slice(sep + 2)

      const lines = chunk.split('\n')
      let event = 'message'
      let dataStr = ''
      for (const line of lines) {
        if (line.startsWith('event:')) event = line.slice(6).trim()
        if (line.startsWith('data:')) dataStr += line.slice(5).trim()
      }
      if (!dataStr) continue

      let data
      try {
        data = JSON.parse(dataStr)
      } catch {
        data = dataStr
      }

      emit(event, data)
      if (event === 'final') {
        finalPayload = data
        try {
          await reader.cancel()
        } catch {
          /* ignore */
        }
        return finalPayload
      }
    }
  }

  if (!finalPayload) {
    throw new Error('stream_no_final')
  }

  return finalPayload
}
