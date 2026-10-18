import React from 'react';
import { Scissors, Sparkles, Trophy, Zap, Shield } from 'lucide-react';

export const CraftAnatomySection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: '100% Freehand (No Patterns)',
      desc: 'Hazel never uses commercial patterns. Every doll is sculpted organically stitch-by-stitch straight from live match reference photos and wrestler entrances.',
      icon: Scissors,
      color: 'from-pink-500 to-rose-600',
      badge: 'Unrepeatable Art'
    },
    {
      num: '02',
      title: 'Micro Ring Gear & Kickpads',
      desc: 'Capturing exact ring gear nuances — from metallic spandex and vinyl jackets to taped wrists, knee braces, and lace-up kickpads.',
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Exact Gear Match'
    },
    {
      num: '03',
      title: 'Fiber Hair & Facial Expressions',
      desc: 'Hair fiber is individually rooted and styled to match wrestler hairstyles — bleached blondes, braided extensions, mohawks, and signature beards.',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      badge: 'Character Soul'
    },
    {
      num: '04',
      title: 'Championship Belts & Props',
      desc: 'Miniature heavyweight title straps, custom spray-painted props, turnbuckles, sunglasses, and entrance robes in micro scale.',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-600',
      badge: 'Gold Standard'
    }
  ];

  return (
    <section id="craft" className="py-16 bg-[#0a0b12] border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>The Making of a Wrestling Doll</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-['Russo_One',sans-serif]">
            Craft Anatomy: Freehand Fiber Mastery
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
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
                className="relative rounded-2xl bg-[#131520] border border-gray-800 p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all group hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-gray-700 font-['Russo_One',sans-serif]">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-800 text-pink-300 border border-gray-700">
                      {step.badge}
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-800/80 flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span className="text-pink-400">★</span>
                  <span>Handmade in Maine</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ringside Quote Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#161826] to-pink-950/40 border border-purple-800/40 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl instagram-gradient flex items-center justify-center text-white text-3xl flex-shrink-0 shadow-lg">
            🤼
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-bold text-white">
              Direct Ringside Presentation Culture
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
              "When you hand a pro wrestler a handmade doll at ringside, watching their face light up from fierce competitor to pure joy is what this art is all about. Every wrestler cherishes having their gear faithfully honored."
            </p>
            <div className="text-xs font-semibold text-pink-400 flex items-center justify-center md:justify-start gap-2 pt-1">
              <span>— Hazel The Doll Maker</span>
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
