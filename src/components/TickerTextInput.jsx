export default function TickerTextInput({ value, onChange }) {
  return (
    <div>
      <label className="font-data mb-2 block text-xs uppercase tracking-wider text-mm-muted">
        종목 직접 입력
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="삼성전자, SK하이닉스, ..."
        className="font-data w-full resize-none rounded-lg border border-mm-border bg-mm-bg px-4 py-3 text-sm text-white placeholder:text-mm-muted/60 focus:border-mm-accent/50 focus:outline-none focus:ring-1 focus:ring-mm-accent/30"
      />
    </div>
  )
}
