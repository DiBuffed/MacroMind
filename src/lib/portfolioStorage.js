const STORAGE_KEY = 'macromind_portfolio_v1'

/**
 * @typedef {{
 *   tickers: string
 *   skipPortfolio: boolean
 *   lastBriefingAt: string | null
 *   cachedBriefing: object | null
 *   lastContextMeta: object | null
 * }} SavedPortfolioState
 */

/** @returns {SavedPortfolioState | null} */
export function loadPortfolioState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const j = JSON.parse(raw)
    return {
      tickers: typeof j.tickers === 'string' ? j.tickers : '',
      skipPortfolio: Boolean(j.skipPortfolio),
      lastBriefingAt: typeof j.lastBriefingAt === 'string' ? j.lastBriefingAt : null,
      cachedBriefing:
        j.cachedBriefing && typeof j.cachedBriefing === 'object'
          ? j.cachedBriefing
          : null,
      lastContextMeta:
        j.lastContextMeta && typeof j.lastContextMeta === 'object'
          ? j.lastContextMeta
          : null,
    }
  } catch {
    return null
  }
}

/**
 * @param {{
 *   tickers?: string
 *   skipPortfolio: boolean
 *   cachedBriefing: object | null
 *   lastContextMeta?: object | null
 * }} p
 */
export function savePortfolioState({
  tickers = '',
  skipPortfolio,
  cachedBriefing,
  lastContextMeta = null,
}) {
  const payload = {
    version: 1,
    tickers,
    skipPortfolio: Boolean(skipPortfolio),
    lastBriefingAt: new Date().toISOString(),
    cachedBriefing,
    lastContextMeta,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('[MacroMind] portfolio 저장 실패', e)
  }
}

export function clearPortfolioState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
