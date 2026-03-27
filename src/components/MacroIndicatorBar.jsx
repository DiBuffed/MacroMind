function dirColor(direction) {
  if (direction === 'up') return 'text-red-500'
  if (direction === 'down') return 'text-emerald-600'
  return 'text-mm-muted'
}

export default function MacroIndicatorBar({ indicators }) {
  const items = [
    { key: 'dollar_index', title: '달러인덱스', data: indicators?.dollar_index },
    { key: 'interest_rate', title: '금리 (10Y)', data: indicators?.interest_rate },
    { key: 'oil_wti', title: '유가 (WTI)', data: indicators?.oil_wti },
  ]

  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-mm-muted">
        오늘의 거시 지표
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(({ key, title, data }) => (
          <div key={key} className="mm-card p-5">
            <p className="font-data text-[11px] font-semibold uppercase tracking-wider text-mm-muted">
              {title}
            </p>
            <p className="font-data mt-2 text-3xl font-bold tracking-tight text-mm-text">
              {data?.value ?? '—'}
            </p>
            <p className={`font-data mt-1 text-sm font-medium ${dirColor(data?.direction)}`}>
              {data?.change ?? '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
