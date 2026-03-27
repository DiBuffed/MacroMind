import { useMemo, useState } from 'react'

export default function StockTabs({ tickers, stockDetails }) {
  const list = useMemo(
    () => (Array.isArray(tickers) ? tickers.filter(Boolean) : []),
    [tickers],
  )
  const [picked, setPicked] = useState(null)

  const active = useMemo(() => {
    if (!list.length) return null
    if (picked && list.includes(picked)) return picked
    return list[0]
  }, [list, picked])

  if (!list.length) return null

  return (
    <section className="mt-8 border-t border-mm-border pt-8">
      <p className="font-data mb-1 text-xs uppercase tracking-wider text-mm-accent">
        종목별 딥다이브
      </p>
      <h3 className="mb-4 text-lg font-semibold text-white">
        종목별 거시 맥락
      </h3>
      <div className="flex flex-wrap gap-2">
        {list.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setPicked(t)}
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
    </section>
  )
}
