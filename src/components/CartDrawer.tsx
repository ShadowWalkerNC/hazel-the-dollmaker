import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Scissors } from 'lucide-react';
import type { CartItem } from '../types';
import { YarnBallIcon } from './CrochetIcons';
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
  const discount = appliedPromo ? (subtotal * appliedPromo.percent) / 100 : 0;
  const isFreeShipping = subtotal >= 65.0;
  const shippingCost = items.length === 0 ? 0 : (isFreeShipping ? 0 : 5.0);
  const total = Math.max(0, subtotal - discount + shippingCost);
  const totalDollSlots = items.reduce((sum, item) => sum + (item.product.dollCapacityUsage * item.quantity), 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();

    if (code === 'LIMITLESS10') {
      setAppliedPromo({ code, percent: 10 });
      sounds.playRingBell();
    } else if (code === 'MAINEFIBER') {
      setAppliedPromo({ code, percent: 15 });
      sounds.playRingBell();
    } else if (code) {
      setPromoError('Promo code not recognized.');
      setAppliedPromo(null);
    }
  };

  const handleOrderViaInstagram = () => {
    const list = items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.product.name} ${it.selectedSize ? `(Size ${it.selectedSize})` : ''} - $${(
            it.product.price * it.quantity
          ).toFixed(2)}${it.customNotes ? `\n  Notes: "${it.customNotes}"` : ''}`
      )
      .join('\n');

    const message = `Hi Hazel! 🧶 I picked out items on your website:\n${list}\n\nEstimated Total: $${total.toFixed(
      2
    )}\nI'd love to discuss order review, shipping, and payment options with you!`;

    navigator.clipboard.writeText(message);
    setCopiedDm(true);
    sounds.playLikeChime();
    setTimeout(() => {
      window.open('https://www.instagram.com/hazel_the_dollmaker/', '_blank');
      setCopiedDm(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#110f1c] border-l-2 border-dashed border-pink-500/30 text-gray-100 flex flex-col shadow-2xl">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b-2 border-dashed border-pink-400/20 bg-[#161324] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <YarnBallIcon className="w-4 h-4 text-pink-200" />
              </div>
              <div>
                <h2 className="text-base font-crochet font-bold text-white tracking-wide">
                  Your Yarn Bag
                </h2>
                <span className="text-[11px] text-pink-300 font-script">
                  {items.length === 0 ? 'Basket is empty' : `${items.length} item type(s) • ${totalDollSlots} doll slot(s)`}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body - Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-20 crochet-patch rounded-2xl p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-pink-400/40 mx-auto" />
                <h3 className="text-sm font-crochet font-bold text-white">Your bag is empty</h3>
                <p className="text-xs text-gray-300 font-script max-w-xs mx-auto">
                  Explore Hazel’s official t-shirts, stickers, accessories, and wrestling collectibles!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-crochet font-bold shadow-md border border-dashed border-pink-300/40 cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-black/40 border border-dashed border-pink-400/25 flex items-start justify-between gap-3"
                >
                  <div className="w-16 h-16 rounded-xl bg-gray-900 border border-dashed border-pink-400/30 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-crochet font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    {item.selectedSize && (
                      <span className="text-[10px] text-pink-300 font-crochet">
                        Size: {item.selectedSize}
                      </span>
                    )}
                    {item.customNotes && (
                      <p className="text-[10px] text-amber-300 line-clamp-1 italic font-script">
                        "{item.customNotes}"
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-dashed border-pink-400/30 rounded-lg bg-black/50 text-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-gray-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-white font-mono">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-gray-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
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

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t-2 border-dashed border-pink-400/20 bg-[#161324] space-y-3">
              
              {/* Promo code */}
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

              {/* Price Breakdown */}
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

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onOpenCheckout(appliedPromo?.code || '', discount)}
                  className="w-full py-3 rounded-xl font-crochet font-bold text-sm text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-600/30 border border-dashed border-pink-300/40 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <span>Send Order to Hazel for Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleOrderViaInstagram}
                  className="w-full py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-200 text-xs font-crochet font-bold border border-dashed border-pink-400/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>{copiedDm ? 'Copied Bag! Opening Instagram...' : 'Inquire Direct via Instagram DM'}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
