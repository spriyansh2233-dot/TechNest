import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';

export default function LandingPage({ 
  personalRecommendations, 
  products, 
  setSelectedCategory, 
  setSelectedProductId, 
  fetchProductDetails,
  wishlist,
  toggleWishlist,
  addToCart,
  getProductCartQty,
  updateCartQty,
  recentlyViewed,
  onQuickView,
  loadingProducts
}) {
  const navigate = useNavigate();
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const carouselRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleExploreClick = () => {
    navigate('/shop');
  };

  const handleCategoryClick = (catKey) => {
    navigate(`/shop?category=${catKey}`);
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Filter or select the products to show in Recommendations
  let displayProds = [];
  if (personalRecommendations && personalRecommendations.length > 0) {
    displayProds = personalRecommendations;
  }
  
  // If we have fewer than 4 products, fill in with general products as fallback
  if (displayProds.length < 4 && products && products.length > 0) {
    const existingIds = new Set(displayProds.map(p => p.id));
    for (const prod of products) {
      if (!existingIds.has(prod.id)) {
        displayProds.push(prod);
        existingIds.add(prod.id);
      }
      if (displayProds.length >= 4) break;
    }
  }

  // Derive Deals
  const dealsProds = products ? products.filter(p => p.discount > 0).sort((a,b) => b.discount - a.discount).slice(0, 4) : [];
  
  // Derive Top Rated / Trending
  const trendingProds = products ? [...products].sort((a,b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 8) : [];
  
  // Derive New Arrivals (just reverse order for demo)
  const newArrivalsProds = products ? [...products].reverse().slice(0, 4) : [];

  return (
    <div className="animate-fadeIn pb-16 bg-transparent pt-[80px] md:pt-[90px]">
        {/* 1. HERO SECTION */}
        {/* Premium cinematic Hero Section */}
        <div className="w-full bg-[#F8F9FC] pb-10">
          <motion.section 
            whileHover={{ 
              y: -4,
              scale: 1.01,
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)"
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative flex items-center h-[560px] px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden mt-4 md:mt-6 rounded-3xl shadow-2xl group cursor-pointer"
            style={{ 
              backgroundImage: 'url(/images/ecosystem.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#0A0E1A'
            }}
          >
            {/* Subtle tech grid for premium branding */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none z-0" />
            
            {/* Subtle dark gradient overlay from left to guarantee readability on top of dark blue background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-blue-950/10 to-transparent pointer-events-none z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter w-full relative z-10 items-center justify-items-center h-full py-12 md:py-0">
              {/* LEFT CONTENT */}
              <motion.div
                 initial={{ opacity: 0, x: -40 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8 }}
                 className="flex flex-col justify-center relative w-full pl-4 md:pl-12"
              >
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-4">
                     <span className="text-[#8B7CFF] text-[13px] font-bold tracking-widest uppercase font-mono-technical">
                       Summer Tech Sale
                     </span>
                   </div>

                  <h1 className="text-[40px] md:text-[52px] font-extrabold leading-[1.1] text-white tracking-tight mb-4">
                    Premium Tech. <br />
                    Elevated Everyday.
                  </h1>

                  <p className="mb-8 text-white/80 max-w-lg text-[16px] md:text-[17px] font-medium leading-relaxed">
                    Unmatched performance. Premium design. <br />
                    Up to 50% off across audio, wearables & more.
                  </p>

                  <div className="flex flex-wrap gap-5 items-center">
                    <motion.button 
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(109, 93, 252, 0.45)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#6D5DFC] to-[#8B7CFF] text-white font-bold rounded-xl transition-all shadow-lg cursor-pointer flex items-center gap-2"
                      onClick={handleExploreClick}
                    >
                      Shop Now
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="px-6 py-3 border border-white/30 bg-transparent text-white rounded-xl transition-colors font-semibold cursor-pointer shadow-sm"
                      onClick={() => {
                        const el = document.getElementById('categories-section');
                        if (el) {
                          const yOffset = -80;
                          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                    >
                      Explore Collection
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT CONTENT - EMPTY TO SHOW BACKGROUND */}
              <div className="hidden md:block w-full h-full pointer-events-none"></div>
           </div>
          </motion.section>
        </div>

      {/* STITCH ECOSYSTEM CATEGORIES */}
      <div className="w-full bg-gradient-to-b from-[#FFFFFF] to-[#F5F3FF] py-14 border-b border-outline/50">
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="categories-section" 
          className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative"
        >
          <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-primary/3 rounded-full blur-[100px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-secondary/3 rounded-full blur-[120px] pointer-events-none z-0"></div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-8 relative z-10">
          <div>
            <h2 className="font-headline-xl text-[32px] text-on-surface mb-3 font-bold tracking-tight">Shop by Category</h2>
            <p className="font-body-md text-[16px] text-on-surface-variant">Discover premium tech products curated for modern lifestyles.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
          {[
            { name: 'Audio Gear', key: 'Audio', icon: 'headphones', color: '#6D5DFC' },
            { name: 'Wearables', key: 'Wearables', icon: 'watch', color: '#8B7CFF' },
            { name: 'Gaming Accessories', key: 'Electronics', icon: 'sports_esports', color: '#5B4AE4' },
            { name: 'Smart Devices', key: 'Smart Home', icon: 'devices', color: '#805AD5' },
            { name: 'Accessories', key: 'Accessories', icon: 'cable', color: '#B3B3B3' }
          ].map((cat) => {
            const count = products ? products.filter(p => p.category === cat.key).length : 0;
            return (
              <motion.div 
                key={cat.name}
                onClick={() => handleCategoryClick(cat.key)}
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                className="premium-category-card rounded-2xl p-6 cursor-pointer group relative overflow-hidden flex flex-col justify-between h-[150px]"
              >
                {/* Border glow on hover */}
                <div className="absolute inset-0 border border-transparent group-hover:border-primary/20 transition-all duration-300 rounded-2xl pointer-events-none" />
                
                {/* Top half: Icon & Product Count */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-[24px] group-hover:rotate-[12deg] group-hover:scale-110 transition-all duration-300" style={{ color: cat.color }}>{cat.icon}</span>
                  </div>
                  <span className="bg-primary/10 border border-primary/20 text-primary font-mono-technical text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {count} items
                  </span>
                </div>

                {/* Bottom half: Title */}
                <div className="mt-4 relative z-10">
                  <h3 className="font-bold text-[15px] text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {cat.name}
                    <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">arrow_forward</span>
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
      </div>

      {/* STITCH BENTO GRID (RECOMMENDATIONS / TRENDING) */}
      <div className="w-full bg-[#FFFFFF] py-14">
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
        >
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-3">
              <span className="material-symbols-outlined text-primary text-[14px]" data-icon="auto_awesome">auto_awesome</span>
              <span className="font-label-caps text-[10px] text-primary font-semibold uppercase tracking-widest">
                {personalRecommendations && personalRecommendations.length > 0 ? "Personalized" : "Featured"}
              </span>
            </div>
            <h2 className="font-headline-lg text-[28px] text-on-surface mb-1 font-bold">Recommended for You</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
            {personalRecommendations && personalRecommendations.length > 0 
              ? "Products inspired by your shopping trends." 
              : "Explore our hand-picked selection of premium hardware."}
          </p>
        </div>
        
        {loadingProducts ? (
          <ProductGridSkeleton count={4} />
        ) : displayProds.length === 0 ? (
          <div className="glass-card p-16 text-center flex flex-col items-center max-w-xl mx-auto border border-outline bg-surface">
            <span className="material-symbols-outlined text-primary text-[48px] mb-4 animate-pulse" data-icon="explore">explore</span>
            <h3 className="font-headline-lg text-[22px] text-primary mb-2">Explore the Ecosystem</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Our recommendation neural network needs data. Discover trending products to get started.</p>
            <button 
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-primary text-surface font-label-caps text-label-caps uppercase rounded-lg hover:bg-primary/80 transition-colors cursor-pointer"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProds.slice(0, 4).map((prod) => {
              const qtyInCart = getProductCartQty ? getProductCartQty(prod.id) : 0;
              const isWishlisted = wishlist ? wishlist.some(item => item.id === prod.id) : false;
              return (
                <ProductCard 
                  key={`recommendation-${prod.id}`}
                  prod={prod}
                  qtyInCart={qtyInCart}
                  isWishlisted={isWishlisted}
                  onCardClick={() => { setSelectedProductId(prod.id); fetchProductDetails(prod.id); navigate('/product/' + prod.id); }}
                  onAddToCart={addToCart}
                  onUpdateCartQty={updateCartQty}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={onQuickView}
                />
              );
            })}
          </div>
        )}
      </motion.section>
      </div>

      {/* DEALS OF THE DAY SECTION */}
      {dealsProds.length > 0 && (
        <div className="w-full bg-gradient-to-b from-[#FFFFFF] via-[#F4F6FC] to-[#FFFFFF] py-14 border-t border-b border-outline/50">
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            id="flash-deals" 
            className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto p-8 md:p-12 relative overflow-hidden rounded-[40px] border border-outline/50 shadow-xl bg-gradient-to-br from-[#FFFFFF] via-[#F3F4F6] to-[#FFFFFF]"
          >
            {/* Subtle tech grid for premium branding */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#6D5DFC_1px,_transparent_1px)] [background-size:24px_24px]"></div>
            
            {/* Outer glow ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-[40px] border border-outline/30 pointer-events-none z-0" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#6D5DFC]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B7CFF]/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Floating premium particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/15 blur-[1px]"
                style={{
                  width: Math.random() * 16 + 8,
                  height: Math.random() * 16 + 8,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: Math.random() * 6 + 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="mb-8 relative z-10 px-4 md:px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
              <span className="material-symbols-outlined text-primary text-[14px]" data-icon="local_fire_department">local_fire_department</span>
              <span className="font-label-caps text-[10px] text-primary font-bold uppercase tracking-widest">
                Limited Time Offers
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-lg text-[32px] text-on-surface mb-1 font-bold tracking-tight">Flash Deals</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Don't miss out on these exclusive discounts.</p>
              </div>
              
              {/* Premium Countdown Clock */}
              <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-xl border border-primary/15 shadow-sm">
                <span className="text-[11px] font-bold text-primary/80 uppercase tracking-widest">Ends In</span>
                <div className="flex gap-2">
                  <div className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-mono-technical font-bold text-[14px] shadow-sm">04</div>
                  <span className="text-primary font-bold self-center">:</span>
                  <div className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-mono-technical font-bold text-[14px] shadow-sm">12</div>
                  <span className="text-primary font-bold self-center">:</span>
                  <div className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-mono-technical font-bold text-[14px] shadow-sm">36</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {dealsProds.map((prod) => {
              const qtyInCart = getProductCartQty ? getProductCartQty(prod.id) : 0;
              const isWishlisted = wishlist ? wishlist.some(item => item.id === prod.id) : false;
              return (
                <ProductCard 
                  key={`deal-${prod.id}`}
                  prod={prod}
                  qtyInCart={qtyInCart}
                  isWishlisted={isWishlisted}
                  onCardClick={() => { setSelectedProductId(prod.id); fetchProductDetails(prod.id); navigate('/product/' + prod.id); }}
                  onAddToCart={addToCart}
                  onUpdateCartQty={updateCartQty}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={onQuickView}
                />
              );
            })}
          </div>
        </motion.section>
      </div>
      )}

      {/* TRENDING NOW SECTION */}
      {trendingProds.length > 0 && (
        <div className="w-full bg-[#FFFFFF] py-14">
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-3">
                <span className="material-symbols-outlined text-primary text-[14px]" data-icon="trending_up">trending_up</span>
                <span className="font-label-caps text-[10px] text-primary font-bold uppercase tracking-widest">
                  Top Rated
                </span>
              </div>
              <h2 className="font-headline-lg text-[28px] text-on-surface mb-1 font-bold">Best Sellers</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Our most popular products, loved by the community.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingProds.slice(0, 4).map((prod) => {
                const qtyInCart = getProductCartQty ? getProductCartQty(prod.id) : 0;
                const isWishlisted = wishlist ? wishlist.some(item => item.id === prod.id) : false;
                return (
                  <ProductCard 
                    key={`trending-${prod.id}`}
                    prod={prod}
                    qtyInCart={qtyInCart}
                    isWishlisted={isWishlisted}
                    onCardClick={() => { setSelectedProductId(prod.id); fetchProductDetails(prod.id); navigate('/product/' + prod.id); }}
                    onAddToCart={addToCart}
                    onUpdateCartQty={updateCartQty}
                    onToggleWishlist={toggleWishlist}
                    onQuickView={onQuickView}
                  />
                );
              })}
            </div>
          </motion.section>
        </div>
      )}

      {/* PROMOTIONAL BANNER */}
      <div className="w-full bg-gradient-to-b from-[#FFFFFF] via-[#F3F4FE] to-[#FFFFFF] py-14">
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
        >
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-[360px] md:h-[400px] rounded-[32px] overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#F3F4FF] to-[#EBF0FF] border border-primary/10 shadow-xl hover:shadow-[0_25px_60px_rgba(109,93,252,0.08)] flex items-center group transition-all duration-500 ease-out hover:border-primary/35"
        >
          {/* Cyberpunk grid background of the gaming zone */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(109,93,252,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(109,93,252,0.15)_1px,transparent_1px)] [background-size:24px_24px] z-0" />
          
          {/* Large Neon Radial Glow Behind Controller */}
          <div className="absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6D5DFC]/10 rounded-full blur-[110px] pointer-events-none z-0 transition-all duration-700 group-hover:bg-[#6D5DFC]/15 group-hover:scale-110" />
          <div className="absolute right-[8%] md:right-[15%] top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#8B7CFF]/8 rounded-full blur-[70px] pointer-events-none z-0 transition-all duration-700 group-hover:bg-[#8B7CFF]/12 group-hover:scale-110" />

          {/* Left Side Cyan Ambient Gaming Light */}
          <div className="absolute -top-[30%] -left-[10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />

          {/* Large Controller image set as a true background layer with premium hover interactions */}
          <motion.img 
            src="/images/products/gaming/gaming-controller-removebg-preview.png"
            alt="Gaming zone controller background"
            style={{ 
              transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0) rotate(${mousePos.x * 4}deg)`,
              right: '8%',
              top: '50%',
              y: '-50%'
            }}
            transition={{ type: "spring", stiffness: 85, damping: 26 }}
            className="absolute w-[52%] md:w-[48%] max-w-[500px] object-contain opacity-[0.65] group-hover:opacity-[0.88] group-hover:scale-[1.04] transition-all duration-500 pointer-events-none z-0 filter drop-shadow-[0_15px_45px_rgba(109,93,252,0.15)] drop-shadow-[0_0_20px_rgba(109,93,252,0.1)]"
          />

          {/* Floating Gamepad Outline Icons for parallax depth */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Top Center Gamepad Icon */}
            <motion.div 
              style={{ transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -10}px, 0)` }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              className="absolute left-[48%] top-[18%] opacity-[0.08] text-primary select-none"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <path d="M6 12h4m-2-2v4M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h1a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" />
                <circle cx="15.5" cy="10.5" r="0.75" fill="currentColor" />
                <circle cx="17.5" cy="12.5" r="0.75" fill="currentColor" />
              </svg>
            </motion.div>

            {/* Bottom Center-Left Gamepad Icon */}
            <motion.div 
              style={{ transform: `translate3d(${mousePos.x * -14}px, ${mousePos.y * -14}px, 0)` }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              className="absolute left-[37%] bottom-[18%] opacity-[0.08] text-primary select-none"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                <path d="M6 12h4m-2-2v4M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h1a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" />
                <circle cx="15.5" cy="10.5" r="0.75" fill="currentColor" />
                <circle cx="17.5" cy="12.5" r="0.75" fill="currentColor" />
              </svg>
            </motion.div>

            {/* Middle-Right Gamepad Icon (left of controller, glowing purple) */}
            <motion.div 
              style={{ transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 0)` }}
              transition={{ type: "spring", stiffness: 80, damping: 25 }}
              className="absolute left-[54%] bottom-[38%] opacity-[0.25] text-primary select-none filter drop-shadow-[0_0_10px_rgba(109,93,252,0.3)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                <path d="M6 12h4m-2-2v4M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h1a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" />
                <circle cx="15.5" cy="10.5" r="0.75" fill="currentColor" />
                <circle cx="17.5" cy="12.5" r="0.75" fill="currentColor" />
              </svg>
            </motion.div>

            {/* Top Right Gamepad Icon (above controller's right grip, glowing purple) */}
            <motion.div 
              style={{ transform: `translate3d(${mousePos.x * -24}px, ${mousePos.y * -24}px, 0)` }}
              transition={{ type: "spring", stiffness: 85, damping: 26 }}
              className="absolute right-[6%] top-[20%] opacity-[0.35] text-primary select-none filter drop-shadow-[0_0_12px_rgba(109,93,252,0.4)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px]">
                <path d="M6 12h4m-2-2v4M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h1a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" />
                <circle cx="15.5" cy="10.5" r="0.75" fill="currentColor" />
                <circle cx="17.5" cy="12.5" r="0.75" fill="currentColor" />
              </svg>
            </motion.div>
          </div>

          {/* Glowing purple dust particles drifting */}
          <div className="absolute inset-y-0 right-0 left-1/3 overflow-hidden pointer-events-none z-0">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#8B7CFF]/30 blur-[0.7px]"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  left: `${Math.random() * 80 + 20}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -35, 0],
                  opacity: [0.15, 0.75, 0.15],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Foreground Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter w-full h-full relative z-10 px-8 md:px-16 items-center">
            {/* Left Column Content - takes up 3/5 width for readability on top of grid */}
            <div className="md:col-span-7 max-w-lg text-left flex flex-col justify-center h-full pt-4 md:pt-0">
              <span className="bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 inline-block border border-primary/20 w-fit backdrop-blur-md">
                Gaming Zone
              </span>
              <h2 className="text-[38px] md:text-[52px] font-extrabold text-on-surface mb-4 leading-[1.12] tracking-tight">
                Elevate Your<br/>
                <span className="bg-gradient-to-r from-primary via-[#8B7CFF] to-[#5B4AE4] bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(109,93,252,0.2)]">Play.</span>
              </h2>
              <p className="text-on-surface-variant mb-8 text-[14px] leading-relaxed max-w-md font-medium">
                Up to 45% off premium gaming accessories. Equip yourself with the absolute best mechanical peripherals, high-precision mice, and elite gear.
              </p>
              
              <motion.button 
                onClick={() => navigate('/shop?category=gaming')} 
                whileHover={{ scale: 1.03, boxShadow: "0 12px 30px rgba(109, 93, 252, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                style={{ transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0)` }}
                className="group px-7 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-[14px] rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2.5 shadow-[0_8px_24px_rgba(109,93,252,0.2)] border border-primary/30 w-fit"
              >
                Explore Gaming Zone
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform duration-300">
                  <path d="M6 12h4m-2-2v4M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h1a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" />
                  <circle cx="15.5" cy="10.5" r="0.75" fill="currentColor" />
                  <circle cx="17.5" cy="12.5" r="0.75" fill="currentColor" />
                </svg>
              </motion.button>
            </div>

            {/* Right Column - left empty on grid to fully showcase the premium controller background */}
            <div className="hidden md:block md:col-span-5 h-full pointer-events-none"></div>
          </div>
        </div>
      </motion.section>
      </div>

      {/* NEW ARRIVALS SECTION */}
      {newArrivalsProds.length > 0 && (
        <div className="w-full bg-[#FFFFFF] py-14">
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            id="new-arrivals" 
            className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-3">
                <span className="material-symbols-outlined text-secondary text-[14px]" data-icon="new_releases">new_releases</span>
                <span className="font-label-caps text-[10px] text-secondary font-bold uppercase tracking-widest">
                  Just Landed
                </span>
              </div>
              <h2 className="font-headline-lg text-[28px] text-on-surface mb-1 font-bold">New Arrivals</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Be the first to experience our latest cutting-edge technology.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newArrivalsProds.map((prod) => {
              const qtyInCart = getProductCartQty ? getProductCartQty(prod.id) : 0;
              const isWishlisted = wishlist ? wishlist.some(item => item.id === prod.id) : false;
              return (
                <ProductCard 
                  key={`new-${prod.id}`}
                  prod={prod}
                  qtyInCart={qtyInCart}
                  isWishlisted={isWishlisted}
                  onCardClick={() => { setSelectedProductId(prod.id); fetchProductDetails(prod.id); navigate('/product/' + prod.id); }}
                  onAddToCart={addToCart}
                  onUpdateCartQty={updateCartQty}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={onQuickView}
                />
              );
            })}
          </div>
        </motion.section>
      </div>
      )}

      {/* CUSTOMER REVIEWS SECTION */}
      <div className="w-full bg-[#FFFFFF] py-14">
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
        >
          <div className="rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-xl border border-primary/10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(245, 246, 250, 0.9)), url(/images/ecosystem.png)' }}>
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#6D5DFC_1px,_transparent_1px)] [background-size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="text-center mb-10 relative z-10">
              <h2 className="font-headline-lg text-[32px] text-on-surface mb-2 font-bold">What Our Customers Say</h2>
              <p className="font-body-md text-[16px] text-on-surface-variant">Trusted by tech enthusiasts worldwide.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                { name: "Alex Mercer", role: "Software Engineer", review: "The build quality of the products is absolutely phenomenal. Shipping was incredibly fast, and customer service was top tier.", rating: 5, avatar: "AM" },
                { name: "Sarah Jenkins", role: "Digital Artist", review: "I've been looking for gear that matches my aesthetic and this site delivered. Everything looks stunning and works perfectly.", rating: 5, avatar: "SJ" },
                { name: "David Chen", role: "Content Creator", review: "Absolutely love the minimalist design language. The audio equipment I bought here completely elevated my studio setup.", rating: 5, avatar: "DC" }
              ].map((review, idx) => (
                <div key={idx} className="bg-white/70 border border-primary/5 p-8 rounded-[24px] relative hover:bg-white/90 hover:border-primary/20 hover:shadow-xl transition-all duration-300 shadow-md backdrop-blur-md">
                  <span className="material-symbols-outlined text-[48px] text-primary/5 absolute top-4 right-4">format_quote</span>
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-warning text-[18px]" data-icon="star">star</span>
                    ))}
                  </div>
                  <p className="font-body-md text-on-surface-variant mb-8 relative z-10 leading-relaxed font-medium">"{review.review}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-label-caps text-[14px] shadow-inner">{review.avatar}</div>
                    <div>
                      <h4 className="font-bold text-[15px] text-on-surface">{review.name}</h4>
                      <p className="text-[13px] text-on-surface-variant">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* RECENTLY VIEWED SECTION */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <div className="w-full bg-[#FFFFFF] py-14">
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
          >
            <div className="mb-8 flex justify-between items-end">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-3">
                  <span className="material-symbols-outlined text-primary text-[14px]" data-icon="history">history</span>
                  <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest">History</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Recently Viewed</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Pick up where you left off.</p>
              </div>
              
              {recentlyViewed.length > 1 && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => scrollCarousel('left')}
                    className="w-10 h-10 rounded-full border border-outline bg-surface text-on-surface-variant hover:text-primary hover:border-primary/50 hover:shadow-sm transition-all flex items-center justify-center cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button 
                    onClick={() => scrollCarousel('right')}
                    className="w-10 h-10 rounded-full border border-outline bg-surface text-on-surface-variant hover:text-primary hover:border-primary/50 hover:shadow-sm transition-all flex items-center justify-center cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
            
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto scrollbar-none scroll-smooth gap-5 pb-4"
            >
              {recentlyViewed.map((prod) => {
                const qtyInCart = getProductCartQty ? getProductCartQty(prod.id) : 0;
                const isWishlisted = wishlist ? wishlist.some(item => item.id === prod.id) : false;
                return (
                  <div key={`recent-landing-${prod.id}`} className="min-w-[280px] sm:min-w-[320px] max-w-[320px] flex-shrink-0">
                    <ProductCard 
                      prod={prod}
                      qtyInCart={qtyInCart}
                      isWishlisted={isWishlisted}
                      onCardClick={() => { setSelectedProductId(prod.id); fetchProductDetails(prod.id); navigate('/product/' + prod.id); }}
                      onAddToCart={addToCart}
                      onUpdateCartQty={updateCartQty}
                      onToggleWishlist={toggleWishlist}
                      onQuickView={onQuickView}
                    />
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>
      )}

      {/* Specs Modal */}
      <AnimatePresence>
        {isSpecsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSpecsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            
            {/* Modal content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative glass-card border border-outline p-8 max-w-lg w-full z-10 shadow-2xl bg-surface/95 backdrop-blur-2xl text-left"
            >
              {/* Close button */}
              <button 
                onClick={() => setIsSpecsOpen(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-[28px] animate-pulse">headphones</span>
                <div>
                  <h3 className="font-headline-lg text-[22px] text-primary font-bold">Nova Sonic ANC</h3>
                  <p className="font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-wider">Acoustic Engineering Specs</p>
                </div>
              </div>

              <div className="space-y-4 font-body-md text-on-surface-variant">
                {[
                  { label: 'Noise Cancellation', value: 'Active ANC (Hybrid 4-mic)' },
                  { label: 'Battery Life', value: '40 Hours (ANC On) / 60 Hours (ANC Off)' },
                  { label: 'Bluetooth Version', value: '5.3 (LE Audio Ready)' },
                  { label: 'Weight', value: '240g' },
                  { label: 'Charging', value: 'USB-C Fast Charge (10 min = 5 hours)' },
                  { label: 'Audio Drivers', value: '40mm Custom Dynamic Drivers' },
                  { label: 'Compatibility', value: 'iOS / Android / Windows / macOS' },
                  { label: 'Latency', value: 'Ultra-low 45ms Gaming Mode' }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-outline hover:bg-surface-container px-2 rounded transition-colors group">
                    <span className="text-[13px] text-on-surface-variant/80 group-hover:text-primary transition-colors font-medium">{spec.label}</span>
                    <span className="text-[13px] text-primary font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button 
                  onClick={() => setIsSpecsOpen(false)}
                  className="px-5 py-2.5 bg-transparent border border-outline-variant hover:border-primary/50 text-primary text-[12px] font-label-caps tracking-widest uppercase rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setIsSpecsOpen(false);
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 bg-primary text-white hover:bg-secondary text-[12px] font-label-caps tracking-widest uppercase rounded-lg shadow-[0_4px_15px_rgba(109,93,252,0.25)] hover:shadow-[0_6px_20px_rgba(109,93,252,0.35)] transition-all font-semibold cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
