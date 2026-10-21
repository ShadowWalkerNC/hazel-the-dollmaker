import React from 'react';
import { Scissors, Trophy } from 'lucide-react';
import { CrochetHookIcon, YarnBallIcon, WoodenButtonIcon } from './CrochetIcons';

export const CraftAnatomySection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Freehand Amigurumi (No Patterns)',
      desc: 'Starting from a Magic Ring in tight single-crochet (sc). Hazel never follows commercial charts — every head, torso, and boot is sculpted organically from live match reference photos.',
      icon: CrochetHookIcon,
      color: 'from-pink-500 to-rose-600',
      badge: 'Continuous Spiral'
    },
    {
      num: '02',
      title: 'Micro Ring Gear & Kickpads',
      desc: 'Exact ring gear nuances — from metallic spandex and vinyl jackets to taped wrists, knee braces, and lace-up kickpads crocheted with high yarn tension.',
      icon: YarnBallIcon,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Tight Yarn Gauge'
    },
    {
      num: '03',
      title: 'Rooted Fiber Hair & Beards',
      desc: 'Individual strands of worsted yarn are latch-hooked strand by strand, then brushed and trimmed to mirror bleached mohawks, braids, and signature full beards.',
      icon: Scissors,
      color: 'from-amber-500 to-orange-600',
      badge: 'Hand-Rooted'
    },
    {
      num: '04',
      title: 'Championship Belts & Props',
      desc: 'Miniature heavyweight title straps, custom turnbuckles, sunglasses, championship gold plates, and satin entrance robes scaled down to doll size.',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-600',
      badge: 'Gold Standard'
    }
  ];

  return (
    <section id="craft" className="py-16 bg-[#0c0b14] border-b-2 border-dashed border-pink-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border-2 border-dashed border-pink-400/30 text-pink-300 text-xs font-crochet font-semibold">
            <CrochetHookIcon className="w-4 h-4 text-pink-400" />
            <span>Behind The Hook: Amigurumi Anatomy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-['Russo_One',sans-serif]">
            Craft Anatomy: Freehand Fiber Mastery
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-script">
            How Hazel transforms hundreds of yards of yarn into high-personality likenesses of wrestling champions without a single written pattern.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl crochet-patch p-6 flex flex-col justify-between hover:border-pink-400 transition-all group hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-pink-400/60 font-['Russo_One',sans-serif]">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-crochet font-bold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-dashed border-pink-400/40">
                      {step.badge}
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform border border-dashed border-white/30`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-crochet font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-300 font-script leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-dashed border-pink-400/20 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="text-pink-400 flex items-center gap-1 font-crochet font-semibold">
                    <YarnBallIcon className="w-3.5 h-3.5" />
                    <span>Single Crochet (sc)</span>
                  </span>
                  <span className="font-script">Maine, USA</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Authentic Yarn Studio Specs Callout */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/40 border-2 border-dashed border-pink-400/25 text-center">
          <div className="p-2">
            <div className="text-[11px] font-crochet text-gray-400 uppercase tracking-wider">Yarn Weight</div>
            <div className="text-sm font-crochet font-bold text-white mt-0.5">Worsted (Medium 4)</div>
          </div>
          <div className="p-2">
            <div className="text-[11px] font-crochet text-gray-400 uppercase tracking-wider">Hook Gauge</div>
            <div className="text-sm font-crochet font-bold text-pink-400 mt-0.5">3.25mm – 3.5mm (E)</div>
          </div>
          <div className="p-2">
            <div className="text-[11px] font-crochet text-gray-400 uppercase tracking-wider">Safety Eyes</div>
            <div className="text-sm font-crochet font-bold text-purple-300 mt-0.5">Locking Back Washers</div>
          </div>
          <div className="p-2">
            <div className="text-[11px] font-crochet text-gray-400 uppercase tracking-wider">Pattern Style</div>
            <div className="text-sm font-crochet font-bold text-amber-300 mt-0.5">100% Freehand Sculpt</div>
          </div>
        </div>

        {/* Ringside Quote Banner */}
        <div className="mt-8 rounded-2xl crochet-patch p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative">
          <div className="absolute top-3 right-3 text-pink-400/40">
            <WoodenButtonIcon className="w-5 h-5" />
          </div>
          <div className="w-16 h-16 rounded-2xl instagram-gradient flex items-center justify-center text-white text-3xl flex-shrink-0 shadow-lg border-2 border-dashed border-pink-300/40">
            🧶
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-crochet font-bold text-white">
              Direct Ringside Presentation Culture
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl font-script italic">
              "When you hand a pro wrestler a handmade doll at ringside, watching their face light up from fierce competitor to pure joy is what this art is all about. Every wrestler cherishes having their gear faithfully honored."
            </p>
            <div className="text-xs font-crochet font-semibold text-pink-400 flex items-center justify-center md:justify-start gap-2 pt-1">
              <span>— Hazel The Dollmaker</span>
              <span>•</span>
              <a
                href="https://www.instagram.com/hazel_the_dollmaker/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-pink-300"
              >
                Follow on Instagram @hazel_the_dollmaker
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
