import React, { useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface MerchStoreSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const MerchStoreSection: React.FC<MerchStoreSectionProps> = ({
  products,
  onSelectProduct,
  onQuickAddToCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Merch' },
    { id: 'apparel', label: 'Apparel' },
    { id: 'custom-doll', label: 'Custom Dolls' },
    { id: 'stickers', label: 'Stickers' },
    { id: 'accessories', label: 'Pins & Accessories' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <section id="merch-store" className="py-14 bg-[#0a0b12] border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
              Official Store
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-['Russo_One',sans-serif]">
              Merchandise & Custom Dolls
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchandise..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 scrollbar-none border-b border-white/[0.06]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onQuickAddToCart={onQuickAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-white/[0.02] border border-white/10 p-8 space-y-3">
            <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No items found</h3>
            <p className="text-xs text-gray-400">Try selecting another category or clearing your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
