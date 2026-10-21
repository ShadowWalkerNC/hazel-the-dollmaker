import React, { useState } from 'react';
import { X, ShoppingBag, Scissors, Sparkles, AlertCircle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Product, CartItem } from '../types';
import { MerchMockup } from './MerchMockup';
import { YarnBallIcon, WoodenButtonIcon } from './CrochetIcons';
import { sounds } from '../utils/audio';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onOpenInterestModal?: (kind?: 'collector') => void;
  onOpenCommissionModal?: (initialName?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenInterestModal,
  onOpenCommissionModal,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('primary');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const currentImg = activeImage === 'primary' ? product.imageUrl : (product.secondaryImageUrl || product.imageUrl);
  const isAvailable = product.state === 'available';
  const isPreview = product.state === 'preview';
  const isInquiryOnly = product.state === 'inquiry_only';
  const isSoldOut = product.state === 'sold_out';

  const handleAdd = () => {
    if (!isAvailable) return;
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
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-dashed border-pink-400/40 uppercase font-crochet font-bold">
                  {product.badge || 'Official Item'}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-white/10">
                  {product.state.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-crochet font-bold text-white tracking-wide truncate max-w-sm sm:max-w-md mt-0.5">
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
                    activeImage === 'primary' ? 'border-pink-500 shadow-md' : 'border-gray-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={product.imageUrl} alt="Primary" className="w-full h-full object-contain" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage('secondary')}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-900 p-1 transition-all cursor-pointer ${
                    activeImage === 'secondary' ? 'border-pink-500 shadow-md' : 'border-gray-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={product.secondaryImageUrl} alt="Secondary" className="w-full h-full object-contain" />
                </button>
              </div>
            )}

            {/* Workload Specs Swatch */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-dashed border-pink-400/25 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-300">
                <span className="font-crochet">Doll Studio Slots Consumed:</span>
                <strong className="text-amber-300">{product.dollCapacityUsage} slot{product.dollCapacityUsage === 1 ? '' : 's'}</strong>
              </div>
              {product.productionHours > 0 && (
                <div className="flex justify-between text-gray-300">
                  <span className="font-crochet">Estimated Freehand Work:</span>
                  <strong className="text-pink-300">~{product.productionHours} hours</strong>
                </div>
              )}
              <div className="flex justify-between text-gray-300">
                <span className="font-crochet">Handcrafted Origin:</span>
                <span className="text-white">Maine, USA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Interaction Options */}
          <div className="md:col-span-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div>
                <h1 className="text-xl sm:text-2xl font-crochet font-extrabold text-white">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-pink-300 font-script mt-1">
                  {product.tagline}
                </p>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-dashed border-pink-400/20">
                <span className="text-3xl font-black text-white font-['Russo_One',sans-serif]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {isPreview && (
                  <span className="text-xs text-amber-300 font-crochet font-semibold">
                    (Planned Launch Price)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-300 font-script leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection (For Apparel or Bundles) */}
              {product.hasSizes && product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-crochet font-bold text-gray-300">
                    Select Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-10 rounded-xl text-xs font-crochet font-bold border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-pink-600 text-white border-pink-300 shadow-md'
                            : 'bg-black/40 text-gray-300 border-dashed border-pink-400/30 hover:border-pink-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Attire Notes (For Made-To-Order Dolls) */}
              {product.requiresCustomNotes && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-crochet font-bold text-pink-300 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-pink-400" />
                    <span>Wrestler Ring Gear & Attire Details:</span>
                  </label>
                  <textarea
                    rows={3}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder={product.customNotesPlaceholder || 'Describe attire, colors, kickpads, and photo reference links...'}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/40 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script resize-none"
                  />
                  <p className="text-[11px] text-gray-400 font-script">
                    Hazel reviews every custom commission inquiry individually before confirming timeline and acceptance.
                  </p>
                </div>
              )}

              {/* Action Buttons based on State */}
              <div className="pt-4 border-t border-dashed border-pink-400/20 space-y-3">
                {isAvailable && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-dashed border-pink-400/30 rounded-xl bg-black/40 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 text-gray-400 hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-white font-mono">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 text-gray-400 hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAdd}
                      className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-crochet font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/30 border border-dashed border-pink-300/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-pink-200" />
                      <span>{addedAnimation ? 'Added to Bag!' : `Add to Bag • $${(product.price * quantity).toFixed(2)}`}</span>
                    </button>
                  </div>
                )}

                {isPreview && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenInterestModal) onOpenInterestModal('collector');
                      }}
                      className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-pink-600 hover:from-amber-500 hover:to-pink-500 text-white font-crochet font-bold text-xs sm:text-sm shadow-lg shadow-amber-900/30 border border-dashed border-amber-200/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Join Drop Notification List</span>
                    </button>
                    <p className="text-center text-[11px] text-gray-400 font-script">
                      Be notified first when the ordering window opens and the ship-by date is confirmed.
                    </p>
                  </div>
                )}

                {isInquiryOnly && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenCommissionModal) onOpenCommissionModal(product.name);
                      }}
                      className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-crochet font-bold text-xs sm:text-sm shadow-lg shadow-purple-900/30 border border-dashed border-pink-200/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Scissors className="w-4 h-4 text-white" />
                      <span>Submit Custom Inquiry to Hazel</span>
                    </button>
                    <p className="text-center text-[11px] text-gray-400 font-script">
                      Hazel verifies scope, availability, and payment details before approving custom commissions.
                    </p>
                  </div>
                )}

                {isSoldOut && (
                  <div className="p-3 rounded-xl bg-black/40 border border-dashed border-gray-700 text-center text-xs text-gray-400 font-script">
                    This item has reached capacity for this production run. Join the drop club to catch future releases.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
