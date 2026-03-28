import React, { useMemo, useState } from 'react'

const MACRO_ICONS = {
  currency: '💵',
  interest_rate: '📈',
  trump_policy: '🇺🇸',
  geopolitical: '⚔️',
  oil: '🛢️',
}

const MACRO_COLORS = {
  currency: '#4361ee', // Blue
  interest_rate: '#4cc9f0', // Cyan
  trump_policy: '#f72585', // Pink
  geopolitical: '#7209b7', // Purple
  oil: '#3a0ca3', // Deep Blue
}

export default function PortfolioRiskNetwork({ data }) {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [hoveredLink, setHoveredLink] = useState(null)

  const { portfolio_tickers, portfolio_links, risk_matrix } = data

  const factors = useMemo(() => {
    return Object.keys(risk_matrix).map((key) => ({
      id: key,
      label: risk_matrix[key].label,
      score: risk_matrix[key].score,
      color: MACRO_COLORS[key] || '#cbd5e1',
      icon: MACRO_ICONS[key] || '🌐',
    }))
  }, [risk_matrix])

  const stocks = useMemo(() => {
    return (portfolio_tickers || []).map((ticker) => ({
      id: ticker,
      label: ticker,
    }))
  }, [portfolio_tickers])

  const links = useMemo(() => {
    return (portfolio_links || []).map((link, idx) => ({
      id: `link-${idx}`,
      source: link.source,
      target: link.target,
      reason: link.reason,
      strength: link.strength,
    }))
  }, [portfolio_links])

  // Layout constants
  const width = 800
  const height = Math.max(400, Math.max(factors.length, stocks.length) * 60)
  const factorX = 100
  const stockX = 700
  const nodeRadius = 22

  // Nodes
  const factorNodes = factors.map((f, i) => ({
    ...f,
    x: factorX,
    y: (height / (factors.length + 1)) * (i + 1),
    type: 'factor'
  }))

  // 섹터 노드 추가 (큼지막한 덩어리)
  const sectors = useMemo(() => {
    const sMap = {}
    links.forEach(l => {
      // AI가 분석한 뉴스 기반 섹터 정보를 가져오거나 기본 섹터 할당
      const sectorName = l.reason.split(' ')[0] || '관련 산업' 
      if (!sMap[sectorName]) sMap[sectorName] = { id: sectorName, label: sectorName, type: 'sector' }
    })
    return Object.values(sMap)
  }, [links])

  const sectorX = (factorX + stockX) / 2
  const sectorNodes = sectors.map((s, i) => ({
    ...s,
    x: sectorX,
    y: (height / (sectors.length + 1)) * (i + 1),
    color: '#4cc9f0'
  }))

  const stockNodes = stocks.map((s, i) => ({
    ...s,
    x: stockX,
    y: (height / (stocks.length + 1)) * (i + 1),
    type: 'stock',
    color: '#1a1a2e' // Dark Navy for stocks
  }))

  const allNodes = [...factorNodes, ...sectorNodes, ...stockNodes]

  const findNode = (id) => allNodes.find((n) => n.id === id)

  const activeLinks = links.filter((l) => {
    if (!hoveredNode) return true
    return l.source === hoveredNode || l.target === hoveredNode
  })

  return (
    <div className="mm-card overflow-hidden bg-white p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="text-lg font-extrabold text-mm-text">리스크 연결망</h3>
        <p className="text-sm text-mm-muted">
          거시 변수가 내 종목에 미치는 경로를 시각화합니다. 노드에 마우스를 올려 상세 이유를 확인하세요.
        </p>
      </div>

      <div className="relative overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto"
        >
          {/* Gradients */}
          <defs>
            {factors.map(f => (
              <linearGradient key={`grad-${f.id}`} id={`grad-${f.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={f.color} />
                <stop offset="100%" stopColor="#1a1a2e" />
              </linearGradient>
            ))}
          </defs>

          {/* Links */}
          <g>
            {activeLinks.map((link) => {
              const s = findNode(link.source)
              const t = findNode(link.target)
              if (!s || !t) return null

              const isActive = 
                !hoveredNode || 
                hoveredNode === link.source || 
                hoveredNode === link.target
              
              const isHighlighted = 
                hoveredLink === link.id || 
                (hoveredNode && (hoveredNode === link.source || hoveredNode === link.target))

              // Bezier curve points
              const cp1x = s.x + (t.x - s.x) / 2
              const cp2x = s.x + (t.x - s.x) / 2
              const path = `M ${s.x} ${s.y} C ${cp1x} ${s.y}, ${cp2x} ${t.y}, ${t.x} ${t.y}`

              return (
                <path
                  key={link.id}
                  d={path}
                  fill="none"
                  stroke={`url(#grad-${link.source})`}
                  strokeWidth={isHighlighted ? 4 : 2}
                  strokeOpacity={isActive ? (isHighlighted ? 0.8 : 0.3) : 0.05}
                  className="transition-all duration-300"
                  onMouseEnter={() => setHoveredLink(link.id)}
                  onMouseLeave={() => setHoveredLink(null)}
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g>
            {allNodes.map((node) => {
              const isStock = stocks.some(s => s.id === node.id)
              const isHovered = hoveredNode === node.id
              const hasActiveLink = links.some(l => 
                (l.source === node.id || l.target === node.id) && 
                (hoveredNode ? (l.source === hoveredNode || l.target === hoveredNode) : false)
              )
              
              const opacity = !hoveredNode || isHovered || hasActiveLink ? 1 : 0.2

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer transition-opacity duration-300"
                  style={{ opacity }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer Glow for Highlight */}
                  {isHovered && (
                    <circle
                      r={nodeRadius + 6}
                      fill={node.color || '#4361ee'}
                      opacity="0.2"
                    />
                  )}
                  
                  {/* Node Circle */}
                  <circle
                    r={nodeRadius}
                    fill="white"
                    stroke={node.color || '#cbd5e1'}
                    strokeWidth="3"
                    className="shadow-sm"
                  />
                  
                  {/* Icon/Text */}
                  <text
                    dy=".3em"
                    textAnchor="middle"
                    className="text-lg select-none"
                  >
                    {node.icon || (node.type === 'stock' ? '🏢' : node.type === 'sector' ? '📦' : node.label[0])}
                  </text>

                  {/* Label */}
                  <text
                    y={nodeRadius + 18}
                    textAnchor="middle"
                    className={`text-[11px] font-bold select-none ${isStock ? 'fill-mm-text' : 'fill-mm-primary'}`}
                    style={{ fill: node.color }}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>

        {/* Hover Info Overlay */}
        {hoveredNode || hoveredLink ? (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none">
            <div className="mm-card bg-white/95 backdrop-blur-sm p-4 shadow-xl border border-mm-primary/20 animate-in fade-in slide-in-from-bottom-2">
              {hoveredLink ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-mm-primary uppercase tracking-wider">연결 분석</span>
                  </div>
                  <p className="text-sm font-medium text-mm-text leading-relaxed">
                    {links.find(l => l.id === hoveredLink)?.reason}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-mm-primary uppercase tracking-wider">
                      {stocks.some(s => s.id === hoveredNode) ? '종목 정보' : '거시 변수'}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-mm-text mb-1">
                    {findNode(hoveredNode)?.label}
                  </h4>
                  <p className="text-sm text-mm-muted leading-relaxed">
                    {stocks.some(s => s.id === hoveredNode) 
                      ? `${hoveredNode}와 관련된 거시 변수 연결을 확인하세요.`
                      : risk_matrix[hoveredNode]?.why}
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-50">
            <p className="text-xs font-medium text-mm-muted">노드나 선에 마우스를 올려보세요</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 border-t border-mm-border pt-6">
        {factors.map(f => (
          <div key={f.id} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }}></span>
            <span className="text-xs font-bold text-mm-text">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
