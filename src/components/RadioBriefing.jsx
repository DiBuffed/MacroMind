export default function RadioBriefing({ text }) {
  const paragraphs = (text || '').split('\n').filter(Boolean)
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-mm-text/90">
      {paragraphs.length ? (
        paragraphs.map((p, i) => <p key={i}>{p}</p>)
      ) : (
        <p className="text-mm-muted">브리핑 텍스트가 없습니다.</p>
      )}
    </div>
  )
}
