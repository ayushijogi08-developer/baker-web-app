export type Role = "ADMIN" | "STAFF";

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK";

export type OrderType = "PICKUP" | "DELIVERY";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type OrderStatus =
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  active?: boolean;
  sortOrder: number;
  _count?: {
    products: number;
  };
}

export interface ProductSize {
  id: string;
  label: string;
  priceOverride?: number | null;
}

export interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: Category;
  description: string;
  price: number;
  discountPrice?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  ingredients?: string[] | string;
  preparationTime?: string;
  stockQuantity?: number;
  isOutOfStock?: boolean;
  stockStatus: StockStatus;
  isEggless: boolean;
  featured: boolean;
  active?: boolean;
  images: ProductImage[];
  sizes: ProductSize[];
  subGroup?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface OrderItem {
  id: string;
  productId?: string;
  productNameSnapshot: string;
  sizeLabelSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  orderType: OrderType;
  deliveryAddress?: string | null;
  scheduledDate?: string;
  scheduledTime?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENT" | "FLAT";
  value: number;
  minimumOrder: number;
  active: boolean;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  openingHours: string;
  openingTime?: string;
  closingTime?: string;
  isStoreOpenManualOverride?: boolean | null;
  storeClosedNotice?: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  maxDeliveryDistanceKm?: number;
  baseIncludedKm?: number;
  extraKmFee?: number;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  zomatoUrl?: string;
  swiggyUrl?: string;
  logoUrl?: string;
}
