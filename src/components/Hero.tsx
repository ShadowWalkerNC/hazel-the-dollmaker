import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { YarnBallIcon, CrochetHookIcon, WoodenButtonIcon } from './CrochetIcons';

interface HeroProps {
  onExploreClick: () => void;
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onShopClick
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 border-b-2 border-dashed border-pink-500/20 bg-gradient-to-b from-[#12101b] via-[#0f0e18] to-[#0c0b14]">
      {/* Subtle yarn fiber glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-72 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-amber-600/10 blur-[110px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Crochet Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border-2 border-dashed border-pink-400/40 text-pink-300 text-xs font-crochet font-semibold shadow-inner">
              <YarnBallIcon className="w-4 h-4 text-pink-400" />
              <span>Freehand Amigurumi & Official Merch</span>
              <span className="text-pink-400/50">•</span>
              <span className="text-amber-300 font-script">Zero Patterns</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-[1.1] font-['Russo_One',sans-serif]">
              Pro Wrestling Likenesses, <br className="hidden sm:inline" />
              <span className="instagram-text-gradient">Handcrafted In Yarn.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Welcome to the official home of <strong className="text-white font-semibold">Hazel The Dollmaker</strong> (<a href="https://www.instagram.com/hazel_the_dollmaker/" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">@hazel_the_dollmaker</a>). Every doll is 100% freehand sculpted without patterns to mirror real ring gear, boots, and championships — gifted directly to indie and pro champions ringside.
            </p>

            {/* Stitched Craft CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={onShopClick}
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-crochet font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-pink-600/30 border-2 border-dashed border-pink-300/40 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Official Merch</span>
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="h-11 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-crochet font-semibold text-xs sm:text-sm border-2 border-dashed border-pink-400/30 hover:border-pink-300 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <CrochetHookIcon className="w-4 h-4 text-pink-400" />
                <span>View Wrestler Dolls</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Tactile Swatch Value Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t-2 border-dashed border-pink-500/20 max-w-lg mx-auto lg:mx-0">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-dashed border-pink-400/20 text-center lg:text-left">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <CrochetHookIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span className="text-xs font-crochet font-bold text-white">100% Freehand</span>
                </div>
                <div className="text-[11px] text-gray-400 font-script">Zero patterns used</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-dashed border-purple-400/20 text-center lg:text-left">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <YarnBallIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-crochet font-bold text-white">Ringside Gifts</span>
                </div>
                <div className="text-[11px] text-gray-400 font-script">Limitless & beyond</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-dashed border-amber-400/20 text-center lg:text-left">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <WoodenButtonIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-crochet font-bold text-white">Custom Orders</span>
                </div>
                <div className="text-[11px] text-gray-400 font-script">Any wrestler gear</div>
              </div>
            </div>

          </div>

          {/* Hero Right: Tactile Stitched Craft Badge */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl crochet-patch p-5 space-y-4 shadow-2xl relative">
              
              {/* Corner Wooden Buttons */}
              <div className="absolute top-2 left-2 text-pink-400/40">
                <WoodenButtonIcon className="w-4 h-4" />
              </div>
              <div className="absolute top-2 right-2 text-pink-400/40">
                <WoodenButtonIcon className="w-4 h-4" />
              </div>

              {/* Top Fabric Tag Ribbon */}
              <div className="flex items-center justify-center pt-1">
                <div className="px-3 py-1 rounded bg-[#fdfbf7] text-[#1a1725] text-[10px] font-script font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-dashed border-pink-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  Official Yarn Art Studio • Maine
                </div>
              </div>

              {/* Logo Frame with Stitched Seam */}
              <div className="relative rounded-xl overflow-hidden bg-black/60 border-2 border-dashed border-pink-400/40 aspect-[4/3] flex items-center justify-center p-3 shadow-inner">
                <img
                  src="/hazel-logo.jpg"
                  alt="Hazel The Dollmaker Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bio Stitched Card */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-dashed border-pink-400/25 text-xs text-gray-300 space-y-1.5">
                <div className="text-[11px] font-crochet font-bold text-pink-400 flex items-center gap-1.5">
                  <YarnBallIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Hazel The Dollmaker</span>
                </div>
                <p className="italic text-gray-300 text-[11px] leading-relaxed font-script">
                  "Watcher of wrestling. Maker of dolls. No patterns used, every piece is custom made."
                </p>
                <div className="text-[10px] text-gray-400 pt-1.5 flex items-center justify-between border-t border-dashed border-pink-400/20">
                  <span className="flex items-center gap-1">📍 Maine, USA</span>
                  <span className="text-amber-300 font-crochet font-semibold">✨ Commissions Open</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
