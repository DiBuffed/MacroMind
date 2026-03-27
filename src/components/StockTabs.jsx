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
    <section className="mt-10 border-t border-mm-border pt-10">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-mm-primary">
        종목별 딥다이브
      </p>
      <h3 className="mb-6 text-xl font-extrabold text-mm-text">종목별 거시 맥락</h3>
      <div className="flex flex-wrap gap-2">
        {list.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setPicked(t)}
            className={`font-data rounded-full border px-4 py-2 text-xs font-semibold transition ${
              active === t
                ? 'border-mm-primary bg-mm-primary/10 text-mm-primary shadow-sm'
                : 'border-mm-border bg-white text-mm-muted hover:border-mm-primary/30 hover:text-mm-text'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {active && stockDetails?.[active] && (
        <div className="mm-card mt-6 p-5">
          <p className="text-sm leading-relaxed text-mm-text/90">{stockDetails[active]}</p>
        </div>
      )}
    </section>
  )
}
