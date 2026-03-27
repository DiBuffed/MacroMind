import { useState } from 'react'
import {
  MACRO_FACTOR_LABEL,
  MACRO_FACTOR_ORDER,
} from '../lib/macroFactorKeywords.js'

function severityBg(severity, active) {
  const base =
    severity === 'high'
      ? 'bg-gradient-to-br from-mm-pink/25 to-red-500/15 border-mm-pink/35'
      : severity === 'medium'
        ? 'bg-gradient-to-br from-mm-yellow/20 to-amber-400/10 border-mm-yellow/40'
        : 'bg-gradient-to-br from-mm-cyan/15 to-mm-primary/10 border-mm-cyan/30'
  return active ? `${base} ring-2 ring-mm-primary/40` : base
}

function severityCaption(severity) {
  if (severity === 'high') return '노출 높음'
  if (severity === 'medium') return '주의'
  return '상대적 양호'
}

const FACTOR_EXPLAINERS = {
  currency:
    '환율은 원화와 달러 등 외국 통화의 교환 비율입니다. 달러가 비싸지면(환율 상승) 수입품 가격이 오르고, 수출 기업은 같은 달러 매출을 원화로 바꿀 때 더 많이 받지만, 원자재 비용도 함께 오릅니다.',
  interest_rate:
    '금리는 돈을 빌리는 비용입니다. 금리가 오르면 기업이 투자할 때 비용이 커지고, 미래 수익을 현재 가치로 환산할 때 덜 가치있게 되어 주가(특히 성장주)에 부담을 줍니다.',
  trump_policy:
    '미국 대통령의 관세·무역·보조금 정책은 글로벌 공급망에 직접 영향을 줍니다. 관세가 올라가면 수출품 가격 경쟁력이 떨어지고, 규제 변화는 특정 산업 전체의 판도를 바꿀 수 있습니다.',
  geopolitical:
    '전쟁·분쟁·국가 간 긴장은 공급망 중단, 원자재 가격 급등, 투자자 심리 악화를 일으킵니다. 예를 들어 대만 리스크가 커지면 전 세계 반도체 공급에 문제가 생길 수 있습니다.',
  oil: '유가는 에너지·운송·물류 비용에 직결됩니다. 유가가 오르면 거의 모든 기업의 운영비가 올라가고, 소비자 지출이 줄며, 물가(인플레이션)를 자극하는 요인이 됩니다.',
}

export default function MacroSnapshotHeatmap({ riskMatrix }) {
  const [openKey, setOpenKey] = useState(null)

  return (
    <div className="overflow-x-auto rounded-2xl border border-mm-border bg-white">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-5 gap-px bg-mm-border">
          {MACRO_FACTOR_ORDER.map((key) => {
            const row = riskMatrix?.[key]
            const label = row?.label || MACRO_FACTOR_LABEL[key] || key
            const score = Math.min(100, Math.max(0, Number(row?.score) || 0))
            const sev = row?.severity || 'low'
            const isOpen = openKey === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setOpenKey(isOpen ? null : key)}
                className={`flex min-h-[100px] cursor-pointer flex-col justify-between border border-transparent p-3 text-left transition-all sm:p-4 ${severityBg(sev, isOpen)}`}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-mm-muted sm:text-[11px]">
                  {label}
                </p>
                <p className="font-data text-2xl font-bold tabular-nums text-mm-text sm:text-3xl">
                  {score}%
                </p>
                <p className="text-[10px] font-medium text-mm-text/80 sm:text-xs">
                  {severityCaption(sev)}
                </p>
                <p className="mt-1 text-[9px] text-mm-primary/70">
                  {isOpen ? '닫기' : '이게 뭔가요?'}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {openKey && (
        <div className="border-t border-mm-primary/15 bg-mm-primary/[0.03] px-5 py-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-mm-primary">
            {riskMatrix?.[openKey]?.label || MACRO_FACTOR_LABEL[openKey]} — 이게 뭔가요?
          </p>
          <p className="mb-3 text-sm leading-relaxed text-mm-text/85">
            {FACTOR_EXPLAINERS[openKey]}
          </p>
          {riskMatrix?.[openKey]?.why && (
            <div className="rounded-xl border border-mm-border bg-white/60 px-4 py-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-mm-warning">
                오늘 내 포트폴리오에는?
              </p>
              <p className="text-sm leading-relaxed text-mm-text/85">
                {riskMatrix[openKey].why}
              </p>
            </div>
          )}
        </div>
      )}

      <p className="border-t border-mm-border bg-mm-alt/50 px-4 py-2 text-[11px] text-mm-muted">
        각 항목을 눌러보세요. 이 변수가 무엇이고, 왜 내 종목에 영향을 주는지 설명합니다.
      </p>
    </div>
  )
}
