import { useCallback, useEffect, useMemo, useState } from 'react'

export default function PortfolioInputScreen({
  onSubmit,
  onSkip,
  onCancel,
  initialTickers = '',
  hasSavedSession = false,
}) {
  const [tickers, setTickers] = useState(initialTickers)
  const [file, setFile] = useState(null)

  useEffect(() => {
    setTickers(initialTickers)
  }, [initialTickers])

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      const f = e.dataTransfer?.files?.[0]
      if (f && f.type.startsWith('image/')) setFile(f)
    },
    [],
  )

  const hasAnything = tickers.trim().length > 0 || file

  return (
    <div className="flex flex-1 items-start justify-center bg-mm-alt/40 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mm-pill mb-4 inline-block bg-mm-primary/10 px-4 py-1.5 text-xs font-bold text-mm-primary">
            에이전트에 맡길 종목
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-mm-text sm:text-3xl">
            종목만 알려 주세요
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-mm-muted">
            입력·캡처 한 번이면 오늘 뉴스·시세와 거시·역사 맥락이{' '}
            <strong className="font-medium text-mm-text/90">내 종목 렌즈</strong>로 묶입니다.
            분석 후 바로 대시보드에서 확인하세요.
          </p>
        </div>

        <div className="mm-card overflow-hidden">
          {/* 종목 텍스트 입력 */}
          <div className="border-b border-mm-border px-5 py-5 sm:px-7 sm:py-6">
            <label
              htmlFor="mm-tickers"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-mm-primary"
            >
              보유 종목
            </label>
            <textarea
              id="mm-tickers"
              value={tickers}
              onChange={(e) => setTickers(e.target.value)}
              rows={4}
              placeholder="예: 삼성전자 10주, 하이닉스 조금, 애플, 테슬라랑 엔비디아도 있어... 또는 증권사 화면을 복사해서 붙여넣으세요."
              className="font-data w-full resize-y rounded-xl border border-mm-border bg-mm-page px-4 py-3 text-sm leading-relaxed text-mm-text placeholder:text-mm-muted/50 focus:border-mm-primary focus:outline-none focus:ring-2 focus:ring-mm-primary/20"
            />
            <p className="mt-2 text-xs text-mm-muted">
              자연스러운 문장, 목록, 복사된 텍스트 등 어떤 형식이든 에이전트가 종목을 찾아냅니다.
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                document.getElementById('mm-portfolio-file')?.click()
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => document.getElementById('mm-portfolio-file')?.click()}
            className="relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center px-5 py-5 transition hover:bg-mm-cyan/5 sm:px-7 sm:py-6"
          >
            <input
              id="mm-portfolio-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setFile(f)
              }}
            />
            {previewUrl ? (
              <div className="relative w-full text-center">
                <img
                  src={previewUrl}
                  alt="포트폴리오 캡쳐"
                  className="mx-auto max-h-40 rounded-xl object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="font-data mt-3 text-xs font-medium text-mm-pink hover:underline"
                >
                  이미지 제거
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-2xl opacity-60">📸</span>
                <p className="text-sm font-medium text-mm-muted">
                  또는 증권앱 <span className="text-mm-text">캡쳐</span>를 여기에
                  드롭/클릭
                </p>
                <p className="font-data text-[10px] text-mm-muted/60">
                  JPG · PNG · WebP
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex gap-4 items-center">
            {hasSavedSession ? (
              <button
                type="button"
                onClick={onCancel}
                className="text-sm font-medium text-mm-muted underline-offset-4 transition hover:text-mm-primary hover:underline"
              >
                취소하고 돌아가기
              </button>
            ) : (
              <button
                type="button"
                onClick={onSkip}
                className="text-sm font-medium text-mm-muted underline-offset-4 transition hover:text-mm-primary hover:underline"
              >
                종목 없이 거시 브리핑만
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSubmit({ tickers, file })}
            disabled={!hasAnything}
            className="mm-pill bg-mm-primary px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-mm-primary/20 transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            에이전트 실행 →
          </button>
        </div>
      </div>
    </div>
  )
}
