import React, { useState } from 'react';
import { ExternalLink, Plus, Copy, Check, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DollItem } from '../types';
import { InstagramIcon } from './InstagramIcon';
import { sounds } from '../utils/audio';

interface InstagramEmbedSectionProps {
  onOpenAddModal: () => void;
  onAddDoll: (newDoll: DollItem) => void;
  dolls: DollItem[];
}

export const InstagramEmbedSection: React.FC<InstagramEmbedSectionProps> = ({
  onOpenAddModal,
  onAddDoll,
  dolls
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [quickWrestler, setQuickWrestler] = useState('');
  const [activeDollPreview, setActiveDollPreview] = useState<DollItem>(dolls[0] || {
    id: 'nic-nemeth',
    wrestlerName: 'Nic Nemeth',
    dollTitle: '"The Wanted Man" Doll',
    promotion: 'Global Champion',
    date: '2024',
    instagramUrl: 'https://www.instagram.com/hazel_the_dollmaker/',
    gearDetails: ['Bleached hair yarn', 'Pink & black trunks', 'Gold title belt'],
    story: 'Backstage moment with Nic Nemeth holding his custom doll.',
    wrestlerImageUrl: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
    dollImageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80',
    category: 'champion',
    featured: true,
    likesCount: 842,
  });
  const [copied, setCopied] = useState(false);

  // Extract shortcode if pasted
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    const match = inputUrl.match(/\/(p|reel)\/([^/?#&]+)/);
    const shortcode = match ? match[2] : 'custom-post';
    const wrestler = quickWrestler.trim() || 'Featured Wrestler';

    const newDoll: DollItem = {
      id: `ig-${Date.now()}`,
      wrestlerName: wrestler,
      dollTitle: `${wrestler} Likeness by Hazel`,
      promotion: 'Indie Wrestling Circuit',
      date: 'Just Added',
      instagramUrl: inputUrl.trim(),
      instagramPostId: shortcode,
      gearDetails: ['Custom freehand yarn styling', 'Authentic ringside gear mimicry'],
      story: `Custom piece featured on Hazel's Instagram (@hazel_the_dollmaker).`,
      wrestlerImageUrl: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
      dollImageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80',
      category: 'ringside-gift',
      featured: true,
      likesCount: 1,
      isUserAdded: true,
    };

    onAddDoll(newDoll);
    setActiveDollPreview(newDoll);
    setInputUrl('');
    setQuickWrestler('');
    sounds.playLikeChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText('https://www.instagram.com/hazel_the_dollmaker/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="instagram-hub" className="py-14 bg-[#0d0c16] border-b-2 border-dashed border-pink-500/20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border-2 border-dashed border-pink-400/30 text-pink-300 text-xs font-crochet font-semibold">
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>Interactive Instagram Showcase Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-['Russo_One',sans-serif]">
            Put Her Instagram To Showcase Her Art
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-script">
            Easily feature posts directly from Hazel’s Instagram feed (<a href="https://www.instagram.com/hazel_the_dollmaker/" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline font-semibold">@hazel_the_dollmaker</a>). Paste any post or reel link below to showcase her wrestler and doll creations in real time.
          </p>
        </div>

        {/* Quick Paste Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <form onSubmit={handleQuickAdd} className="p-3 sm:p-4 rounded-3xl crochet-patch border-2 border-dashed border-pink-400/30 shadow-xl flex flex-col md:flex-row items-center gap-2.5">
            <div className="flex-1 w-full flex items-center px-3 py-2 bg-gray-900 rounded-xl border border-gray-800">
              <InstagramIcon className="w-5 h-5 text-pink-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste Instagram Post or Reel URL (e.g. https://www.instagram.com/p/...)"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            
            <div className="w-full md:w-56 flex items-center px-3 py-2 bg-gray-900 rounded-xl border border-gray-800">
              <input
                type="text"
                value={quickWrestler}
                onChange={(e) => setQuickWrestler(e.target.value)}
                placeholder="Wrestler Name (Optional)"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-5 py-2.5 rounded-xl text-white font-bold text-sm instagram-gradient hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Put Post</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 mt-3 px-2">
            <span>
              💡 Tip: You can also use the full creator modal with photos & stories.
            </span>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="text-pink-400 hover:text-pink-300 font-semibold underline"
            >
              Open Detailed Creator Form →
            </button>
          </div>
        </div>

        {/* Live Instagram Profile Card & Showcase Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Profile Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-[#12141d] border border-gray-800 p-6 space-y-5 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full p-0.5 instagram-gradient shadow-lg">
                  <div className="w-full h-full rounded-full bg-[#161824] flex items-center justify-center text-2xl">
                    🪡
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-white">hazel_the_dollmaker</h3>
                    <span className="text-blue-400 text-sm" title="Craft Verified">✓</span>
                  </div>
                  <p className="text-xs text-pink-400 font-semibold">Hazel The Doll Maker</p>
                  <p className="text-xs text-gray-400">Crochet Artist • Ringside Gifting</p>
                </div>
              </div>

              {/* Bio & Philosophy */}
              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs text-gray-300 space-y-2 leading-relaxed">
                <p>
                  📍 Attending live independent shows (Limitless Wrestling & beyond).
                </p>
                <p>
                  🧶 <strong>Freehand Crochet:</strong> Zero patterns used. Every stitch is freehand sculpted to capture each wrestler’s signature facial hair, tattoos, boots, and ring trunks.
                </p>
                <p>
                  🏆 Belts, entrance robes, jackets, and accessories all handcrafted in miniature scale.
                </p>
              </div>

              {/* Profile Link & Copy Button */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="https://www.instagram.com/hazel_the_dollmaker/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl instagram-gradient hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <InstagramIcon className="w-4 h-4 text-white" />
                  <span>Visit Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={handleCopyProfile}
                  className="py-2.5 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-gray-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  <span>{copied ? 'Copied Link!' : 'Copy Handle'}</span>
                </button>
              </div>
            </div>

            {/* Quick Picker of Hazel's Recent Doll Posts */}
            <div className="p-5 rounded-2xl bg-[#12141d] border border-gray-800 space-y-3">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Featured Creations On Feed</span>
              </h4>
              <div className="space-y-2">
                {dolls.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveDollPreview(item)}
                    className="w-full p-2.5 rounded-xl bg-gray-900/60 hover:bg-purple-950/30 border border-gray-800 hover:border-purple-500/40 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-800">
                        <img src={item.dollImageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors truncate max-w-[170px]">
                          {item.wrestlerName}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[170px]">
                          {item.dollTitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-pink-400 font-semibold flex items-center gap-0.5">
                      View <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Embed / Interactive Player */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#12141d] border border-gray-800 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Instagram Showcase Viewer
                  </span>
                </div>
                <a
                  href={activeDollPreview.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
                >
                  <span>@hazel_the_dollmaker</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Instagram Embed or Visual Feed Card */}
              <div className="w-full rounded-xl bg-[#0e1017] border border-gray-800/80 overflow-hidden flex flex-col items-center justify-center p-4 min-h-[460px]">
                
                <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-black/40 border border-gray-700/50 shadow-inner p-4 text-center space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full instagram-gradient flex items-center justify-center text-xs font-bold text-white">
                        🪡
                      </div>
                      <span className="font-semibold text-white">hazel_the_dollmaker</span>
                    </div>
                    <span className="text-[11px] text-pink-400 font-semibold">Post Showcase</span>
                  </div>

                  {/* Official Brand Showcase within Embed */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#11131f] border border-gray-800 p-3 flex flex-col items-center justify-center">
                    <img
                      src="/hazel-logo.jpg"
                      alt="Hazel The Dollmaker"
                      className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(236,72,153,0.3)]"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md rounded-lg py-1 px-2.5 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-pink-300">{activeDollPreview.wrestlerName}</span>
                      <span className="text-gray-400">{activeDollPreview.promotion}</span>
                    </div>
                  </div>

                  {/* Post caption text */}
                  <p className="text-xs text-gray-300 text-left leading-relaxed">
                    <strong className="text-white">hazel_the_dollmaker</strong> {activeDollPreview.story} Handcrafted without patterns, capturing custom ring gear and championship details! 🪡🌟 #hazelthedollmaker #crochetdoll #wrestlingdolls #limitlesswrestling
                  </p>

                  {/* Open in Instagram CTA */}
                  <div className="pt-2">
                    <a
                      href={activeDollPreview.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl instagram-gradient hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <InstagramIcon className="w-4 h-4 text-white" />
                      <span>View Full Original Post On Instagram</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
