export interface DollItem {
  id: string;
  wrestlerName: string;
  dollTitle: string;
  promotion: string;
  date: string;
  instagramUrl: string;
  instagramPostId?: string;
  gearDetails: string[];
  story: string;
  wrestlerImageUrl: string;
  dollImageUrl: string;
  category: 'ringside-gift' | 'champion' | 'indie-favorite' | 'custom-commission';
  featured: boolean;
  isUserAdded?: boolean;
  likesCount?: number;
}

export interface Drop {
  id: string;
  wrestlerName: string;
  title: string;
  tagline: string;
  description: string;
  heroImageUrl: string;
  capacityLimit: number;
  dollsClaimed: number;
  orderingWindowStart: string;
  orderingWindowEnd: string;
  estimatedShipByDate: string;
  status: 'preview' | 'open' | 'paused' | 'sold_out' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

export type ProductCategory =
  | 'custom-doll'
  | 'limited'
  | 'bundle'
  | 'signature'
  | 'apparel'
  | 'accessories'
  | 'stickers';

export type ProductAvailabilityState =
  | 'preview'
  | 'inquiry_only'
  | 'available'
  | 'sold_out'
  | 'archived';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  state: ProductAvailabilityState;
  badge?: string;
  mockupType?: 'tee' | 'hoodie' | 'sticker' | 'pin' | 'tote' | 'doll';
  imageUrl: string;
  secondaryImageUrl?: string;
  dropId?: string;
  dollCapacityUsage: number; // 0 for apparel/stickers, 1 for doll, 2 for bundle with 2 dolls
  productionHours: number; // approx 2-6h for handmade dolls
  hasSizes?: boolean;
  sizes?: string[];
  requiresCustomNotes?: boolean;
  customNotesPlaceholder?: string;
  sortOrder?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  customNotes?: string;
}

export interface OrderInfo {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerInstagram?: string;
  customerPhone?: string;
  preferredContact: 'instagram' | 'whatsapp' | 'email';
  shippingAddress: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  dollSlotsReserved: number;
  promoCode?: string;
  status: 'pending_review' | 'discussing' | 'confirmed' | 'crafted' | 'shipped' | 'cancelled';
  notesToHazel?: string;
  date?: string;
  createdAt?: string | number;
}

export interface InterestRecord {
  id: number;
  kind: 'collector' | 'wrestler' | 'nomination';
  name: string;
  email: string;
  details: string;
  createdAt: string;
}
