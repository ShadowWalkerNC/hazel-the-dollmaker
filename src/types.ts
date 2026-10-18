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
  likesCount: number;
  isUserAdded?: boolean;
}

export interface CommissionRequest {
  wrestlerName: string;
  promotion: string;
  attireDescription: string;
  hasBelt: boolean;
  beltDetails?: string;
  specialProps?: string;
  clientInstagram: string;
  notes?: string;
}

export type ProductCategory = 'apparel' | 'custom-doll' | 'accessories' | 'stickers' | 'limited';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  badge?: string;
  description: string;
  features: string[];
  imageUrl: string;
  secondaryImageUrl?: string;
  mockupType?: 'tee' | 'hoodie' | 'sticker' | 'pin' | 'tote' | 'doll';
  inStock: boolean;
  hasSizes?: boolean;
  sizes?: string[];
  requiresCustomNotes?: boolean;
  customNotesPlaceholder?: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  id: string; // unique item id (product id + size)
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
  shippingAddress: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string;
  date: string;
}
