import React from 'react';
import { ShoppingBag, Scissors } from 'lucide-react';
import type { Product } from '../types';
import { MerchMockup } from './MerchMockup';
import { YarnBallIcon, WoodenButtonIcon } from './CrochetIcons';
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
      className="group relative crochet-patch rounded-2xl transition-all duration-200 flex flex-col overflow-hidden shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Visual Area */}
      <div className="relative w-full aspect-square bg-[#100e1b] overflow-hidden flex items-center justify-center p-2 border-b-2 border-dashed border-pink-400/20">
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

        {/* Fabric Cloth Tag / Badge overlay */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="text-[10px] font-crochet font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white border border-dashed border-pink-200/50 uppercase tracking-wide shadow-md">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wooden Button corner decoration */}
        <div className="absolute top-2.5 right-2.5 z-10 text-pink-400/30">
          <WoodenButtonIcon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-crochet font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mt-1 font-script">
            {product.tagline}
          </p>

          {/* Custom doll note indicator */}
          {product.requiresCustomNotes && (
            <div className="mt-2 text-[10px] font-crochet text-amber-300 bg-amber-500/10 border border-dashed border-amber-400/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <YarnBallIcon className="w-3 h-3 text-amber-400" />
              <span>100% Freehand • Made to Order</span>
            </div>
          )}
        </div>

        {/* Price & Add to Bag */}
        <div className="pt-3 border-t border-dashed border-pink-400/20 flex items-center justify-between">
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
            className="h-8 px-3 rounded-xl bg-pink-500/10 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-pink-200 hover:text-white text-xs font-crochet font-bold flex items-center gap-1.5 transition-all border border-dashed border-pink-400/30 hover:border-pink-300 shadow-sm cursor-pointer"
          >
            {product.requiresCustomNotes ? (
              <>
                <Scissors className="w-3 h-3 text-pink-400 group-hover:text-white" />
                <span>Customize</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 text-pink-400 group-hover:text-white" />
                <span>{product.hasSizes ? 'Select Size' : 'Add'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
