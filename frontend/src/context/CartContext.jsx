/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext(null);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Session expired - logging out...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Sync user state from localStorage to check auth status
  useEffect(() => {
    const checkUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        setUser(savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null);
      } catch (e) {
        console.error("Failed to parse user in CartContext:", e);
        setUser(null);
      }
    };

    checkUser();
    // Listen for storage events (e.g. login/logout in App.jsx)
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const fetchBackendCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/cart');
      
      // If there are guest cart items in localStorage, merge them with the backend cart
      const savedCart = localStorage.getItem('technest_cart');
      if (savedCart && savedCart !== 'undefined') {
        try {
          const guestCart = JSON.parse(savedCart);
          if (guestCart.items && guestCart.items.length > 0) {
            console.log("Merging guest cart with backend cart...");
            let currentCart = res.data;
            for (const item of guestCart.items) {
              currentCart = await addProductToBackend(item.product.id, item.quantity);
            }
            localStorage.removeItem('technest_cart');
            setCart(currentCart);
            return;
          }
        } catch (e) {
          console.error("Failed to parse guestCart in CartContext:", e);
        }
      }
      
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart data when user login status changes
  useEffect(() => {
    if (user) {
      fetchBackendCart();
    } else {
      // Guest mode: load cart from localStorage
      const savedCart = localStorage.getItem('technest_cart');
      if (savedCart && savedCart !== 'undefined') {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse savedCart in CartContext:", e);
          setCart({ items: [] });
        }
      } else {
        setCart({ items: [] });
      }
    }
  }, [user]);

  const addProductToBackend = async (productId, quantity) => {
    const res = await api.post(`/api/cart/add`, null, {
      params: { productId, quantity }
    });
    return res.data;
  };

  const addToCart = async (product, quantity = 1) => {
    if (product.stock <= 0) {
      throw new Error("Product is out of stock");
    }

    if (user) {
      try {
        const updatedCart = await addProductToBackend(product.id, quantity);
        setCart(updatedCart);
      } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to add product to backend cart");
      }
    } else {
      // Guest mode local cart logic
      setCart(prevCart => {
        const existingItemIndex = prevCart.items.findIndex(item => item.product.id === product.id);
        let updatedItems = [...prevCart.items];

        if (existingItemIndex > -1) {
          const newQty = updatedItems[existingItemIndex].quantity + quantity;
          if (product.stock < newQty) {
            throw new Error(`Only ${product.stock} items available in stock`);
          }
          updatedItems[existingItemIndex].quantity = newQty;
        } else {
          updatedItems.push({ product, quantity });
        }

        const newCart = { ...prevCart, items: updatedItems };
        localStorage.setItem('technest_cart', JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const updateCartQty = async (productId, quantity, maxStock) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (maxStock !== undefined && quantity > maxStock) {
      throw new Error(`Only ${maxStock} items available in stock`);
    }

    if (user) {
      try {
        const res = await api.put(`/api/cart/update`, null, {
          params: { productId, quantity }
        });
        setCart(res.data);
      } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to update item quantity");
      }
    } else {
      // Guest mode local cart update
      setCart(prevCart => {
        const updatedItems = prevCart.items.map(item => {
          if (item.product.id === productId) {
            return { ...item, quantity };
          }
          return item;
        });
        const newCart = { ...prevCart, items: updatedItems };
        localStorage.setItem('technest_cart', JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await api.delete(`/api/cart/remove/${productId}`);
        setCart(res.data);
      } catch (err) {
        console.error("Failed to remove item from backend cart", err);
      }
    } else {
      // Guest mode local cart remove
      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(item => item.product.id !== productId);
        const newCart = { ...prevCart, items: updatedItems };
        localStorage.setItem('technest_cart', JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/api/cart/clear');
        setCart({ items: [] });
      } catch (err) {
        console.error("Failed to clear backend cart", err);
      }
    } else {
      // Guest mode local cart clear
      localStorage.removeItem('technest_cart');
      setCart({ items: [] });
    }
  };

  const syncUser = (loggedUser) => {
    setUser(loggedUser);
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const cartSubtotal = cart?.items?.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartSubtotal,
      syncUser
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
