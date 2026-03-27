/**
 * 브리핑에 넣을 외부 뉴스·시세 컨텍스트 수집 (서버에서만 실행)
 * 키가 없으면 해당 소스는 건너뜀 — Frankfurter(환율)·Google News RSS는 API 키 없이 시도
 */

function safeJson(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function parseRssItems(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)
    const source = block.match(/<source[^>]*>(.*?)<\/source>/)
    const link = block.match(/<link>(.*?)<\/link>/)
    const t = (title?.[1] || title?.[2] || '').trim()
    if (t) {
      items.push({
        title: t,
        pubDate: pubDate?.[1] || '',
        source: source?.[1] || '',
        link: link?.[1] || '',
      })
    }
  }
  return items
}

/** Frankfurter — 무료, 키 불필요 (ECB 기준 환율) */
async function fetchFrankfurterUsdKrw() {
  const res = await fetch(
    'https://api.frankfurter.app/latest?from=USD&to=KRW,EUR,JPY',
    { signal: AbortSignal.timeout(8000) },
  )
  const data = await safeJson(res)
  const krw = data.rates?.KRW
  const eur = data.rates?.EUR
  const jpy = data.rates?.JPY
  if (!krw) return null
  return {
    source: 'frankfurter',
    line: `환율 스냅샷 (${data.date} 기준 ECB): USD/KRW ≈ ${krw.toFixed(2)}원, USD/EUR ≈ ${eur?.toFixed(4) ?? '—'}, USD/JPY ≈ ${jpy?.toFixed(2) ?? '—'}`,
  }
}

/** Google News RSS — 무료, 키 불필요 (한국 경제·비즈니스 뉴스) */
async function fetchGoogleNewsRss() {
  const feeds = [
    {
      label: '한국 경제',
      url: 'https://news.google.com/rss/search?q=%EA%B2%BD%EC%A0%9C+%EC%A3%BC%EC%8B%9D+%ED%99%98%EC%9C%A8+%EA%B8%88%EB%A6%AC&hl=ko&gl=KR&ceid=KR:ko',
    },
    {
      label: 'US Business',
      url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en',
    },
  ]

  const allItems = []
  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'MacroMind/1.0 (news aggregator)' },
      })
      if (!res.ok) continue
      const xml = await res.text()
      const items = parseRssItems(xml)
      for (const item of items.slice(0, 8)) {
        allItems.push({
          title: item.title,
          source: item.source || feed.label,
          pubDate: item.pubDate,
        })
      }
    } catch {
      /* skip */
    }
  }
  return allItems
}

/** NewsAPI — NEWS_API_KEY 필요 https://newsapi.org */
async function fetchNewsApiHeadlines() {
  const key = (process.env.NEWS_API_KEY || '').trim()
  if (!key) return []

  const urls = [
    `https://newsapi.org/v2/top-headlines?country=kr&category=business&pageSize=6&apiKey=${key}`,
    `https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=5&apiKey=${key}`,
  ]
  const headlines = []
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      const data = await safeJson(res)
      if (data.status !== 'ok') continue
      for (const a of data.articles || []) {
        if (a.title) headlines.push({ title: a.title, source: a.source?.name || 'NewsAPI' })
      }
    } catch {
      /* skip */
    }
  }
  return headlines.slice(0, 10)
}

/** Finnhub — FINNHUB_API_KEY 필요 https://finnhub.io */
async function fetchFinnhubMarketNews() {
  const token = (process.env.FINNHUB_API_KEY || '').trim()
  if (!token) return []

  const url = `https://finnhub.io/api/v1/news?category=general&token=${token}`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const arr = await safeJson(res)
    if (!Array.isArray(arr)) return []
    return arr.slice(0, 8).map((n) => {
      const t = n.headline || n.title || ''
      return t ? { title: t, source: n.source || 'Finnhub', summary: n.summary || '' } : null
    }).filter(Boolean)
  } catch {
    return []
  }
}

