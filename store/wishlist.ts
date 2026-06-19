import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItemType } from "@/types";

type WishlistState = {
  items: WishlistItemType[];
  addItem: (item: WishlistItemType) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (!get().hasItem(item.productId)) {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      hasItem: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "puratva-wishlist" }
  )
);
