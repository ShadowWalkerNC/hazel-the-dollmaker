import React from 'react';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

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
    { id: 'store', label: 'Store' },
    { id: 'gallery', label: 'Wrestler Dolls' },
    { id: 'instagram-hub', label: 'Instagram' },
    { id: 'craft', label: 'Craft Anatomy' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d0e15]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className="flex items-center space-x-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/15 bg-black flex-shrink-0 group-hover:border-purple-400 transition-colors">
              <img
                src="/hazel-logo.jpg"
                alt="Hazel The Dollmaker"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-bold text-white text-sm tracking-tight group-hover:text-purple-300 transition-colors">
                Hazel
              </span>
              <span className="text-xs text-gray-400 font-medium">
                The Dollmaker
              </span>
            </div>
          </button>

          {/* Clean Unified Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-white bg-white/10 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {item.label}
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
              className="h-9 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">@hazel_the_dollmaker</span>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="h-9 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-purple-600/20 active:scale-95 relative"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag</span>
              {cartItemCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-purple-700 text-[10px] font-bold">
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
