'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../src/components/Navbar';
import { Hero } from '../src/components/Hero';
import { MerchStoreSection } from '../src/components/MerchStoreSection';
import { AboutSection } from '../src/components/AboutSection';
import { CraftAnatomySection } from '../src/components/CraftAnatomySection';
import { DollCard } from '../src/components/DollCard';
import { InstagramEmbedSection } from '../src/components/InstagramEmbedSection';
import { CartDrawer } from '../src/components/CartDrawer';
import { ProductDetailModal } from '../src/components/ProductDetailModal';
import { CheckoutModal } from '../src/components/CheckoutModal';
import { CommissionModal } from '../src/components/CommissionModal';
import { CommunityInterestModal } from '../src/components/CommunityInterestModal';
import { AdminModal } from '../src/components/AdminModal';
import { DollDetailModal } from '../src/components/DollDetailModal';
import { AddInstagramModal } from '../src/components/AddInstagramModal';
import { YarnBallIcon, CrochetHookIcon } from '../src/components/CrochetIcons';
import { InstagramIcon } from '../src/components/InstagramIcon';
import { WhatsAppIcon } from '../src/components/WhatsAppIcon';
import { INITIAL_PRODUCTS, ACTIVE_DROP } from '../src/data/products';
import { INITIAL_DOLLS } from '../src/data/initialDolls';
import { sounds } from '../src/utils/audio';
import type { Product, Drop, CartItem, DollItem, OrderInfo } from '../src/types';
import { Sparkles, Trophy, Heart, ArrowRight } from 'lucide-react';

