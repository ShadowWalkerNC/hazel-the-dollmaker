import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { YarnBallIcon, CrochetHookIcon, WoodenButtonIcon } from './CrochetIcons';
import { InstagramIcon } from './InstagramIcon';
import { WhatsAppIcon } from './WhatsAppIcon';

interface AboutSectionProps {
  onOpenCommission: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenCommission }) => {
  return (
    <section id="about-hazel" className="py-16 bg-[#0c0b15] border-b-2 border-dashed border-pink-500/20 relative overflow-hidden">
      {/* Background craft glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-pink-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border-2 border-dashed border-pink-400/30 text-pink-300 text-xs font-crochet font-semibold">
            <YarnBallIcon className="w-4 h-4 text-pink-400" />
            <span>Meet The Artist Behind The Hook</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-['Russo_One',sans-serif]">
            About The Dollmaker
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-script">
            "Watcher of wrestling. Maker of dolls. No patterns used, every piece is custom made."
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Portrait & Badge */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm rounded-3xl crochet-patch p-4 sm:p-5 shadow-2xl border-2 border-dashed border-pink-400/40">
              
              {/* Corner Buttons */}
              <div className="absolute top-3 left-3 text-pink-400/40">
                <WoodenButtonIcon className="w-4 h-4" />
              </div>
              <div className="absolute top-3 right-3 text-pink-400/40">
                <WoodenButtonIcon className="w-4 h-4" />
              </div>

              {/* Photo Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-black/60 border-2 border-dashed border-pink-400/30 aspect-square flex items-center justify-center p-3">
                <img
                  src="/hazel-logo.jpg"
                  alt="Hazel The Dollmaker"
                  className="w-full h-full object-contain rounded-xl drop-shadow-lg"
                />
                
                {/* Woven Studio Label */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#fdfbf7] text-[#191523] px-3 py-1.5 rounded-xl border border-dashed border-pink-400 text-center shadow-lg">
                  <div className="text-[11px] font-crochet font-extrabold tracking-wider uppercase text-pink-700">
                    🌱🐈‍⬛🧶 Hazel The Dollmaker
                  </div>
                  <div className="text-[10px] font-script text-gray-600">
                    Freehand Amigurumi Artist • Maine, USA
                  </div>
                </div>
              </div>

              {/* Stats Swatch */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-dashed border-pink-400/25 text-center">
                <div className="p-2 rounded-xl bg-black/40 border border-dashed border-pink-400/20">
                  <div className="text-base font-black text-pink-400 font-['Russo_One',sans-serif]">0</div>
                  <div className="text-[10px] font-crochet text-gray-400">Written Patterns</div>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-dashed border-pink-400/20">
                  <div className="text-base font-black text-purple-300 font-['Russo_One',sans-serif]">100%</div>
                  <div className="text-[10px] font-crochet text-gray-400">Freehand Yarn</div>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-dashed border-pink-400/20">
                  <div className="text-base font-black text-amber-300 font-['Russo_One',sans-serif]">50+</div>
                  <div className="text-[10px] font-crochet text-gray-400">Ringside Gifts</div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Bio & Story */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-2xl font-crochet font-bold text-white flex items-center gap-2">
                <span>The Story of Fiber Meets The Squared Circle</span>
                <Sparkles className="w-5 h-5 text-pink-400" />
              </h3>

              <div className="space-y-3 text-sm text-gray-300 leading-relaxed font-script">
                <p>
                  Hazel is a Maine-based fiber artist and die-hard independent professional wrestling fan. What started as an experiment sculpting dolls for her favorite wrestlers has grown into an iconic ringside staple at <strong className="text-white font-semibold">Limitless Wrestling</strong> and independent promotions across New England and beyond.
                </p>
                <p>
                  Unlike typical amigurumi crafters who follow standard store-bought stitch guides, Hazel creates <strong className="text-pink-300 font-semibold">100% freehand</strong>. Armed only with a crochet hook, reference photos from live matches, and worsted weight yarn, she sculpts boots, kickpads, championship belts, and rooted hair in real time.
                </p>
                <p>
                  Every piece is a genuine one-of-a-kind labor of love. Watching champions like Rip Byson, Nic Nemeth, Mac Daniels, Channing Thomas, and Dezmond Cole light up backstage when handed their likenesses is the heartbeat of the project.
                </p>
              </div>
            </div>

            {/* Direct Channel Connect Badges */}
            <div className="p-5 rounded-2xl bg-black/40 border-2 border-dashed border-pink-400/30 space-y-3">
              <div className="text-xs font-crochet font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Discuss Orders, Payment & Shipping With Hazel</span>
              </div>
              <p className="text-xs text-gray-300 font-script">
                Hazel reviews every single order individually to verify gear colors, sizing, and shipping options. Reach out directly on Instagram or WhatsApp anytime:
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://www.instagram.com/hazel_the_dollmaker/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl instagram-gradient hover:opacity-95 text-white text-xs font-crochet font-bold flex items-center gap-2 shadow-md transition-all border border-dashed border-pink-200/40"
                >
                  <InstagramIcon className="w-4 h-4 text-white" />
                  <span>DM on Instagram @hazel_the_dollmaker</span>
                </a>

                <a
                  href="https://wa.me/?text=Hi%20Hazel!%20I'm%20reaching%20out%20from%20your%20Hazel%20The%20Dollmaker%20official%20store%20about%20an%20order!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-crochet font-bold flex items-center gap-2 shadow-md transition-all border border-dashed border-emerald-300/40"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onOpenCommission}
                  className="px-4 py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-200 text-xs font-crochet font-bold border border-dashed border-pink-400/40 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CrochetHookIcon className="w-4 h-4 text-pink-400" />
                  <span>Commission Custom Doll</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
