import { useEffect, useMemo, useState } from 'react'
import ImageUploadZone from './ImageUploadZone.jsx'
import TickerTextInput from './TickerTextInput.jsx'

export default function PortfolioInputScreen({ onSubmit, onSkip }) {
  const [tickers, setTickers] = useState('')
  const [file, setFile] = useState(null)

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <h2 className="mb-2 text-2xl font-semibold text-white">포트폴리오</h2>
      <p className="mb-8 text-mm-muted">
        보유 종목을 <strong className="text-white/90">직접 입력</strong>하거나, 원하면
        증권 앱 캡쳐를 올려도 됩니다. 둘 다 비우면 일반 거시 브리핑만 받습니다.
      </p>

      <section className="mb-10">
        <h3 className="font-data mb-3 text-xs uppercase tracking-wider text-mm-accent">
          1 · 보유 종목 (권장)
        </h3>
        <TickerTextInput value={tickers} onChange={setTickers} />
        <p className="mt-2 text-xs text-mm-muted">
          쉼표로 구분하세요. 예:{' '}
          <span className="font-data text-mm-muted/90">
            삼성전자, SK하이닉스, NAVER
          </span>
        </p>
      </section>

      <section className="mb-10">
        <h3 className="font-data mb-3 text-xs uppercase tracking-wider text-mm-muted">
          2 · 선택 · 증권 앱 캡쳐
        </h3>
        <ImageUploadZone
          previewUrl={previewUrl}
          onFile={setFile}
          onClear={() => setFile(null)}
        />
      </section>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-mm-border pt-8">
        <button
          type="button"
          onClick={onSkip}
          className="font-data text-sm text-mm-muted underline-offset-4 hover:text-white hover:underline"
        >
          포트폴리오 없이 시작
        </button>
        <button
          type="button"
          onClick={() => onSubmit({ tickers, file })}
          className="font-data rounded border border-mm-accent/50 bg-mm-accent/15 px-8 py-3 text-sm font-medium text-mm-accent transition hover:bg-mm-accent/25"
        >
          분석 시작
        </button>
      </div>
    </div>
  )
}
