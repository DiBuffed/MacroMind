export default function LandingScreen({
  onStart,
  previewTickers,
}) {
  const tickers = String(previewTickers || '')
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6)

  const sampleNews = [
    {
      headline: '달러 강세 재점화 — 원·달러 1,3xx원대',
      why: '외국인 수급·수출주 실적·원자재 비용까지 동시에 흔들립니다.',
      region: '해외',
      sector: '수출/반도체',
      tags: ['환율', '달러'],
    },
    {
      headline: '미 국채금리 재상승 — 금리 인하 기대 후퇴',
      why: '성장주 밸류에이션과 대출·소비 흐름에 직접 영향이 큽니다.',
      region: '해외',
      sector: '빅테크/성장',
      tags: ['금리', '유동성'],
    },
    {
      headline: '유가 반등 — 물류·항공·정유에 혼재 신호',
      why: '인플레이션과 마진이 같이 움직여 섹터 간 희비가 갈립니다.',
      region: '해외',
      sector: '에너지/운송',
      tags: ['유가', '인플레'],
    },
    {
      headline: '관세/규제 이슈 재부상 — 공급망 리스크 확대',
      why: '섹터 단위로 비용·수요·수출 경로가 바뀌며 변동성이 커집니다.',
      region: '해외',
      sector: '제조/공급망',
      tags: ['관세', '지정학'],
    },
  ]

  const clusters = [
    {
      name: '달러·금리',
      driver: '달러 강세 + 금리 상승이 위험자산에 부담',
      risk: '지표 둔화 시 급격한 되돌림 가능',
      count: 6,
      chips: ['환율', '금리', '수급'],
    },
    {
      name: 'AI/반도체',
      driver: '투자 사이클은 유지, 변동성은 확대',
      risk: '정책/관세 리스크가 실적 가시성을 흔듦',
      count: 4,
      chips: ['반도체', '관세', '밸류'],
    },
    {
      name: '원자재·에너지',
      driver: '유가/원자재가 비용·물가에 재차 영향',
      risk: '수요 둔화 시 가격 급락 리스크',
      count: 5,
      chips: ['유가', '물가', '운송'],
    },
  ]

  const modules = [
    {
      key: 'one-take',
      title: '오늘의 관점',
      body: [
        '결론: 오늘은 “뉴스”보다 “흐름”이 더 중요합니다.',
        '근거: 달러·금리·정책이 동시에 움직이면 섹터 단위로 쏠림이 생깁니다.',
        '주의: 단기 변동은 커질 수 있어 “왜”의 연결 고리를 먼저 확인하세요.',
      ],
    },
    {
      key: 'checklist',
      title: '직장인 체크리스트',
      body: [
        '환율이 오르면: 수출주·원자재·외국인 수급 경로를 먼저 보기',
        '금리가 오르면: 성장주·금융·소비의 민감도 차이를 보기',
        '정책/관세가 나오면: 공급망·마진·대체 수요가 어디로 이동하는지 보기',
      ],
    },
  ]

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <section className="grid grid-cols-1 gap-10 rounded-3xl border border-mm-border bg-white p-8 shadow-mm-card sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="mm-pill bg-mm-primary/10 px-4 py-1.5 text-xs font-black tracking-widest text-mm-primary uppercase">
                MacroMind
              </span>
              <span className="text-xs font-bold text-mm-muted">
                뉴스 → 거시/섹터 → 내 종목
              </span>
            </div>
            <h1 className="text-3xl font-[900] leading-[1.12] tracking-tight text-mm-text sm:text-5xl">
              뉴스는 많고 시간은 없다.
              <br />
              <span className="text-mm-primary">에이전트</span>에게 맡기자.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-mm-text/75 sm:text-lg">
              출근길 5분. 에이전트가 오늘의 뉴스를 이해하기 쉽게 요약하고,
              거시/섹터 흐름으로 묶어, 내 종목에 왜 영향을 주는지 연결합니다.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStart}
                className="mm-pill bg-mm-primary px-7 py-3 text-sm font-black text-white shadow-[0_14px_44px_rgba(67,97,238,0.28)] transition hover:scale-[1.02] hover:shadow-[0_18px_56px_rgba(67,97,238,0.35)] active:scale-[0.98]"
              >
                에이전트 실행 →
              </button>
              <button
                type="button"
                onClick={() => scrollTo('landing-my')}
                className="text-sm font-bold text-mm-muted underline underline-offset-4 hover:text-mm-text"
              >
                내 종목부터 보기
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTo('landing-news')}
                className="mm-pill bg-mm-alt px-4 py-2 text-xs font-black text-mm-text"
              >
                1) 뉴스
              </button>
              <span className="text-xs font-black text-mm-muted">→</span>
              <button
                type="button"
                onClick={() => scrollTo('landing-macro')}
                className="mm-pill bg-mm-alt px-4 py-2 text-xs font-black text-mm-text"
              >
                2) 거시/섹터
              </button>
              <span className="text-xs font-black text-mm-muted">→</span>
              <button
                type="button"
                onClick={() => scrollTo('landing-my')}
                className="mm-pill bg-mm-alt px-4 py-2 text-xs font-black text-mm-text"
              >
                3) 내 종목
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-mm-border bg-mm-alt/40 p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-mm-muted">
                오늘의 한 줄
              </p>
              <p className="mt-2 text-base font-extrabold leading-snug text-mm-text">
                달러·금리·정책이 동시에 움직이면,
                섹터가 먼저 흔들리고 종목이 뒤따릅니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['뉴스', '지표', '섹터'].map((t) => (
                  <span
                    key={t}
                    className="mm-pill bg-white px-3 py-1 text-[11px] font-bold text-mm-muted border border-mm-border"
                  >
                    근거: {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-mm-border bg-white p-4">
                <p className="text-xs font-black text-mm-primary">오늘의 추천 루트</p>
                <p className="mt-1 text-sm leading-relaxed text-mm-text/80">
                  뉴스 4개 → 클러스터 3개 → 내 종목 영향
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="landing-news" className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-mm-muted">
                News
              </p>
              <h2 className="mt-2 text-2xl font-black text-mm-text">
                9시 뉴스 스냅샷
              </h2>
            </div>
            <button
              type="button"
              onClick={() => scrollTo('landing-macro')}
              className="text-sm font-bold text-mm-primary underline underline-offset-4"
            >
              흐름(거시/섹터)로 묶기 →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sampleNews.map((n) => (
              <button
                key={n.headline}
                type="button"
                onClick={() => scrollTo('landing-macro')}
                className="mm-card w-full border border-mm-border bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="mm-pill bg-mm-primary/10 px-3 py-1 text-[10px] font-black text-mm-primary">
                    {n.sector}
                  </span>
                  <span className="mm-pill bg-mm-alt px-3 py-1 text-[10px] font-black text-mm-muted">
                    {n.region}
                  </span>
                  {n.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="mm-pill bg-mm-alt px-3 py-1 text-[10px] font-bold text-mm-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-extrabold leading-snug text-mm-text">
                  {n.headline}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mm-text/75">
                  <span className="font-bold text-mm-primary">왜 중요?</span> {n.why}
                </p>
                <div className="mt-4 text-xs font-black text-mm-primary">
                  흐름으로 연결 →
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="landing-macro" className="mt-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-mm-muted">
                Macro / Sector
              </p>
              <h2 className="mt-2 text-2xl font-black text-mm-text">
                뉴스를 ‘흐름’으로 묶기
              </h2>
            </div>
            <button
              type="button"
              onClick={() => scrollTo('landing-my')}
              className="text-sm font-bold text-mm-primary underline underline-offset-4"
            >
              내 종목에 적용하기 →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {clusters.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => scrollTo('landing-my')}
                className="mm-card w-full border border-mm-border bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-mm-text">{c.name}</h3>
                  <span className="mm-pill bg-mm-primary/10 px-3 py-1 text-[10px] font-black text-mm-primary">
                    관련 뉴스 {c.count}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-sm leading-relaxed text-mm-text/80">
                    <span className="font-bold text-mm-primary">드라이버</span> {c.driver}
                  </p>
                  <p className="text-sm leading-relaxed text-mm-text/80">
                    <span className="font-bold text-mm-pink">리스크</span> {c.risk}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.chips.map((t) => (
                    <span
                      key={t}
                      className="mm-pill bg-mm-alt px-3 py-1 text-[10px] font-bold text-mm-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 text-xs font-black text-mm-primary">
                  내 종목 영향 보기 →
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="landing-my" className="mt-16">
          <div className="mb-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-mm-muted">
              My Stocks
            </p>
            <h2 className="mt-2 text-2xl font-black text-mm-text">
              내 종목에 바로 적용
            </h2>
          </div>

          <div className="mm-card border border-mm-border bg-white p-7">
            {tickers.length ? (
              <div>
                <p className="text-sm font-bold text-mm-text">
                  현재 저장된 종목
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tickers.map((t) => (
                    <span
                      key={t}
                      className="mm-pill bg-mm-alt px-4 py-2 text-xs font-black text-mm-text border border-mm-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-mm-muted">
                  이제 오늘의 뉴스/섹터 흐름에서 <span className="font-bold text-mm-text">왜</span> 영향을 받는지 연결해 드립니다.
                </p>
                <button
                  type="button"
                  onClick={onStart}
                  className="mt-6 mm-pill bg-mm-primary px-7 py-3 text-sm font-black text-white shadow-[0_14px_44px_rgba(67,97,238,0.28)] transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  내 종목 영향 확인하기 →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-black text-mm-text">
                    내 종목을 추가하면 영향만 골라 보여줘요.
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-mm-muted">
                    관심 종목을 넣으면 오늘 뉴스/섹터 흐름에서 바로 연결해드립니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStart}
                  className="mm-pill bg-mm-primary px-7 py-3 text-sm font-black text-white shadow-[0_14px_44px_rgba(67,97,238,0.28)] transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  종목 추가하고 시작 →
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {modules.map((m) => (
            <div
              key={m.key}
              className="mm-card border border-mm-border bg-white p-7"
            >
              <h3 className="text-base font-black text-mm-text">{m.title}</h3>
              <ul className="mt-4 space-y-2">
                {m.body.map((line, i) => (
                  <li key={i} className="text-sm leading-relaxed text-mm-text/75">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={onStart}
            className="mm-pill bg-mm-primary px-10 py-4 text-base font-black text-white shadow-[0_18px_56px_rgba(67,97,238,0.3)] transition hover:scale-[1.02] active:scale-[0.98]"
          >
            오늘 흐름 보러 가기 →
          </button>
          <p className="mt-3 text-xs font-bold text-mm-muted">
            투자 추천이 아닌 정보 제공 목적입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
