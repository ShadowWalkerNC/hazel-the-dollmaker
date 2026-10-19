import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Plus, Sparkles } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DollCard } from './components/DollCard';
import { InstagramEmbedSection } from './components/InstagramEmbedSection';
import { CraftAnatomySection } from './components/CraftAnatomySection';
import { AboutSection } from './components/AboutSection';
import { MerchStoreSection } from './components/MerchStoreSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AddInstagramModal } from './components/AddInstagramModal';
import { DollDetailModal } from './components/DollDetailModal';
import { CommissionModal } from './components/CommissionModal';
import { AdminModal } from './components/AdminModal';
import { InstagramIcon } from './components/InstagramIcon';
import { CrochetHookIcon } from './components/CrochetIcons';
import { INITIAL_DOLLS } from './data/initialDolls';
import { INITIAL_PRODUCTS } from './data/products';
import type { DollItem, Product, CartItem, OrderInfo } from './types';
import { sounds } from './utils/audio';

const DOLLS_STORAGE_KEY = 'hazel_dollmaker_collection_v2';
const CART_STORAGE_KEY = 'hazel_dollmaker_cart_v2';
const PRODUCTS_STORAGE_KEY = 'hazel_dollmaker_products_v2';
const ORDERS_STORAGE_KEY = 'hazel_dollmaker_orders_v2';

