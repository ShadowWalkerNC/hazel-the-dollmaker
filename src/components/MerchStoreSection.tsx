import React, { useState } from 'react';
import { Search, ShoppingBag, Sparkles, Filter } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { YarnBallIcon } from './CrochetIcons';

interface MerchStoreSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onOpenInterestModal?: (kind?: 'collector') => void;
}

export const MerchStoreSection: React.FC<MerchStoreSectionProps> = ({
  products,
  onSelectProduct,
  onQuickAddToCart,
  onOpenInterestModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Items', icon: '🧶' },
    { id: 'limited', label: 'Limited Drops', icon: '⭐' },
    { id: 'custom-doll', label: 'Custom 1-of-1', icon: '🪡' },
    { id: 'bundle', label: 'Bundles', icon: '🎁' },
    { id: 'signature', label: 'Signature', icon: '🏆' },
    { id: 'apparel', label: 'Apparel', icon: '👕' },
    { id: 'accessories', label: 'Pins & Bags', icon: '🧷' },
    { id: 'stickers', label: 'Stickers', icon: '✨' },
  ];

  const filteredProducts = products.filter((p) => {
    if (p.state === 'archived') return false; // Hide archived products from customer storefront
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchState = selectedState === 'all' || p.state === selectedState;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchCat && matchState && matchSearch;
  });

  return (
    <section id="merch-store" className="py-14 bg-[#0d0c16] border-b-2 border-dashed border-pink-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-crochet font-bold text-pink-400 uppercase tracking-wider mb-1">
              <YarnBallIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Official Merch & Drops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-['Russo_One',sans-serif]">
              Collectibles, Custom Dolls & Studio Apparel
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-pink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store items..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border-2 border-dashed border-pink-400/30 text-xs font-crochet text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs styled as tactile swatches */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-dashed border-pink-400/20">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-crochet font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md border-2 border-dashed border-pink-200/50'
                  : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border-2 border-dashed border-transparent'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Availability Filter Chips */}
        <div className="flex items-center gap-2 mb-8 text-xs font-crochet">
          <span className="text-gray-400 flex items-center gap-1 text-[11px]">
            <Filter className="w-3 h-3 text-pink-400" />
            <span>State:</span>
          </span>
          {[
            { id: 'all', label: 'All States' },
            { id: 'available', label: 'Ready to Order' },
            { id: 'preview', label: 'Previews & Drops' },
            { id: 'inquiry_only', label: 'Custom Inquiries' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedState(st.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                selectedState === st.id
                  ? 'bg-pink-500/20 text-pink-300 border-pink-400/50'
                  : 'text-gray-400 hover:text-gray-200 border-white/5 hover:bg-white/5'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onQuickAddToCart={onQuickAddToCart}
                onOpenInterestModal={onOpenInterestModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl crochet-patch p-8 space-y-3">
            <ShoppingBag className="w-10 h-10 text-pink-400/50 mx-auto" />
            <h3 className="text-sm font-crochet font-bold text-white">No items found in this yarn basket</h3>
            <p className="text-xs text-gray-300 font-script">Try selecting another category or resetting filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedState('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-crochet font-bold border border-dashed border-pink-300/40 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
