"use client";

import { createContext, useContext, useState, useTransition, type ReactNode } from "react";
import { addToCart, removeCartLine, updateCartLine } from "@/lib/cart/actions";
import type { UiCart } from "@/lib/shopify/mappers";
import type { LanguageCode } from "@/lib/shopify/types";

type CartContextValue = {
  cart: UiCart | null;
  isOpen: boolean;
  isPending: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  initialCart,
  language,
  children,
}: {
  initialCart: UiCart | null;
  language: LanguageCode;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<UiCart | null>(initialCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function addItem(variantId: string, quantity: number) {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          setCart(await addToCart(variantId, quantity, language));
          setIsOpen(true);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  function updateItem(lineId: string, quantity: number) {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          setCart(await updateCartLine(lineId, quantity, language));
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  function removeItem(lineId: string) {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          setCart(await removeCartLine(lineId, language));
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
