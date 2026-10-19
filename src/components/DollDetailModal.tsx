import React, { useState } from 'react';
import { X, Check, Share2, Trophy, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DollItem } from '../types';
import { InstagramIcon } from './InstagramIcon';
import { YarnBallIcon, CrochetHookIcon, WoodenButtonIcon } from './CrochetIcons';

interface DollDetailModalProps {
  doll: DollItem | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onOpenCommission: () => void;
}

export const DollDetailModal: React.FC<DollDetailModalProps> = ({
  doll,
  onClose,
  onOpenCommission
}) => {
  const [copied, setCopied] = useState(false);

  if (!doll) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(doll.instagramUrl);
    setCopied(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 crochet-patch rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-2 border-dashed border-pink-400/40">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-dashed border-pink-400/20 bg-[#141120]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-dashed border-pink-400/50 p-0.5 bg-black">
              <img src="/hazel-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-crochet font-bold text-white tracking-wide">
                  {doll.wrestlerName}
                </h2>
                <span className="text-[10px] font-crochet font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-dashed border-pink-400/40">
                  {doll.promotion}
                </span>
              </div>
              <p className="text-xs text-pink-300 font-script font-semibold">{doll.dollTitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="p-2 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-200 text-xs font-crochet font-bold flex items-center gap-1.5 transition-all border border-dashed border-pink-400/30 cursor-pointer"
              title="Share / Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-950/30 via-[#171424] to-purple-950/30 border-2 border-dashed border-pink-400/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-crochet font-extrabold uppercase tracking-widest text-pink-400">
                  <YarnBallIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>100% Freehand Likeness • Handcrafted in Maine</span>
                </div>
                <h3 className="text-2xl font-black text-white font-['Russo_One',sans-serif]">
                  {doll.wrestlerName}
                </h3>
                <p className="text-xs text-pink-200 font-script font-medium">
                  {doll.dollTitle} • {doll.promotion}
                </p>
              </div>

              <a
                href="https://www.instagram.com/hazel_the_dollmaker/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl instagram-gradient hover:opacity-95 text-white text-xs font-crochet font-bold flex items-center gap-2 shadow-md transition-all flex-shrink-0 border border-dashed border-pink-200/40"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
                <span>View On Instagram @hazel_the_dollmaker</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Ringside Quote */}
            <div className="p-4 rounded-xl bg-black/50 border border-dashed border-pink-400/20 space-y-2">
              <span className="text-[11px] font-crochet font-bold text-amber-300 flex items-center gap-1.5">
                <WoodenButtonIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>The Ringside Story & Presentation:</span>
              </span>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed italic font-script">
                "{doll.story}"
              </p>
              <div className="text-[11px] text-gray-400 pt-1 flex items-center justify-between border-t border-dashed border-pink-400/20 font-mono">
                <span>Gifted ringside by Hazel</span>
                <span>{doll.date}</span>
              </div>
            </div>
          </div>

          {/* Fiber Specs & Yarn Anatomy */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-black/40 border border-dashed border-pink-400/25 text-center">
            <div>
              <div className="text-[10px] font-crochet text-gray-400 uppercase">Material</div>
              <div className="text-xs font-crochet font-bold text-white mt-0.5">100% Worsted Yarn</div>
            </div>
            <div>
              <div className="text-[10px] font-crochet text-gray-400 uppercase">Stitch Method</div>
              <div className="text-xs font-crochet font-bold text-pink-300 mt-0.5">Continuous Rounds (sc)</div>
            </div>
            <div>
              <div className="text-[10px] font-crochet text-gray-400 uppercase">Tension</div>
              <div className="text-xs font-crochet font-bold text-amber-300 mt-0.5">Heavy Gauge Tight</div>
            </div>
            <div>
              <div className="text-[10px] font-crochet text-gray-400 uppercase">Care</div>
              <div className="text-xs font-crochet font-bold text-emerald-300 mt-0.5">Hand Wash Cold</div>
            </div>
          </div>

          {/* Handcrafted Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-crochet font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <CrochetHookIcon className="w-4 h-4 text-pink-400" />
              <span>Handcrafted Ring Gear Nuances Captured</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {doll.gearDetails.map((gear, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-dashed border-pink-400/20 text-xs text-gray-200 font-script">
                  <span className="text-pink-400 font-bold mt-0.5">✦</span>
                  <span className="leading-relaxed">{gear}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Box: Commission a similar piece */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 to-purple-950/40 border-2 border-dashed border-pink-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-crochet font-bold text-white">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Want a custom doll created of yourself or your favorite wrestler?</span>
              </div>
              <p className="text-xs text-gray-300 font-script">
                Hazel accepts custom orders without patterns. Every doll is 100% 1-of-1.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenCommission();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-crochet font-bold flex items-center gap-2 transition-all shadow-lg shadow-pink-900/30 whitespace-nowrap border border-dashed border-pink-300/40 cursor-pointer"
            >
              <CrochetHookIcon className="w-4 h-4" />
              <span>Start Custom Request</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
