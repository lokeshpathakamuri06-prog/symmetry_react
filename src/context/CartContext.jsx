import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomer } from './CustomerContext';
import { useProducts } from './PublicContentContext';

// The cart belongs to the customer's account (symmetry_backend app/api/account_cart.py), so it is the
// same on every device. Visitors can browse freely; Add to cart / Buy now asks them to sign in first,
// remembers the item, and adds it once they are signed in. A cart kept in this browser before sign-in
// was required is moved into the account on sign-in. The wishlist stays in the browser.

const CartContext = createContext();

/** Most of one item per order (the API accepts 1–20) */
export const MAX_QTY = 20;

const EMPTY = Object.freeze([]);
const LEGACY_CART_KEY = 'symmetry_cart';
const PENDING_KEY = 'symmetry_pending_add'; // the item a signed-out visitor tried to add

const readJson = (storage, key, fallback) => {
  try {
    const saved = storage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};
const remove = (storage, key) => {
  try {
    storage.removeItem(key);
  } catch {
    /* storage blocked */
  }
};
const writeJson = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
};

/** Chosen options as the API stores them (finish / fabric, null when the product has none) */
const optionsFor = (product, options = {}) => ({
  finish: options.finish || product.defaultFinish || null,
  fabric: options.fabric || options.color || product.defaultFabric || null,
});

