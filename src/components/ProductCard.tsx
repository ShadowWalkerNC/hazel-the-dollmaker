import React from 'react';
import { ShoppingBag, Scissors } from 'lucide-react';
import type { Product } from '../types';
import { MerchMockup } from './MerchMockup';
import { sounds } from '../utils/audio';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAddToCart
}) => {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.hasSizes || product.requiresCustomNotes) {
      onSelectProduct(product);
    } else {
      onQuickAddToCart(product);
      sounds.playLikeChime();
    }
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-[#11131c] rounded-xl border border-white/10 hover:border-purple-500/40 transition-all duration-200 flex flex-col overflow-hidden shadow-lg hover:shadow-purple-950/20 cursor-pointer"
    >
      {/* Product Visual Area */}
      <div className="relative w-full aspect-square bg-[#0b0c13] overflow-hidden flex items-center justify-center p-2">
        {product.mockupType ? (
          <MerchMockup type={product.mockupType} title={product.name} />
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
            loading="lazy"
          />
        )}

        {/* Badge overlay */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-600/90 text-white border border-purple-400/30 uppercase tracking-wide">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-1">
            {product.tagline}
          </p>

          {/* Custom doll note indicator */}
          {product.requiresCustomNotes && (
            <div className="mt-2 text-[10px] text-purple-300 bg-purple-950/30 border border-purple-800/30 px-2 py-0.5 rounded-md">
              100% Freehand • Made to Order
            </div>
          )}
        </div>

        {/* Price & Add to Bag */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-white font-['Russo_One',sans-serif]">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="h-8 px-3 rounded-lg bg-white/5 hover:bg-purple-600 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10 hover:border-purple-500/50"
          >
            {product.requiresCustomNotes ? (
              <>
                <Scissors className="w-3 h-3" />
                <span>Customize</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>{product.hasSizes ? 'Select Size' : 'Add'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
