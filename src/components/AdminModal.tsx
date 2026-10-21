'use client';
import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Package,
  Calendar,
  ShoppingBag,
  Users,
  Trophy,
  Heart,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';
import type { Product, Drop, OrderInfo } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminSecretInput, setAdminSecretInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'drops' | 'orders' | 'collectors' | 'collabs' | 'nominations'>('products');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Admin Data
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [activeDrop, setActiveDrop] = useState<Drop | null>(null);
  const [ordersList, setOrdersList] = useState<OrderInfo[]>([]);
  const [collectorsList, setCollectorsList] = useState<any[]>([]);
  const [collabsList, setCollabsList] = useState<any[]>([]);
  const [nominationsList, setNominationsList] = useState<any[]>([]);

  // Check auth on open
  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json() as { authorized: boolean };
      setIsAuthenticated(data.authorized);
      if (data.authorized) {
        loadData();
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: adminSecretInput }),
      });

      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Invalid admin key');
      }

      setIsAuthenticated(true);
      loadData();
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setAdminSecretInput('');
  };

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/data');
      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        throw new Error('Failed to load admin data');
      }
      const data = await res.json() as any;
      setProductsList(data.products || []);
      setActiveDrop(data.activeDrop || null);
      setOrdersList(data.orders || []);
      setCollectorsList(data.collectors || []);
      setCollabsList(data.collabs || []);
      setNominationsList(data.groupedNominations || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (idx: number, field: keyof Product, value: any) => {
    const updated = [...productsList];
    updated[idx] = { ...updated[idx], [field]: value };
    setProductsList(updated);
  };

  const saveProduct = async (prod: Product) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prod),
      });
      const data = await res.json() as any;
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to save product');
      setSuccessMsg(`Product "${prod.name}" updated successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const saveDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDrop) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/drops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeDrop),
      });
      const data = await res.json() as any;
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to update drop');
      setSuccessMsg(`Drop schedule and capacity limits updated.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderInfo['status']) => {
    setErrorMsg(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json() as any;
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to update order');
      setOrdersList((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
      setSuccessMsg(`Order ${orderId} status set to ${newStatus}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-[#12101b] border-2 border-dashed border-fuchsia-500/40 rounded-3xl shadow-2xl overflow-hidden text-gray-100 flex flex-col max-h-[92vh]">
        
        {/* Top Bar */}
        <div className="bg-[#1a162b] px-6 py-4 border-b border-fuchsia-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest text-pink-400 uppercase font-semibold">
                Maker Workspace
              </span>
              <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                Hazel’s Side-Business Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/30 transition-colors"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading && !isAuthenticated && (
            <div className="py-20 text-center text-gray-400 flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-pink-400" />
              <p className="text-sm">Verifying authorization...</p>
            </div>
          )}

          {!isLoading && !isAuthenticated && (
            /* Login Gate */
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400/40 text-pink-400 flex items-center justify-center mx-auto shadow-xl shadow-pink-500/10">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif text-white">Hazel’s Private Portal</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Server-protected management for drop limits, orders, pricing, and collector signups.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left bg-[#181528] p-5 rounded-2xl border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Maker Secret Passkey
                  </label>
                  <input
                    type="password"
                    required
                    value={adminSecretInput}
                    onChange={(e) => setAdminSecretInput(e.target.value)}
                    placeholder="Enter admin secret key"
                    className="w-full bg-[#0e0d15] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1 font-mono">
                    Default key: <span className="text-pink-300">hazel-dolls-secret-2026</span>
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </button>
              </form>
            </div>
          )}

          {isAuthenticated && (
            /* Dashboard Authenticated View */
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === 'products'
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Products & Prices ({productsList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('drops')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === 'drops'
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Drop Scheduling & Limits</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === 'orders'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Inquiries ({ordersList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('collectors')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === 'collectors'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Collector Club ({collectorsList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('collabs')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === 'collabs'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Wrestler Collabs ({collabsList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('nominations')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === 'nominations'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Fan Nominations ({nominationsList.length})</span>
                </button>
              </div>

              {/* Status alerts */}
              {successMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Store Catalog & Availability States</h4>
                      <p className="text-xs text-gray-400">Configure prices, production hours, and live availability for each merchandise item.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-white/10 rounded-2xl overflow-hidden">
                      <thead className="bg-[#181526] text-gray-300 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price ($)</th>
                          <th className="p-3">Workload (Hrs)</th>
                          <th className="p-3">Doll Slots</th>
                          <th className="p-3">State</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {productsList.map((prod, idx) => (
                          <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3">
                              <div className="font-semibold text-white">{prod.name}</div>
                              <div className="text-[11px] text-gray-400 line-clamp-1">{prod.tagline}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-pink-300 font-mono">
                                {prod.category}
                              </span>
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                step="0.01"
                                value={prod.price}
                                onChange={(e) => handleProductChange(idx, 'price', parseFloat(e.target.value) || 0)}
                                className="w-20 bg-[#0e0d15] border border-white/20 rounded px-2 py-1 text-white font-mono"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                step="0.5"
                                value={prod.productionHours}
                                onChange={(e) => handleProductChange(idx, 'productionHours', parseFloat(e.target.value) || 0)}
                                className="w-16 bg-[#0e0d15] border border-white/20 rounded px-2 py-1 text-white font-mono"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                value={prod.dollCapacityUsage}
                                onChange={(e) => handleProductChange(idx, 'dollCapacityUsage', parseInt(e.target.value) || 0)}
                                className="w-14 bg-[#0e0d15] border border-white/20 rounded px-2 py-1 text-white font-mono"
                              />
                            </td>
                            <td className="p-3">
                              <select
                                value={prod.state}
                                onChange={(e) => handleProductChange(idx, 'state', e.target.value as any)}
                                className="bg-[#0e0d15] border border-white/20 rounded px-2 py-1 text-white text-xs"
                              >
                                <option value="available">Available to order</option>
                                <option value="inquiry_only">Inquiry only</option>
                                <option value="preview">Preview / Coming soon</option>
                                <option value="sold_out">Sold out</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => saveProduct(prod)}
                                className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-1 shadow-sm"
                              >
                                <Save className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. Drops Tab */}
              {activeTab === 'drops' && activeDrop && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h4 className="font-bold text-white text-base">Current Featured Drop & Capacity Planning</h4>
                    <p className="text-xs text-gray-400">
                      Manageable side-business drop limits. Hazel controls capacity based on her actual available time (approx 2–6h per doll).
                    </p>
                  </div>

                  <form onSubmit={saveDrop} className="space-y-4 bg-[#181526] p-5 rounded-2xl border border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          Drop Title
                        </label>
                        <input
                          type="text"
                          required
                          value={activeDrop.title}
                          onChange={(e) => setActiveDrop({ ...activeDrop, title: e.target.value })}
                          className="w-full bg-[#0e0d15] border border-white/15 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          Featured Wrestler
                        </label>
                        <input
                          type="text"
                          required
                          value={activeDrop.wrestlerName}
                          onChange={(e) => setActiveDrop({ ...activeDrop, wrestlerName: e.target.value })}
                          className="w-full bg-[#0e0d15] border border-white/15 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          Doll Capacity Cap (Slots)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={activeDrop.capacityLimit}
                          onChange={(e) => setActiveDrop({ ...activeDrop, capacityLimit: parseInt(e.target.value) || 1 })}
                          className="w-full bg-[#0e0d15] border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          Slots Claimed So Far
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={activeDrop.dollsClaimed}
                          onChange={(e) => setActiveDrop({ ...activeDrop, dollsClaimed: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#0e0d15] border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          Drop Status
                        </label>
                        <select
                          value={activeDrop.status}
                          onChange={(e) => setActiveDrop({ ...activeDrop, status: e.target.value as any })}
                          className="w-full bg-[#0e0d15] border border-white/15 rounded-xl px-3 py-2 text-sm text-white"
                        >
                          <option value="open">Open for orders</option>
                          <option value="preview">Preview / Coming soon</option>
                          <option value="paused">Paused (Taking a breather)</option>
                          <option value="sold_out">Sold out</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          Ordering Window
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={activeDrop.orderingWindowStart}
                            onChange={(e) => setActiveDrop({ ...activeDrop, orderingWindowStart: e.target.value })}
                            className="w-full bg-[#0e0d15] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                          <span className="text-gray-400">to</span>
                          <input
                            type="date"
                            value={activeDrop.orderingWindowEnd}
                            onChange={(e) => setActiveDrop({ ...activeDrop, orderingWindowEnd: e.target.value })}
                            className="w-full bg-[#0e0d15] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                          Clear Ship-By Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={activeDrop.estimatedShipByDate}
                          onChange={(e) => setActiveDrop({ ...activeDrop, estimatedShipByDate: e.target.value })}
                          className="w-full bg-[#0e0d15] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                        Drop Description / Workload Notes
                      </label>
                      <textarea
                        rows={3}
                        value={activeDrop.description}
                        onChange={(e) => setActiveDrop({ ...activeDrop, description: e.target.value })}
                        className="w-full bg-[#0e0d15] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-pink-600 hover:opacity-90 text-white rounded-xl font-medium text-sm transition-all shadow-md flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Drop Settings</span>
                    </button>
                  </form>
                </div>
              )}

              {/* 3. Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Direct Customer Inquiries & Orders</h4>
                      <p className="text-xs text-gray-400">Review requested items, discuss payment & shipping, and track crafting status.</p>
                    </div>
                    <a
                      href="/api/admin/data?format=csv&type=orders"
                      download
                      className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Orders CSV</span>
                    </a>
                  </div>

                  {ordersList.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 bg-[#181526] rounded-2xl border border-white/5">
                      No order inquiries submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ordersList.map((ord) => (
                        <div key={ord.orderId} className="bg-[#181526] border border-white/10 rounded-2xl p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-pink-400 text-sm">#{ord.orderId}</span>
                                <strong className="text-white text-sm">{ord.customerName}</strong>
                                <span className="text-xs text-gray-400">({ord.customerEmail})</span>
                              </div>
                              <div className="text-[11px] text-gray-400 mt-0.5">
                                Preferred Contact: <strong className="text-amber-300 uppercase">{ord.preferredContact}</strong>
                                {ord.customerInstagram && ` • IG: @${ord.customerInstagram}`}
                                {ord.customerPhone && ` • Phone: ${ord.customerPhone}`}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-emerald-400 font-mono">
                                ${ord.total?.toFixed(2)}
                              </span>
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.orderId, e.target.value as any)}
                                className="bg-[#0e0d15] border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white"
                              >
                                <option value="pending_review">Pending Review</option>
                                <option value="discussing">Discussing Details</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="crafted">Doll Crafted</option>
                                <option value="shipped">Shipped</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          <div className="text-xs space-y-1 text-gray-300">
                            <div className="font-medium text-pink-300">Requested Items:</div>
                            <ul className="list-disc list-inside text-gray-400 space-y-0.5">
                              {ord.items?.map((it, i) => (
                                <li key={i}>
                                  {it.quantity}x {it.product.name} {it.selectedSize ? `(Size: ${it.selectedSize})` : ''} - ${(it.product.price * it.quantity).toFixed(2)}
                                  {it.customNotes && <span className="text-amber-300 block ml-5">Notes: "{it.customNotes}"</span>}
                                </li>
                              ))}
                            </ul>
                            <div className="text-[11px] text-gray-400 pt-1">
                              <strong>Ship to:</strong> {ord.shippingAddress}
                            </div>
                            {ord.notesToHazel && (
                              <div className="text-[11px] bg-black/40 p-2 rounded-lg border border-white/5 text-amber-200">
                                <strong>Customer note:</strong> {ord.notesToHazel}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Collectors Tab */}
              {activeTab === 'collectors' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">VIP Drop Club Signups</h4>
                      <p className="text-xs text-gray-400">Fans waiting for the next limited drop notification.</p>
                    </div>
                    <a
                      href="/api/admin/data?format=csv&type=signups"
                      download
                      className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Collectors CSV</span>
                    </a>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-white/10 rounded-2xl overflow-hidden">
                      <thead className="bg-[#181526] text-gray-300 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                        <tr>
                          <th className="p-3">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Favorite Wrestler / Note</th>
                          <th className="p-3">Signup Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {collectorsList.map((c) => (
                          <tr key={c.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-semibold text-white">{c.name}</td>
                            <td className="p-3 text-pink-300 font-mono">{c.email}</td>
                            <td className="p-3 text-gray-300">{c.details}</td>
                            <td className="p-3 text-gray-500 font-mono text-[11px]">{c.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. Wrestler Collabs Tab */}
              {activeTab === 'collabs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Wrestler Collaboration Inquiries</h4>
                      <p className="text-xs text-gray-400">Inquiries submitted by wrestlers and promoters for custom drops.</p>
                    </div>
                    <a
                      href="/api/admin/data?format=csv&type=collabs"
                      download
                      className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Collabs CSV</span>
                    </a>
                  </div>

                  <div className="space-y-3">
                    {collabsList.map((collab) => (
                      <div key={collab.id} className="bg-[#181526] border border-white/10 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div>
                            <strong className="text-white text-sm">{collab.name}</strong>
                            <span className="text-xs text-gray-400 ml-2">({collab.email})</span>
                          </div>
                          <span className="text-[11px] font-mono text-gray-500">{collab.createdAt}</span>
                        </div>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans bg-black/40 p-3 rounded-xl border border-white/5">
                          {collab.details}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Nominations Tab */}
              {activeTab === 'nominations' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Ranked Wrestler Nominations</h4>
                      <p className="text-xs text-gray-400">Grouped fan suggestions helping Hazel choose upcoming featured drops.</p>
                    </div>
                    <a
                      href="/api/admin/data?format=csv&type=nominations"
                      download
                      className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Nominations CSV</span>
                    </a>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-white/10 rounded-2xl overflow-hidden">
                      <thead className="bg-[#181526] text-gray-300 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                        <tr>
                          <th className="p-3">Rank & Wrestler</th>
                          <th className="p-3">Fan Votes</th>
                          <th className="p-3">Handles</th>
                          <th className="p-3">Reasons</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {nominationsList.map((nom, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-semibold text-white">
                              <span className="text-pink-400 font-mono mr-2">#{i + 1}</span>
                              {nom.name}
                            </td>
                            <td className="p-3">
                              <span className="px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 font-bold font-mono">
                                {nom.count} {nom.count === 1 ? 'vote' : 'votes'}
                              </span>
                            </td>
                            <td className="p-3 text-purple-300 font-mono text-[11px]">{nom.handles?.join(', ') || '—'}</td>
                            <td className="p-3 text-gray-300 text-[11px] max-w-xs">{nom.reasons?.join('; ') || 'Fan suggestion'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
