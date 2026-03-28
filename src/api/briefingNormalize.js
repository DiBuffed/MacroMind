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

  const mo = b.macro_outlook
  const incomingMo =
    raw.macro_outlook && typeof raw.macro_outlook === 'object'
      ? raw.macro_outlook
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
    portfolio_links: Array.isArray(raw.portfolio_links)
      ? raw.portfolio_links
      : b.portfolio_links || [],
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
      then_vs_now:
        typeof (raw.historical_pattern?.then_vs_now) === 'string'
          ? raw.historical_pattern.then_vs_now
          : b.historical_pattern.then_vs_now ?? '',
    },
    stock_details:
      raw.stock_details && typeof raw.stock_details === 'object'
        ? { ...b.stock_details, ...raw.stock_details }
        : { ...b.stock_details },
    macro_outlook: {
      summary:
        typeof incomingMo.summary === 'string' ? incomingMo.summary : mo.summary,
      scenarios: Array.isArray(incomingMo.scenarios)
        ? incomingMo.scenarios
        : mo.scenarios,
      watch_factors: Array.isArray(incomingMo.watch_factors)
        ? incomingMo.watch_factors
        : mo.watch_factors,
    },
    news_feed: Array.isArray(raw.news_feed)
      ? raw.news_feed.map((item) => ({
          headline: typeof item?.headline === 'string' ? item.headline : '',
          region: ['domestic', 'international'].includes(item?.region)
            ? item.region
            : 'international',
          sector: typeof item?.sector === 'string' ? item.sector : '기타',
          summary: typeof item?.summary === 'string' ? item.summary : '',
          ripple_effect:
            typeof item?.ripple_effect === 'string' ? item.ripple_effect : '',
          historical_echo:
            typeof item?.historical_echo === 'string'
              ? item.historical_echo
              : '',
          affected_tickers: Array.isArray(item?.affected_tickers)
            ? item.affected_tickers
            : [],
          impact_explanation:
            typeof item?.impact_explanation === 'string'
              ? item.impact_explanation
              : '',
          severity: ['high', 'medium', 'low'].includes(item?.severity)
            ? item.severity
            : 'low',
          macro_factors: Array.isArray(item?.macro_factors)
            ? item.macro_factors
            : [],
        }))
      : b.news_feed,
    portfolio_synthesis:
      typeof raw.portfolio_synthesis === 'string'
        ? raw.portfolio_synthesis
        : b.portfolio_synthesis,
  }
}
