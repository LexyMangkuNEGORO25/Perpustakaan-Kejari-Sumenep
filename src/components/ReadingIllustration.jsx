function ReadingIllustration() {
  return (
    <div className="reading-illustration">
      <div className="reading-ill-bg">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="220" r="160" fill="rgba(196,154,74,0.06)" className="ripple-1" />
          <circle cx="200" cy="220" r="120" fill="rgba(30,45,61,0.04)" className="ripple-2" />
          <circle cx="200" cy="220" r="80" fill="rgba(196,154,74,0.04)" className="ripple-3" />
        </svg>
      </div>

      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="reading-ill-main">
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e2d3d" />
            <stop offset="100%" stopColor="#121f2c" />
          </linearGradient>
          <linearGradient id="bookGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c49a4a" />
            <stop offset="100%" stopColor="#a07e35" />
          </linearGradient>
        </defs>

        <g className="figure-group">
          <g className="legs-group">
            <path d="M170 260 C155 290 130 310 125 325 C120 340 130 345 145 340 C160 335 175 315 185 295" className="leg-left" />
            <path d="M230 260 C245 290 260 310 270 320 C280 330 275 340 260 338 C245 336 230 320 215 300" className="leg-right" />
            <path d="M155 280 C175 270 200 265 225 270 C240 273 250 285 240 295 C220 310 180 315 155 300 C145 294 148 284 155 280Z" className="legs-fill" />
          </g>

          <g className="body-group">
            <path d="M155 150 C155 115 165 100 200 100 C235 100 245 115 245 150 L245 260 C245 275 235 280 200 280 C165 280 155 275 155 260Z" className="body-shape" />
            <path d="M160 155 C160 125 168 110 200 110 C232 110 240 125 240 155 L240 250 C240 262 232 268 200 268 C168 268 160 262 160 250Z" className="body-inner" />
          </g>

          <g className="arm-left-group">
            <path d="M165 165 C145 180 135 200 140 220" className="arm-left" />
            <circle cx="140" cy="222" r="9" className="hand-left" />
          </g>

          <g className="arm-right-group">
            <path d="M235 165 C255 180 265 200 260 220" className="arm-right" />
            <circle cx="260" cy="222" r="9" className="hand-right" />
          </g>

          <g className="book-group">
            <path d="M130 218 L195 200 L195 260 L130 268Z" className="book-left" />
            <path d="M270 218 L205 200 L205 260 L270 268Z" className="book-right" />
            <path d="M130 218 L200 200 L270 218 L200 235Z" className="book-spine" />
            <line x1="200" y1="200" x2="200" y2="260" className="book-line" />
            <line x1="150" y1="215" x2="185" y2="207" className="book-text-line" />
            <line x1="150" y1="225" x2="185" y2="217" className="book-text-line" />
            <line x1="250" y1="215" x2="215" y2="207" className="book-text-line" />
            <line x1="250" y1="225" x2="215" y2="217" className="book-text-line" />
          </g>

          <g className="head-group">
            <circle cx="200" cy="82" r="35" className="head-shape" />
            <path d="M178 75 C185 62 215 62 222 75" className="hair-shape" />
            <circle cx="190" cy="78" r="2.5" className="eye-left" />
            <circle cx="210" cy="78" r="2.5" className="eye-right" />
            <path d="M194 90 C197 93 203 93 206 90" className="mouth" />
          </g>

          <g className="glow-group">
            <circle cx="200" cy="180" r="100" fill="url(#bookGrad)" className="book-glow" opacity="0.06" />
          </g>
        </g>
      </svg>

      <div className="reading-ill-sparkle">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="80" r="3" fill="#c49a4a" className="sparkle-1" />
          <circle cx="310" cy="100" r="2.5" fill="#c49a4a" className="sparkle-2" />
          <circle cx="80" cy="280" r="2" fill="#c49a4a" className="sparkle-3" />
          <circle cx="330" cy="300" r="3" fill="#c49a4a" className="sparkle-4" />
          <circle cx="150" cy="350" r="2" fill="#1e2d3d" className="sparkle-5" />
          <circle cx="280" cy="360" r="2.5" fill="#1e2d3d" className="sparkle-6" />
        </svg>
      </div>
    </div>
  )
}

export default ReadingIllustration