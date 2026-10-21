import React from 'react';
import { ShoppingBag, ArrowRight, Calendar, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { YarnBallIcon, CrochetHookIcon, WoodenButtonIcon } from './CrochetIcons';
import type { Drop, Product } from '../types';

interface HeroProps {
  drop?: Drop | null;
  onExploreClick: () => void;
  onShopClick: () => void;
  onOpenInterestModal: (kind?: 'collector' | 'wrestler' | 'nomination') => void;
  onSelectProduct?: (p: Product) => void;
}

export const Hero: React.FC<HeroProps> = ({
  drop,
  onExploreClick,
  onShopClick,
  onOpenInterestModal,
}) => {
  const slotsRemaining = drop ? Math.max(0, drop.capacityLimit - drop.dollsClaimed) : 0;
  const isDropOpen = drop?.status === 'open';

  return (
    <section className="relative overflow-hidden pt-10 pb-16 border-b-2 border-dashed border-pink-500/20 bg-gradient-to-b from-[#12101b] via-[#0f0e18] to-[#0c0b14]">
      {/* Subtle yarn fiber glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-72 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-amber-600/10 blur-[110px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        
        {/* ======================================================== */}
        {/* FEATURED WRESTLER DROP WORKLOAD & SCHEDULE BANNER        */}
        {/* ======================================================== */}
        {drop && (
          <div className="w-full rounded-2xl bg-gradient-to-r from-pink-950/60 via-[#181226] to-purple-950/60 border-2 border-dashed border-pink-400/50 p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3.5 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 via-purple-600 to-amber-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <CrochetHookIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-[10px] font-crochet font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-pink-500 text-white tracking-wide shadow-sm">
                    {drop.status === 'open' ? 'Drop Open Now' : drop.status === 'preview' ? 'Drop Preview / Waitlist' : drop.status === 'paused' ? 'Drop Paused' : 'Drop Closed'}
                  </span>
                  <span className="text-xs text-amber-300 font-crochet font-bold">
                    {drop.title}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-crochet font-bold text-white mt-0.5">
                  {drop.wrestlerName} — Handmade Drop Limit: {drop.capacityLimit} Dolls Total
                </h4>
                <p className="text-xs text-gray-300 font-script line-clamp-1">
                  Hazel crochets each doll freehand (approx. 4–5 hrs each). Shared capacity across collectible, bundle, and signature options.
                </p>
              </div>
            </div>

            {/* Clear Production Schedule & Capacity Usage */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs font-mono text-pink-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-crochet text-gray-300">Est. Ship-by:</span>
                <strong className="text-white">{drop.estimatedShipByDate}</strong>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs font-mono text-amber-300">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                <span>{slotsRemaining} / {drop.capacityLimit} slots</span>
              </div>

              {isDropOpen ? (
                <button
                  type="button"
                  onClick={onShopClick}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-crochet font-bold shadow-md shadow-pink-600/30 border border-dashed border-pink-300/40 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>View Drop Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenInterestModal('collector')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-crochet font-bold shadow-md shadow-pink-600/30 border border-dashed border-pink-300/40 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Notify Me at Launch</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MAIN HERO GRID                                          */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Left: Headlines & Intro */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Handcrafted organic badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border-2 border-dashed border-pink-400/30 text-pink-300 text-xs font-crochet font-semibold shadow-sm">
              <YarnBallIcon className="w-4 h-4 text-pink-400" />
              <span>Freehand Organic Wrestling Amigurumi</span>
              <span className="text-pink-400 font-bold">•</span>
              <span className="text-amber-300">No Patterns Used</span>
            </div>

            {/* Impact Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.08] font-['Russo_One',sans-serif]">
              Wrestlers In <span className="text-pink-500">Yarn</span>.<br />
              Stitched For <span className="text-amber-400">The Fans</span>.
            </h1>

            {/* Story Lead */}
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 font-script leading-relaxed">
              Hazel handcrafts 1-of-1 likeness dolls of pro wrestling champions and indie stars from match photos — capturing kickpads, tattoos, championship belts, and ring attire one loop at a time.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={onShopClick}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:from-pink-500 hover:to-purple-500 text-white font-crochet font-bold text-xs sm:text-sm shadow-xl shadow-pink-600/30 border-2 border-dashed border-pink-200/50 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-pink-200" />
                <span>Shop Merch & Drops</span>
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-crochet font-semibold text-xs sm:text-sm border-2 border-dashed border-pink-400/30 hover:border-pink-300 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <CrochetHookIcon className="w-4 h-4 text-pink-400" />
                <span>Wrestler Archive</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => onOpenInterestModal('wrestler')}
                className="px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 font-crochet font-semibold text-xs sm:text-sm border-2 border-dashed border-amber-400/30 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <span>Wrestler Collabs</span>
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
                  <span className="text-xs font-crochet font-bold text-white">Controlled Runs</span>
                </div>
                <div className="text-[11px] text-gray-400 font-script">Manageable workload</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-dashed border-amber-400/20 text-center lg:text-left">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <WoodenButtonIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-crochet font-bold text-white">Direct Review</span>
                </div>
                <div className="text-[11px] text-gray-400 font-script">IG & WhatsApp</div>
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
                  <span className="text-amber-300 font-crochet font-semibold">✨ 1-of-1 Inquiries Open</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
