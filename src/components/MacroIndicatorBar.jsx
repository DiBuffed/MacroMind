function dirColor(direction) {
  if (direction === 'up') return 'text-red-400'
  if (direction === 'down') return 'text-mm-accent'
  return 'text-mm-muted'
}

export default function MacroIndicatorBar({ indicators }) {
  const items = [
    { key: 'dollar_index', title: '달러인덱스', data: indicators?.dollar_index },
    { key: 'interest_rate', title: '금리 (10Y)', data: indicators?.interest_rate },
    { key: 'oil_wti', title: '유가 (WTI)', data: indicators?.oil_wti },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ key, title, data }) => (
        <div
          key={key}
          className="rounded-lg border border-mm-border bg-mm-surface/80 px-4 py-3"
        >
          <p className="font-data text-xs uppercase tracking-wider text-mm-muted">
            {title}
          </p>
          <p className="font-data mt-1 text-2xl font-medium text-white">
            {data?.value ?? '—'}
          </p>
          <p
            className={`font-data mt-1 text-sm ${dirColor(data?.direction)}`}
          >
            {data?.change ?? '—'}
          </p>
        </div>
      ))}
    </div>
  )
}
