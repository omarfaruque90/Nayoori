"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  cartItemId: string; // Unique ID for cart item (since same product can have different sizes/colors)
  productId: string;
  title: string;
  price: number;
  mainImageUrl: string;
  color: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isDrawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "cartItemId">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, amount: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openCart = () => setIsDrawerOpen(true);
  const closeCart = () => setIsDrawerOpen(false);
  const clearCart = () => setCartItems([]);

  const addToCart = (newItem: Omit<CartItem, "cartItemId">) => {
    setCartItems((prevItems) => {
      // Check if exact same product (id + color + size) already exists
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productId === newItem.productId && item.color === newItem.color && item.size === newItem.size
      );

      if (existingItemIndex > -1) {
        // Increment quantity if exact match exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }

      // Add new distinct cart item
      const newCartItem = {
        ...newItem,
        cartItemId: `${newItem.productId}-${newItem.color}-${newItem.size}-${Date.now()}`,
      };
      return [...prevItems, newCartItem];
    });
    
    // Automatically open drawer when adding to cart
    openCart(); 
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, amount: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = Math.max(1, item.quantity + amount); // Minimum quantity is 1
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isDrawerOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
