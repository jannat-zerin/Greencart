'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  healthiness?: number;
  priceHonestyRating?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartHealthAnalysis {
  score: number;
  junkPercentage: number;
  message: string;
  suggestions: string[];
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'INCREASE_QUANTITY'; productId: number }
  | { type: 'DECREASE_QUANTITY'; productId: number }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  analyzeCart: () => CartHealthAnalysis;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.product.id);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity: 1 }];
      }

      const total = newItems.reduce((sum, item) => sum + Math.floor(item.product.price) * item.quantity, 0);
      return { items: newItems, total };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.productId);
      const total = newItems.reduce((sum, item) => sum + Math.floor(item.product.price) * item.quantity, 0);
      return { items: newItems, total };
    }

    case 'INCREASE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      const total = newItems.reduce((sum, item) => sum + Math.floor(item.product.price) * item.quantity, 0);
      return { items: newItems, total };
    }

    case 'DECREASE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0);
      const total = newItems.reduce((sum, item) => sum + Math.floor(item.product.price) * item.quantity, 0);
      return { items: newItems, total };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', product });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  const increaseQuantity = (productId: number) => {
    dispatch({ type: 'INCREASE_QUANTITY', productId });
  };

  const decreaseQuantity = (productId: number) => {
    dispatch({ type: 'DECREASE_QUANTITY', productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const analyzeCart = (): CartHealthAnalysis => {
    const items = state.items;
    if (!items.length) {
      return { score: 100, junkPercentage: 0, message: 'Your cart is empty.', suggestions: [] };
    }

    let totalQty = 0;
    let weightedHealthSum = 0;
    let junkQty = 0;

    items.forEach((item) => {
      const qty = item.quantity || 1;
      totalQty += qty;
      const health = typeof item.product.healthiness === 'number' ? item.product.healthiness : 50;
      weightedHealthSum += health * qty;
      if (health < 50) junkQty += qty;
    });

    const avgHealth = totalQty ? Math.round(weightedHealthSum / totalQty) : 50;
    const junkPercentage = totalQty ? Math.round((junkQty / totalQty) * 100) : 0;

    const suggestions: string[] = [];
    if (junkPercentage >= 60) {
      suggestions.push('Your cart contains a lot of junk food — add fruits or vegetables to balance it.');
    } else if (junkPercentage >= 30) {
      suggestions.push('Consider swapping one snack for a fresh fruit or a vegetable.');
    } else {
      suggestions.push('Nice! Your cart looks balanced. Consider adding more greens for extra nutrients.');
    }

    if (avgHealth < 40) suggestions.push('Try adding whole grains, nuts, or fresh produce to boost overall healthiness.');

    const message = `Your cart health score is ${avgHealth} — ${junkPercentage}% junk items.`;

    return { score: avgHealth, junkPercentage, message, suggestions };
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getItemCount,
        analyzeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}