import React, { useState } from 'react';
import { X, ShoppingBag, Star, Check, Scissors, Truck, ShieldCheck, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Product, CartItem } from '../types';
import { MerchMockup } from './MerchMockup';
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
      <div className="relative w-full max-w-4xl my-8 bg-[#12141e] border border-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 bg-[#0e1017]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-purple-500/40 bg-gray-900">
              <img src="/hazel-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase font-semibold">
                {product.badge || 'Official Merch'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide truncate max-w-sm sm:max-w-md">
                {product.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Image Viewer */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#0c0e16] border border-gray-800 aspect-square flex items-center justify-center p-3">
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
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase shadow-lg">
                  Save ${(product.originalPrice - product.price).toFixed(0)}
                </div>
              )}
            </div>

            {/* Thumbnail switcher if secondary image exists */}
            {product.secondaryImageUrl && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveImage('primary')}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-900 p-1 transition-all ${
                    activeImage === 'primary' ? 'border-pink-500 shadow-md shadow-pink-500/30' : 'border-gray-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.imageUrl} alt="Thumbnail 1" className="w-full h-full object-contain" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage('secondary')}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-900 p-1 transition-all ${
                    activeImage === 'secondary' ? 'border-pink-500 shadow-md shadow-pink-500/30' : 'border-gray-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.secondaryImageUrl} alt="Thumbnail 2" className="w-full h-full object-contain" />
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-300 space-y-2">
              <div className="flex items-center gap-2 text-pink-300 font-semibold">
                <Truck className="w-4 h-4 text-pink-400" />
                <span>Worldwide Shipping from Maine, USA</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>100% Quality & Likeness Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Options & Add to Cart */}
          <div className="md:col-span-6 space-y-5">
            
            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 mb-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold">{product.rating}</span>
                <span className="text-gray-400">({product.reviewCount} reviews)</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight font-['Russo_One',sans-serif]">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-white font-['Russo_One',sans-serif]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  In Stock & Ready
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector for Apparel */}
            {product.hasSizes && product.sizes && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-300">Select Size:</span>
                  <span className="text-pink-400 font-semibold">Standard Unisex Streetwear Fit</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSize === size
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 scale-105'
                          : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 hover:text-white'
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
              <div className="space-y-2 p-3.5 rounded-2xl bg-purple-950/20 border border-purple-800/40">
                <label className="block text-xs font-bold text-purple-200 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-pink-400" />
                  <span>Custom Wrestler Likeness Details *</span>
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder={product.customNotesPlaceholder || 'Wrestler name, gear colorway, hair styling, belt details, reference links...'}
                  className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none"
                />
                <p className="text-[11px] text-gray-400">
                  Hazel will review your notes and match photos directly before freehand sculpting.
                </p>
              </div>
            )}

            {/* Features checklist */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Craft Specifications:
              </span>
              <ul className="space-y-1 text-xs text-gray-300">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart Action */}
            <div className="pt-3 border-t border-gray-800 flex items-center gap-3">
              <div className="flex items-center bg-gray-900 border border-gray-700 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 font-bold text-sm transition-colors"
                >
                  -
                </button>
                <span className="w-9 text-center font-bold text-white text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 font-bold text-sm transition-colors"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                  addedAnimation
                    ? 'bg-emerald-600 scale-98'
                    : 'instagram-gradient hover:opacity-95 shadow-pink-600/30 active:scale-98'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart • ${(product.price * quantity).toFixed(2)}</span>
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
                className="text-xs text-pink-400 hover:text-pink-300 font-semibold inline-flex items-center gap-1 underline"
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
