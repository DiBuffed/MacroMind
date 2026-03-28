/** 데모·폴백용 브리핑 페이로드 (스키마 기준) */
export const MOCK_BRIEFING_RESPONSE = {
  indicators: {
    dollar_index: { value: '105.2', change: '+1.2%', direction: 'up' },
    interest_rate: { value: '4.82%', change: '+0.05%', direction: 'up' },
    oil_wti: { value: '$71.3', change: '-1.2%', direction: 'down' },
  },
  portfolio_tickers: ['삼성전자', 'SK하이닉스', 'TSMC'],
  portfolio_links: [
    { source: 'currency', target: '삼성전자', reason: '수출 비중이 높아 달러 강세 시 매출 확대 효과', strength: 'high' },
    { source: 'currency', target: 'SK하이닉스', reason: '글로벌 반도체 결제 대금 달러 기반, 환차익 발생', strength: 'medium' },
    { source: 'trump_policy', target: '삼성전자', reason: '미국 내 반도체 공장 보조금 및 관세 정책 영향', strength: 'high' },
    { source: 'trump_policy', target: 'SK하이닉스', reason: '대중국 반도체 장비 수출 규제 가능성', strength: 'medium' },
    { source: 'trump_policy', target: 'TSMC', reason: '대만 지정학 리스크와 미국 내 파운드리 경쟁력', strength: 'high' },
    { source: 'geopolitical', target: 'TSMC', reason: '대만해협 긴장 고조 시 파운드리 공급망 리스크', strength: 'high' },
    { source: 'interest_rate', target: '삼성전자', reason: '금리 인상 시 미래 이익 할인율 상승 부담', strength: 'low' },
    { source: 'oil', target: 'SK하이닉스', reason: '반도체 공정 내 에너지 비용 및 물류비 부담', strength: 'low' }
  ],
  risk_matrix: {
    currency: { score: 78, label: '환율 (달러↑)', severity: 'high', why: '달러가 강세면 수출 비중이 높은 반도체 종목은 원화 환산 수익이 늘지만, 수입 원자재 비용 상승과 외국인 매도 압력이 겹쳐 주가에 부담을 줍니다.' },
    interest_rate: { score: 52, label: '금리 (금리↑)', severity: 'medium', why: '금리가 오르면 기업 차입 비용이 올라가고, 미래 이익을 할인하는 비율이 높아져 성장주 밸류에이션에 부담을 줍니다.' },
    trump_policy: { score: 71, label: '트럼프 정책', severity: 'high', why: '관세·수출 규제 정책 변화가 반도체 수출 기업의 글로벌 공급망과 미국 매출에 직접 영향을 줍니다.' },
    geopolitical: { score: 31, label: '지정학 (전쟁)', severity: 'low', why: '현재 직접적 분쟁 확대 신호는 제한적이지만, 대만해협 리스크는 반도체 공급에 구조적 위험 요인입니다.' },
    oil: { score: 43, label: '유가', severity: 'medium', why: '유가 상승은 운송·물류 비용을 높이고, 소비자 지출 감소와 인플레이션을 자극합니다.' },
  },
  diversification_warning: {
    has_warning: true,
    message:
      '삼성전자, SK하이닉스, TSMC — 세 종목 모두 달러강세와 미중갈등에 같은 방향으로 노출되어 있습니다. 반도체 섹터 집중도 89%.',
    concentration: '89%',
  },
  briefing:
    '오늘 달러인덱스가 1.2% 상승했습니다. 당신의 포트폴리오는 환율(달러↑) 노출도가 78%로, 달러 강세 뉴스가 나오면 바로 체감되는 구조입니다. 반도체·수출 비중이 큰 종목이 겹쳐 있어서, 환율 변동이 “배경 소음”이 아니라 “앞줄 이슈”로 들어올 수 있어요.\n\n금리는 10년물 기준 소폭 상승 국면인데, 이건 성장 둔화 우려와 금리 인하 기대가 동시에 붙어 있는 전형적인 흔들림 구간입니다. 트럼프 정책(관세·재정) 쪽은 노출도 71%로 높게 잡혀 있어서, 무역·규제 헤드라인이 나올 때마다 변동성이 커질 수 있습니다.\n\n역사적으로 2022년 달러 강세 사이클 당시 반도체 섹터는 평균적으로 -23%대 조정이 나왔었고, 지금 패턴과의 유사도는 68%로 보입니다. 투자 추천이 아니라, “당신 종목 리스크가 오늘 뉴스와 어떻게 연결되는지”를 한 번에 보기 위한 판단 재료입니다.',
  historical_pattern: {
    event: '2022년 달러 강세 사이클',
    similarity: 68,
    what_happened:
      '당시 반도체 섹터는 평균적으로 -23%대 조정이 나왔고, 달러 강세·수출주 조정이 겹쳤습니다.',
    current_implication:
      '달러·관세·지정학 이슈가 동시에 언급되는 국면이라, 과거 유사 국면과 비교해 볼 만합니다.',
    then_vs_now:
      '2022년에는 연준이 금리를 급격히 올리던 시기여서 달러 강세와 주가 하락이 동시에 나왔지만, 지금은 금리 인하를 논의하는 국면이라 동일한 하락폭이 반복되긴 어렵습니다. 다만 달러 강세 자체는 수출주에 비슷한 방향의 압력을 줄 수 있습니다.',
  },
  stock_details: {
    삼성전자:
      '반도체·메모리 사이클과 환율에 직접 노출. 수출 비중이 커서 달러 강세가 마진·수익성에 민감하게 연결.',
    SK하이닉스:
      'HBM·AI 수요 테마와 미중 기술 패권 리스크가 동시에 작동. 거시 이벤트에 따른 변동성에 민감.',
    TSMC: '글로벌 파운드리·지정학·공급망 리스크가 한 번에 묶여 있는 대표 수출주.',
  },
  news_feed: [
    {
      headline: '달러인덱스 105 돌파, 원·달러 1,380원대 진입',
      region: 'international',
      summary:
        '미국 달러가 주요 통화 대비 강세를 보이면서 달러인덱스가 105를 넘겼습니다. 원·달러 환율도 1,380원대로 올라섰는데, 이는 수출 기업의 원화 환산 매출에 영향을 줄 수 있습니다.',
      ripple_effect:
        '달러가 강해지면 수입 물가가 올라가고, 한국처럼 수출 비중이 높은 경제에서는 기업 실적이 환율 방향에 따라 갈릴 수 있습니다.',
      historical_echo:
        '2022년 하반기에도 달러인덱스가 114까지 오르면서 원·달러 1,440원을 찍었고, 당시 반도체 수출주는 평균 20%대 조정이 나왔습니다.',
      affected_tickers: ['삼성전자', 'SK하이닉스', 'TSMC'],
      impact_explanation:
        '세 종목 모두 달러 표시 매출·원자재 비용 구조를 갖고 있어서, 환율이 급변하면 분기 실적 전망이 바뀔 수 있습니다. 특히 삼성전자는 수출 비중이 80% 이상이라 환율 민감도가 높습니다.',
      severity: 'high',
      macro_factors: ['currency'],
    },
    {
      headline: '트럼프, 반도체 관세 검토 시사 — "미국 제조업 보호"',
      region: 'international',
      summary:
        '트럼프 전 대통령이 반도체 수입에 대한 추가 관세를 검토하겠다고 밝혔습니다. 아직 확정은 아니지만, 글로벌 반도체 공급망에 긴장감이 돌고 있습니다.',
      ripple_effect:
        '관세가 실제로 부과되면 반도체 가격이 올라 소비자 부담이 커지고, 한국·대만 수출 기업은 미국 시장 접근이 어려워질 수 있습니다.',
      historical_echo:
        '2018~2019년 미중 무역전쟁 때 반도체·전자 부품에 25% 관세가 부과되었고, 당시 관련 기업 주가는 수개월간 15~30% 하락했습니다.',
      affected_tickers: ['삼성전자', 'SK하이닉스', 'TSMC'],
      impact_explanation:
        '세 종목 모두 미국 향 반도체 수출 비중이 크기 때문에, 관세가 현실화되면 판매 단가나 수요에 직접적인 영향을 받습니다. 특히 TSMC는 미국 내 공장을 짓고 있어 관세 회피 가능성이 있지만, 건설 비용이 늘어나는 부담도 있습니다.',
      severity: 'high',
      macro_factors: ['trump_policy', 'geopolitical'],
    },
    {
      headline: 'WTI 원유 $71대, OPEC+ 감산 유지 결정',
      region: 'international',
      summary:
        'OPEC+가 기존 감산 기조를 유지하기로 하면서 유가가 $71대를 유지하고 있습니다. 급등은 아니지만, 하방도 제한되어 있는 상황입니다.',
      ripple_effect:
        '유가가 안정되면 에너지 비용 부담은 줄지만, 인플레이션 압력이 다시 커질 여지도 남아 있습니다.',
      historical_echo: '',
      affected_tickers: [],
      impact_explanation: '',
      severity: 'low',
      macro_factors: ['oil'],
    },
    {
      headline: '코스피 2,600선 안착 시도, 외국인 순매수 전환',
      region: 'domestic',
      summary: '코스피 지수가 외국인의 매수세에 힘입어 2,600선 위에서 등락을 거듭하고 있습니다. 반도체와 자동차 대형주 위주로 매수세가 유입되는 모습입니다.',
      ripple_effect: '국내 증시의 투자 심리가 회복되면서 원화 가치 안정에도 긍정적인 영향을 줄 수 있습니다.',
      historical_echo: '',
      affected_tickers: ['삼성전자', '현대차'],
      impact_explanation: '삼성전자와 현대차는 코스피 비중이 높은 대표 종목으로, 지수 상승 시 동반 강세를 보이는 경향이 있습니다.',
      severity: 'medium',
      macro_factors: ['currency']
    },
    {
      headline: '한국은행, 기준금리 동결 결정 — "물가 추이 주시"',
      region: 'domestic',
      summary: '한국은행 금융통화위원회가 현재의 기준금리를 유지하기로 결정했습니다. 인플레이션 둔화 속도를 더 지켜보겠다는 신중한 입장입니다.',
      ripple_effect: '금리 동결로 기업들의 이자 부담 급증 우려는 덜었으나, 고금리 상황이 지속됨에 따라 내수 소비 위축 가능성은 여전합니다.',
      historical_echo: '과거 2010년대 중반 금리 정체기에도 내수주와 성장주 사이의 수익률 차별화가 뚜렷하게 나타난 바 있습니다.',
      affected_tickers: ['카카오', 'NAVER'],
      impact_explanation: '금리에 민감한 IT 성장주들은 금리 동결 소식에 안도하는 경향이 있지만, 인하 시점이 늦춰질 경우 반등 탄력이 약해질 수 있습니다.',
      severity: 'medium',
      macro_factors: ['interest_rate']
    },
    {
      headline: '미 10년물 금리 4.82%, 금리 인하 기대 후퇴',
      region: 'international',
      summary:
        '미국 국채 10년물 금리가 4.82%로 소폭 올랐습니다. 시장에서는 연준이 금리를 내릴 시기가 늦춰질 수 있다는 전망이 나오고 있습니다.',
      ripple_effect:
        '금리가 높게 유지되면 기업들의 자금 조달 비용이 올라가고, 특히 성장주(기술·반도체)의 밸류에이션에 부담을 줄 수 있습니다.',
      historical_echo:
        '2023년 10월에도 10년물이 5%에 근접했고, 당시 나스닥은 한 달간 -8%를 기록했습니다.',
      affected_tickers: ['삼성전자', 'SK하이닉스'],
      impact_explanation:
        '반도체 종목은 미래 실적에 대한 기대로 밸류에이션이 높은 편이라, 금리가 오르면 할인율이 높아져 주가에 하방 압력이 생길 수 있습니다. 쉽게 말해 "미래 수익의 현재 가치"가 줄어드는 겁니다.',
      severity: 'medium',
      macro_factors: ['interest_rate'],
    },
  ],
  macro_outlook: {
    summary:
      '단기(수주~수개월)로는 금리·환율 변동성이 뉴스 플로우를 지배할 가능성이 큽니다. 중기로는 성장 둔화 vs 완화 기대가 엇갈리는 국면에서 섹터별 차별화가 강해질 수 있습니다.',
    scenarios: [
      '달러·금리 동반 강세: 수출·달러표 매출 비중 큰 종목은 환차·금리 민감도가 커질 수 있음.',
      '지정학·무역 이슈 완화 시: 위험자산 선호와 함께 변동성 축소 시나리오.',
    ],
    watch_factors: ['FOMC·연준 발언', '원·달러', '반도체 재고·가격'],
  },
  portfolio_synthesis:
    '보유 종목은 반도체·수출 비중이 겹쳐 환율·미중 정책 뉴스에 동조될 여지가 큽니다. 거시 시나리오별로는 (1) 달러 강세 지속 시 마진·환율 이슈가 앞으로 나올 수 있고, (2) 금리 인하 기대 재점화 시 성장주 쏠림이 강해질 수 있습니다. 투자 권유가 아니라, 뉴스가 나올 때 어떤 축부터 점검할지 정리한 참고용입니다.',
}
