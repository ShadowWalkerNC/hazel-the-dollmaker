import { ExternalLink } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { YarnBallIcon } from './CrochetIcons';

interface NavbarProps {
  onOpenCart: () => void;
  cartItemCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  cartItemCount,
  activeTab,
  setActiveTab
}) => {
  const navItems = [
    { id: 'store', label: 'Store', icon: '🧶' },
    { id: 'gallery', label: 'Wrestler Dolls', icon: '🪡' },
    { id: 'instagram-hub', label: 'Instagram', icon: '📸' },
    { id: 'craft', label: 'Craft Anatomy', icon: '✂️' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#12101b]/95 backdrop-blur-md border-b-2 border-dashed border-pink-500/25 shadow-lg shadow-black/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name with Embroidered Patch Aesthetic */}
          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className="flex items-center space-x-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-dashed border-pink-400/60 bg-black flex-shrink-0 group-hover:border-pink-300 group-hover:scale-105 transition-all p-0.5 shadow-md shadow-pink-900/30">
              <img
                src="/hazel-logo.jpg"
                alt="Hazel The Dollmaker"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-crochet font-bold text-white text-base tracking-wide group-hover:text-pink-300 transition-colors">
                  Hazel
                </span>
                <span className="text-[11px] font-script text-pink-300/80 font-medium">
                  The Dollmaker
                </span>
              </div>
              <span className="text-[9px] text-gray-400 font-mono tracking-wider uppercase -mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Freehand Crochet Studio
              </span>
            </div>
          </button>

          {/* Stitched Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-black/30 p-1 rounded-xl border border-white/5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-crochet font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-pink-200 bg-pink-500/20 border border-dashed border-pink-400/50 shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Instagram Link + Shopping Bag */}
          <div className="flex items-center space-x-2">
            
            {/* Instagram Profile */}
            <a
              href="https://www.instagram.com/hazel_the_dollmaker/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-200 hover:text-white border border-dashed border-pink-400/30 text-xs font-crochet font-medium flex items-center space-x-1.5 transition-all"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">@hazel_the_dollmaker</span>
              <ExternalLink className="w-3 h-3 text-pink-400/70" />
            </a>

            {/* Shopping Bag Button (Cozy Stitched Patch) */}
            <button
              type="button"
              onClick={onOpenCart}
              className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-crochet font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-pink-600/30 border border-dashed border-pink-300/40 active:scale-95 relative"
            >
              <YarnBallIcon className="w-3.5 h-3.5 text-pink-200" />
              <span>Bag</span>
              {cartItemCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-pink-700 text-[10px] font-extrabold shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
