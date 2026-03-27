import { useCallback } from 'react'

export default function ImageUploadZone({ previewUrl, onFile, onClear }) {
  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      const f = e.dataTransfer?.files?.[0]
      if (f && f.type.startsWith('image/')) onFile(f)
    },
    [onFile],
  )

  return (
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
      className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-mm-border bg-mm-surface/50 p-6 transition hover:border-mm-accent/40 hover:bg-mm-surface"
    >
      <input
        id="mm-portfolio-file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
        }}
      />
      {previewUrl ? (
        <div className="relative w-full">
          <img
            src={previewUrl}
            alt="포트폴리오 캡쳐"
            className="mx-auto max-h-48 rounded object-contain"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="font-data mt-3 text-xs text-mm-warning"
          >
            이미지 제거
          </button>
        </div>
      ) : (
        <>
          <span className="mb-2 text-2xl">📸</span>
          <p className="text-center text-sm text-mm-muted">
            증권사 앱 캡쳐를 올려주세요
          </p>
          <p className="font-data mt-2 text-xs text-mm-muted/70">
            드래그 앤 드롭 · JPG · PNG
          </p>
        </>
      )}
    </div>
  )
}
