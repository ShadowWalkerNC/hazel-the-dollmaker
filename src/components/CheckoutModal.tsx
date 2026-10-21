import React, { useState } from 'react';
import { X, Send, HeartHandshake, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CartItem, OrderInfo } from '../types';
import { InstagramIcon } from './InstagramIcon';
import { WhatsAppIcon } from './WhatsAppIcon';
import { YarnBallIcon } from './CrochetIcons';
import { sounds } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoCode?: string;
  discount: number;
  onOrderSuccess: (order: OrderInfo) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  promoCode,
  discount,
  onOrderSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerInstagram, setCustomerInstagram] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'instagram' | 'whatsapp' | 'email'>('instagram');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [zip, setZip] = useState('');
  const [notesToHazel, setNotesToHazel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<OrderInfo | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 65.0;
  const shippingCost = items.length === 0 ? 0 : (isFreeShipping ? 0 : 5.0);
  const total = Math.max(0, subtotal - discount + shippingCost);
  const dollSlotsReserved = items.reduce((sum, item) => sum + (item.product.dollCapacityUsage * item.quantity), 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim()) {
      setErrorMessage('Please complete your name, email, and shipping address.');
      return;
    }

    setIsSubmitting(true);
    const orderPayload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerInstagram: customerInstagram.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      preferredContact,
      shippingAddress: `${shippingAddress.trim()}, ${city.trim()}, ${stateCode.trim()} ${zip.trim()}`,
      items,
      subtotal,
      discount,
      shipping: shippingCost,
      total,
      dollSlotsReserved,
      promoCode,
      notesToHazel: notesToHazel.trim() || undefined,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json() as { error?: string; order?: OrderInfo };
      if (!response.ok || data.error || !data.order) {
        throw new Error(data.error || 'Could not record order review request.');
      }

      setCompletedOrder(data.order);
      setIsCompleted(true);
      sounds.playRingBell();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onOrderSuccess(data.order);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit order for review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppOrderUrl = (order: OrderInfo) => {
    const lines = order.items.map(
      (it) => `• ${it.quantity}x ${it.product.name} ${it.selectedSize ? `(${it.selectedSize})` : ''} - $${(it.product.price * it.quantity).toFixed(2)}`
    );
    const text = `Hi Hazel! 🧶 I just submitted order inquiry #${order.orderId} on your site:\n${lines.join('\n')}\nTotal: $${order.total.toFixed(2)}\nShip to: ${order.shippingAddress}\n\nI'd like to discuss payment options and shipping with you!`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 crochet-patch rounded-3xl shadow-2xl overflow-hidden flex flex-col border-2 border-dashed border-pink-400/40">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-dashed border-pink-400/20 bg-[#141120]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-dashed border-pink-400/50 p-0.5 bg-black">
              <img src="/hazel-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <h2 className="text-lg font-crochet font-bold text-white">
                {isCompleted ? 'Order Sent to Hazel!' : 'Send Order to Hazel for Review'}
              </h2>
              <p className="text-xs text-pink-300 font-script">
                {isCompleted ? 'Reference created. Direct review with Hazel.' : 'Hazel verifies sizing, custom gear, shipping, and payment options.'}
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[82vh]">
          {isCompleted && completedOrder ? (
            /* Order Submitted Success View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-pink-600/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-dashed border-pink-400/40 uppercase">
                  Order Inquiry #{completedOrder.orderId}
                </span>
                <h3 className="text-xl sm:text-2xl font-crochet font-extrabold text-white">
                  Hazel Received Your Order Inquiry!
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-script max-w-lg mx-auto">
                  Thank you, <strong className="text-white">{completedOrder.customerName}</strong>! Hazel reviews each order personally to confirm custom gear details, shipping timeline, and payment method (Venmo, PayPal, Zelle, Card).
                </p>
              </div>

              {/* Order Summary Swatch */}
              <div className="crochet-patch p-4 rounded-2xl text-left space-y-2 text-xs">
                <div className="font-crochet font-bold text-pink-300 border-b border-dashed border-pink-400/20 pb-1.5 flex justify-between">
                  <span>Order Items:</span>
                  <span className="text-white">${completedOrder.total.toFixed(2)}</span>
                </div>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-gray-300">
                    <span>{it.quantity}x {it.product.name} {it.selectedSize ? `(${it.selectedSize})` : ''}</span>
                    <span>${(it.product.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-dashed border-pink-400/20 flex justify-between text-[11px] text-gray-400 font-script">
                  <span>Destination: {completedOrder.shippingAddress}</span>
                  <span>Contact: {completedOrder.preferredContact}</span>
                </div>
              </div>

              {/* Direct Messaging CTAs */}
              <div className="p-4 rounded-2xl bg-black/50 border border-dashed border-pink-400/30 space-y-3 text-left">
                <div className="text-xs font-crochet font-bold text-white flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-pink-400" />
                  <span>Connect Directly to Discuss Payment & Shipping:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href="https://www.instagram.com/hazel_the_dollmaker/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl instagram-gradient hover:opacity-95 text-white text-xs font-crochet font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <InstagramIcon className="w-4 h-4 text-white" />
                    <span>DM on Instagram</span>
                  </a>

                  <a
                    href={getWhatsAppOrderUrl(completedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-crochet font-bold flex items-center justify-center gap-2 shadow-md transition-all border border-dashed border-emerald-300/40"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Send on WhatsApp</span>
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-crochet font-bold border border-dashed border-white/20 transition-all cursor-pointer"
              >
                Back to Store
              </button>
            </div>
          ) : (
            /* Order Submission Form */
            <form onSubmit={handleSubmitOrder} className="space-y-5 font-crochet">
              
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-dashed border-rose-500/50 text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Items Summary Banner */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-dashed border-pink-400/25 space-y-2">
                <div className="flex justify-between text-xs font-bold text-pink-300">
                  <span>Inquiry Items ({items.length})</span>
                  <span>Estimated Total: ${total.toFixed(2)}</span>
                </div>
                <div className="space-y-1 text-xs text-gray-300 font-script max-h-24 overflow-y-auto">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span className="truncate max-w-xs">• {it.quantity}x {it.product.name} {it.selectedSize ? `(${it.selectedSize})` : ''}</span>
                      <span>${(it.product.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {dollSlotsReserved > 0 && (
                  <div className="text-[10px] text-amber-300 pt-1 border-t border-dashed border-pink-400/20">
                    ★ Consumes {dollSlotsReserved} handmade doll slot(s) from Hazel's studio capacity.
                  </div>
                )}
              </div>

              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  1. Your Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Instagram Handle (Optional)</label>
                    <input
                      type="text"
                      value={customerInstagram}
                      onChange={(e) => setCustomerInstagram(e.target.value)}
                      placeholder="@your_handle"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Phone / WhatsApp (Optional)</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (207) 555-0199"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">
                    How should Hazel reply to you?
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['instagram', 'whatsapp', 'email'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPreferredContact(method)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          preferredContact === method
                            ? 'bg-pink-600 text-white border-pink-300 shadow-md'
                            : 'bg-black/40 text-gray-400 border-dashed border-white/20 hover:text-white'
                        }`}
                      >
                        {method === 'instagram' ? '📷 Instagram DM' : method === 'whatsapp' ? '💬 WhatsApp' : '✉️ Email'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  2. Shipping Destination
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="123 Ringside St, Apt 4"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Portland"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      placeholder="ME"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Zip *</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="04101"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">
                    Special Gear or Shipping Notes for Hazel (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notesToHazel}
                    onChange={(e) => setNotesToHazel(e.target.value)}
                    placeholder="e.g. Need by next month's Limitless show, preferred payment via Venmo, specific gear colorway..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 resize-none font-script"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl font-crochet font-bold text-sm text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-600/30 border border-dashed border-pink-300/40 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending to Hazel...' : `Send Order to Hazel for Review • $${total.toFixed(2)}`}</span>
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-2 font-script">
                  No payment is processed now. Hazel reviews all requests personally before confirming payment and shipping.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
