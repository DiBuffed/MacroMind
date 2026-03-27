export default function TickerTextInput({ value, onChange }) {
  return (
    <div>
      <label
        htmlFor="mm-tickers"
        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-mm-muted"
      >
        종목명
      </label>
      <textarea
        id="mm-tickers"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="삼성전자, SK하이닉스, 현대차, NAVER, ..."
        className="font-data w-full resize-y rounded-2xl border border-mm-border bg-mm-page px-4 py-3.5 text-sm leading-relaxed text-mm-text placeholder:text-mm-muted/50 focus:border-mm-primary focus:outline-none focus:ring-2 focus:ring-mm-primary/20"
      />
    </div>
  )
}
