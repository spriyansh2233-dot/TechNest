import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import axios from 'axios';
import { useCart } from './context/CartContext';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  MessageSquare, 
  X, 
  ArrowLeft, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  DollarSign, 
  Send,
  Loader,
  Heart,
  Star,
  Shield,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import { ProductGridSkeleton } from './components/SkeletonLoader';

// Lazy loaded page components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Shop = lazy(() => import('./pages/Shop'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));

// Configure Axios Instance
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

// Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  let user = null;
  try {
    const saved = localStorage.getItem('user');
    user = saved && saved !== 'undefined' ? JSON.parse(saved) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage in ProtectedRoute:", e);
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/shop" replace />;
  }
  return children;
};

// HERO_SLIDES removed

export default function App() {
  const { cart, addToCart, updateCartQty, removeFromCart, clearCart, cartCount, cartSubtotal, syncUser } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & View States
  const [currentView, setCurrentView] = useState('home'); // 'home', 'detail', 'dashboard', 'admin'
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  
  
  
  // Data States
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [personalRecommendations, setPersonalRecommendations] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [freqBought, setFreqBought] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1500);

  // Premium UX states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // User & Auth States
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      return null;
    }
  });
  const [authMode, setAuthMode] = useState(null); // 'login', 'register' or null
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Cart & Orders State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [latestOrderSummary, setLatestOrderSummary] = useState(null);

  // Admin Form State
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', stock: '', category: 'Electronics', imageUrl: '', discount: 0
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminTab, setAdminTab] = useState('products'); // 'products', 'orders', 'users'

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your TechNest AI Assistant. 🤖 Ask me anything about returns, tracking, payments, or popular recommendations!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Payment State
  const [showPaymentMock, setShowPaymentMock] = useState(false);
  const [paymentStep, setPaymentStep] = useState('select'); // 'select', 'processing', 'success'
  const [paymentMethod, setPaymentMethod] = useState('');
  const [toast, setToast] = useState(null);
  const [showGuestCheckoutModal, setShowGuestCheckoutModal] = useState(false);
  const [perfModeEnabled, setPerfModeEnabled] = useState(() => {
    try {
      return localStorage.getItem('technest_perf_mode') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('technest_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState([]);

  // Sync wishlist to appropriate storage key depending on user state
  useEffect(() => {
    const key = user ? `technest_wishlist_${user.email}` : 'technest_wishlist_guest';
    try {
      const saved = localStorage.getItem(key);
      setWishlist(saved && saved !== 'undefined' ? JSON.parse(saved) : []);
    } catch (e) {
      setWishlist([]);
    }
  }, [user]);

  useEffect(() => {
    const key = user ? `technest_wishlist_${user.email}` : 'technest_wishlist_guest';
    localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, user]);

  // Smart Scrolling Header & Direction Tracker
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Slower, smoother transition for header shrink trigger
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY || currentScrollY <= 20) {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle URL category query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    if (categoryParam) {
      const normalized = categoryParam.toLowerCase();
      const urlCategoryMap = {
        'audio': 'Audio Gear',
        'wearables': 'Smart Wearables',
        'gaming': 'Gaming',
        'smartdevices': 'Smart Devices',
        'accessories': 'Accessories',
        'smarthome': 'Smart Devices'
      };
      const mapped = urlCategoryMap[normalized];
      if (mapped) {
        setSelectedCategory(mapped);
      }
    }
  }, [location.search]);

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Handle logo scroll behavior on route changes
  useEffect(() => {
    if (location.pathname === '/') {
      const shouldScroll = sessionStorage.getItem('technest_scroll_to_top');
      if (shouldScroll === 'true') {
        sessionStorage.removeItem('technest_scroll_to_top');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.pathname]);

  const handleLogoClick = (e) => {
    if (e) e.preventDefault();
    setSelectedProductId(null);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      sessionStorage.setItem('technest_scroll_to_top', 'true');
      navigate('/');
    }
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  // Categories list - aligned with "Explore by Category" section naming
  const categories = ['All', 'Audio Gear', 'Smart Wearables', 'Gaming', 'Smart Devices', 'Accessories'];

  // Scroll to bot chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Load Initial Data
  useEffect(() => {
    fetchProducts();
    fetchRecommendations();
    if (user) {
      fetchOrders();
      if (user.role === 'ADMIN') {
        fetchAdminOrders();
        fetchAdminUsers();
      }
    }
  }, [user]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleWishlist = (product) => {
    const isAlreadyWishlisted = wishlist.some(item => item.id === product.id);
    setWishlist(prev => 
      isAlreadyWishlisted ? prev.filter(item => item.id !== product.id) : [...prev, product]
    );
    showToast(isAlreadyWishlisted ? 'Removed from wishlist' : 'Added to wishlist!', 'info');
  };

  // API Call functions
  // Map frontend display category names to actual database category values
  const categoryToDbMap = {
    'Audio Gear': 'Audio',
    'Smart Wearables': 'Wearables',
    'Gaming': 'Electronics',
    'Smart Devices': 'Smart Home',
    'Accessories': 'Accessories'
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      let url = '/api/products';
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'All') {
        const dbCategory = categoryToDbMap[selectedCategory] || selectedCategory;
        params.category = dbCategory;
      }
      params.maxPrice = priceRange;
      
      const res = await api.get(url, { params });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setTimeout(() => setLoadingProducts(false), 500);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/api/recommendations/personal');
      setPersonalRecommendations(res.data);
    } catch (err) {
      console.error("Error personal recommendations:", err);
    }
  };

  const fetchProductDetails = async (id) => {
    try {
      const res = await api.get(`/api/products/${id}`);
      const product = res.data;
      setSelectedProduct(product);
      
      // Track recently viewed
      setRecentlyViewed(prev => {
        const filtered = prev.filter(p => p.id !== product.id);
        const updated = [product, ...filtered].slice(0, 5); // Keep last 5
        localStorage.setItem('technest_recently_viewed', JSON.stringify(updated));
        return updated;
      });

      // Fetch recommendation side-car data
      const simRes = await api.get(`/api/recommendations/similar/${id}`);
      setSimilarProducts(simRes.data);
      
      const freqRes = await api.get(`/api/recommendations/frequently-bought/${id}`);
      setFreqBought(freqRes.data);
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  // Cart is fetched and synchronized via CartContext

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await api.get('/api/orders');
      // Sort orders by most recent
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setUserOrders(sorted);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchAdminOrders = async () => {
    try {
      const res = await api.get('/api/orders/admin');
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setAdminOrders(sorted);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setAdminUsers(res.data);
    } catch (err) {
      console.error("Error fetching admin users:", err);
    }
  };

  // Handle Search & Filtering
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, priceRange]);

  // Auth Operations
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        const res = await api.post('/api/auth/login', {
          email: authForm.email,
          password: authForm.password
        });
        localStorage.setItem('token', res.data.token);
        const loggedUser = {
          name: res.data.name,
          email: res.data.email,
          role: res.data.email === 'admin@technest.com' ? 'ADMIN' : 'USER'
        };
        
        // Sync wishlist
        const guestWishlistStr = localStorage.getItem('technest_wishlist_guest');
        let userWishlist = [];
        try {
          const userWishlistKey = `technest_wishlist_${loggedUser.email}`;
          const userSaved = localStorage.getItem(userWishlistKey);
          userWishlist = userSaved && userSaved !== 'undefined' ? JSON.parse(userSaved) : [];
          
          if (guestWishlistStr && guestWishlistStr !== 'undefined') {
            const guestWishlist = JSON.parse(guestWishlistStr);
            if (guestWishlist.length > 0) {
              const existingIds = new Set(userWishlist.map(item => item.id));
              for (const item of guestWishlist) {
                if (!existingIds.has(item.id)) {
                  userWishlist.push(item);
                }
              }
              localStorage.removeItem('technest_wishlist_guest');
            }
          }
          localStorage.setItem(userWishlistKey, JSON.stringify(userWishlist));
        } catch (e) {
          console.error("Error syncing wishlist on login:", e);
        }

        setWishlist(userWishlist);
        setUser(loggedUser);
        syncUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        showToast(`Welcome back, ${res.data.name}!`);
        setAuthMode(null);
      } else {
        const res = await api.post('/api/auth/register', {
          name: authForm.name,
          email: authForm.email,
          password: authForm.password
        });
        localStorage.setItem('token', res.data.token);
        const loggedUser = {
          name: res.data.name,
          email: res.data.email,
          role: 'USER'
        };

        // Sync wishlist
        const guestWishlistStr = localStorage.getItem('technest_wishlist_guest');
        let userWishlist = [];
        try {
          const userWishlistKey = `technest_wishlist_${loggedUser.email}`;
          const userSaved = localStorage.getItem(userWishlistKey);
          userWishlist = userSaved && userSaved !== 'undefined' ? JSON.parse(userSaved) : [];
          
          if (guestWishlistStr && guestWishlistStr !== 'undefined') {
            const guestWishlist = JSON.parse(guestWishlistStr);
            if (guestWishlist.length > 0) {
              const existingIds = new Set(userWishlist.map(item => item.id));
              for (const item of guestWishlist) {
                if (!existingIds.has(item.id)) {
                  userWishlist.push(item);
                }
              }
              localStorage.removeItem('technest_wishlist_guest');
            }
          }
          localStorage.setItem(userWishlistKey, JSON.stringify(userWishlist));
        } catch (e) {
          console.error("Error syncing wishlist on register:", e);
        }

        setWishlist(userWishlist);
        setUser(loggedUser);
        syncUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        showToast(`Account created successfully! Welcome, ${res.data.name}!`);
        setAuthMode(null);
      }
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    syncUser(null);
    setUserOrders([]);
    setAdminOrders([]);
    setCurrentView('home');
    showToast('Logged out successfully.');
  };

  // Cart Operations Wrappers
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      await addToCart(product, quantity);
      showToast('Added to cart!');
    } catch (err) {
      showToast(err.message || 'Failed to add item', 'error');
    }
  };

  const handleUpdateCartQty = async (productId, quantity, maxStock) => {
    try {
      await updateCartQty(productId, quantity, maxStock);
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      showToast('Item removed from cart');
    } catch (err) {
      showToast('Failed to remove item', 'error');
    }
  };

  // Checkout & Payment simulation
  const handleCheckoutClick = () => {
    if (!cart || cart.items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    if (!user) {
      setIsCartOpen(false);
      setShowGuestCheckoutModal(true);
      return;
    }
    setShowPaymentMock(true);
    setPaymentStep('select');
  };

  const processMockPayment = async () => {
    if (!paymentMethod) {
      showToast('Please select a payment method', 'info');
      return;
    }
    setPaymentStep('processing');

    try {
      // 1. Create payment order on backend
      const orderRes = await api.post('/api/payments/create-order');
      const { id: razorpayOrderId, amount, currency, razorpayKey } = orderRes.data;

      // 2. Check if window.Razorpay is available and has a valid key configured
      if (window.Razorpay && razorpayKey && !razorpayKey.startsWith("rzp_test_dummyId")) {
        const options = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: "TechNest",
          description: "Premium Electronic Purchase",
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              setPaymentStep('processing');
              const verifyRes = await api.post('/api/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              setLatestOrderSummary({
                orderId: response.razorpay_order_id,
                total: cartSubtotal,
                items: cart.items ? [...cart.items] : []
              });
              setPaymentStep('success');
              clearCart();
              fetchOrders();
              fetchRecommendations();
              showToast('Order placed successfully. Thank you for shopping with us!', 'success');
            } catch (err) {
              showToast(err.response?.data?.message || 'Payment verification failed', 'error');
              setPaymentStep('select');
            }
          },
          prefill: {
            name: user?.name || "Customer",
            email: user?.email || "customer@technest.com",
            contact: "9999999999"
          },
          theme: {
            color: "#f42c37"
          },
          modal: {
            ondismiss: function () {
              setPaymentStep('select');
              showToast('Payment cancelled by user', 'info');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback to verified simulation if key is dummy/test
        console.log("Using Razorpay simulation...");
        setTimeout(async () => {
          try {
            const paymentId = 'pay_MOCK_' + Math.random().toString(36).substring(2, 11).toUpperCase();
            const signature = 'sig_MOCK_' + Math.random().toString(36).substring(2, 15);
            
            // Post signature validation to backend verify endpoint
            const verifyRes = await api.post('/api/payments/verify', {
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: signature
            });
            setLatestOrderSummary({
              orderId: razorpayOrderId || ('SC-' + Math.random().toString(36).substring(2, 9).toUpperCase()),
              total: cartSubtotal,
              items: cart.items ? [...cart.items] : []
            });
            setPaymentStep('success');
            clearCart();
            fetchOrders();
            fetchRecommendations();
            showToast('Order placed successfully. Thank you for shopping with us!', 'success');
          } catch (err) {
            showToast(err.response?.data?.message || 'Failed to place order', 'error');
            setPaymentStep('select');
          }
        }, 2000);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Order checkout failed to initialize', 'error');
      setPaymentStep('select');
    }
  };

  // Order Operations
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/api/orders/${orderId}/cancel`);
      fetchOrders();
      fetchProducts(); // Refresh stocks
      showToast('Order cancelled successfully. Refund processed.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    }
  };

  // Chatbot Messaging
  const handleSendMessage = async (msgText) => {
    const textToSend = msgText || chatInput;
    if (!textToSend.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    if (!msgText) setChatInput('');
    
    setIsTyping(true);

    try {
      const res = await api.post('/api/chatbot', { message: textToSend });
      // Simulate natural thinking delay
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'bot', text: res.data.response }]);
        setIsTyping(false);
      }, 700);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'Oops! I had trouble connecting to the brain. Please try again.' }]);
    }
  };

  // Admin Operations
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/products', newProduct);
      fetchProducts();
      setNewProduct({
        name: '', description: '', price: '', stock: '', category: 'Electronics', imageUrl: '', discount: 0
      });
      showToast('Product created successfully!');
    } catch (err) {
      showToast('Failed to create product', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await api.delete(`/api/products/${productId}`);
        fetchProducts();
        showToast('Product deleted successfully!');
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to delete product', 'error');
      }
    }
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/products/${editingProduct.id}`, editingProduct);
      fetchProducts();
      setEditingProduct(null);
      showToast('Product updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/admin/${orderId}/status`, null, {
        params: { status }
      });
      fetchAdminOrders();
      showToast('Order status updated');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Total quantity count and subtotal are retrieved dynamically from CartContext

  // Helper to get quantity of a product in the cart
  const getProductCartQty = (productId) => {
    if (!cart || !cart.items) return 0;
    const item = cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const cartTax = cartSubtotal * 0.08;
  const cartTotal = cartSubtotal + cartTax;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-[#8A2BE2]/30 selection:text-primary transition-colors duration-300 relative">
      {/* Premium Ambient Background System */}
      {!perfModeEnabled && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Faint futuristic tech grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(138,43,226,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(138,43,226,0.012)_1px,transparent_1px)] bg-[size:50px_50px] opacity-35 pointer-events-none" />
          
          {/* Deep atmospheric dark purple to violet mesh gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0822] via-[#080514] to-[#060b24] opacity-98" />

          {/* Slow moving soft glow orbs */}
          <motion.div 
            animate={{
              x: [0, 80, -40, 0],
              y: [0, -60, 40, 0],
              scale: [1, 1.15, 0.9, 1]
            }}
            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
            className="absolute top-[10%] left-[-15%] w-[45vw] h-[45vw] max-w-[650px] rounded-full bg-[#8A2BE2]/14 blur-[140px] mix-blend-screen"
          />
          
          <motion.div 
            animate={{
              x: [0, -70, 50, 0],
              y: [0, 80, -50, 0],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 30, ease: "easeInOut" }}
            className="absolute bottom-[10%] right-[-15%] w-[50vw] h-[50vw] max-w-[700px] rounded-full bg-[#4f46e5]/10 blur-[160px] mix-blend-screen"
          />

          <motion.div 
            animate={{
              x: [0, 40, -50, 0],
              y: [0, 50, -60, 0],
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute top-[50%] left-[20%] w-[35vw] h-[35vw] max-w-[500px] rounded-full bg-[#4f46e5]/8 blur-[130px] mix-blend-screen"
          />

          <motion.div 
            animate={{
              x: [0, -50, 60, 0],
              y: [0, -40, 50, 0],
            }}
            transition={{ repeat: Infinity, duration: 28, ease: "easeInOut" }}
            className="absolute top-[75%] right-[20%] w-[30vw] h-[30vw] max-w-[450px] rounded-full bg-[#8A2BE2]/10 blur-[110px] mix-blend-screen"
          />

          {/* Ultra-low opacity rotating atmospheric light streaks */}
          <div className="absolute inset-0 opacity-[0.07] overflow-hidden">
            <div className="absolute top-1/4 left-0 w-full h-[150px] bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent -rotate-12 transform scale-150 blur-[80px]" />
            <div className="absolute top-2/3 right-0 w-full h-[200px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent rotate-12 transform scale-150 blur-[100px]" />
          </div>
        </div>
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateCartQty={handleUpdateCartQty}
        removeFromCart={handleRemoveFromCart}
        subtotal={cartSubtotal}
        tax={cartTax}
        total={cartTotal}
        onCheckout={handleCheckoutClick}
      />

      {/* Guest Checkout Redirect Modal */}
      <AnimatePresence>
        {showGuestCheckoutModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuestCheckoutModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative glass-card border border-white/20 p-8 max-w-md w-full z-10 shadow-[0_0_50px_rgba(138,43,226,0.4)] bg-[#0f0f0f]/95 backdrop-blur-2xl text-center"
            >
              <button 
                onClick={() => setShowGuestCheckoutModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>

              <div className="w-16 h-16 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[#8A2BE2] text-[32px] animate-pulse">lock</span>
              </div>

              <h3 className="font-headline-lg text-[22px] text-primary mb-3 font-bold">Login to Complete Purchase</h3>
              <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed">
                You need to be logged in to securely save your shipping address and complete your checkout.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setShowGuestCheckoutModal(false);
                    navigate('/login');
                  }}
                  className="w-full py-3.5 bg-primary text-surface font-label-caps text-[12px] uppercase tracking-widest rounded-xl hover:bg-primary/95 shadow-[0_0_15px_rgba(138,43,226,0.4)] hover:shadow-[0_0_20px_rgba(138,43,226,0.6)] transition-all font-bold cursor-pointer"
                >
                  Sign In to Account
                </button>
                <button 
                  onClick={() => {
                    setShowGuestCheckoutModal(false);
                    navigate('/signup');
                  }}
                  className="w-full py-3.5 bg-transparent border border-outline-variant hover:border-[#8A2BE2]/50 text-primary font-label-caps text-[12px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  Create New Account
                </button>
                <button 
                  onClick={() => setShowGuestCheckoutModal(false)}
                  className="w-full py-2.5 text-on-surface-variant hover:text-primary text-[11px] font-label-caps tracking-widest uppercase transition-all cursor-pointer mt-2"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPONENT: MOCK CHECKOUT PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentMock && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (paymentStep !== 'processing') {
                  setShowPaymentMock(false);
                }
              }}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[160]"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-[#0f0f0f]/95 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(138,43,226,0.4)] border border-white/20 z-[161] text-left"
            >
              {/* Header branding */}
              <div className="bg-[#141414] px-8 py-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-[#8A2BE2]/20 text-[#8A2BE2] border border-[#8A2BE2]/30 p-2 rounded font-mono-technical text-[10px] uppercase tracking-widest font-bold">
                    PAY
                  </div>
                  <div>
                    <h4 className="font-headline-lg text-[18px] text-primary font-bold">
                      {paymentStep === 'success' ? 'Payment Successful' : 'TechNest Checkout'}
                    </h4>
                    <p className="font-body-md text-[12px] text-on-surface-variant mt-1">Secure Checkout</p>
                  </div>
                </div>
                
                {paymentStep !== 'processing' && (
                  <button 
                    onClick={() => setShowPaymentMock(false)}
                    className="p-2 hover:bg-white/5 text-on-surface-variant hover:text-[#8A2BE2] rounded-full transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Select Method State */}
              {paymentStep === 'select' && (
                <div className="p-8 space-y-6">
                  
                  {/* Product/Amount summary */}
                  <div className="flex justify-between items-center bg-white/5 border border-white/10 p-5 rounded-xl">
                    <div>
                      <h5 className="font-body-lg text-[14px] text-primary font-semibold">Order Summary</h5>
                      <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Checking out {cartCount} items</p>
                    </div>
                    <span className="font-mono-technical text-[20px] text-primary font-bold">${cartSubtotal.toFixed(2)}</span>
                  </div>

                  <div className="space-y-4">
                    <h6 className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Select Payment Method</h6>
                    
                    {/* Cards option */}
                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/5 ${
                        paymentMethod === 'card' ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 shadow-[0_0_10px_rgba(138,43,226,0.15)]' : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <input type="radio" checked={paymentMethod === 'card'} onChange={() => {}} className="accent-[#8A2BE2] cursor-pointer" />
                      <div>
                        <p className="font-body-lg text-[14px] text-primary font-semibold">Credit / Debit Card</p>
                        <p className="font-body-md text-[12px] text-on-surface-variant mt-1">Pay with Visa, Mastercard, or AMEX</p>
                      </div>
                    </div>

                    {/* UPI option */}
                    <div 
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/5 ${
                        paymentMethod === 'upi' ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 shadow-[0_0_10px_rgba(138,43,226,0.15)]' : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <input type="radio" checked={paymentMethod === 'upi'} onChange={() => {}} className="accent-[#8A2BE2] cursor-pointer" />
                      <div>
                        <p className="font-body-lg text-[14px] text-primary font-semibold">UPI Transfer</p>
                        <p className="font-body-md text-[12px] text-on-surface-variant mt-1">Pay with any UPI app</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={processMockPayment}
                    className="w-full py-4 bg-primary text-surface font-label-caps text-[12px] uppercase tracking-widest rounded-xl hover:bg-primary/95 shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all text-center flex items-center justify-center gap-2 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Pay ${cartSubtotal.toFixed(2)}</span>
                  </button>
                </div>
              )}

              {/* Processing State */}
              {paymentStep === 'processing' && (
                <div className="p-16 text-center flex flex-col items-center justify-center space-y-6">
                  <span className="material-symbols-outlined text-[48px] text-primary animate-spin">sync</span>
                  <div className="space-y-2">
                    <h4 className="font-headline-lg text-[18px] text-primary font-bold">Processing transaction...</h4>
                    <p className="font-body-md text-[14px] text-on-surface-variant">Connecting to bank servers...</p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {paymentStep === 'success' && (
                <div className="p-8 md:p-10 text-center flex flex-col items-center justify-center space-y-6">
                  <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/25 flex items-center justify-center w-fit mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse">
                    <span className="material-symbols-outlined text-[36px]">task_alt</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-headline-lg text-[22px] text-primary font-bold">Order Confirmed</h3>
                    <p className="font-body-md text-[13px] text-on-surface-variant max-w-[320px] mx-auto leading-relaxed">
                      Your order has been placed successfully. Thank you for shopping with TechNest.
                    </p>
                  </div>

                  {/* Estimated Delivery Date Badge */}
                  <div className="flex items-center gap-2 justify-center bg-emerald-500/5 text-emerald-400 border border-emerald-500/15 px-4 py-2 rounded-xl text-[12px] font-medium w-fit mx-auto shadow-[0_0_10px_rgba(16,185,129,0.05)]">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">local_shipping</span>
                    <span>Estimated Delivery: <strong className="font-semibold text-primary">{new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong> (Express)</span>
                  </div>

                  {/* Order Summary Snippet */}
                  {latestOrderSummary && (
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-left max-w-sm mx-auto shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      <div className="flex justify-between items-center text-[12px] border-b border-white/5 pb-2.5">
                        <div>
                          <span className="text-on-surface-variant text-[10px] uppercase tracking-wider block font-medium">Order ID</span>
                          <span className="font-mono-technical text-primary font-bold">#{latestOrderSummary.orderId}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-on-surface-variant text-[10px] uppercase tracking-wider block font-medium">Total Paid</span>
                          <span className="font-mono-technical text-[#8A2BE2] font-bold">${latestOrderSummary.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Product Thumbnails Grid */}
                      <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-hide">
                        {latestOrderSummary.items.map((item, idx) => (
                          <div key={idx} className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg p-1.5 flex items-center justify-center mix-blend-screen flex-shrink-0 relative group" title={item.product.name}>
                            <img src={item.product.imageUrl} alt="" className="max-h-full object-contain filter drop-shadow-md" />
                            {item.quantity > 1 && (
                              <span className="absolute -bottom-1 -right-1 bg-[#8A2BE2] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border border-[#0f0f0f]">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Redirection Buttons */}
                  <div className="w-full flex flex-col gap-3 max-w-sm mx-auto pt-2">
                    <button 
                      onClick={() => { setShowPaymentMock(false); setIsCartOpen(false); navigate('/orders'); }}
                      className="w-full py-4 bg-primary text-surface font-label-caps text-[11px] uppercase tracking-widest rounded-xl hover:bg-primary/95 shadow-[0_0_15px_rgba(138,43,226,0.3)] hover:shadow-[0_0_20px_rgba(138,43,226,0.5)] transition-all cursor-pointer font-bold text-center active:scale-[0.98]"
                    >
                      View Orders
                    </button>
                    <button 
                      onClick={() => { setShowPaymentMock(false); setIsCartOpen(false); navigate('/shop'); }}
                      className="w-full py-3.5 bg-transparent border border-white/15 hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/5 text-primary font-label-caps text-[11px] uppercase tracking-widest rounded-xl transition-all cursor-pointer font-bold text-center active:scale-[0.98]"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 right-6 z-[200] flex items-center gap-3.5 px-6 py-4 rounded-xl border border-white/20 shadow-2xl bg-[#0f0f0f]/90 backdrop-blur-2xl max-w-sm"
          >
            <div className={`p-2 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
              toast.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
              'bg-[#8A2BE2]/10 text-primary border border-[#8A2BE2]/20'
            }`}>
              {toast.type === 'success' && <CheckCircle size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'info' && <Sparkles size={18} />}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[13px] text-primary font-sans leading-tight">{toast.message}</span>
              <span className="font-mono-technical text-[9px] text-on-surface-variant uppercase tracking-wider mt-0.5">Order Update</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-b shadow-2xl ${
        isScrolled 
          ? scrollDirection === 'down'
            ? '-translate-y-3 bg-[#050505]/95 border-purple-500/15 shadow-black/60'
            : 'translate-y-0 bg-[#050505]/85 border-white/10 shadow-black/40' 
          : 'translate-y-0 bg-[#050505]/20 border-white/5'
      } backdrop-blur-md`}>
        <div className={`flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
            ? scrollDirection === 'down' 
              ? 'py-2 md:py-2.5' 
              : 'py-3 md:py-3.5' 
            : 'py-4 md:py-5'
        }`}>
          <div className="flex items-center gap-8">
            <button 
              onClick={handleLogoClick} 
              className={`flex items-center gap-2 font-headline-lg text-headline-lg tracking-tighter text-primary cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102 hover:text-[#8A2BE2] active:scale-98 group ${
                isScrolled && scrollDirection === 'down' ? 'scale-[0.92]' : 'scale-100'
              }`}
            >
              <span className="material-symbols-outlined text-[28px] text-[#8A2BE2] group-hover:shadow-[0_0_15px_rgba(138,43,226,0.5)] rounded-lg transition-all duration-300" data-icon="deployed_code">deployed_code</span>
              <span className="font-bold">
                TechNest<span className="text-[#8A2BE2] text-[10px] uppercase align-super ml-1 border border-[#8A2BE2]/50 px-1 rounded shadow-[0_0_8px_rgba(138,43,226,0.3)] group-hover:border-[#8A2BE2] group-hover:shadow-[0_0_12px_rgba(138,43,226,0.6)] transition-all">PRO</span>
              </span>
            </button>
            <div className="hidden md:flex gap-6">
              <button 
                onClick={() => { navigate('/'); setSelectedProductId(null); }} 
                className={`font-body-md text-body-md transition-all cursor-pointer relative ${
                  location.pathname === '/' ? 'text-primary font-semibold font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Home
                {location.pathname === '/' && (
                  <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#8A2BE2] shadow-[0_0_8px_#8A2BE2]" />
                )}
              </button>
              <button 
                onClick={() => { navigate('/shop'); setSelectedProductId(null); }} 
                className={`font-body-md text-body-md transition-all cursor-pointer relative ${
                  location.pathname === '/shop' ? 'text-primary font-semibold font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Shop
                {location.pathname === '/shop' && (
                  <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#8A2BE2] shadow-[0_0_8px_#8A2BE2]" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Global Search (Desktop - Home/Shop View Only) */}
            {(location.pathname === '/' || location.pathname === '/shop') && (
              <div className="relative">
                <div className="hidden md:flex items-center bg-surface-container-highest/30 border border-outline-variant/30 rounded-full px-4 py-2 w-64 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:w-80">
                  <Search className="text-on-surface-variant mr-2" size={15} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="bg-transparent border-none outline-none w-full font-body-md text-body-md text-primary placeholder-on-surface-variant"
                  />
                  {searchTerm && (
                    <X size={14} className="text-on-surface-variant cursor-pointer hover:text-primary" onClick={() => setSearchTerm('')} />
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {isSearchFocused && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-[#0f0f0f]/95 border border-white/10 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl p-4 z-50 space-y-4">
                    {searchTerm ? (
                      <div>
                        <h4 className="font-mono-technical text-[9px] text-[#8A2BE2] uppercase tracking-wider mb-2 font-bold">Product Suggestions</h4>
                        <div className="space-y-1">
                          {products
                            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .slice(0, 5)
                            .map(p => (
                              <button 
                                key={p.id}
                                onMouseDown={() => {
                                  setSearchTerm(p.name);
                                  setIsSearchFocused(false);
                                  navigate('/shop');
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-primary hover:bg-[#8A2BE2]/10 hover:text-[#8A2BE2] transition-all flex items-center gap-2 cursor-pointer font-medium"
                              >
                                <span className="material-symbols-outlined text-[16px]">search</span>
                                <span className="truncate">{p.name}</span>
                              </button>
                            ))
                          }
                          {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                            <p className="text-[12px] text-on-surface-variant px-3 py-2">No matching products found.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-mono-technical text-[9px] text-[#8A2BE2] uppercase tracking-wider mb-2 font-bold">Trending Searches</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Sonic Pro', 'Tracker Ring', 'K1 Pro', 'Nexus X', 'Audio'].map(term => (
                              <button 
                                key={term}
                                onMouseDown={() => {
                                  setSearchTerm(term);
                                  setIsSearchFocused(false);
                                  navigate('/shop');
                                }}
                                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10 text-on-surface-variant hover:text-primary text-[11px] font-label-caps transition-all cursor-pointer font-semibold"
                              >
                                  {term}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-mono-technical text-[9px] text-[#8A2BE2] uppercase tracking-wider mb-2 font-bold">Categories</h4>
                           <div className="grid grid-cols-2 gap-2">
                             {[
                               { name: 'Audio Gear', icon: 'headphones', color: '#8A2BE2' },
                               { name: 'Smart Wearables', icon: 'watch', color: '#d97706' },
                               { name: 'Gaming', icon: 'sports_esports', color: '#4f46e5' },
                               { name: 'Accessories', icon: 'keyboard', color: '#0ea5e9' }
                             ].map(cat => (
                               <button 
                                 key={cat.name}
                                 onMouseDown={() => {
                                   setSelectedCategory(cat.name);
                                   setIsSearchFocused(false);
                                   navigate('/shop');
                                 }}
                                 className="text-left px-3 py-2 rounded-lg text-[12px] text-on-surface-variant hover:text-primary hover:bg-[#8A2BE2]/10 transition-all flex items-center gap-2 cursor-pointer"
                               >
                                 <span className="material-symbols-outlined text-[16px]" style={{ color: cat.color }}>{cat.icon}</span>
                                 {cat.name}
                               </button>
                             ))}
                           </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={() => navigate('/wishlist')}
              className="relative text-primary hover:bg-white/5 transition-all duration-300 p-2 rounded-full active:scale-95 hidden md:block"
            >
              <span className={`material-symbols-outlined ${wishlist.length > 0 && location.pathname !== '/wishlist' ? "text-error" : ""}`} data-icon="favorite">favorite</span>
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse"></span>
              )}
            </button>
            
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="text-primary hover:bg-white/5 transition-all duration-300 p-2 rounded-full active:scale-95 relative"
            >
              <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#8A2BE2] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="relative group hidden md:block">
                <button className="text-primary hover:bg-white/5 transition-all duration-300 p-2 rounded-full active:scale-95 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]" data-icon="account_circle">account_circle</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-highest border border-outline-variant/30 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                  <div className="p-4 border-b border-outline-variant/30">
                    <p className="font-body-lg text-[14px] text-primary truncate font-semibold mb-1">{user.name}</p>
                    <p className="font-mono-technical text-[10px] text-on-surface-variant truncate">{user.email}</p>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <button onClick={() => navigate('/profile')} className="w-full text-left px-3 py-2 font-body-md text-[13px] text-on-surface-variant hover:text-primary hover:bg-white/5 rounded transition-colors flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">person</span> Profile
                    </button>
                    <button onClick={() => navigate('/orders')} className="w-full text-left px-3 py-2 font-body-md text-[13px] text-on-surface-variant hover:text-primary hover:bg-white/5 rounded transition-colors flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">inventory_2</span> My Orders
                    </button>
                    <button onClick={() => navigate('/wishlist')} className="w-full text-left px-3 py-2 font-body-md text-[13px] text-on-surface-variant hover:text-primary hover:bg-white/5 rounded transition-colors flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">favorite</span> Wishlist
                    </button>
                    <button onClick={() => navigate('/settings')} className="w-full text-left px-3 py-2 font-body-md text-[13px] text-on-surface-variant hover:text-primary hover:bg-white/5 rounded transition-colors flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                    </button>
                    {user.role === 'ADMIN' && (
                      <button onClick={() => navigate('/admin')} className="w-full text-left px-3 py-2 font-body-md text-[13px] text-[#8A2BE2] hover:bg-[#8A2BE2]/10 rounded transition-colors flex items-center gap-3 border-t border-outline-variant/30 mt-1 pt-2">
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> Admin Panel
                      </button>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 font-body-md text-[13px] text-error hover:bg-error/10 rounded transition-colors flex items-center gap-3 border-t border-outline-variant/30 mt-1 pt-2">
                      <span className="material-symbols-outlined text-[18px]">logout</span> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => navigate('/login')} 
                  className="font-body-md text-body-md text-primary hover:text-[#8A2BE2] transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')} 
                  className="px-4 py-2 bg-primary text-surface hover:bg-primary/90 font-label-caps text-[11px] uppercase tracking-wider rounded-full transition-all cursor-pointer font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-primary hover:bg-white/5 transition-all duration-300 p-2 rounded-full active:scale-95 md:hidden"
            >
              <span className="material-symbols-outlined" data-icon="menu">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 bg-[#0f0f0f]/95 border-l border-white/10 h-full shadow-2xl z-[111] flex flex-col p-6 space-y-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-headline-lg text-[18px] text-primary font-bold">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-on-surface-variant hover:text-primary p-1 bg-white/5 rounded-full cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                  className="text-left font-body-lg text-[16px] text-primary hover:text-[#8A2BE2] py-2 border-b border-white/5 cursor-pointer bg-transparent border-none"
                >
                  Home
                </button>
                <button 
                  onClick={() => { navigate('/shop'); setIsMobileMenuOpen(false); }}
                  className="text-left font-body-lg text-[16px] text-primary hover:text-[#8A2BE2] py-2 border-b border-white/5 cursor-pointer bg-transparent border-none"
                >
                  Shop
                </button>
                <button 
                  onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }}
                  className="text-left font-body-lg text-[16px] text-primary hover:text-[#8A2BE2] py-2 border-b border-white/5 flex items-center gap-2 cursor-pointer bg-transparent border-none"
                >
                  Wishlist {wishlist.length > 0 && <span className="w-2 h-2 bg-error rounded-full" />}
                </button>
              </div>

              <div className="mt-auto border-t border-white/5 pt-6 space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 flex items-center justify-center text-primary font-bold font-mono-technical uppercase flex-shrink-0">
                        {user.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-body-lg text-[14px] text-primary truncate font-semibold">{user.name}</p>
                        <p className="font-mono-technical text-[10px] text-on-surface-variant truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-2">
                      <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 text-[13px] text-on-surface-variant hover:text-primary flex items-center gap-3 cursor-pointer bg-transparent border-none">
                        <span className="material-symbols-outlined text-[18px]">person</span> Profile
                      </button>
                      <button onClick={() => { navigate('/orders'); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 text-[13px] text-on-surface-variant hover:text-primary flex items-center gap-3 cursor-pointer bg-transparent border-none">
                        <span className="material-symbols-outlined text-[18px]">inventory_2</span> My Orders
                      </button>
                      <button onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 text-[13px] text-on-surface-variant hover:text-primary flex items-center gap-3 cursor-pointer bg-transparent border-none">
                        <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                      </button>
                      {user.role === 'ADMIN' && (
                        <button onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 text-[13px] text-[#8A2BE2] flex items-center gap-3 cursor-pointer bg-transparent border-none">
                          <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> Admin Panel
                        </button>
                      )}
                      <button 
                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                        className="w-full text-left py-2 text-[13px] text-error flex items-center gap-3 border-t border-white/5 mt-2 pt-4 cursor-pointer bg-transparent border-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span> Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                      className="w-full py-3 bg-transparent border border-white/10 hover:border-[#8A2BE2]/50 text-primary font-label-caps text-[11px] uppercase tracking-widest rounded-xl transition-all cursor-pointer font-bold text-center"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                      className="w-full py-3 bg-primary text-surface font-label-caps text-[11px] uppercase tracking-widest rounded-xl transition-all cursor-pointer font-bold text-center"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE SEARCH BAR */}
      {(location.pathname === '/' || location.pathname === '/shop') && (
        <div className="md:hidden px-margin-mobile py-3 bg-surface border-b border-white/5 mt-[72px]">
          <div className="flex items-center bg-surface-container-highest/30 rounded-full px-4 py-2 border border-outline-variant/30 focus-within:border-primary/50">
            <Search className="text-on-surface-variant mr-2" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none w-full font-body-md text-body-md text-primary"
            />
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="h-[80vh] flex items-center justify-center"><Loader className="animate-spin text-primary" size={48} /></div>}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage personalRecommendations={personalRecommendations} products={products} setSelectedCategory={setSelectedCategory} setSelectedProductId={setSelectedProductId} fetchProductDetails={fetchProductDetails} navigate={navigate} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={handleAddToCart} getProductCartQty={getProductCartQty} updateCartQty={handleUpdateCartQty} recentlyViewed={recentlyViewed} onQuickView={handleQuickView} loadingProducts={loadingProducts} />} />
              <Route path="/shop" element={<Shop categories={categories} products={products} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} wishlist={wishlist} toggleWishlist={toggleWishlist} getProductCartQty={getProductCartQty} setSelectedProductId={setSelectedProductId} fetchProductDetails={fetchProductDetails} navigate={navigate} addToCart={handleAddToCart} updateCartQty={handleUpdateCartQty} onQuickView={handleQuickView} loadingProducts={loadingProducts} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<AuthPage mode="login" user={user} setUser={setUser} showToast={showToast} />} />
              <Route path="/signup" element={<AuthPage mode="register" user={user} setUser={setUser} showToast={showToast} />} />
              <Route path="/forgot-password" element={<AuthPage mode="forgot" user={user} setUser={setUser} showToast={showToast} />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage user={user} setUser={setUser} showToast={showToast} /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage user={user} showToast={showToast} perfModeEnabled={perfModeEnabled} setPerfModeEnabled={setPerfModeEnabled} /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><MyOrdersPage userOrders={userOrders} handleCancelOrder={handleCancelOrder} setIsChatOpen={setIsChatOpen} handleSendMessage={handleSendMessage} addToCart={handleAddToCart} setIsCartOpen={setIsCartOpen} showToast={showToast} navigate={navigate} /></ProtectedRoute>} />
              <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard user={user} products={products} adminOrders={adminOrders} adminUsers={adminUsers} adminTab={adminTab} setAdminTab={setAdminTab} newProduct={newProduct} setNewProduct={setNewProduct} editingProduct={editingProduct} setEditingProduct={setEditingProduct} handleCreateProduct={handleCreateProduct} handleEditProductSubmit={handleEditProductSubmit} handleDeleteProduct={handleDeleteProduct} handleUpdateOrderStatus={handleUpdateOrderStatus} showToast={showToast} navigate={navigate} api={api} /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProductDetail selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} similarProducts={similarProducts} freqBought={freqBought} addToCart={handleAddToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} getProductCartQty={getProductCartQty} updateCartQty={handleUpdateCartQty} setSelectedProductId={setSelectedProductId} fetchProductDetails={fetchProductDetails} navigate={navigate} recentlyViewed={recentlyViewed} onQuickView={handleQuickView} />} />
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage wishlist={wishlist} toggleWishlist={toggleWishlist} getProductCartQty={getProductCartQty} setSelectedProductId={setSelectedProductId} fetchProductDetails={fetchProductDetails} navigate={navigate} addToCart={handleAddToCart} updateCartQty={handleUpdateCartQty} onQuickView={handleQuickView} /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
</main>
      {/* FOOTER */}
      <footer className="bg-[#050505]/40 backdrop-blur-xl border-t border-white/10 pt-20 pb-10 px-margin-mobile md:px-margin-desktop mt-auto relative z-10">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-outline-variant/30">
          
          {/* Col 1: Brand Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={handleLogoClick}>
              <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-[#8A2BE2] transition-colors" data-icon="deployed_code">deployed_code</span>
              <span className="font-headline-lg text-headline-lg tracking-tight text-primary group-hover:text-[#8A2BE2] transition-colors hidden sm:block">
                TechNest<span className="text-[#8A2BE2] text-[12px] uppercase align-super ml-1 border border-[#8A2BE2] px-1 rounded">PRO</span>
              </span>
            </div>
            <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">
              Premium audio headsets, wearable tech, and minimalist gadgets designed to elevate your personal style.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors" title="Facebook">
                <span className="material-symbols-outlined text-[18px]" data-icon="share">share</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors" title="Twitter">
                <span className="material-symbols-outlined text-[18px]" data-icon="language">language</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors" title="Instagram">
                <span className="material-symbols-outlined text-[18px]" data-icon="photo_camera">photo_camera</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-6">
            <h4 className="font-label-caps text-[12px] uppercase tracking-widest text-primary">Sitemap</h4>
            <ul className="space-y-4 font-body-md text-[14px] text-on-surface-variant">
              <li>
                <button onClick={() => { navigate('/'); setSelectedProductId(null); }} className="hover:text-primary transition-colors cursor-pointer">Home</button>
              </li>
              <li>
                <button onClick={() => { navigate('/shop'); setSelectedProductId(null); }} className="hover:text-primary transition-colors cursor-pointer">Shop</button>
              </li>
              <li>
                <button onClick={() => { navigate('/about'); setSelectedProductId(null); }} className="hover:text-primary transition-colors cursor-pointer">About Us</button>
              </li>
              <li>
                <button onClick={() => showToast("Contact us at support@technest.com", "info")} className="hover:text-primary transition-colors cursor-pointer">Contact Support</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact details */}
          <div className="space-y-6">
            <h4 className="font-label-caps text-[12px] uppercase tracking-widest text-primary">Contact Us</h4>
            <ul className="space-y-4 font-body-md text-[14px] text-on-surface-variant">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]" data-icon="mail">mail</span>
                <a href="mailto:support@technest.com" className="hover:text-primary transition-colors">support@technest.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]" data-icon="phone_in_talk">phone_in_talk</span>
                <span>+1 800-SMART-NET</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[18px] mt-1" data-icon="location_on">location_on</span>
                <span className="leading-relaxed">Sector 7G, Core Node<br/>Cyber City, CC 95014</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="font-label-caps text-[12px] uppercase tracking-widest text-primary">Newsletter</h4>
            <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">
              Subscribe for the latest products and offers.
            </p>
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                showToast("Successfully subscribed to the newsletter!", "success"); 
                e.target.reset(); 
              }}
              className="flex items-center bg-surface border border-outline-variant/30 rounded p-2 focus-within:border-primary/50 transition-colors"
            >
              <input 
                type="email" 
                required
                placeholder="Email Address..." 
                className="bg-transparent border-none outline-none w-full text-[13px] font-body-md text-primary px-3 placeholder-on-surface-variant"
              />
              <button 
                type="submit"
                className="p-2 bg-primary hover:bg-primary/90 text-surface rounded transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]" data-icon="arrow_forward">arrow_forward</span>
              </button>
            </form>
          </div>

        </div>

        {/* Bottom footer copyright details */}
        <div className="max-w-container-max mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between font-mono-technical text-[10px] text-on-surface-variant gap-4">
          <p>© {new Date().getFullYear()} TechNest Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      <QuickViewModal 
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
        qtyInCart={quickViewProduct ? getProductCartQty(quickViewProduct.id) : 0}
        isWishlisted={quickViewProduct ? wishlist.some(item => item.id === quickViewProduct.id) : false}
        onAddToCart={addToCart}
        onUpdateCartQty={updateCartQty}
        onToggleWishlist={toggleWishlist}
        navigate={navigate}
      />
    </div>
  );
}


