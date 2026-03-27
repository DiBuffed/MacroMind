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
      className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-mm-border bg-mm-alt/50 p-6 transition hover:border-mm-primary/40 hover:bg-mm-cyan/5"
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
            className="mx-auto max-h-48 rounded-xl object-contain"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="font-data mt-3 text-xs font-medium text-mm-pink"
          >
            이미지 제거
          </button>
        </div>
      ) : (
        <>
          <span className="mb-2 text-3xl">📸</span>
          <p className="text-center text-sm font-medium text-mm-text">
            증권사 앱 캡쳐를 올려주세요
          </p>
          <p className="font-data mt-2 text-xs text-mm-muted">
            드래그 앤 드롭 · JPG · PNG · WebP
          </p>
        </>
      )}
    </div>
  )
}
