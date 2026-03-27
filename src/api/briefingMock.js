/** 데모·폴백용 브리핑 페이로드 (스키마 기준) */
export const MOCK_BRIEFING_RESPONSE = {
  indicators: {
    dollar_index: { value: '104.2', change: '+0.8%', direction: 'up' },
    interest_rate: { value: '4.82%', change: '+0.05%', direction: 'up' },
    oil_wti: { value: '$71.3', change: '-1.2%', direction: 'down' },
  },
  portfolio_tickers: ['삼성전자', 'SK하이닉스'],
  risk_matrix: {
    currency: { score: 78, label: '환율 (달러↑)', severity: 'high' },
    interest_rate: { score: 52, label: '금리 변동', severity: 'medium' },
    trump_policy: { score: 71, label: '트럼프 정책', severity: 'high' },
    geopolitical: { score: 31, label: '지정학 리스크', severity: 'low' },
    oil: { score: 43, label: '유가', severity: 'medium' },
  },
  diversification_warning: {
    has_warning: true,
    message:
      '삼성전자, SK하이닉스 모두 달러강세와 미중갈등에 같은 방향으로 노출. 반도체 집중도 89%',
    concentration: '89%',
  },
  briefing:
    '오늘 달러인덱스가 0.8% 오르면서 신흥국 환율 압박이 다시 부각됐습니다. 국내 반도체는 수출 비중이 커서 환율 민감도가 높은 편이라, 달러 강세 뉴스만으로도 심리가 조금 무거워질 수 있어요.\n\n금리 쪽은 10년물이 소폭 올랐는데, 이건 "성장 둔화 vs 인플레 재점화" 논쟁이 아직 끝나지 않았다는 신호로 읽는 게 자연스럽습니다. 유가는 하루 단위로는 내렸지만, 지정학 리스크가 남아 있으면 변동성은 쉽게 사라지지 않습니다.\n\n포트폴리오 기준으로 보면, 오늘의 핵심은 "같은 거시 변수에 같은 방향으로 노출된 종목이 겹쳐 있는가"입니다. 역사적으로 비슷한 국면이 있었고, 그때 시장은 단기적으로 변동성을 키우며 방어적으로 재배치하는 패턴이 자주 나왔습니다.\n\n투자 추천이 아니라, 오늘 뉴스를 내 종목 렌즈로 정리한 판단 재료입니다.',
  historical_pattern: {
    event: '2018년 미중 무역전쟁',
    similarity: 73,
    what_happened:
      '당시 반도체 섹터는 이후 3개월간 변동성이 커졌고, 관세·환율 이슈가 겹칠 때 수출주 중심으로 조정이 나타났습니다.',
    current_implication:
      '지금도 달러·관세·지정학 이슈가 동시에 언급되는 국면이라, 과거 패턴과의 유사도를 참고할 만합니다.',
  },
  stock_details: {
    삼성전자:
      '반도체 섹터로 달러 강세에 직접 노출. 메모리 가격·수요 사이클과 환율이 함께 움직이는 구조.',
    SK하이닉스:
      'HBM·AI 수요 테마와 미중 기술 패권 리스크가 동시에 작동. 거시 이벤트에 따른 변동성에 민감.',
  },
}
