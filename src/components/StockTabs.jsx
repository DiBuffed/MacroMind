import { useState } from 'react'

export default function StockTabs({ tickers, stockDetails }) {
  const list = Array.isArray(tickers) ? tickers.filter(Boolean) : []
  const [active, setActive] = useState(list[0] ?? null)

  if (!list.length) return null

  return (
    <div className="mt-8 border-t border-mm-border pt-6">
      <h3 className="mb-3 text-sm font-semibold text-mm-muted">
        종목별 거시 맥락
      </h3>
      <div className="flex flex-wrap gap-2">
        {list.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className={`font-data rounded border px-3 py-1.5 text-xs transition ${
              active === t
                ? 'border-mm-accent bg-mm-accent/15 text-mm-accent'
                : 'border-mm-border text-mm-muted hover:border-mm-border/80 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {active && stockDetails?.[active] && (
        <p className="mt-4 text-sm leading-relaxed text-white/85">
          {stockDetails[active]}
        </p>
      )}
    </div>
  )
}
