import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Plus } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DollCard } from './components/DollCard';
import { InstagramEmbedSection } from './components/InstagramEmbedSection';
import { CraftAnatomySection } from './components/CraftAnatomySection';
import { MerchStoreSection } from './components/MerchStoreSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AddInstagramModal } from './components/AddInstagramModal';
import { DollDetailModal } from './components/DollDetailModal';
import { CommissionModal } from './components/CommissionModal';
import { InstagramIcon } from './components/InstagramIcon';
import { INITIAL_DOLLS } from './data/initialDolls';
import { INITIAL_PRODUCTS } from './data/products';
import type { DollItem, Product, CartItem } from './types';
import { sounds } from './utils/audio';

const DOLLS_STORAGE_KEY = 'hazel_dollmaker_collection_v2';
const CART_STORAGE_KEY = 'hazel_dollmaker_cart_v2';

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
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

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

  // Active view tab: 'store' | 'gallery' | 'instagram-hub' | 'craft'
  const [activeTab, setActiveTab] = useState('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inspectDoll, setInspectDoll] = useState<DollItem | null>(null);
  const [checkoutPromo, setCheckoutPromo] = useState<{ code: string; discount: number }>({ code: '', discount: 0 });

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

  // Filter dolls based on search query & category
  const filteredDolls = dolls.filter((doll) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'user-added'
        ? Boolean(doll.isUserAdded)
        : doll.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doll.wrestlerName.toLowerCase().includes(q) ||
      doll.dollTitle.toLowerCase().includes(q) ||
      doll.promotion.toLowerCase().includes(q) ||
      doll.gearDetails.some((g) => g.toLowerCase().includes(q)) ||
      doll.story.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0b0c12] text-gray-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Clean Streamlined Header */}
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
      />

      {/* Hero Section */}
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
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 1. Official Merchandise Store */}
        <MerchStoreSection
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAddToCart={handleQuickAddToCart}
        />

        {/* 2. Wrestler & Doll Tribute Gallery */}
        <section id="gallery-section" className="py-14 border-b border-white/[0.08] bg-[#0b0c12]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
                  Ringside Archive
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-['Russo_One',sans-serif]">
                  Wrestler Likeness Dolls
                </h2>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="h-9 px-3.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-pink-400" />
                  <span>Add Post</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCatalog}
                  title="Reset to default collection"
                  className="h-9 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 pb-3 border-b border-white/[0.06]">
              <div className="w-full sm:w-auto flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Likenesses' },
                  { id: 'champion', label: 'Champions' },
                  { id: 'ringside-gift', label: 'Ringside Gifts' },
                  { id: 'indie-favorite', label: 'Indie Favorites' },
                  { id: 'user-added', label: 'Added By You' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter wrestlers..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Dolls Grid */}
            {filteredDolls.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <div className="text-center py-14 rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-2">
                <p className="text-xs text-gray-400">No matching wrestler likenesses found.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-3 py-1 rounded-md bg-purple-600 text-white text-xs font-semibold"
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

      </main>

      {/* Clean Uniform Footer */}
      <footer className="bg-[#08090e] border-t border-white/[0.08] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-black flex-shrink-0">
                <img src="/hazel-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">
                Hazel The Dollmaker
              </span>
              <span className="text-xs text-gray-400">• Handcrafted in Maine</span>
            </div>

            {/* Clean link */}
            <a
              href="https://www.instagram.com/hazel_the_dollmaker/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-pink-400 hover:text-pink-300 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Follow @hazel_the_dollmaker on Instagram</span>
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
        onOrderSuccess={() => setCart([])}
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

    </div>
  );
};

export default App;
