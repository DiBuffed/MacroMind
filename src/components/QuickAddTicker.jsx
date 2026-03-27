import { useState } from 'react'

export default function QuickAddTicker({ onAdd }) {
  const [value, setValue] = useState('')

  const submit = () => {
    const t = value.trim()
    if (!t) return
    onAdd(t)
    setValue('')
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            submit()
          }
        }}
        placeholder="종목 추가 (예: 카카오)"
        className="font-data min-w-0 flex-1 rounded-xl border border-mm-border bg-mm-page px-4 py-2.5 text-sm text-mm-text placeholder:text-mm-muted/50 focus:border-mm-primary focus:outline-none focus:ring-2 focus:ring-mm-primary/20"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!value.trim()}
        className="mm-pill shrink-0 bg-mm-primary px-5 py-2.5 text-xs font-bold text-white transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        + 추가
      </button>
    </div>
  )
}