export const App: React.FC = () => {
  // Dolls Showcase State
  const [dolls, setDolls] = useState<DollItem[]>(() => {
    try {
      const saved = localStorage.getItem(DOLLS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DOLLS;
  });

  // Merchandise Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Orders State for Hazel's Review
  const [orders, setOrders] = useState<OrderInfo[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Active view tab: 'store' | 'gallery' | 'instagram-hub' | 'craft' | 'about-hazel'
  const [activeTab, setActiveTab] = useState('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inspectDoll, setInspectDoll] = useState<DollItem | null>(null);
  const [checkoutPromo, setCheckoutPromo] = useState<{ code: string; discount: number }>({ code: '', discount: 0 });

  // Load from backend API on initial mount
  const refreshBackendData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData) && prodData.length > 0) {
          setProducts(prodData);
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(prodData));
        } else {
          // seed initial products to backend
          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(INITIAL_PRODUCTS)
          });
        }
      }
    } catch (e) {
      console.warn('Backend products not reachable, using local storage state', e);
    }

    try {
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersData));
        }
      }
    } catch (e) {
      console.warn('Backend orders not reachable, using local storage state', e);
    }
  };

  useEffect(() => {
    refreshBackendData();
  }, []);

  // Sync Products to local storage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Sync Orders to local storage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Sync Dolls
  useEffect(() => {
    try {
      localStorage.setItem(DOLLS_STORAGE_KEY, JSON.stringify(dolls));
    } catch {
      // ignore
    }
  }, [dolls]);

  // Sync Cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Cart handlers
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === item.product.id && i.selectedSize === item.selectedSize
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += item.quantity;
        if (item.customNotes) {
          next[existingIdx].customNotes = item.customNotes;
        }
        return next;
      }
      return [item, ...prev];
    });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuickAddToCart = (product: Product) => {
    const item: CartItem = {
      id: `${product.id}-default-${Date.now()}`,
      product,
      quantity: 1,
    };
    handleAddToCart(item);
  };

  const handleOpenCheckout = (promoCode: string, discount: number) => {
    setCheckoutPromo({ code: promoCode, discount });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleAddDoll = (newDoll: DollItem) => {
    setDolls((prev) => [newDoll, ...prev]);
  };

  const handleLike = (id: string) => {
    setDolls((prev) =>
      prev.map((d) => (d.id === id ? { ...d, likesCount: d.likesCount + 1 } : d))
    );
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset gallery to default showcase pieces?')) {
      setDolls(INITIAL_DOLLS);
      localStorage.removeItem(DOLLS_STORAGE_KEY);
      sounds.playLikeChime();
    }
  };

  // Admin management handlers with backend API sync
  const handleUpdateProduct = async (updated: Product) => {
    try {
      await fetch(`/api/products/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn('Backend product update error:', e);
    }
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    sounds.playLikeChime();
  };

  const handleAddProduct = async (newProd: Partial<Product>) => {
    const id = `hazel-prod-${Date.now()}`;
    const product: Product = {
      id,
      name: newProd.name || 'Custom Item',
      tagline: newProd.tagline || 'Handmade merchandise',
      description: newProd.description || 'Crafted with premium yarn and wrestler spirit.',
      features: newProd.features || ['Handmade in Maine', 'Freehand organic crochet stitch'],
      price: newProd.price || 25,
      category: newProd.category || 'apparel',
      imageUrl: newProd.imageUrl || '/hazel-logo.jpg',
      badge: newProd.badge,
      inStock: true,
      stockCount: newProd.stockCount ?? 15,
      isSpecial: newProd.isSpecial ?? false,
      specialDiscountText: newProd.specialDiscountText,
      specialEndsAt: newProd.specialEndsAt,
      rating: 5.0,
      reviewCount: 1,
    };

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([product]),
      });
    } catch (e) {
      console.warn('Backend product add error:', e);
    }
    setProducts((prev) => [product, ...prev]);
    sounds.playRingBell();
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Backend product delete error:', e);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    sounds.playTrashSwoosh();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderInfo['status']) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn('Backend order update error:', e);
    }
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
    sounds.playLikeChime();
  };

  // Filter dolls based on search query & category
  const filteredDolls = dolls.filter((doll) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'user-added'
        ? doll.isUserAdded
        : doll.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      doll.wrestlerName.toLowerCase().includes(q) ||
      doll.promotion.toLowerCase().includes(q) ||
      doll.dollTitle.toLowerCase().includes(q) ||
      doll.gearDetails.some((g) => g.toLowerCase().includes(q)) ||
      doll.story.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_review').length;
  const heroSpecials = products.filter((p) => p.isSpecial);

  return (
    <div className="min-h-screen crochet-bg text-gray-100 flex flex-col font-sans selection:bg-pink-600 selection:text-white">
      
      {/* Clean Streamlined Header with Stitched Edge */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        cartItemCount={cartItemCount}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          const targetId = tab === 'store' ? 'merch-store' : tab === 'gallery' ? 'gallery-section' : tab;
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Hero Section with Live Drop Specials */}
      <Hero
        onShopClick={() => {
          setActiveTab('store');
          const el = document.getElementById('merch-store');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreClick={() => {
          setActiveTab('gallery');
          const el = document.getElementById('gallery-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        specials={heroSpecials}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 1. Official Merchandise Store */}
        <MerchStoreSection
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAddToCart={handleQuickAddToCart}
        />

        {/* 2. About The Dollmaker Section */}
        <AboutSection
          onOpenCommission={() => setIsCommissionModalOpen(true)}
        />

        {/* 2. Wrestler & Doll Tribute Gallery */}
        <section id="gallery-section" className="py-14 border-b-2 border-dashed border-pink-500/20 bg-[#0d0c16]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-crochet font-bold text-pink-400 uppercase tracking-wider mb-1">
                  <CrochetHookIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Ringside Freehand Archive</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-['Russo_One',sans-serif]">
                  Wrestler Likeness Dolls
                </h2>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-crochet font-bold border border-dashed border-pink-300/40 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Post</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCatalog}
                  title="Reset to default collection"
                  className="h-9 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-dashed border-pink-400/20 transition-all flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 pb-3 border-b border-dashed border-pink-400/20">
              <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Likenesses', icon: '🧶' },
                  { id: 'champion', label: 'Champions', icon: '🏆' },
                  { id: 'ringside-gift', label: 'Ringside Gifts', icon: '🎁' },
                  { id: 'indie-favorite', label: 'Indie Favorites', icon: '⚡' },
                  { id: 'user-added', label: 'Added By You', icon: '✨' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-crochet font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md border-2 border-dashed border-pink-200/50'
                        : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border-2 border-dashed border-transparent'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-pink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter wrestlers..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border-2 border-dashed border-pink-400/30 text-xs font-crochet text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>
            </div>

            {/* Dolls Grid */}
            {filteredDolls.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDolls.map((doll) => (
                  <DollCard
                    key={doll.id}
                    doll={doll}
                    onSelect={(d) => setInspectDoll(d)}
                    onLike={handleLike}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-14 rounded-2xl crochet-patch p-6 space-y-2">
                <p className="text-xs text-gray-300 font-script">No matching wrestler likenesses found.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-crochet font-bold border border-dashed border-pink-300/40 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}

          </div>
        </section>

        {/* 3. Instagram Hub & Embedder Section */}
        <InstagramEmbedSection
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onAddDoll={handleAddDoll}
          dolls={dolls}
        />

        {/* 4. Craft Anatomy & Dollmaker Philosophy */}
        <CraftAnatomySection />

        {/* 5. Custom Commission Callout Banner */}
        <section className="py-12 bg-[#0c0b14] border-b-2 border-dashed border-pink-500/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="crochet-patch rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-crochet font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Custom Orders Without Patterns</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Russo_One',sans-serif]">
                  Have Hazel Crochet Your Ring Gear or Favorite Wrestler
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-script max-w-2xl leading-relaxed">
                  Every custom doll is sculpted organically with exact gear matching, safety eyes, custom championship belts, and rooted fiber hair. 100% 1-of-1 handmade art.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCommissionModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-crochet font-bold text-sm shadow-xl shadow-pink-600/30 border-2 border-dashed border-pink-200/50 flex items-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <CrochetHookIcon className="w-5 h-5" />
                <span>Request Custom Doll</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Cozy Stitched Footer */}
      <footer className="bg-[#090810] border-t-2 border-dashed border-pink-500/20 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-dashed border-pink-400/60 bg-black flex-shrink-0 p-0.5">
                <img src="/hazel-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="text-sm font-crochet font-bold text-white tracking-wide">
                  Hazel The Dollmaker
                </span>
                <span className="text-xs text-pink-300/80 font-script ml-2">• Hand-stitched in Maine with ❤️ & yarn</span>
              </div>
            </div>

            {/* Instagram link */}
            <a
              href="https://www.instagram.com/hazel_the_dollmaker/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-crochet font-medium text-pink-300 hover:text-white inline-flex items-center gap-1.5 transition-colors bg-pink-500/10 px-3 py-1.5 rounded-xl border border-dashed border-pink-400/30"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>@hazel_the_dollmaker on Instagram</span>
            </a>

          </div>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={handleOpenCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        promoCode={checkoutPromo.code}
        discount={checkoutPromo.discount}
        onOrderSuccess={(newOrder) => {
          setCart([]);
          setOrders((prev) => [newOrder, ...prev]);
        }}
      />

      <AddInstagramModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDoll={handleAddDoll}
      />

      <DollDetailModal
        doll={inspectDoll}
        onClose={() => setInspectDoll(null)}
        onLike={handleLike}
        onOpenCommission={() => setIsCommissionModalOpen(true)}
      />

      <CommissionModal
        isOpen={isCommissionModalOpen}
        onClose={() => setIsCommissionModalOpen(false)}
      />

      {/* Studio Control Room: Hazel Admin Inventory & Order Review Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onRefreshData={refreshBackendData}
      />

    </div>
  );
};

export default App;
