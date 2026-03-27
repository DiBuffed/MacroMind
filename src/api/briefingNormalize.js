import { MOCK_BRIEFING_RESPONSE } from './briefingMock.js'

function mergeIndicator(base, incoming) {
  if (!incoming || typeof incoming !== 'object') return base
  return { ...base, ...incoming }
}

/**
 * API JSON이 일부만 와도 대시보드가 깨지지 않도록 기본값과 병합합니다.
 * @param {unknown} raw
 */
export function normalizeBriefingData(raw) {
  const b = MOCK_BRIEFING_RESPONSE
  if (!raw || typeof raw !== 'object') {
    return { ...b }
  }

  const rm = b.risk_matrix
  const incomingRm = raw.risk_matrix && typeof raw.risk_matrix === 'object'
    ? raw.risk_matrix
    : {}

  return {
    indicators: {
      dollar_index: mergeIndicator(
        b.indicators.dollar_index,
        raw.indicators?.dollar_index,
      ),
      interest_rate: mergeIndicator(
        b.indicators.interest_rate,
        raw.indicators?.interest_rate,
      ),
      oil_wti: mergeIndicator(b.indicators.oil_wti, raw.indicators?.oil_wti),
    },
    portfolio_tickers: Array.isArray(raw.portfolio_tickers)
      ? raw.portfolio_tickers
      : b.portfolio_tickers,
    risk_matrix: {
      currency: mergeIndicator(rm.currency, incomingRm.currency),
      interest_rate: mergeIndicator(rm.interest_rate, incomingRm.interest_rate),
      trump_policy: mergeIndicator(rm.trump_policy, incomingRm.trump_policy),
      geopolitical: mergeIndicator(rm.geopolitical, incomingRm.geopolitical),
      oil: mergeIndicator(rm.oil, incomingRm.oil),
    },
    diversification_warning: {
      ...b.diversification_warning,
      ...(raw.diversification_warning &&
      typeof raw.diversification_warning === 'object'
        ? raw.diversification_warning
        : {}),
    },
    briefing: typeof raw.briefing === 'string' ? raw.briefing : b.briefing,
    historical_pattern: {
      ...b.historical_pattern,
      ...(raw.historical_pattern &&
      typeof raw.historical_pattern === 'object'
        ? raw.historical_pattern
        : {}),
    },
    stock_details:
      raw.stock_details && typeof raw.stock_details === 'object'
        ? { ...b.stock_details, ...raw.stock_details }
        : { ...b.stock_details },
  }
}