/** FRED — FRED_API_KEY https://fred.stlouisfed.org/docs/api/api_key.html — 미국 10년물 금리 DGS10 */
async function fetchFredDgs10() {
  const key = (process.env.FRED_API_KEY || '').trim()
  if (!key) return null

  const u = new URL('https://api.stlouisfed.org/fred/series/observations')
  u.searchParams.set('series_id', 'DGS10')
  u.searchParams.set('api_key', key)
  u.searchParams.set('file_type', 'json')
  u.searchParams.set('sort_order', 'desc')
  u.searchParams.set('limit', '1')

  try {
    const res = await fetch(u, { signal: AbortSignal.timeout(8000) })
    const data = await safeJson(res)
    const obs = data.observations?.[0]
    if (!obs?.value || obs.value === '.') return null
    return {
      source: 'fred',
      line: `미국 10년 국채 수익률(DGS10) 최신값: ${obs.value}% (관측일 ${obs.date})`,
    }
  } catch {
    return null
  }
}

/** Alpha Vantage — ALPHA_VANTAGE_KEY, WTI 유가 등 */
async function fetchAlphaVantageWti() {
  const key = (process.env.ALPHA_VANTAGE_KEY || '').trim()
  if (!key) return null

  const url = `https://www.alphavantage.co/query?function=WTI&interval=monthly&apikey=${key}`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    const data = await safeJson(res)
    const d = data.data?.[0]
    if (!d) return null
    return {
      source: 'alphavantage',
      line: `WTI 원유(월별 시리즈 최신): $${d.value} (${d.date})`,
    }
  } catch {
    return null
  }
}

/**
 * @returns {{ text: string, meta: { sources: string[], newsCount: number } }}
 */
export async function fetchBriefingContext() {
  const sources = []
  const blocks = []

  const [fxResult, fredResult, wtiResult, googleRss, finnResult, newsApiResult] =
    await Promise.allSettled([
      fetchFrankfurterUsdKrw(),
      fetchFredDgs10(),
      fetchAlphaVantageWti(),
      fetchGoogleNewsRss(),
      fetchFinnhubMarketNews(),
      fetchNewsApiHeadlines(),
    ])

  const fx = fxResult.status === 'fulfilled' ? fxResult.value : null
  if (fx) {
    sources.push(fx.source)
    blocks.push(`[환율]\n${fx.line}`)
  }

  const fred = fredResult.status === 'fulfilled' ? fredResult.value : null
  if (fred) {
    sources.push(fred.source)
    blocks.push(`[금리·채권]\n${fred.line}`)
  }

  const wti = wtiResult.status === 'fulfilled' ? wtiResult.value : null
  if (wti) {
    sources.push(wti.source)
    blocks.push(`[유가]\n${wti.line}`)
  }

  const newsItems = []

  const gNews = googleRss.status === 'fulfilled' ? googleRss.value : []
  if (gNews.length) {
    sources.push('google_news_rss')
    for (const item of gNews) {
      newsItems.push(`· [${item.source}] ${item.title}`)
    }
  }

  const finn = finnResult.status === 'fulfilled' ? finnResult.value : []
  if (finn.length) {
    sources.push('finnhub_news')
    for (const item of finn) {
      const line = item.summary
        ? `· [${item.source}] ${item.title} — ${item.summary.slice(0, 120)}`
        : `· [${item.source}] ${item.title}`
      newsItems.push(line)
    }
  }

  const newsApi = newsApiResult.status === 'fulfilled' ? newsApiResult.value : []
  if (newsApi.length) {
    sources.push('newsapi')
    for (const item of newsApi) {
      newsItems.push(`· [${item.source}] ${item.title}`)
    }
  }

  const uniqueNews = [...new Set(newsItems)].slice(0, 18)

  if (uniqueNews.length) {
    blocks.push(
      `[오늘의 실시간 뉴스 헤드라인 — ${uniqueNews.length}건]\n` +
      '아래 뉴스를 기반으로 news_feed를 구성하고, 각 뉴스의 인과관계·파급효과·과거 유사사례를 분석하세요.\n' +
      uniqueNews.join('\n'),
    )
  }

  const text =
    blocks.length > 0
      ? `아래는 서버가 방금 수집한 외부 데이터입니다. indicators·briefing·news_feed에 반영하고, 부족한 항목은 합리적으로 보완하세요.\n\n${blocks.join('\n\n')}`
      : ''

  return {
    text,
    meta: {
      sources: [...new Set(sources)],
      newsCount: uniqueNews.length,
    },
  }
}
