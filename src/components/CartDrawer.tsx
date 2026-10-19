import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Tag, Check, Truck, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CartItem } from '../types';
import { InstagramIcon } from './InstagramIcon';
import { YarnBallIcon } from './CrochetIcons';
import { sounds } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenCheckout: (promoCode: string, discount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [copiedDm, setCopiedDm] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedPromo ? subtotal * (appliedPromo.percent / 100) : 0;
  const freeShippingThreshold = 65.0;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 5.0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCodeInput.trim().toUpperCase();
    if (clean === 'LIMITLESS10') {
      setAppliedPromo({ code: clean, percent: 10 });
      setPromoError('');
      sounds.playLikeChime();
    } else if (clean === 'HAZELVIP') {
      setAppliedPromo({ code: clean, percent: 15 });
      setPromoError('');
      sounds.playLikeChime();
    } else {
      setPromoError('Invalid code. Try "LIMITLESS10" or "HAZELVIP"');
    }
  };

  const handleOrderViaInstagram = () => {
    const lines = items.map(
      (item) => `• ${item.quantity}x ${item.product.name} ${item.selectedSize ? `(Size: ${item.selectedSize})` : ''} - $${(item.product.price * item.quantity).toFixed(2)}${item.customNotes ? `\n  Notes: "${item.customNotes}"` : ''}`
    );

    const dmText = `Hi Hazel! 🪡✨ I'd like to place an order from your Hazel The Dollmaker store:

${lines.join('\n')}

Subtotal: $${subtotal.toFixed(2)}
Estimated Total: $${total.toFixed(2)}

Please let me know how you'd like me to send payment and shipping details. Thank you!`;

    navigator.clipboard.writeText(dmText);
    setCopiedDm(true);
    sounds.playLikeChime();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    setTimeout(() => {
      window.open('https://www.instagram.com/hazel_the_dollmaker/', '_blank');
      setCopiedDm(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#12101b] border-l-2 border-dashed border-pink-400/40 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b-2 border-dashed border-pink-400/20 flex items-center justify-between bg-[#151221]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md border border-dashed border-pink-300/40">
              <YarnBallIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-crochet font-bold text-white tracking-wide">
                Your Shopping Bag
              </h2>
              <p className="text-xs text-pink-300 font-script">
                {items.reduce((c, i) => c + i.quantity, 0)} item(s) selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Styled as Yarn Gauge */}
        <div className="p-3 bg-pink-500/10 border-b border-dashed border-pink-400/20 text-xs font-crochet">
          <div className="flex items-center justify-between mb-1.5 font-semibold text-pink-200">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-pink-400" />
              {isFreeShipping ? '🎉 Free Shipping Unlocked!' : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping!`}
            </span>
            <span className="text-pink-400 font-bold">
              {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
            </span>
          </div>
          <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden p-0.5 border border-dashed border-pink-400/30">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-black/40 border-2 border-dashed border-pink-400/30 flex items-center justify-center text-pink-400">
                <YarnBallIcon className="w-8 h-8 text-pink-400/70" />
              </div>
              <h3 className="text-base font-crochet font-bold text-white">Your Yarn Bag Is Empty</h3>
              <p className="text-xs text-gray-300 font-script max-w-xs mx-auto">
                Discover Hazel's official logo tees, hoodies, stickers, or request a 1-of-1 wrestler crochet doll!
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-crochet font-bold transition-all shadow-md border border-dashed border-pink-300/40 cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl crochet-patch flex items-center gap-3 group border border-dashed border-pink-400/30"
              >
                <div className="w-16 h-16 rounded-xl bg-black/60 overflow-hidden flex-shrink-0 p-1 border border-dashed border-pink-400/20">
                  <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-crochet font-bold text-white truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-gray-300 flex items-center gap-2 mt-0.5 font-script">
                    <span className="font-bold text-pink-300">
                      ${item.product.price.toFixed(2)}
                    </span>
                    {item.selectedSize && (
                      <span className="px-1.5 py-0.2 rounded-md bg-pink-500/10 text-pink-200 border border-dashed border-pink-400/30 text-[10px] font-crochet">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>
                  {item.customNotes && (
                    <p className="text-[10px] text-amber-300 italic truncate mt-0.5 font-script">
                      Notes: {item.customNotes}
                    </p>
                  )}

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-black/50 border border-dashed border-pink-400/30 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 text-gray-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-crochet font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 text-gray-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-white font-['Russo_One',sans-serif]">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t-2 border-dashed border-pink-400/20 bg-[#141120] space-y-3">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-pink-400" />
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Promo Code (LIMITLESS10)"
                  className="w-full pl-8 pr-2 py-1.5 rounded-xl bg-black/50 border border-dashed border-pink-400/30 text-xs font-crochet text-white uppercase focus:outline-none focus:border-pink-400"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-pink-200 text-xs font-crochet font-bold border border-dashed border-pink-400/30 transition-all cursor-pointer"
              >
                Apply
              </button>
            </form>
            {appliedPromo && (
              <p className="text-[11px] text-emerald-400 font-crochet font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                {appliedPromo.code} applied ({appliedPromo.percent}% OFF)!
              </p>
            )}
            {promoError && (
              <p className="text-[11px] text-rose-400 font-script">{promoError}</p>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-dashed border-pink-400/20 font-crochet">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({appliedPromo.percent}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{isFreeShipping ? <strong className="text-emerald-400">FREE</strong> : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-dashed border-pink-400/20">
                <span>Total</span>
                <span className="text-base text-pink-400 font-['Russo_One',sans-serif]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onOpenCheckout(appliedPromo?.code || '', discount)}
                className="w-full py-3 rounded-xl font-crochet font-bold text-sm text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-600/30 border border-dashed border-pink-300/40 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleOrderViaInstagram}
                className="w-full py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-200 text-xs font-crochet font-bold border border-dashed border-pink-400/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>{copiedDm ? 'Copied Bag to DM! Opening IG...' : 'Order Direct via Instagram DM'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
