import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CartItem } from '../types';
import { InstagramIcon } from './InstagramIcon';
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
      <div className="relative w-full max-w-md bg-[#11131c] border-l border-gray-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-[#0e1017]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg instagram-gradient flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Russo_One',sans-serif]">
                Your Shopping Bag
              </h2>
              <p className="text-xs text-gray-400">
                {items.reduce((c, i) => c + i.quantity, 0)} item(s) selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-3 bg-purple-950/20 border-b border-purple-800/30 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-semibold text-purple-200">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-pink-400" />
              {isFreeShipping ? '🎉 Free US Shipping Unlocked!' : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping!`}
            </span>
            <span className="text-pink-400 font-bold">
              {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-800/50 flex items-center justify-center text-gray-500">
                <ShoppingBag className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-base font-bold text-white">Your Bag Is Empty</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Discover Hazel's official logo tees, hoodies, stickers, or commission a 1-of-1 wrestler crochet doll!
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-gray-900/70 border border-gray-800 flex items-center gap-3 group"
              >
                <div className="w-16 h-16 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 p-1">
                  <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-pink-300">
                      ${item.product.price.toFixed(2)}
                    </span>
                    {item.selectedSize && (
                      <span className="px-1.5 py-0.2 rounded bg-gray-800 text-gray-300 border border-gray-700 text-[10px]">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>
                  {item.customNotes && (
                    <p className="text-[10px] text-purple-300 italic truncate mt-0.5">
                      Notes: {item.customNotes}
                    </p>
                  )}

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 text-gray-400 hover:text-white flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 text-gray-400 hover:text-white flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-500 hover:text-red-400 p-1 transition-colors"
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
          <div className="p-4 sm:p-5 border-t border-gray-800 bg-[#0c0e15] space-y-3">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Promo Code (LIMITLESS10)"
                  className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs text-white uppercase focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition-colors"
              >
                Apply
              </button>
            </form>
            {appliedPromo && (
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                {appliedPromo.code} applied ({appliedPromo.percent}% OFF)!
              </p>
            )}
            {promoError && (
              <p className="text-[11px] text-red-400">{promoError}</p>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-gray-800/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
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
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
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
                className="w-full py-3 rounded-xl font-bold text-sm text-white instagram-gradient hover:opacity-95 shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleOrderViaInstagram}
                className="w-full py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 text-xs font-semibold border border-purple-800/50 flex items-center justify-center gap-2 transition-colors"
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
