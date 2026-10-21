import React from 'react';
import { ShoppingBag, Scissors, Sparkles, Clock, Eye, AlertCircle } from 'lucide-react';
import type { Product } from '../types';
import { MerchMockup } from './MerchMockup';
import { YarnBallIcon, WoodenButtonIcon } from './CrochetIcons';
import { sounds } from '../utils/audio';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onOpenInterestModal?: (kind?: 'collector') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAddToCart,
  onOpenInterestModal,
}) => {
  const isAvailable = product.state === 'available';
  const isPreview = product.state === 'preview';
  const isInquiryOnly = product.state === 'inquiry_only';
  const isSoldOut = product.state === 'sold_out';

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPreview) {
      if (onOpenInterestModal) onOpenInterestModal('collector');
      else onSelectProduct(product);
      return;
    }
    if (isInquiryOnly || product.hasSizes || product.requiresCustomNotes) {
      onSelectProduct(product);
      return;
    }
    if (isAvailable) {
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

        {/* State Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.badge && (
            <span className="text-[10px] font-crochet font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white border border-dashed border-pink-200/50 uppercase tracking-wide shadow-md">
              {product.badge}
            </span>
          )}

          {isPreview && (
            <span className="text-[9px] font-crochet font-bold px-2 py-0.5 rounded-full bg-amber-500/90 text-black uppercase tracking-wider shadow">
              Preview / Waitlist
            </span>
          )}
          {isInquiryOnly && (
            <span className="text-[9px] font-crochet font-bold px-2 py-0.5 rounded-full bg-purple-500/90 text-white uppercase tracking-wider shadow">
              Custom Inquiry Only
            </span>
          )}
          {isSoldOut && (
            <span className="text-[9px] font-crochet font-bold px-2 py-0.5 rounded-full bg-rose-900/90 text-rose-200 uppercase tracking-wider shadow">
              Sold Out
            </span>
          )}
        </div>

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

          {/* Workload / Capacity Info */}
          {product.dollCapacityUsage > 0 && (
            <div className="mt-2 text-[10px] font-crochet text-pink-300 bg-pink-500/10 border border-dashed border-pink-400/30 px-2 py-0.5 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-1">
                <YarnBallIcon className="w-3 h-3 text-pink-400" />
                <span>Handmade doll (~{product.productionHours}h)</span>
              </span>
              <span className="text-amber-300 font-bold">{product.dollCapacityUsage} slot</span>
            </div>
          )}
        </div>

        {/* Price & Action Button */}
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
            onClick={handleActionClick}
            className={`h-8 px-3 rounded-xl text-xs font-crochet font-bold flex items-center gap-1.5 transition-all border border-dashed shadow-sm cursor-pointer ${
              isPreview
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-400/40'
                : isInquiryOnly
                ? 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border-purple-400/40'
                : isSoldOut
                ? 'bg-white/5 text-gray-500 border-gray-700 cursor-not-allowed'
                : 'bg-pink-500/10 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-pink-200 hover:text-white border-pink-400/30 hover:border-pink-300'
            }`}
          >
            {isPreview ? (
              <>
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Join List</span>
              </>
            ) : isInquiryOnly ? (
              <>
                <Scissors className="w-3 h-3 text-purple-400" />
                <span>Inquire</span>
              </>
            ) : isSoldOut ? (
              <span>Sold Out</span>
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