export const CartProvider = ({ children }) => {
  const { status: accountStatus, customer, request } = useCustomer();
  const owner = accountStatus === 'signedIn' ? customer?.email : null;
  const { items: products, status: contentStatus } = useProducts();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  // Account cart lines from the API, tagged with whose cart they are (nothing shows for anyone else)
  const [cart, setCart] = useState({ owner: null, items: [], failed: null });
  const lines = owner && cart.owner === owner ? cart.items : EMPTY;
  const cartStatus = !owner
    ? (accountStatus === 'checking' ? 'loading' : 'idle')
    : cart.owner === owner ? 'ready' : cart.failed === owner ? 'error' : 'loading';
  const setLines = useCallback((fn) => setCart((prev) => ({ ...prev, items: fn(prev.items) })), []);

  const [wishlist, setWishlist] = useState(() => readJson(localStorage, 'symmetry_wishlist', []));
  const [lastOrder, setLastOrder] = useState(() => readJson(localStorage, 'symmetry_last_order', null));

  // Last item added, for the "Added to cart" notice (CartToast)
  const [lastAdded, setLastAdded] = useState(null);
  const dismissAdded = useCallback(() => setLastAdded(null), []);

  useEffect(() => {
    writeJson(localStorage, 'symmetry_wishlist', wishlist);
  }, [wishlist]);

  const accept = useCallback((data) => {
    setCart({ owner, items: data?.items || [], failed: null });
    return data?.items || [];
  }, [owner]);
  const fail = useCallback(() => setCart((prev) => ({ ...prev, failed: owner })), [owner]);

  // Signed in: load the account cart, first moving in any browser cart and the item they tried to add
  const loadedFor = useRef(null);
  useEffect(() => {
    if (!owner) {
      loadedFor.current = null;
      return;
    }
    if (loadedFor.current === owner) return;
    loadedFor.current = owner;
    const legacy = readJson(localStorage, LEGACY_CART_KEY, []);
    const pending = readJson(sessionStorage, PENDING_KEY, null);
    const toMerge = [
      ...(Array.isArray(legacy) ? legacy : []).map((item) => ({
        productId: item.id, quantity: Math.min(MAX_QTY, item.quantity || 1),
        finish: item.selectedFinish || null, fabric: item.selectedFabric || null,
      })),
      ...(pending?.productId ? [pending] : []),
    ].filter((i) => i.productId).slice(0, 50);
    const load = toMerge.length
      ? request('/account/cart/merge', { method: 'POST', body: { items: toMerge.map(({ productId, quantity, finish, fabric }) => ({ productId, quantity, finish, fabric })) } })
      : request('/account/cart');
    load
      .then((data) => {
        accept(data);
        remove(localStorage, LEGACY_CART_KEY);
        remove(sessionStorage, PENDING_KEY);
        if (pending?.productId) {
          const product = products.find((p) => p.id === pending.productId);
          if (product && !pending.buyNow) setLastAdded({ product, quantity: pending.quantity, at: Date.now() });
        }
      })
      .catch(fail);
  }, [owner, request, accept, fail, products]);

  const reload = useCallback(() => request('/account/cart').then(accept).catch(fail), [request, accept, fail]);

  /** Signed out: remember the item and go to sign-in; afterwards they come back to `next` */
  const askToSignIn = useCallback((product, quantity, options) => {
    writeJson(sessionStorage, PENDING_KEY, {
      productId: product.id, quantity: Math.min(MAX_QTY, quantity), ...optionsFor(product, options), buyNow: !!options.buyNow,
    });
    const next = options.buyNow ? '/checkout' : `${pathname}${search}`;
    navigate(`/account/login?next=${encodeURIComponent(next)}&reason=cart`);
  }, [navigate, pathname, search]);

  /**
   * Add to the account cart. Resolves true when added; false when the visitor was sent to sign in
   * (or the item can't be bought; `error` then says why).
   * options: finish, fabric/color, silent (no "Added" notice), buyNow (go to checkout after sign-in)
   */
  const addToCart = useCallback(async (product, quantity = 1, options = {}) => {
    if (accountStatus !== 'signedIn') {
      askToSignIn(product, quantity, options);
      return false;
    }
    try {
      accept(await request('/account/cart', {
        method: 'POST', body: { productId: product.id, quantity: Math.min(MAX_QTY, quantity), ...optionsFor(product, options) },
      }));
    } catch (err) {
      if (err.status === 401) askToSignIn(product, quantity, options);
      else setLastAdded({ product, quantity, at: Date.now(), error: err.message || 'Could not add this item. Please try again.' });
      return false;
    }
    if (!options.silent) setLastAdded({ product, quantity, at: Date.now() });
    return true;
  }, [accountStatus, askToSignIn, request, accept]);

  // Changes show at once; the server's answer then replaces them (or the cart reloads on error)
  const change = useCallback((cartKey, quantity) => {
    setLines((prev) => (quantity > 0 ? prev.map((l) => (l.id === cartKey ? { ...l, quantity } : l)) : prev.filter((l) => l.id !== cartKey)));
    const call = quantity > 0
      ? request(`/account/cart/${cartKey}`, { method: 'PATCH', body: { quantity } })
      : request(`/account/cart/${cartKey}`, { method: 'DELETE' });
    return call.then(accept).catch(reload);
  }, [request, accept, reload, setLines]);

  const removeFromCart = useCallback((cartKey) => change(cartKey, 0), [change]);

  const updateQuantity = useCallback((cartKey, delta) => {
    const line = lines.find((l) => l.id === cartKey);
    if (line) change(cartKey, Math.min(MAX_QTY, line.quantity + delta));
  }, [lines, change]);

  const setItemQuantity = useCallback((cartKey, newQty) => {
    const qty = parseInt(newQty, 10);
    change(cartKey, isNaN(qty) || qty <= 0 ? 0 : Math.min(MAX_QTY, qty));
  }, [change]);

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

  /** After an order: the server has already emptied the account cart */
  const clearCart = useCallback(() => setLines(() => []), [setLines]);

  const recordOrder = (orderData) => {
    setLastOrder(orderData);
    writeJson(localStorage, 'symmetry_last_order', orderData);
    clearCart();
  };

  // Cart lines joined to the published product (photos, name, options); price and stock are live
  const cartItems = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return lines
      .filter((l) => byId.has(l.productId) || contentStatus !== 'ready')
      .map((l) => {
        const product = byId.get(l.productId) || { id: l.productId, name: '' };
        return {
          ...product,
          price: l.price, originalPrice: l.originalPrice, availability: l.availability, inStock: l.inStock,
          stockQuantity: l.stockQuantity, stockStatus: l.stockStatus,
          cartKey: l.id,
          quantity: l.quantity,
          selectedFinish: l.finish || product.defaultFinish || null,
          selectedFabric: l.fabric || product.defaultFabric || null,
        };
      });
  }, [lines, products, contentStatus]);

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
        cartStatus,
        signedIn: accountStatus === 'signedIn',
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