export default function HomePage() {
  // Navigation
  const [activeTab, setActiveTab] = useState('store');

  // Products & Drop State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeDrop, setActiveDrop] = useState<Drop>(ACTIVE_DROP);
  const [dolls, setDolls] = useState<DollItem[]>(INITIAL_DOLLS);

  // Cart & Orders
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDoll, setSelectedDoll] = useState<DollItem | null>(null);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);
  const [isInterestOpen, setIsInterestOpen] = useState(false);
  const [interestInitialTab, setInterestInitialTab] = useState<'collector' | 'wrestler' | 'nomination'>('collector');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAddInstagramOpen, setIsAddInstagramOpen] = useState(false);

  // Fetch live products & drop on mount
  useEffect(() => {
    fetchProductsAndDrop();
    // Restore saved cart from local storage if any
    try {
      const savedCart = localStorage.getItem('hazel_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch {
      // LocalStorage not available or parse error
    }
  }, []);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('hazel_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore storage errors
    }
  }, [cartItems]);

  const fetchProductsAndDrop = async () => {
    try {
      const [prodRes, dropRes] = await Promise.all([
        fetch('/api/products').catch(() => null),
        fetch('/api/drops').catch(() => null),
      ]);

      if (prodRes && prodRes.ok) {
        const prodData = (await prodRes.json()) as { products?: Product[] };
        if (prodData.products && prodData.products.length > 0) {
          setProducts(prodData.products);
        }
      }

      if (dropRes && dropRes.ok) {
        const dropData = (await dropRes.json()) as { drop?: Drop };
        if (dropData.drop) {
          setActiveDrop(dropData.drop);
        }
      }
    } catch {
      // Fallbacks already in place
    }
  };

  // Cart Actions
  const handleAddToCart = (product: Product, selectedSize?: string, customNotes?: string) => {
    sounds.playBagAdd();
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.product.id === product.id && it.selectedSize === selectedSize && it.customNotes === customNotes
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          product,
          quantity: 1,
          selectedSize,
          customNotes,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleAddCartItemDirect = (item: CartItem) => {
    sounds.playBagAdd();
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.product.id === item.product.id &&
          it.selectedSize === item.selectedSize &&
          it.customNotes === item.customNotes
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('hazel_cart');
    } catch {}
  };

  const handleOrderSuccess = (order: OrderInfo) => {
    handleClearCart();
    setPendingOrdersCount((c) => c + 1);
    fetchProductsAndDrop(); // refresh drop capacity
  };

  const handleOpenInterest = (tab: 'collector' | 'wrestler' | 'nomination' = 'collector') => {
    setInterestInitialTab(tab);
    setIsInterestOpen(true);
  };

  const handleDollLike = (dollId: string) => {
    setDolls((prev) =>
      prev.map((d) => (d.id === dollId ? { ...d, likesCount: (d.likesCount || 0) + 1 } : d))
    );
  };

  const handleAddDoll = (newDoll: DollItem) => {
    setDolls((prev) => [newDoll, ...prev]);
  };

  const cartItemCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0e0d15] text-gray-100 font-sans selection:bg-pink-600 selection:text-white flex flex-col">
      
      {/* Top Banner: Workload Transparency */}
      <div className="bg-gradient-to-r from-purple-950 via-pink-950 to-amber-950 border-b border-pink-500/20 px-4 py-1.5 text-center text-xs text-pink-200 flex items-center justify-center gap-2 font-crochet font-medium">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
        <span>
          <strong>Hazel The Dollmaker</strong> — Handmade freehand crochet wrestler dolls & original studio merch. Each doll takes 2–6 hours of individual handwork.
        </span>
      </div>

      {/* Main Navbar */}
      <Navbar
        cartItemCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          if (t === 'community') handleOpenInterest('collector');
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenInterestModal={handleOpenInterest}
        pendingOrdersCount={pendingOrdersCount}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          drop={activeDrop}
          onExploreClick={() => {
            document.getElementById('merch-store')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onShopClick={() => {
            document.getElementById('merch-store')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenInterestModal={handleOpenInterest}
        />

        {/* Merch Store Section (Categories, Search, Products) */}
        <MerchStoreSection
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAddToCart={(p) => handleAddToCart(p)}
          onOpenInterestModal={() => handleOpenInterest('collector')}
        />

        {/* Community & Inquiries Callout Strip */}
        <section className="py-12 bg-gradient-to-r from-[#161224] via-[#120f1e] to-[#161224] border-b-2 border-dashed border-fuchsia-500/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">
                Hazel’s Creative Corner
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Russo_One',sans-serif] uppercase">
                Get Involved With The Studio
              </h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Join our VIP drop notifications, pitch an official wrestler collaboration, or nominate a wrestler for our next small-batch drop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Option 1: Collector Drop Club */}
              <div className="crochet-patch p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-pink-400/60 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-crochet">Collector Drop Club</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-script">
                    Hazel limits each drop to protect her craft and deliver on time. Club members get early email announcements with exact slot counts and ship-by dates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenInterest('collector')}
                  className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold font-crochet flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-pink-600/20 cursor-pointer"
                >
                  <span>Join Drop Club</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option 2: Wrestler Collaboration */}
              <div className="crochet-patch p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-400/60 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-crochet">Wrestler Collaboration</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-script">
                    Independent wrestlers and champions: pitch an official limited likeness drop with approved gear and royalties. Inquiries verify likeness and rights control.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenInterest('wrestler')}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-crochet flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  <span>Pitch Collaboration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option 3: Nominate a Wrestler */}
              <div className="crochet-patch p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-purple-400/60 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-crochet">Nominate a Wrestler</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-script">
                    Want to see your favorite indie wrestler, champion, or tag team made in yarn? Vote for them! Hazel groups nominations to plan future drops.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenInterest('nomination')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-crochet flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  <span>Vote for Wrestler</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Hazel Section */}
        <AboutSection onOpenCommission={() => setIsCommissionOpen(true)} />

        {/* Craft Anatomy Section */}
        <CraftAnatomySection />

        {/* Wrestler Dolls Gallery / Archive */}
        <section id="gallery" className="py-16 bg-[#0e0d15] border-b-2 border-dashed border-pink-500/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-crochet font-bold text-pink-400 uppercase tracking-wider mb-1">
                  <CrochetHookIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Ringside Moments & Archives</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-['Russo_One',sans-serif]">
                  The Wrestler & The Doll Showcase
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
                  Actual handmade wrestler dolls gifted and showcased ringside across indie wrestling and major promotions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/hazel_the_dollmaker/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-crochet font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Follow @hazel_the_dollmaker</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dolls.slice(0, 4).map((doll) => (
                <DollCard
                  key={doll.id}
                  doll={doll}
                  onSelect={(d) => setSelectedDoll(d)}
                  onLike={handleDollLike}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Interactive Feed & Quick Embed */}
        <InstagramEmbedSection
          dolls={dolls}
          onAddDoll={handleAddDoll}
          onOpenAddModal={() => setIsAddInstagramOpen(true)}
        />

        {/* Honest FAQ Section */}
        <section className="py-14 bg-[#0c0b14] border-b-2 border-dashed border-pink-500/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">
                Clear & Honest Information
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Russo_One',sans-serif] uppercase">
                Good To Know
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                How Hazel manages her side business, production caps, custom orders, and payments.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'How does Hazel handle orders and payments?',
                  a: 'Hazel reviews every customer request personally! When you submit an order, Hazel connects with you directly via Instagram, WhatsApp, or Email to verify ring gear details, shipping addresses, and payment methods (Venmo, PayPal, Zelle, Card) before any payment is taken.'
                },
                {
                  q: 'Why are doll quantities strictly capped per drop?',
                  a: 'Hazel crochets each doll by hand without commercial manufacturing or automated machines. A single doll takes 2 to 6 hours of detailed handwork. Capping production to 10–15 dolls per drop ensures Hazel delivers every order with highest quality and ships by the promised date.'
                },
                {
                  q: 'What is the difference between a Collectible Drop and a Custom Doll?',
                  a: 'A limited drop is a small, synchronized run of a specific featured wrestler (e.g. Nic Nemeth). A custom 1-of-1 doll is a commission where you provide match attire photos and Hazel creates your specific gear from scratch.'
                },
                {
                  q: 'Are all wrestler dolls official merchandise?',
                  a: 'Commercial merchandise drops will only be released with explicit permissions or partnerships with the featured wrestler. Personal gift dolls presented ringside at live events are artistic tributes and do not imply commercial licenses.'
                },
                {
                  q: 'When will my order ship?',
                  a: 'Every drop clearly states an estimated ship-by date in the hero banner and order review before you submit. Apparel and stickers ship directly; handmade dolls ship as they are completed.'
                }
              ].map((item, i) => (
                <details
                  key={i}
                  className="group bg-[#141220] border border-white/10 rounded-2xl p-4 transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                    <span>{item.q}</span>
                    <span className="text-pink-400 font-mono text-base transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed font-script border-t border-white/5 pt-3">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0a12] border-t-2 border-dashed border-pink-500/20 py-10 text-gray-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-dashed border-pink-400/60 p-0.5 bg-black">
              <img src="/hazel-logo.jpg" alt="Hazel The Dollmaker" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <div className="text-white font-crochet font-bold text-sm">Hazel The Dollmaker</div>
              <div className="text-[11px] text-pink-300/80 font-script">Handmade Freehand Crochet & Wrestling Collectibles</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://www.instagram.com/hazel_the_dollmaker/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-pink-300 transition-colors"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              <span>@hazel_the_dollmaker</span>
            </a>
            <a
              href="https://wa.me/?text=Hi%20Hazel!%20Visiting%20your%20official%20store."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Direct</span>
            </a>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-gray-500 hover:text-amber-400 transition-colors font-mono text-[11px] cursor-pointer"
            >
              Maker Admin
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] text-gray-500">
            © {new Date().getFullYear()} Hazel The Dollmaker. All rights reserved.
            <br />
            Crafted with yarn, passion, and wrestling heart.
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* ALL MODALS                                               */}
      {/* ======================================================== */}

      {/* 1. Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={(code, disc) => {
          setPromoCode(code);
          setDiscount(disc);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 2. Checkout & Order Review Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        promoCode={promoCode}
        discount={discount}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 3. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddCartItemDirect}
        onOpenInterestModal={() => {
          setSelectedProduct(null);
          handleOpenInterest('collector');
        }}
        onOpenCommissionModal={(wrestlerName) => {
          setSelectedProduct(null);
          setIsCommissionOpen(true);
        }}
      />

      {/* 4. Commission Modal (Custom 1-of-1) */}
      <CommissionModal
        isOpen={isCommissionOpen}
        onClose={() => setIsCommissionOpen(false)}
      />

      {/* 5. Community Interest Modal (Drop Club, Wrestler Collab, Nominations) */}
      <CommunityInterestModal
        isOpen={isInterestOpen}
        onClose={() => setIsInterestOpen(false)}
        initialTab={interestInitialTab}
      />

      {/* 6. Admin Studio Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* 7. Wrestler Doll Archive Detail Modal */}
      <DollDetailModal
        doll={selectedDoll}
        onClose={() => setSelectedDoll(null)}
        onLike={handleDollLike}
        onOpenCommission={() => {
          setSelectedDoll(null);
          setIsCommissionOpen(true);
        }}
      />

      {/* 8. Add Instagram Post Modal */}
      <AddInstagramModal
        isOpen={isAddInstagramOpen}
        onClose={() => setIsAddInstagramOpen(false)}
        onAddDoll={handleAddDoll}
      />

    </div>
  );
}
