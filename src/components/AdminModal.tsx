import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Edit3, Save, Package, RefreshCw 
} from 'lucide-react';
import type { Product, OrderInfo } from '../types';
import { CrochetHookIcon } from './CrochetIcons';
import { InstagramIcon } from './InstagramIcon';
import { WhatsAppIcon } from './WhatsAppIcon';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: OrderInfo[];
  onUpdateProduct: (product: Product) => Promise<void>;
  onAddProduct: (product: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderInfo['status']) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'new-product'>('orders');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editIsSpecial, setEditIsSpecial] = useState<boolean>(false);
  const [editSpecialText, setEditSpecialText] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // New product form
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(25);
  const [newCategory, setNewCategory] = useState<Product['category']>('apparel');
  const [newStock, setNewStock] = useState(20);
  const [newTagline, setNewTagline] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newIsSpecial, setNewIsSpecial] = useState(false);

  if (!isOpen) return null;

  const startEdit = (p: Product) => {
    setEditingProductId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stockCount ?? 15);
    setEditIsSpecial(!!p.isSpecial);
    setEditSpecialText(p.specialDiscountText || '');
  };

  const handleSaveProductEdit = async (p: Product) => {
    setIsSaving(true);
    await onUpdateProduct({
      ...p,
      price: editPrice,
      stockCount: editStock,
      inStock: editStock > 0,
      isSpecial: editIsSpecial,
      specialDiscountText: editSpecialText,
      specialEndsAt: editIsSpecial ? new Date(Date.now() + 48 * 3600 * 1000).toISOString() : undefined
    });
    setEditingProductId(null);
    setIsSaving(false);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSaving(true);
    await onAddProduct({
      name: newName,
      price: newPrice,
      category: newCategory,
      stockCount: newStock,
      inStock: newStock > 0,
      tagline: newTagline || 'Official handcrafted merchandise by Hazel',
      badge: newBadge || (newIsSpecial ? 'Special Drop' : undefined),
      isSpecial: newIsSpecial,
      specialDiscountText: newIsSpecial ? 'Limited Time Special' : undefined,
      description: `Official Hazel The Dollmaker release. Screen-printed and hand-inspected in Maine.`,
      features: ['Handcrafted studio standard', '100% Quality checked by Hazel'],
      imageUrl: '/hazel-logo.jpg',
      rating: 5.0,
      reviewCount: 1,
    });
    // reset form
    setNewName('');
    setNewPrice(25);
    setNewStock(20);
    setNewTagline('');
    setNewBadge('');
    setNewIsSpecial(false);
    setActiveTab('inventory');
    setIsSaving(false);
  };

  // WhatsApp order chat link generator
  const getWhatsAppReviewLink = (order: OrderInfo) => {
    const summary = order.items.map(it => `${it.quantity}x ${it.product.name}`).join(', ');
    const msg = `Hi ${order.customerName}! 🧶 This is Hazel (@hazel_the_dollmaker) regarding your order #${order.orderId} (${summary} - $${order.total.toFixed(2)}). Let's finalize your preferred payment method and shipping details!`;
    const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
    return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl my-6 crochet-patch rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border-2 border-dashed border-pink-400/40">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-dashed border-pink-400/20 bg-[#151222] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md border border-dashed border-pink-300/40">
              <CrochetHookIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-crochet font-bold text-white">
                  Hazel's Studio Control Room
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Full Backend Admin
                </span>
              </div>
              <p className="text-xs text-pink-300 font-script">
                Review incoming orders, adjust inventory & prices, activate limited specials
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRefreshData()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-dashed border-pink-400/30 transition-all text-xs font-crochet flex items-center gap-1 cursor-pointer"
              title="Refresh live data"
            >
              <RefreshCw className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-3 bg-[#110f1c] border-b border-dashed border-pink-400/20 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-crochet font-bold rounded-t-xl transition-all border-t-2 border-x-2 ${
              activeTab === 'orders'
                ? 'bg-[#181527] text-white border-pink-400 border-b-transparent shadow-sm'
                : 'text-gray-400 hover:text-gray-200 border-transparent'
            }`}
          >
            Orders to Review ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-crochet font-bold rounded-t-xl transition-all border-t-2 border-x-2 ${
              activeTab === 'inventory'
                ? 'bg-[#181527] text-white border-pink-400 border-b-transparent shadow-sm'
                : 'text-gray-400 hover:text-gray-200 border-transparent'
            }`}
          >
            Inventory & Price Manager ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('new-product')}
            className={`px-4 py-2 text-xs font-crochet font-bold rounded-t-xl transition-all border-t-2 border-x-2 ${
              activeTab === 'new-product'
                ? 'bg-[#181527] text-white border-pink-400 border-b-transparent shadow-sm'
                : 'text-gray-400 hover:text-gray-200 border-transparent'
            }`}
          >
            + Add New Store Item
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#131120]">
          
          {/* TAB 1: ORDERS REVIEW */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-dashed border-pink-400/20">
                <span className="text-xs font-crochet font-bold text-gray-300 uppercase tracking-wider">
                  Customer Orders Waiting For Discussion & Review
                </span>
                <span className="text-[11px] text-pink-300 font-script">
                  Orders submitted through the site persist in backend storage
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 space-y-3 crochet-patch rounded-2xl p-6">
                  <Package className="w-10 h-10 text-pink-400/50 mx-auto" />
                  <h3 className="text-base font-crochet font-bold text-white">No pending orders in the queue</h3>
                  <p className="text-xs text-gray-300 font-script">When customers checkout, their order details appear here for you to review and discuss!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div 
                      key={order.orderId}
                      className="p-4 rounded-2xl bg-black/50 border-2 border-dashed border-pink-400/30 space-y-3 shadow-lg"
                    >
                      {/* Order top bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-dashed border-pink-400/20">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-crochet font-bold text-white">
                              Order #{order.orderId}
                            </span>
                            <span className={`text-[10px] font-crochet font-bold px-2.5 py-0.5 rounded-full border ${
                              order.status === 'confirmed' 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                                : order.status === 'discussing'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                                : 'bg-pink-500/20 text-pink-300 border-pink-400/40'
                            }`}>
                              {order.status === 'pending_review' ? 'Needs Review' : order.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 font-script mt-0.5">
                            Customer: <strong className="text-white">{order.customerName}</strong> • {order.date}
                          </div>
                        </div>

                        {/* Direct Channel Connect Buttons for Hazel */}
                        <div className="flex items-center gap-2">
                          {order.customerInstagram && (
                            <a
                              href={`https://www.instagram.com/${order.customerInstagram.replace('@', '')}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl instagram-gradient text-white text-xs font-crochet font-bold flex items-center gap-1.5 shadow-sm"
                            >
                              <InstagramIcon className="w-3.5 h-3.5 text-white" />
                              <span>DM {order.customerInstagram}</span>
                            </a>
                          )}

                          {order.customerPhone && (
                            <a
                              href={getWhatsAppReviewLink(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-crochet font-bold flex items-center gap-1.5 shadow-sm border border-dashed border-emerald-300/40"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                              <span>WhatsApp Customer</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Customer Contact & Shipping Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-black/40 p-2.5 rounded-xl border border-dashed border-pink-400/20 font-script">
                        <div>
                          <span className="text-gray-400">Email: </span>
                          <span className="text-white">{order.customerEmail}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Phone: </span>
                          <span className="text-white">{order.customerPhone || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Preferred Contact: </span>
                          <span className="text-pink-300 font-bold uppercase">{order.preferredContact}</span>
                        </div>
                        <div className="sm:col-span-3">
                          <span className="text-gray-400">Ship to: </span>
                          <span className="text-white">{order.shippingAddress}</span>
                        </div>
                        {order.notesToHazel && (
                          <div className="sm:col-span-3 pt-1 border-t border-dashed border-pink-400/20 text-amber-300">
                            <strong>Note to Hazel:</strong> "{order.notesToHazel}"
                          </div>
                        )}
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-crochet font-bold text-gray-400 uppercase">Items In Order:</span>
                        <div className="space-y-1">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-[#171424] p-2 rounded-lg border border-dashed border-pink-400/20">
                              <div>
                                <span className="font-crochet font-bold text-white">{it.quantity}x {it.product.name}</span>
                                {it.selectedSize && <span className="text-gray-400 ml-2">(Size: {it.selectedSize})</span>}
                                {it.customNotes && <p className="text-[11px] text-pink-300 italic">Custom Spec: {it.customNotes}</p>}
                              </div>
                              <span className="font-mono font-bold text-white">${(it.product.price * it.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action status bar */}
                      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-dashed border-pink-400/20 gap-2">
                        <div className="text-xs font-crochet">
                          <span className="text-gray-400">Total: </span>
                          <strong className="text-pink-400 text-sm font-bold">${order.total.toFixed(2)}</strong>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-crochet">
                          <span className="text-gray-400">Mark Status:</span>
                          <button
                            onClick={() => onUpdateOrderStatus(order.orderId, 'discussing')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer"
                          >
                            In Discussion
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.orderId, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 cursor-pointer"
                          >
                            Confirmed / Paid
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.orderId, 'shipped')}
                            className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 cursor-pointer"
                          >
                            Shipped
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INVENTORY & PRICE MANAGER */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-dashed border-pink-400/20">
                <span className="text-xs font-crochet font-bold text-gray-300 uppercase tracking-wider">
                  Store Items: Adjust Price, Stock & Limited Time Specials
                </span>
                <span className="text-[11px] text-pink-300 font-script">
                  Click 'Edit' to change live prices, stock counts, or hero specials
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((p) => {
                  const isEditing = editingProductId === p.id;
                  return (
                    <div 
                      key={p.id}
                      className="p-4 rounded-2xl bg-black/50 border-2 border-dashed border-pink-400/30 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-xl bg-black/60 border border-dashed border-pink-400/20 p-1 flex-shrink-0">
                          <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-crochet font-bold text-white line-clamp-1">{p.name}</h4>
                          <span className="text-[10px] font-script text-gray-400 uppercase tracking-wider">{p.category}</span>
                          {p.isSpecial && (
                            <span className="ml-2 text-[9px] font-crochet px-2 py-0.5 rounded-full bg-pink-600 text-white font-bold">
                              HERO SPECIAL ACTIVE
                            </span>
                          )}
                        </div>

                        {!isEditing ? (
                          <button
                            onClick={() => startEdit(p)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-pink-300 hover:text-white border border-dashed border-pink-400/30 text-xs font-crochet flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSaveProductEdit(p)}
                            disabled={isSaving}
                            className="p-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-crochet font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                        )}
                      </div>

                      {/* Display or Edit Fields */}
                      {isEditing ? (
                        <div className="space-y-2 pt-2 border-t border-dashed border-pink-400/20 text-xs font-crochet">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-0.5">Price ($)</label>
                              <input
                                type="number"
                                step="0.5"
                                value={editPrice}
                                onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-1 rounded-lg bg-black/80 border border-dashed border-pink-400/40 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-400 mb-0.5">Stock Count</label>
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 rounded-lg bg-black/80 border border-dashed border-pink-400/40 text-white"
                              />
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-pink-950/20 border border-dashed border-pink-400/30 space-y-1.5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editIsSpecial}
                                onChange={(e) => setEditIsSpecial(e.target.checked)}
                                className="rounded text-pink-600"
                              />
                              <span className="text-[11px] font-bold text-amber-300">Feature in Hero Specials Banner?</span>
                            </label>
                            {editIsSpecial && (
                              <input
                                type="text"
                                value={editSpecialText}
                                onChange={(e) => setEditSpecialText(e.target.value)}
                                placeholder="Special text, e.g., 'Save $20 Ringside Special'"
                                className="w-full px-2 py-1 rounded-lg bg-black/80 border border-dashed border-pink-400/40 text-white text-[11px]"
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-pink-400/20 text-xs font-crochet">
                          <div>
                            <span className="text-gray-400 text-[10px] block">Price</span>
                            <span className="text-white font-bold text-sm">${p.price.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-[10px] block">Inventory Status</span>
                            <span className={`font-bold ${p.inStock ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {p.inStock ? `${p.stockCount ?? 'Available'} in stock` : 'Sold Out'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Delete button */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove "${p.name}" from the store?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="text-[11px] font-crochet text-gray-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Item</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ADD NEW PRODUCT FORM */}
          {activeTab === 'new-product' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="pb-2 border-b border-dashed border-pink-400/20">
                <h3 className="text-base font-crochet font-bold text-white">Add A New Product To Hazel’s Store</h3>
                <p className="text-xs text-pink-300 font-script">Item will instantly be added to backend storage and displayed in the store</p>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 font-crochet">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Limitless Wrestling Heavyweight Enamel Pin"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/40 text-sm text-white focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Price ($) *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/40 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as Product['category'])}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/40 text-sm text-white"
                    >
                      <option value="apparel">Apparel</option>
                      <option value="custom-doll">Custom Dolls</option>
                      <option value="stickers">Stickers</option>
                      <option value="accessories">Pins & Bags</option>
                      <option value="limited">Limited Specials</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Initial Stock *</label>
                    <input
                      type="number"
                      required
                      value={newStock}
                      onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/40 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Short Tagline</label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="e.g. 100% Cotton, screen-printed with official logo"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/40 text-sm text-white"
                  />
                </div>

                {/* Hero Special Checkbox */}
                <div className="p-3.5 rounded-2xl bg-black/50 border border-dashed border-pink-400/30 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsSpecial}
                      onChange={(e) => setNewIsSpecial(e.target.checked)}
                      className="rounded text-pink-600"
                    />
                    <span className="text-xs font-bold text-amber-300">Highlight as Limited Time Special in Hero Page?</span>
                  </label>
                  {newIsSpecial && (
                    <input
                      type="text"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      placeholder="Special Badge text (e.g. 'Flash Drop • 48h Only')"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/80 border border-dashed border-pink-400/40 text-xs text-white"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 border border-dashed border-pink-300/40 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Product to Store</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
