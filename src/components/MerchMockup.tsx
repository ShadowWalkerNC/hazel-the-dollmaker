import React from 'react';

interface MerchMockupProps {
  type: 'tee' | 'hoodie' | 'sticker' | 'pin' | 'tote' | 'doll' | 'belt';
  title?: string;
  className?: string;
}

export const MerchMockup: React.FC<MerchMockupProps> = ({ type, className = '' }) => {
  // Realistic apparel and merchandise mockups featuring Hazel's official logo
  if (type === 'tee') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-[#0d0f17] rounded-xl overflow-hidden p-3 ${className}`}>
        {/* Subtle studio backdrop */}
        <div className="absolute inset-0 bg-radial from-purple-900/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Realistic T-Shirt Shape */}
        <svg viewBox="0 0 400 400" className="w-full h-full max-h-72 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="teeFabric" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2029" />
              <stop offset="50%" stopColor="#14161f" />
              <stop offset="100%" stopColor="#0d0e14" />
            </linearGradient>
            <linearGradient id="teeShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
            </linearGradient>
            <filter id="fabricNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" />
              <feComposite in2="SourceGraphic" in="gl" operator="in" />
            </filter>
          </defs>

          {/* T-Shirt Silhouette */}
          <path
            d="M 140 60 Q 200 85 260 60 L 330 115 L 295 160 L 260 145 L 265 350 L 135 350 L 140 145 L 105 160 L 70 115 Z"
            fill="url(#teeFabric)"
            stroke="#2e3240"
            strokeWidth="1.5"
          />
          {/* Collar Ribbing */}
          <path
            d="M 140 60 Q 200 95 260 60 Q 200 78 140 60 Z"
            fill="#252936"
            stroke="#3a3f52"
            strokeWidth="1"
          />
          {/* Sleeve Creases */}
          <path d="M 140 145 L 120 120" stroke="#000000" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M 260 145 L 280 120" stroke="#000000" strokeWidth="2" strokeOpacity="0.3" />
          {/* Side shadows for depth */}
          <path
            d="M 140 60 Q 200 85 260 60 L 330 115 L 295 160 L 260 145 L 265 350 L 135 350 L 140 145 L 105 160 L 70 115 Z"
            fill="url(#teeShadow)"
          />

          {/* Hazel Logo Graphic on Chest */}
          <g transform="translate(135, 125)">
            <image
              href="/hazel-logo.jpg"
              x="0"
              y="0"
              width="130"
              height="95"
              preserveAspectRatio="xMidYMid meet"
              className="rounded-md"
              style={{ mixBlendMode: 'screen', filter: 'contrast(1.15) brightness(1.05)' }}
            />
          </g>

          {/* Woven Hem Tag */}
          <rect x="250" y="342" width="12" height="8" fill="#ec4899" rx="1" />
        </svg>

        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-gray-800">
          6.5oz Heavy Cotton Tee
        </span>
      </div>
    );
  }

  if (type === 'hoodie') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-[#0d0f17] rounded-xl overflow-hidden p-3 ${className}`}>
        <svg viewBox="0 0 400 400" className="w-full h-full max-h-72 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="hoodieFabric" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1b1c24" />
              <stop offset="50%" stopColor="#12131a" />
              <stop offset="100%" stopColor="#0a0a0f" />
            </linearGradient>
          </defs>

          {/* Hoodie Body with Kangaroo Pocket */}
          <path
            d="M 130 70 L 270 70 L 350 140 L 305 185 L 270 165 L 275 360 L 125 360 L 130 165 L 95 185 L 50 140 Z"
            fill="url(#hoodieFabric)"
            stroke="#2b2d3b"
            strokeWidth="1.5"
          />

          {/* Hood Silhouette */}
          <path
            d="M 130 75 Q 200 30 270 75 Q 240 120 200 120 Q 160 120 130 75 Z"
            fill="#222430"
            stroke="#363a4c"
            strokeWidth="1.2"
          />

          {/* Drawstrings */}
          <path d="M 185 115 Q 183 150 180 175" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 215 115 Q 217 150 220 175" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Kangaroo Pocket */}
          <path
            d="M 155 240 L 245 240 L 260 310 L 140 310 Z"
            fill="#181922"
            stroke="#2f3242"
            strokeWidth="1"
          />

          {/* Logo on Chest */}
          <g transform="translate(138, 130)">
            <image
              href="/hazel-logo.jpg"
              x="0"
              y="0"
              width="124"
              height="90"
              preserveAspectRatio="xMidYMid meet"
              style={{ mixBlendMode: 'screen', filter: 'contrast(1.15) brightness(1.05)' }}
            />
          </g>

          {/* Ribbed Hem & Cuffs */}
          <rect x="125" y="348" width="150" height="12" fill="#161720" stroke="#2b2d3b" strokeWidth="0.8" />
        </svg>

        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-gray-800">
          450 GSM Heavy Fleece
        </span>
      </div>
    );
  }

  if (type === 'sticker') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-[#0d0f17] rounded-xl overflow-hidden p-4 ${className}`}>
        {/* Holographic sticker with glossy border */}
        <div className="relative p-2 rounded-2xl bg-gradient-to-tr from-pink-400 via-cyan-300 to-purple-500 shadow-2xl shadow-pink-500/20 transform hover:rotate-1 transition-transform">
          <div className="bg-white p-1 rounded-[14px]">
            <div className="rounded-[10px] overflow-hidden bg-[#10121a] p-2 flex items-center justify-center">
              <img
                src="/hazel-logo.jpg"
                alt="Die-cut holographic sticker"
                className="w-48 h-auto object-contain drop-shadow-[0_5px_15px_rgba(236,72,153,0.4)]"
              />
            </div>
          </div>
          {/* Holographic sheen line */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none transform -skew-x-12" />
        </div>

        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-gray-300 bg-black/70 px-2 py-0.5 rounded border border-gray-700">
          Die-Cut Vinyl (Set of 5)
        </span>
      </div>
    );
  }

  if (type === 'pin') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-[#0d0f17] rounded-xl overflow-hidden p-4 ${className}`}>
        {/* Hard Enamel Pin on Backing Card */}
        <div className="w-56 h-72 rounded-2xl bg-gradient-to-b from-[#181a28] to-[#0f1019] border-2 border-purple-500/40 p-4 flex flex-col items-center justify-between shadow-2xl relative">
          {/* Card Header */}
          <div className="text-center">
            <span className="text-[9px] font-extrabold tracking-widest uppercase text-pink-400">
              Limited Edition • 250 Made
            </span>
            <div className="text-xs font-black text-white font-['Russo_One',sans-serif]">
              HAZEL THE DOLLMAKER
            </div>
          </div>

          {/* The Pin Itself: Gold metal with purple enamel & star */}
          <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 shadow-xl shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#12141f] border-2 border-amber-400 p-2 flex flex-col items-center justify-center overflow-hidden">
              <span className="text-3xl animate-pulse">⭐</span>
              <span className="text-[9px] font-black text-amber-300 mt-1 uppercase tracking-wider">
                Yarn Magic
              </span>
            </div>
            {/* Metallic shine reflection */}
            <div className="absolute top-1 left-3 w-8 h-8 rounded-full bg-white/20 blur-[1px] pointer-events-none" />
          </div>

          {/* Card Footer */}
          <div className="text-center space-y-0.5">
            <div className="text-[10px] font-bold text-gray-300">Hard Enamel Pin</div>
            <div className="text-[9px] text-gray-400">Double clutch • Gold plated</div>
          </div>
        </div>

        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-gray-300 bg-black/70 px-2 py-0.5 rounded border border-gray-700">
          Gold Plated Enamel
        </span>
      </div>
    );
  }

  if (type === 'tote') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-[#0d0f17] rounded-xl overflow-hidden p-3 ${className}`}>
        <svg viewBox="0 0 400 400" className="w-full h-full max-h-72 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="toteCanvas" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3ede2" />
              <stop offset="100%" stopColor="#dfd6c5" />
            </linearGradient>
          </defs>

          {/* Handles */}
          <path
            d="M 150 170 Q 150 40 200 40 Q 250 40 250 170"
            stroke="#3a2f26"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />

          {/* Canvas Bag Body */}
          <path
            d="M 100 160 L 300 160 L 285 360 L 115 360 Z"
            fill="url(#toteCanvas)"
            stroke="#c8beac"
            strokeWidth="1.5"
          />

          {/* Seams */}
          <line x1="120" y1="175" x2="120" y2="350" stroke="#c0b5a0" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="280" y1="175" x2="280" y2="350" stroke="#c0b5a0" strokeWidth="1" strokeDasharray="3,3" />

          {/* Logo printed on Tote */}
          <g transform="translate(120, 200)">
            <image
              href="/hazel-logo.jpg"
              x="0"
              y="0"
              width="160"
              height="110"
              preserveAspectRatio="xMidYMid meet"
              style={{ filter: 'contrast(1.1) brightness(0.95)' }}
            />
          </g>
        </svg>

        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-gray-800">
          12oz Natural Canvas
        </span>
      </div>
    );
  }

  // Fallback for dolls or belts: Craft Studio preview
  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center bg-[#10121d] rounded-xl overflow-hidden p-4 border border-gray-800 ${className}`}>
      <div className="relative w-32 h-32 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-4xl mb-2 shadow-inner">
        🪡
        <div className="absolute -bottom-1 -right-1 text-2xl">🏆</div>
      </div>
      <div className="text-center">
        <span className="text-xs font-bold text-purple-300">100% Freehand Crochet</span>
        <p className="text-[10px] text-gray-400">Made to order in Hazel's Maine studio</p>
      </div>
    </div>
  );
};
