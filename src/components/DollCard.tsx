import React, { useState } from 'react';
import { Tag, ExternalLink } from 'lucide-react';
import type { DollItem } from '../types';
import { InstagramIcon } from './InstagramIcon';
import { YarnBallIcon, CrochetHookIcon, AmigurumiHeartIcon } from './CrochetIcons';
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
    'ringside-gift': { label: 'Ringside Gift', color: 'bg-emerald-500/20 text-emerald-300 border-dashed border-emerald-400/40' },
    'champion': { label: 'Champion Likeness', color: 'bg-amber-500/20 text-amber-300 border-dashed border-amber-400/40' },
    'indie-favorite': { label: 'Indie Favorite', color: 'bg-purple-500/20 text-purple-300 border-dashed border-purple-400/40' },
    'custom-commission': { label: 'Commission', color: 'bg-pink-500/20 text-pink-300 border-dashed border-pink-400/40' },
  };

  return (
    <div
      onClick={() => onSelect(doll)}
      className="group relative crochet-patch rounded-2xl transition-all duration-200 flex flex-col overflow-hidden shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Top Media / Art Card Banner */}
      <div className="relative w-full aspect-[16/10] bg-[#110f1c] overflow-hidden flex flex-col justify-between p-4 border-b-2 border-dashed border-pink-400/20">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between relative z-10">
          <span className={`text-[10px] font-crochet font-bold px-2.5 py-0.5 rounded-full border ${categoryLabels[doll.category]?.color || 'bg-purple-500/20 text-purple-300 border-purple-400/40'}`}>
            {categoryLabels[doll.category]?.label || 'Likeness'}
          </span>

          {/* Faux fabric care tag */}
          <span className="text-[10px] font-mono font-bold text-gray-300 bg-black/60 px-2 py-0.5 rounded border border-dashed border-white/20">
            {doll.date}
          </span>
        </div>

        {/* Centerpiece Crochet Iconography */}
        <div className="my-auto py-2 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl p-[2px] bg-gradient-to-br from-pink-500 via-purple-500 to-amber-500 shadow-md">
            <div className="w-full h-full rounded-[10px] bg-[#151221] flex items-center justify-center text-pink-300">
              <CrochetHookIcon className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <div className="text-left">
            <div className="text-base font-crochet font-bold text-white group-hover:text-pink-300 transition-colors">
              {doll.wrestlerName}
            </div>
            <div className="text-[11px] text-pink-300/80 font-script font-medium flex items-center gap-1">
              <span>{doll.promotion}</span>
              <span className="text-gray-500">•</span>
              <span className="text-amber-300">Amigurumi</span>
            </div>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="text-[10px] font-crochet text-pink-400 font-semibold text-center pt-1 border-t border-dashed border-pink-400/20 flex items-center justify-center gap-1.5">
          <YarnBallIcon className="w-3 h-3 text-pink-400" />
          <span>100% Freehand • Handcrafted in Maine</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-crochet font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
            {doll.wrestlerName}
          </h3>
          <p className="text-xs text-pink-300 font-script font-medium line-clamp-1 mb-2">
            {doll.dollTitle}
          </p>

          {/* Ringside Quote / Story snippet styled like notebook swatch */}
          <p className="text-xs text-gray-300 line-clamp-2 italic bg-black/40 p-2.5 rounded-xl border border-dashed border-pink-400/20 mb-3 leading-relaxed font-script">
            "{doll.story}"
          </p>

          {/* Gear specs tags styled like fabric ribbons */}
          <div className="flex flex-wrap gap-1.5 mb-1">
            {doll.gearDetails.slice(0, 2).map((gear, idx) => (
              <span
                key={idx}
                className="text-[10px] font-crochet px-2 py-0.5 rounded-lg bg-pink-500/10 text-pink-200 border border-dashed border-pink-400/30 flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5 text-pink-400 flex-shrink-0" />
                <span className="truncate max-w-[130px]">{gear}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer actions: Like, Details, Direct Instagram */}
        <div className="pt-3 border-t border-dashed border-pink-400/20 flex items-center justify-between">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-crochet font-semibold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              isLiked
                ? 'text-pink-300 bg-pink-500/20 border border-dashed border-pink-400/50 shadow-sm'
                : 'text-gray-400 hover:text-pink-400 hover:bg-white/5 border border-transparent'
            }`}
          >
            <AmigurumiHeartIcon className={`w-3.5 h-3.5 ${isLiked ? 'text-pink-400' : 'text-gray-400'}`} />
            <span>{doll.likesCount + (isLiked ? 1 : 0)}</span>
          </button>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => onSelect(doll)}
              className="h-8 px-3 rounded-xl text-xs font-crochet font-semibold text-gray-200 bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-dashed border-white/20 hover:border-pink-400 cursor-pointer"
            >
              Yarn Specs
            </button>

            <a
              href="https://www.instagram.com/hazel_the_dollmaker/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="h-8 px-2.5 rounded-xl text-xs font-crochet font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all flex items-center gap-1 shadow-sm border border-dashed border-pink-300/40"
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
