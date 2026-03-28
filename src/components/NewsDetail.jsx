import React from 'react'
import { MACRO_FACTOR_LABEL } from '../lib/macroFactorKeywords.js'

function SeverityBadge({ severity }) {
  const map = {
    high: { text: '중요', cls: 'bg-mm-pink text-white border-mm-pink' },
    medium: { text: '주의', cls: 'bg-mm-warning text-white border-mm-warning' },
    low: { text: '참고', cls: 'bg-mm-primary text-white border-mm-primary' },
  }
  const s = map[severity] || map.low
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${s.cls}`}>
      {s.text}
    </span>
  )
}

function MacroTag({ factorKey }) {
  const label = MACRO_FACTOR_LABEL[factorKey] || factorKey
  return (
    <span className="rounded-full bg-mm-alt px-3 py-1 text-xs font-bold text-mm-muted border border-mm-border">
      {label}
    </span>
  )
}

export default function NewsDetail({ item }) {
  if (!item) return (
    <div className="flex h-full items-center justify-center text-mm-muted text-sm">
      분석할 뉴스를 선택해 주세요.
    </div>
  )

  const hasAffected = item.affected_tickers?.length > 0
  const hasHistory = item.historical_echo?.trim()

  // 요약 문장을 불렛 포인트로 변환 (마침표 기준)
  const bullets = item.summary.split('. ').filter(s => s.trim()).map(s => s.endsWith('.') ? s : s + '.')

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* 제목 및 헤더 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SeverityBadge severity={item.severity} />
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
              item.region === 'domestic' 
                ? 'text-mm-primary border-mm-primary/20 bg-mm-primary/5' 
                : 'text-mm-pink border-mm-pink/20 bg-mm-pink/5'
            }`}>
              {item.region === 'domestic' ? '국내' : '해외'}
            </span>
          </div>
          <span className="text-xs text-mm-muted">8시간 전</span>
        </div>
        <h2 className="text-xl font-black leading-tight text-mm-text sm:text-2xl">
          {item.headline}
        </h2>
      </div>

      {/* 왜 올랐을까 (토스 스타일) */}
      <div className="mm-card bg-mm-alt/30 p-6 sm:p-8">
        <h4 className="mb-4 text-base font-black text-mm-text">왜 그랬을까</h4>
        <ul className="space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-mm-text/90">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mm-muted/40"></span>
              {b}
            </li>
          ))}
          {item.ripple_effect && (
            <li className="flex items-start gap-3 text-sm leading-relaxed text-mm-text/90 font-medium">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mm-primary"></span>
              {item.ripple_effect}
            </li>
          )}
        </ul>

        {/* 키워드 태그 */}
        <div className="mt-8 flex flex-wrap gap-2">
          {item.macro_factors?.map(f => (
            <MacroTag key={f} factorKey={f} />
          ))}
          <span className="text-xs text-mm-muted/60 self-center ml-2">🌐 3개 출처 분석</span>
        </div>
      </div>

      {/* 연관 종목 및 내 종목 영향 */}
      {hasAffected && (
        <div className="space-y-4">
          <h4 className="text-sm font-black text-mm-muted uppercase tracking-wider">연관 기업 분석</h4>
          <div className="grid gap-3">
            {item.affected_tickers.map(ticker => (
              <div key={ticker} className="mm-card flex flex-col bg-white p-5 border border-mm-border hover:border-mm-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-mm-alt flex items-center justify-center text-lg shadow-inner">🏢</div>
                    <div>
                      <h5 className="text-sm font-bold text-mm-text">{ticker}</h5>
                      <p className="text-[10px] text-mm-primary font-black uppercase">내 포트폴리오 영향권</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-mm-pink">+0.4%</p>
                    <p className="text-[10px] text-mm-muted italic">Market Data</p>
                  </div>
                </div>
                
                {/* 구체적인 영향 설명 (복구) */}
                {item.impact_explanation && (
                  <div className="rounded-xl bg-mm-alt/40 p-4">
                    <p className="text-xs leading-relaxed text-mm-text/85">
                      <span className="font-bold text-mm-primary mr-1">분석:</span>
                      {item.impact_explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 과거 사례 */}
      {hasHistory && (
        <div className="rounded-2xl border border-mm-warning/20 bg-mm-warning/[0.02] p-6">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-mm-warning">Historical Echo</p>
          <p className="text-sm leading-relaxed text-mm-text/85">
            {hasHistory}
          </p>
        </div>
      )}
    </div>
  )
}
