import React from 'react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onShopClick
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 border-b border-white/[0.08] bg-[#0c0d14]">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-purple-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Official Store & Freehand Crochet Likenesses</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-[1.1] font-['Russo_One',sans-serif]">
              Pro Wrestling Likenesses, <br className="hidden sm:inline" />
              <span className="instagram-text-gradient">Handcrafted in Yarn.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Welcome to the official home of <strong className="text-white font-semibold">Hazel The Dollmaker</strong> (<a href="https://www.instagram.com/hazel_the_dollmaker/" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">@hazel_the_dollmaker</a>). Every doll is 100% freehand sculpted without patterns to mirror real ring gear, boots, and championships — gifted directly to indie and pro champions ringside.
            </p>

            {/* Uniform CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={onShopClick}
                className="h-11 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-purple-600/25 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Official Merch</span>
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="h-11 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-semibold text-xs sm:text-sm border border-white/10 flex items-center space-x-2 transition-all"
              >
                <span>View Wrestler Dolls</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Clean, Uniform Value Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06] max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-xs font-bold text-white">100% Freehand</div>
                <div className="text-[11px] text-gray-400">Zero patterns used</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xs font-bold text-white">Ringside Gifts</div>
                <div className="text-[11px] text-gray-400">Limitless & beyond</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xs font-bold text-white">Custom Orders</div>
                <div className="text-[11px] text-gray-400">Any wrestler gear</div>
              </div>
            </div>

          </div>

          {/* Hero Right: Clean Logo Display & Bio */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-[#11131c] border border-white/10 p-5 space-y-4 shadow-xl">
              
              {/* Logo Frame */}
              <div className="relative rounded-xl overflow-hidden bg-black/60 border border-white/10 aspect-[4/3] flex items-center justify-center p-3">
                <img
                  src="/hazel-logo.jpg"
                  alt="Hazel The Dollmaker Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Authentic Bio Pill */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-gray-300 space-y-1.5">
                <div className="text-[11px] font-bold text-pink-400">
                  🌱🐈‍⬛🧶 Hazel The Dollmaker
                </div>
                <p className="italic text-gray-300 text-[11px] leading-relaxed">
                  "Watcher of wrestling. Maker of dolls. No patterns used, every piece is custom made."
                </p>
                <div className="text-[10px] text-gray-400 pt-1 flex items-center justify-between border-t border-white/[0.06]">
                  <span>Maine, USA</span>
                  <span className="text-purple-300 font-semibold">✨ Custom Orders Open</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
