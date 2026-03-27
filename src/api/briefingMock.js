/** 데모·폴백용 브리핑 페이로드 (스키마 기준) */
export const MOCK_BRIEFING_RESPONSE = {
  indicators: {
    dollar_index: { value: '105.2', change: '+1.2%', direction: 'up' },
    interest_rate: { value: '4.82%', change: '+0.05%', direction: 'up' },
    oil_wti: { value: '$71.3', change: '-1.2%', direction: 'down' },
  },
  portfolio_tickers: ['삼성전자', 'SK하이닉스', 'TSMC'],
  risk_matrix: {
    currency: { score: 78, label: '환율 (달러↑)', severity: 'high' },
    interest_rate: { score: 52, label: '금리 (금리↑)', severity: 'medium' },
    trump_policy: { score: 71, label: '트럼프 정책', severity: 'high' },
    geopolitical: { score: 31, label: '지정학 (전쟁)', severity: 'low' },
    oil: { score: 43, label: '유가', severity: 'medium' },
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
  },
  stock_details: {
    삼성전자:
      '반도체·메모리 사이클과 환율에 직접 노출. 수출 비중이 커서 달러 강세가 마진·수익성에 민감하게 연결.',
    SK하이닉스:
      'HBM·AI 수요 테마와 미중 기술 패권 리스크가 동시에 작동. 거시 이벤트에 따른 변동성에 민감.',
    TSMC: '글로벌 파운드리·지정학·공급망 리스크가 한 번에 묶여 있는 대표 수출주.',
  },
}
