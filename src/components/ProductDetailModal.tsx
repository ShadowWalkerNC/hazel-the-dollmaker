import React, { useState } from 'react';
import { X, ShoppingBag, Star, Check, Scissors, Truck, ShieldCheck, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Product, CartItem } from '../types';
import { MerchMockup } from './MerchMockup';
import { YarnBallIcon, WoodenButtonIcon } from './CrochetIcons';
import { sounds } from '../utils/audio';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('primary');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const currentImg = activeImage === 'primary' ? product.imageUrl : (product.secondaryImageUrl || product.imageUrl);

  const handleAdd = () => {
    const item: CartItem = {
      id: `${product.id}-${selectedSize || 'default'}-${Date.now()}`,
      product,
      quantity,
      selectedSize: product.hasSizes ? selectedSize : undefined,
      customNotes: product.requiresCustomNotes ? customNotes : undefined,
    };

    onAddToCart(item);
    sounds.playLikeChime();
    setAddedAnimation(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 crochet-patch rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border-2 border-dashed border-pink-400/40">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-dashed border-pink-400/20 bg-[#141120]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-dashed border-pink-400/50 bg-black p-0.5">
              <img src="/hazel-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-dashed border-pink-400/40 uppercase font-crochet font-bold">
                {product.badge || 'Official Merch'}
              </span>
              <h2 className="text-base sm:text-lg font-crochet font-bold text-white tracking-wide truncate max-w-sm sm:max-w-md">
                {product.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Image Viewer */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#100e1b] border-2 border-dashed border-pink-400/30 aspect-square flex items-center justify-center p-3">
              {product.mockupType ? (
                <MerchMockup type={product.mockupType} title={product.name} />
              ) : (
                <img
                  src={currentImg}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              )}
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-crochet font-black px-2.5 py-1 rounded-lg uppercase shadow-lg border border-dashed border-pink-200">
                  Save ${(product.originalPrice - product.price).toFixed(0)}
                </div>
              )}
              <div className="absolute top-4 right-4 text-pink-400/30">
                <WoodenButtonIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Thumbnail switcher if secondary image exists */}
            {product.secondaryImageUrl && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveImage('primary')}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-900 p-1 transition-all cursor-pointer ${
                    activeImage === 'primary' ? 'border-pink-500 shadow-md shadow-pink-500/30' : 'border-gray-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.imageUrl} alt="Thumbnail 1" className="w-full h-full object-contain" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage('secondary')}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-900 p-1 transition-all cursor-pointer ${
                    activeImage === 'secondary' ? 'border-pink-500 shadow-md shadow-pink-500/30' : 'border-gray-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.secondaryImageUrl} alt="Thumbnail 2" className="w-full h-full object-contain" />
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-dashed border-pink-400/25 text-xs text-gray-300 space-y-2 font-script">
              <div className="flex items-center gap-2 text-pink-300 font-semibold font-crochet">
                <Truck className="w-4 h-4 text-pink-400" />
                <span>Worldwide Shipping from Maine, USA</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300 font-semibold font-crochet">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>100% Quality & Craftsmanship Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Options & Add to Cart */}
          <div className="md:col-span-6 space-y-5">
            
            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-300 mb-1 font-crochet">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <span className="font-bold">{product.rating}</span>
                <span className="text-gray-400">({product.reviewCount} verified reviews)</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight font-['Russo_One',sans-serif]">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-white font-['Russo_One',sans-serif]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-dashed border-emerald-400/40 font-crochet font-semibold">
                  In Stock & Ready to Ship
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-script">
              {product.description}
            </p>

            {/* Size Selector for Apparel */}
            {product.hasSizes && product.sizes && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-crochet">
                  <span className="font-semibold text-gray-300">Select Size:</span>
                  <span className="text-pink-400 font-semibold">Standard Unisex Streetwear Fit</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-xl text-xs font-crochet font-bold transition-all border cursor-pointer ${
                        selectedSize === size
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-300 shadow-md shadow-pink-600/30 scale-105'
                          : 'bg-black/40 text-gray-300 border-dashed border-white/20 hover:border-pink-400 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Notes for Dolls */}
            {product.requiresCustomNotes && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-black/40 border-2 border-dashed border-pink-400/30">
                <label className="block text-xs font-crochet font-bold text-pink-300 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-pink-400" />
                  <span>Custom Wrestler Likeness Details *</span>
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder={product.customNotesPlaceholder || 'Wrestler name, gear colorway, hair styling, belt details, reference links...'}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs font-script text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 resize-none"
                />
                <p className="text-[11px] text-gray-300 font-script">
                  Hazel will review your notes and match photos directly before freehand sculpting in yarn.
                </p>
              </div>
            )}

            {/* Features checklist */}
            <div className="space-y-1.5">
              <span className="text-xs font-crochet font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <YarnBallIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Craft & Garment Specifications:</span>
              </span>
              <ul className="space-y-1 text-xs text-gray-300 font-script">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart Action */}
            <div className="pt-3 border-t border-dashed border-pink-400/20 flex items-center gap-3">
              <div className="flex items-center bg-black/50 border border-dashed border-pink-400/30 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 font-bold text-sm transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-9 text-center font-crochet font-bold text-white text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 font-bold text-sm transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-xl font-crochet font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all border border-dashed border-pink-300/40 cursor-pointer ${
                  addedAnimation
                    ? 'bg-emerald-600 scale-98'
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-600/30 active:scale-98'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added To Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Bag • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Instagram DM Option */}
            <div className="text-center pt-1">
              <a
                href="https://www.instagram.com/hazel_the_dollmaker/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-crochet text-pink-300 hover:text-white font-semibold inline-flex items-center gap-1 underline"
              >
                <span>Prefer to order or ask questions via Instagram DM? Click here</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
