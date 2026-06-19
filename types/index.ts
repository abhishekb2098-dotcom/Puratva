import type {
  User,
  Product,
  Category,
  SubCategory,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
  Banner,
  Testimonial,
  Review,
  Blog,
} from "@prisma/client";

export type ProductWithRelations = Product & {
  category: Category;
  subCategory: SubCategory | null;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
  _count?: { reviews: number; orderItems: number };
};

export type OrderWithRelations = Order & {
  items: (OrderItem & { product: Product })[];
  user: User;
};

export type CartItemType = {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  stock: number;
};

export type WishlistItemType = {
  id: string;
  productId: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  slug: string;
};

export type BannerWithSchedule = Banner & {
  isCurrentlyActive: boolean;
};

export type AdminStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  orderGrowth: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}
