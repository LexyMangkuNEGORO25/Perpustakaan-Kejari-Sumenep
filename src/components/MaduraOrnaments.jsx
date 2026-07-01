export function KerapanSapi({ width = 240, height = 100, className = '' }) {
  return (
    <svg className={className} viewBox="0 0 240 100" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Kerapan Sapi Madura</title>

      {/* Bull 1 (front) */}
      <g opacity="0.9">
        <path d="M175 55 Q190 40 200 48 L215 38 L218 45 Q230 38 232 48 L225 58 Q218 55 215 62 L205 65 Q200 72 190 70 L180 68 Q175 65 178 58 Z"
          fill="#1e2d3d" />
        <path d="M215 38 Q220 25 232 30" stroke="#1e2d3d" strokeWidth="3" strokeLinecap="round" />
        <path d="M222 38 Q232 22 240 28" stroke="#1e2d3d" strokeWidth="3" strokeLinecap="round" />
        <circle cx="218" cy="44" r="2" fill="#c49a4a" />
      </g>

      {/* Bull 2 (back) */}
      <g opacity="0.85">
        <path d="M100 52 Q115 38 125 45 L140 35 L143 42 Q155 35 157 45 L150 55 Q143 52 140 59 L130 62 Q125 69 115 67 L105 65 Q100 62 103 55 Z"
          fill="#1e2d3d" />
        <path d="M140 35 Q145 22 157 27" stroke="#1e2d3d" strokeWidth="3" strokeLinecap="round" />
        <path d="M147 35 Q157 19 165 25" stroke="#1e2d3d" strokeWidth="3" strokeLinecap="round" />
        <circle cx="143" cy="41" r="2" fill="#c49a4a" />
      </g>

      {/* Chariot */}
      <g>
        <rect x="68" y="55" width="30" height="18" rx="3" fill="#1e2d3d" opacity="0.85" />
        <line x1="95" y1="62" x2="130" y2="55" stroke="#1e2d3d" strokeWidth="1.5" opacity="0.6" />
        <line x1="95" y1="62" x2="200" y2="58" stroke="#1e2d3d" strokeWidth="1.5" opacity="0.6" />
        <circle cx="80" cy="78" r="5" fill="none" stroke="#1e2d3d" strokeWidth="1.5" />
        <circle cx="80" cy="78" r="1.5" fill="#1e2d3d" />
      </g>

      {/* Driver */}
      <g>
        <circle cx="80" cy="38" r="7" fill="#1e2d3d" opacity="0.8" />
        <rect x="75" y="45" width="10" height="14" rx="2" fill="#1e2d3d" opacity="0.8" />
        <path d="M75 52 Q68 55 65 60" stroke="#1e2d3d" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M85 52 Q92 50 95 48" stroke="#1e2d3d" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <circle cx="80" cy="36" r="1.2" fill="#c49a4a" />
      </g>

      {/* Ground line */}
      <line x1="20" y1="85" x2="235" y2="85" stroke="#8b7355" strokeWidth="1" opacity="0.4" strokeDasharray="4 3" />
    </svg>
  )
}

export function Keris({ width = 40, height = 160, className = '' }) {
  return (
    <svg className={className} viewBox="0 0 40 160" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Keris Madura</title>

      {/* Handle top */}
      <path d="M16 0 Q20 -4 24 0 L24 10 L16 10 Z" fill="#1e2d3d" opacity="0.9" />

      {/* Handle body */}
      <rect x="16" y="10" width="8" height="24" rx="2" fill="#1e2d3d" opacity="0.85" />
      <circle cx="20" cy="16" r="3" fill="#c49a4a" />
      <ellipse cx="20" cy="26" rx="3" ry="1.5" fill="#c49a4a" opacity="0.5" />

      {/* Guard (ganja) */}
      <polygon points="8,34 32,34 35,42 5,42" fill="#1e2d3d" opacity="0.9" />
      <line x1="20" y1="34" x2="20" y2="42" stroke="#c49a4a" strokeWidth="0.8" opacity="0.5" />

      {/* Wavy blade */}
      <g>
        <path d="M13 42 L13 52 L27 52 L27 60 L13 60 L13 68 L27 68 L27 76 L13 76 L13 84 L27 84 L27 92 L13 92 L13 100 L27 100 L27 108 L13 108 L13 116 L27 116 L27 124 L13 124 L13 132 L27 132 L27 140 L20 150"
          stroke="#1e2d3d" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none" opacity="0.85" />
        <path d="M13 42 L27 42 L27 52 L13 52 L13 60 L27 60 L27 68 L13 68 L13 76 L27 76 L27 84 L13 84 L13 92 L27 92 L27 100 L13 100 L13 108 L27 108 L27 116 L13 116 L13 124 L27 124 L27 132 L13 132 L13 140 L20 150 L20 140 L27 140 L27 132 L13 132 Z"
          fill="#1e2d3d" opacity="0.7" />
      </g>
    </svg>
  )
}

export function BatikCorner({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Batik Corner Ornament</title>
      <path d="M5 40 L40 5 L75 40 L40 75 Z" fill="none" stroke="#c49a4a" strokeWidth="0.6" opacity="0.3" />
      <path d="M15 40 L40 15 L65 40 L40 65 Z" fill="none" stroke="#c49a4a" strokeWidth="0.4" opacity="0.25" />
      <path d="M25 40 L40 25 L55 40 L40 55 Z" fill="none" stroke="#1e2d3d" strokeWidth="0.3" opacity="0.2" />
      <circle cx="40" cy="40" r="3" fill="#c49a4a" opacity="0.3" />
      <circle cx="40" cy="5" r="2" fill="#1e2d3d" opacity="0.25" />
      <circle cx="40" cy="75" r="2" fill="#1e2d3d" opacity="0.25" />
      <circle cx="5" cy="40" r="2" fill="#1e2d3d" opacity="0.25" />
      <circle cx="75" cy="40" r="2" fill="#1e2d3d" opacity="0.25" />
      <circle cx="20" cy="20" r="1.5" fill="#8b7355" opacity="0.2" />
      <circle cx="60" cy="20" r="1.5" fill="#8b7355" opacity="0.2" />
      <circle cx="20" cy="60" r="1.5" fill="#8b7355" opacity="0.2" />
      <circle cx="60" cy="60" r="1.5" fill="#8b7355" opacity="0.2" />
    </svg>
  )
}
