export default function TickerTextInput({ value, onChange }) {
  return (
    <div>
      <label
        htmlFor="mm-tickers"
        className="font-data mb-2 block text-xs uppercase tracking-wider text-mm-muted"
      >
        종목명
      </label>
      <textarea
        id="mm-tickers"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="삼성전자, SK하이닉스, 현대차, NAVER, ..."
        className="font-data w-full resize-y rounded-lg border border-mm-border bg-mm-bg px-4 py-3 text-sm leading-relaxed text-white placeholder:text-mm-muted/60 focus:border-mm-accent/50 focus:outline-none focus:ring-1 focus:ring-mm-accent/30"
      />
    </div>
  )
}
