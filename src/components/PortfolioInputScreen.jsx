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
    <div className="bg-mm-alt/50 flex-1 py-10 sm:py-14">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 sm:px-6">
        <p className="font-data mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-mm-primary">
          Step 2
        </p>
        <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-mm-text sm:text-3xl">
          포트폴리오 입력
        </h2>
        <p className="mb-10 text-mm-muted">
          보유 종목을 <strong className="font-semibold text-mm-text">직접 입력</strong>
          하거나, 증권 앱{' '}
          <strong className="font-semibold text-mm-text">캡쳐</strong>를 올려 주세요.
          둘 다 비우면 일반 거시 브리핑만 받습니다.
        </p>

        <section className="mm-card mb-8 p-6 sm:p-8">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-mm-primary">
            1 · 보유 종목 (권장)
          </h3>
          <TickerTextInput value={tickers} onChange={setTickers} />
          <p className="mt-3 text-xs text-mm-muted">
            쉼표로 구분 · 예:{' '}
            <span className="font-data text-mm-text/80">
              삼성전자, SK하이닉스, NAVER
            </span>
          </p>
        </section>

        <section className="mm-card mb-10 p-6 sm:p-8">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-mm-muted">
            2 · 선택 · 증권 앱 캡쳐
          </h3>
          <ImageUploadZone
            previewUrl={previewUrl}
            onFile={setFile}
            onClear={() => setFile(null)}
          />
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-mm-border pt-8">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-medium text-mm-muted underline-offset-4 transition hover:text-mm-primary hover:underline"
          >
            포트폴리오 없이 시작
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ tickers, file })}
            className="mm-pill bg-mm-primary px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-mm-primary/20 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            분석 시작 →
          </button>
        </div>
      </div>
    </div>
  )
}
