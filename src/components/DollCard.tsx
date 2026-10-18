import React, { useState } from 'react';
import { Heart, Tag, ExternalLink } from 'lucide-react';
import type { DollItem } from '../types';
import { InstagramIcon } from './InstagramIcon';
import { sounds } from '../utils/audio';

interface DollCardProps {
  doll: DollItem;
  onSelect: (doll: DollItem) => void;
  onLike: (id: string) => void;
}

export const DollCard: React.FC<DollCardProps> = ({ doll, onSelect, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsLiked(true);
      onLike(doll.id);
      sounds.playLikeChime();
    }
  };

  const categoryLabels: Record<string, { label: string; color: string }> = {
    'ringside-gift': { label: 'Ringside Gift', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    'champion': { label: 'Champion Likeness', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    'indie-favorite': { label: 'Indie Favorite', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    'custom-commission': { label: 'Commission', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  };

  return (
    <div
      onClick={() => onSelect(doll)}
      className="group relative bg-[#11131c] rounded-xl border border-white/10 hover:border-purple-500/40 transition-all duration-200 flex flex-col overflow-hidden shadow-lg hover:shadow-purple-950/20 cursor-pointer"
    >
      {/* Top Media / Art Card Banner */}
      <div className="relative w-full aspect-[16/10] bg-[#0b0c13] overflow-hidden flex flex-col justify-between p-4 border-b border-white/[0.06]">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between relative z-10">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${categoryLabels[doll.category]?.color || 'bg-purple-500/20 text-purple-300 border-purple-500/30'}`}>
            {categoryLabels[doll.category]?.label || 'Likeness'}
          </span>

          <span className="text-[10px] font-bold text-gray-400 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
            {doll.date}
          </span>
        </div>

        {/* Centerpiece Iconography */}
        <div className="my-auto py-2 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl p-[1px] bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
            <div className="w-full h-full rounded-[11px] bg-[#0d0e15] flex items-center justify-center text-xl">
              🪡
            </div>
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              {doll.wrestlerName}
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              {doll.promotion}
            </div>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="text-[10px] text-pink-400 font-semibold text-center pt-1 border-t border-white/[0.04]">
          100% Freehand • Handcrafted in Maine
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {doll.wrestlerName}
          </h3>
          <p className="text-xs text-pink-400 font-medium line-clamp-1 mb-2">
            {doll.dollTitle}
          </p>

          {/* Ringside Quote / Story snippet */}
          <p className="text-xs text-gray-400 line-clamp-2 italic bg-black/40 p-2 rounded-lg border border-white/[0.04] mb-3 leading-relaxed">
            "{doll.story}"
          </p>

          {/* Gear specs tags */}
          <div className="flex flex-wrap gap-1 mb-1">
            {doll.gearDetails.slice(0, 2).map((gear, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-300 border border-white/[0.06] flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5 text-pink-400 flex-shrink-0" />
                <span className="truncate max-w-[140px]">{gear}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer actions: Like, Details, Direct Instagram */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
              isLiked
                ? 'text-pink-400 bg-pink-500/10'
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
            <span>{doll.likesCount + (isLiked ? 1 : 0)}</span>
          </button>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => onSelect(doll)}
              className="h-8 px-2.5 rounded-lg text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white transition-colors border border-white/10"
            >
              Specs
            </button>

            <a
              href="https://www.instagram.com/hazel_the_dollmaker/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="h-8 px-2.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center gap-1 shadow-sm"
              title="View on Instagram @hazel_the_dollmaker"
            >
              <InstagramIcon className="w-3 h-3 text-white" />
              <span>IG</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
