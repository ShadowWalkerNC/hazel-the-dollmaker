import React from 'react';

export const YarnBallIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M4.5 9c2 1 5 1.5 8 .5s5-3 7-2" />
    <path d="M3.5 14c2-1 6-2 9-1s4.5 3.5 7.5 3.5" />
    <path d="M8.5 3.5c1 2 1.5 6 1 9.5s-2.5 6-1.5 7.5" />
    <path d="M15 4c-1 3-1.5 7-1 10s2.5 5 2 6" />
    <path d="M19 19c2 1.5 3 1 3.5 3" />
  </svg>
);

export const CrochetHookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Crochet hook shaft and hook tip */}
    <path d="M19.5 4.5c.8-.8 1.5-.5 1.5.5 0 1-1 2-2 2h-1l-13 13c-.8.8-2 .8-2.8 0s-.8-2 0-2.8L15 4.2h1.5c1 0 1.5-.5 1.5-1" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const WoodenButtonIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="7" strokeDasharray="2 2" strokeWidth="1" />
    <circle cx="9.5" cy="9.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="9.5" r="1" fill="currentColor" />
    <circle cx="9.5" cy="14.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="14.5" r="1" fill="currentColor" />
    {/* Thread criss-cross */}
    <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1" />
    <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const StitchPatternDivider: React.FC<{ className?: string; label?: string }> = ({
  className = '',
  label
}) => (
  <div className={`relative flex items-center justify-center py-4 my-2 ${className}`}>
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t-2 border-dashed border-pink-400/30" />
    </div>
    {label && (
      <div className="relative px-4 py-1 rounded-full bg-[#17141f] border border-pink-400/40 text-[11px] font-bold text-pink-300 tracking-wider uppercase flex items-center gap-1.5 shadow-md">
        <YarnBallIcon className="w-3.5 h-3.5 text-pink-400" />
        <span>{label}</span>
      </div>
    )}
  </div>
);

export const AmigurumiHeartIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    {/* Yarn thread accent inside heart */}
    <path d="M12 7c0 2-1.5 3-3 3" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
    <path d="M15 9c-1 1-2 3-1 4" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
  </svg>
);
