import React, { useState } from 'react';
import { X, ExternalLink, Send, HeartHandshake } from 'lucide-react';
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
  const [completedOrder, setCompletedOrder] = useState<OrderInfo | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 65.0;
  const shippingCost = isFreeShipping ? 0 : 5.0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !shippingAddress) return;

    setIsSubmitting(true);
    const orderId = `HDM-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderInfo = {
      orderId,
      customerName,
      customerEmail,
      customerInstagram: customerInstagram ? (customerInstagram.startsWith('@') ? customerInstagram : `@${customerInstagram}`) : undefined,
      customerPhone,
      preferredContact,
      shippingAddress: `${shippingAddress}, ${city}, ${stateCode} ${zip}`,
      items,
      subtotal,
      discount,
      shipping: shippingCost,
      total,
      promoCode,
      status: 'pending_review',
      notesToHazel,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: Date.now()
    };

    try {
      // Send to full backend API
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (err) {
      console.warn('Backend order sync fallback to local store:', err);
    }

    setCompletedOrder(newOrder);
    setIsCompleted(true);
    setIsSubmitting(false);
    sounds.playRingBell();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onOrderSuccess(newOrder);
  };

  // Generate Instagram DM URL prefilled
  const getInstagramDmUrl = () => {
    return 'https://www.instagram.com/hazel_the_dollmaker/';
  };

  // Generate WhatsApp prefilled message
  const getWhatsAppOrderUrl = (order: OrderInfo) => {
    const lines = order.items.map(it => `• ${it.quantity}x ${it.product.name} ${it.selectedSize ? `(${it.selectedSize})` : ''} - $${(it.product.price * it.quantity).toFixed(2)}`);
    const text = `Hi Hazel! 🧶 I just submitted order #${order.orderId} on your site:
${lines.join('\n')}
Total: $${order.total.toFixed(2)}
Ship to: ${order.shippingAddress}

I'd like to finalize payment and shipping options with you!`;
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
                {isCompleted ? 'Hazel will review your order & contact you to finalize details' : 'Direct consultation on payment options, custom gear & shipping'}
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {isCompleted && completedOrder ? (
            /* Success Screen */
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-3xl instagram-gradient flex items-center justify-center text-white text-3xl shadow-xl shadow-pink-600/30">
                💌
              </div>

              <div>
                <span className="text-xs font-crochet font-bold text-pink-400 uppercase tracking-widest">
                  Order Successfully Sent To Hazel
                </span>
                <h3 className="text-2xl font-black text-white font-['Russo_One',sans-serif] mt-1">
                  Order #{completedOrder.orderId}
                </h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto mt-2 leading-relaxed font-script">
                  Thank you, <strong className="text-white">{completedOrder.customerName}</strong>! Hazel received your request and will reach out via <strong className="text-pink-300 uppercase">{completedOrder.preferredContact}</strong> to discuss payment methods (Venmo, PayPal, Zelle, Card) and shipping timelines.
                </p>
              </div>

              {/* Direct Next Step Action Badges */}
              <div className="p-4 rounded-2xl bg-black/60 border-2 border-dashed border-pink-400/30 text-left space-y-3">
                <span className="text-xs font-crochet font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-pink-400" />
                  <span>Fast-Track Your Order With Hazel Now:</span>
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={getInstagramDmUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl instagram-gradient hover:opacity-95 text-white text-xs font-crochet font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <InstagramIcon className="w-4 h-4 text-white" />
                    <span>Message Hazel on Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={getWhatsAppOrderUrl(completedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-crochet font-bold flex items-center justify-center gap-2 shadow-md transition-all border border-dashed border-emerald-300/40"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Order Receipt Card */}
              <div className="p-4 rounded-2xl bg-[#0e1017] border border-dashed border-pink-400/20 text-left space-y-3 text-xs font-script">
                <div className="flex justify-between items-center pb-2 border-b border-dashed border-pink-400/20 text-gray-400 font-semibold font-crochet">
                  <span>Item Summary ({completedOrder.items.length} items)</span>
                  <span>{completedOrder.date}</span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-200">
                      <div>
                        <div className="font-bold text-white">{it.quantity}x {it.product.name}</div>
                        {it.selectedSize && <span className="text-[10px] text-gray-400">Size: {it.selectedSize}</span>}
                        {it.customNotes && <div className="text-[10px] text-pink-300 italic truncate max-w-xs">Notes: {it.customNotes}</div>}
                      </div>
                      <span className="font-mono">${(it.product.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-dashed border-pink-400/20 flex justify-between font-bold text-sm text-white font-crochet">
                  <span>Estimated Total (to finalize)</span>
                  <span className="text-pink-400 font-['Russo_One',sans-serif]">${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-crochet font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-dashed border-pink-400/30 transition-all cursor-pointer"
              >
                Back To Store
              </button>
            </div>
          ) : (
            /* Order Review Submission Form */
            <form onSubmit={handleSubmitOrder} className="space-y-5 font-crochet">
              
              {/* Review explanation pill */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-dashed border-pink-400/30 text-xs text-pink-200 flex items-start gap-2.5 font-script">
                <YarnBallIcon className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Handcrafted Direct Review:</strong> Because every doll and apparel piece is inspected and made-to-order, Hazel will review your details to discuss flexible payment (Venmo, PayPal, Zelle, Card) and custom gear requests before taking payment.
                </span>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  1. Contact & Review Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Nic Nemeth or Jane Doe"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">
                      Email Address *
                    </label>
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
                    <label className="block text-[11px] font-bold text-gray-300 mb-1 flex items-center gap-1">
                      <InstagramIcon className="w-3 h-3 text-pink-400" />
                      <span>Instagram Handle</span>
                    </label>
                    <input
                      type="text"
                      value={customerInstagram}
                      onChange={(e) => setCustomerInstagram(e.target.value)}
                      placeholder="@your_instagram"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1 flex items-center gap-1">
                      <WhatsAppIcon className="w-3 h-3 text-emerald-400" />
                      <span>WhatsApp Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (207) 555-0199"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 font-script"
                    />
                  </div>
                </div>

                {/* Preferred Review Channel */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1.5">
                    How should Hazel contact you to confirm payment & shipping?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreferredContact('instagram')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        preferredContact === 'instagram'
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-300 shadow-md'
                          : 'bg-black/40 text-gray-400 border-dashed border-white/20 hover:text-white'
                      }`}
                    >
                      <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                      <span>Instagram DM</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreferredContact('whatsapp')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        preferredContact === 'whatsapp'
                          ? 'bg-emerald-600 text-white border-emerald-300 shadow-md'
                          : 'bg-black/40 text-gray-400 border-dashed border-white/20 hover:text-white'
                      }`}
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreferredContact('email')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        preferredContact === 'email'
                          ? 'bg-purple-600 text-white border-purple-300 shadow-md'
                          : 'bg-black/40 text-gray-400 border-dashed border-white/20 hover:text-white'
                      }`}
                    >
                      <span>✉️ Email</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  2. Shipping Destination
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">
                    Street Address *
                  </label>
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
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Postal Code *</label>
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
                    Special Custom Gear Notes for Hazel (Optional)
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

              {/* Order total & Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl font-crochet font-bold text-sm text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-600/30 border border-dashed border-pink-300/40 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Order to Hazel for Review • ${total.toFixed(2)}</span>
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-2 font-script">
                  Hazel will review your order within 24h to finalize payment options and custom gear specifications.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
