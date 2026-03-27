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
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <h2 className="mb-2 text-2xl font-semibold text-white">포트폴리오 입력</h2>
      <p className="mb-8 text-mm-muted">
        이미지 또는 종목명으로 분석할 범위를 알려주세요.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-data mb-3 text-xs uppercase tracking-wider text-mm-accent">
            A · 이미지
          </h3>
          <ImageUploadZone
            previewUrl={previewUrl}
            onFile={setFile}
            onClear={() => setFile(null)}
          />
        </div>
        <div>
          <h3 className="font-data mb-3 text-xs uppercase tracking-wider text-mm-accent">
            B · 텍스트
          </h3>
          <TickerTextInput value={tickers} onChange={setTickers} />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-mm-border pt-8">
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
