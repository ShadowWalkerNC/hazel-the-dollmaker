import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CartItem, OrderInfo } from '../types';
import { InstagramIcon } from './InstagramIcon';
import { sounds } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoCode?: string;
  discount: number;
  onOrderSuccess: () => void;
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
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay' | 'instagram-invoice'>('card');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderInfo | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 65.0;
  const shippingCost = isFreeShipping ? 0 : 5.0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !shippingAddress) return;

    const orderId = `HDM-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderInfo = {
      orderId,
      customerName,
      customerEmail,
      customerInstagram,
      shippingAddress: `${shippingAddress}, ${city}, ${stateCode} ${zip}`,
      items,
      subtotal,
      discount,
      shipping: shippingCost,
      total,
      promoCode,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setCompletedOrder(newOrder);
    setIsCompleted(true);
    sounds.playRingBell();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onOrderSuccess();
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
                {isCompleted ? 'Order Confirmed!' : 'Hazel The Dollmaker Checkout'}
              </h2>
              <p className="text-xs text-pink-300 font-script">
                {isCompleted ? 'Thank you for supporting independent fiber art' : 'Secure Checkout & Handmade Guarantee'}
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
                🎉
              </div>

              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
                  Order Placed Successfully
                </span>
                <h3 className="text-2xl font-black text-white font-['Russo_One',sans-serif] mt-1">
                  Order #{completedOrder.orderId}
                </h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you, <strong className="text-white">{completedOrder.customerName}</strong>! A receipt has been dispatched to <strong className="text-pink-300">{completedOrder.customerEmail}</strong>.
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="p-4 rounded-2xl bg-[#0e1017] border border-gray-800 text-left space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-gray-800 text-gray-400 font-semibold">
                  <span>Item Summary ({completedOrder.items.length} items)</span>
                  <span>{completedOrder.date}</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-200">
                      <div>
                        <div className="font-bold">{it.quantity}x {it.product.name}</div>
                        {it.selectedSize && <span className="text-[10px] text-gray-400">Size: {it.selectedSize}</span>}
                        {it.customNotes && <div className="text-[10px] text-purple-300 italic truncate max-w-xs">Notes: {it.customNotes}</div>}
                      </div>
                      <span className="font-mono">${(it.product.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-800 flex justify-between font-bold text-sm text-white">
                  <span>Total Paid</span>
                  <span className="text-pink-400 font-['Russo_One',sans-serif]">${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200">
                🧶 <strong>Handmade in Maine:</strong> Hazel will personally handcraft and pack your order. Keep an eye out for ringside videos and dispatch updates on Instagram (<a href="https://www.instagram.com/hazel_the_dollmaker/" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline font-semibold">@hazel_the_dollmaker</a>).
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-sm text-white instagram-gradient hover:opacity-95 transition-all shadow-md"
              >
                Continue Exploring Showcase
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              {/* Order quick pill */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs">
                <div>
                  <span className="text-gray-400">Cart Total: </span>
                  <strong className="text-white font-['Russo_One',sans-serif] text-sm">${total.toFixed(2)}</strong>
                  {promoCode && <span className="text-emerald-400 ml-2">({promoCode} applied)</span>}
                </div>
                <span className="text-pink-400 font-semibold">{items.length} item(s)</span>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  1. Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                    Your Instagram Handle (Optional — for order updates & doll tags)
                  </label>
                  <input
                    type="text"
                    value={customerInstagram}
                    onChange={(e) => setCustomerInstagram(e.target.value)}
                    placeholder="@your_wrestling_handle"
                    className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  2. Shipping Destination
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="123 Wrestling Ring Rd, Apt 4"
                    className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Portland"
                      className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">State / Province *</label>
                    <input
                      type="text"
                      required
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      placeholder="ME"
                      className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="04101"
                      className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  3. Payment Method
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-pink-400" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple-pay')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'apple-pay'
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-sm"> Pay</span>
                    <span>Apple / Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('instagram-invoice')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'instagram-invoice'
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-400" />
                    <span>Instagram Invoice</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white instagram-gradient hover:opacity-95 shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order • ${total.toFixed(2)}</span>
                </button>
                <p className="text-center text-[11px] text-gray-500 mt-2 flex items-center justify-center gap-1">
                  <span>🔒 256-bit encrypted simulated checkout for Hazel The Dollmaker official store</span>
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
