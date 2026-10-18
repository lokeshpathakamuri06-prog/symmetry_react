import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

/** Most of one item per order (the API accepts 1–20) */
export const MAX_QTY = 20;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('symmetry_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('symmetry_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('symmetry_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Last item added, for the "Added to cart" notice (CartToast)
  const [lastAdded, setLastAdded] = useState(null);
  const dismissAdded = useCallback(() => setLastAdded(null), []);

  useEffect(() => {
    localStorage.setItem('symmetry_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('symmetry_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1, options = {}) => {
    setCartItems((prev) => {
      const selectedFinish = options.finish || product.defaultFinish || 'Signature Brass & Walnut';
      const selectedFabric = options.fabric || options.color || product.defaultFabric || 'Bouclé Cream';
      const itemKey = `${product.id}-${selectedFinish}-${selectedFabric}`;

      const existingIndex = prev.findIndex((item) => item.cartKey === itemKey);
      if (existingIndex > -1) {
        return prev.map((item, i) =>
          i === existingIndex ? { ...item, quantity: Math.min(MAX_QTY, item.quantity + quantity) } : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          cartKey: itemKey,
          quantity: Math.min(MAX_QTY, quantity),
          selectedFinish,
          selectedFabric,
        },
      ];
    });
    if (!options.silent) setLastAdded({ product, quantity, at: Date.now() });
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartKey === cartKey) {
            const newQty = Math.min(MAX_QTY, item.quantity + delta);
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const setItemQuantity = (cartKey, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartKey === cartKey ? { ...item, quantity: Math.min(MAX_QTY, qty) } : item))
    );
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  /** "Save for later": take the item out of the cart and keep it in the wishlist */
  const saveForLater = (item) => {
    setWishlist((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
    removeFromCart(item.cartKey);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const recordOrder = (orderData) => {
    setLastOrder(orderData);
    localStorage.setItem('symmetry_last_order', JSON.stringify(orderData));
    clearCart();
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Total at M.R.P. (original price where there is one), for "You save" in the price details
  const mrpTotal = cartItems.reduce(
    (acc, item) => acc + Math.max(item.originalPrice || 0, item.price) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18); // 18% GST standard
  const shipping = subtotal > 150000 || subtotal === 0 ? 0 : 3500; // Same rule as the API: free above ₹1,50,000
  const totalAmount = subtotal + tax + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        setItemQuantity,
        clearCart,
        cartCount,
        subtotal,
        mrpTotal,
        savings: mrpTotal - subtotal,
        tax,
        shipping,
        totalAmount,
        lastOrder,
        recordOrder,
        wishlist,
        toggleWishlist,
        saveForLater,
        lastAdded,
        dismissAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
