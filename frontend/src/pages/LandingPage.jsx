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
  const carouselRef = useRef(null);

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

  return (
    <div className="animate-fadeIn pb-24">
       {/* 1. HERO SECTION */}
       {/* Premium cinematic Hero Section */}
       <section className="relative flex items-center min-h-screen px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden mt-24">
      
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c0517]/80 via-transparent to-[#120824]/80" />
          {/* Subtle tech grid for premium branding */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] opacity-35 pointer-events-none" />
          
          {/* Purple neon glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-[#8A2BE2]/12 rounded-full blur-[130px] pointer-events-none z-0" />
          {/* Light streaks */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 left-1/4 w-48 h-96 bg-[#8A2BE2]/15 rotate-12 blur-2xl animate-pulse opacity-30" />
            <div className="absolute top-1/2 right-1/3 w-48 h-96 bg-[#4f46e5]/10 -rotate-12 blur-2xl animate-pulse opacity-30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter w-full relative z-10 items-center justify-items-center">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center relative"
            >
              {/* Radial glow directly behind the text content */}
              <div className="absolute -inset-10 bg-[#8A2BE2]/4 rounded-full blur-[70px] pointer-events-none z-0" />
              <div className="relative z-10">
                <p className="text-purple-400 mb-4 font-semibold tracking-wider text-sm uppercase">TRENDING NOW</p>

                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  The Future of <br />
                  Tech, <br />
                  <span className="text-purple-500">Delivered.</span>
                </h1>

                <p className="mt-6 text-gray-400 max-w-lg text-lg">
                  Experience next-generation industrial design and peerless
                  performance curated by TechNest.
                </p>

                <div className="flex gap-4 mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(138, 43, 226, 0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
                    onClick={handleExploreClick}
                  >
                    Explore Collection
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(138, 43, 226, 0.15)", borderColor: "#a855f7" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="px-6 py-3 border border-purple-500 rounded-xl transition-colors text-purple-400 font-semibold cursor-pointer"
                    onClick={() => setIsSpecsOpen(true)}
                  >
                    View Specs
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* RIGHT CONTENT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center justify-center relative w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] py-12 md:py-0"
            >
              {/* Cinematic Ambient Glow & Concentric Rings behind the headphone */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                {/* Outermost subtle neon ring */}
                <div className="absolute w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full border border-purple-500/10 opacity-30 animate-pulse" />
                <div className="absolute w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full border border-indigo-500/5 opacity-20" />
                
                {/* Soft atmospheric radial gradient glows */}
                <div className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#8A2BE2]/15 blur-[90px] mix-blend-screen" />
                <div className="absolute w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full bg-indigo-500/10 blur-[80px] mix-blend-screen" />
              </div>

              {/* Grounded cinematic shadow that reacts dynamically to the headphone's float height */}
              <motion.div
                animate={{
                  scaleX: [1, 0.85, 1],
                  scaleY: [1, 0.9, 1],
                  opacity: [0.65, 0.38, 0.65],
                  filter: ["blur(16px)", "blur(22px)", "blur(16px)"]
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute bottom-[8%] md:bottom-[6%] left-1/2 -translate-x-1/2 w-[55%] md:w-[60%] h-[24px] bg-black/90 rounded-[50%] pointer-events-none z-0 mix-blend-multiply"
              />
              <motion.div
                animate={{
                  scaleX: [1, 0.82, 1],
                  scaleY: [1, 0.86, 1],
                  opacity: [0.45, 0.22, 0.45],
                  filter: ["blur(10px)", "blur(15px)", "blur(10px)"]
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute bottom-[8%] md:bottom-[6%] left-1/2 -translate-x-1/2 w-[45%] md:w-[50%] h-[18px] bg-[#8A2BE2]/35 rounded-[50%] pointer-events-none z-0"
              />

              {/* Floating animation wrapper for the headphone */}
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative z-10 w-[85%] sm:w-[90%] md:w-[100%] lg:w-[110%] max-w-[620px] aspect-square flex items-center justify-center"
              >
                <img
                  src="/images/headphone.png"
                  alt="AURA Premium Headphones"
                  className="w-full h-full object-contain select-none filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-700 hover:scale-105"
                  style={{
                    filter: 'drop-shadow(0 0 35px rgba(138,43,226,0.5))',
                    mixBlendMode: 'normal'
                  }}
                />
              </motion.div>
            </motion.div>

         </div>

        </section>

        {/* Glow separator divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#8A2BE2]/25 to-transparent relative z-10" />

      {/* STITCH ECOSYSTEM CATEGORIES */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-24 relative">
        <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-[#8A2BE2]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-[#4f46e5]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 relative z-10">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-2">Explore by Category</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Discover premium tech curated for modern lifestyles.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            { name: 'Audio Gear', key: 'audio', desc: 'High-fidelity acoustic gear', icon: 'headphones', color: '#8A2BE2' },
            { name: 'Smart Wearables', key: 'wearables', desc: 'Precision health tracking', icon: 'watch', color: '#d97706' },
            { name: 'Gaming', key: 'gaming', desc: 'Tournament-grade control', icon: 'sports_esports', color: '#4f46e5' },
            { name: 'Smart Devices', key: 'smartdevices', desc: 'Connected living essentials', icon: 'devices', color: '#0ea5e9' }
          ].map((cat) => (
            <div 
              key={cat.name}
              onClick={() => handleCategoryClick(cat.key)}
              className="glass-card relative overflow-hidden h-[250px] cursor-pointer group rounded-2xl border border-white/10 transition-all duration-500 flex flex-col justify-between p-7 shadow-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl"
            >
              {/* Colored border overlay on hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-2 transition-all duration-300 z-20 rounded-2xl pointer-events-none" style={{ borderColor: cat.color + '60' }} />

              {/* Card ambient blur orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ backgroundColor: cat.color + '15' }} />

              {/* Top-Left Category Badge */}
              <div className="w-10 h-10 rounded-full bg-[#141414]/80 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-300 z-20">
                <span className="material-symbols-outlined text-[18px]" style={{ color: cat.color }} data-icon={cat.icon}>{cat.icon}</span>
              </div>

              {/* Bottom Content Overlay */}
              <div className="relative z-10 flex items-end justify-between w-full gap-4 mt-auto">
                <div className="text-left">
                  <h3 className="font-headline-lg text-[20px] text-primary mb-1 font-bold group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-body-md text-[13px] text-on-surface-variant group-hover:text-primary/90 transition-colors leading-snug">
                    {cat.desc}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-primary bg-[#141414]/40 backdrop-blur-sm group-hover:bg-primary group-hover:text-surface group-hover:border-primary transition-all duration-300 transform group-hover:scale-105 flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-0.5">arrow_forward</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Glow separator divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#8A2BE2]/25 to-transparent relative z-10" />

      {/* STITCH BENTO GRID (RECOMMENDATIONS / TRENDING) */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-24 pt-24">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8A2BE2]/30 bg-[#8A2BE2]/5 mb-4">
            <span className="material-symbols-outlined text-[#8A2BE2] text-[14px]" data-icon="auto_awesome">auto_awesome</span>
            <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest">
              {personalRecommendations && personalRecommendations.length > 0 ? "Personalized" : "Trending Now"}
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Recommended for You</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {personalRecommendations && personalRecommendations.length > 0 
              ? "Products inspired by your shopping trends." 
              : "Explore our hand-picked selection of premium hardware."}
          </p>
        </div>
        
        {loadingProducts ? (
          <ProductGridSkeleton count={4} />
        ) : displayProds.length === 0 ? (
          <div className="glass-card p-16 text-center flex flex-col items-center max-w-xl mx-auto border border-white/5">
            <span className="material-symbols-outlined text-[#8A2BE2] text-[48px] mb-4 animate-pulse" data-icon="explore">explore</span>
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
      </section>

      {/* Glow separator divider */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#8A2BE2]/25 to-transparent relative z-10" />
      )}

      {/* RECENTLY VIEWED SECTION */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-24 pt-24">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8A2BE2]/30 bg-[#8A2BE2]/5 mb-4">
                <span className="material-symbols-outlined text-[#8A2BE2] text-[14px]" data-icon="history">history</span>
                <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest">History</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Recently Viewed</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Pick up where you left off.</p>
            </div>
            
            {recentlyViewed.length > 1 && (
              <div className="flex gap-2">
                <button 
                  onClick={() => scrollCarousel('left')}
                  className="w-10 h-10 rounded-full border border-outline-variant/30 bg-surface text-on-surface-variant hover:text-primary hover:border-[#8A2BE2]/50 hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button 
                  onClick={() => scrollCarousel('right')}
                  className="w-10 h-10 rounded-full border border-outline-variant/30 bg-surface text-on-surface-variant hover:text-primary hover:border-[#8A2BE2]/50 hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>
          
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-none scroll-smooth gap-6 pb-4"
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
        </section>
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
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative glass-card border border-white/20 p-8 max-w-lg w-full z-10 shadow-[0_0_50px_rgba(138,43,226,0.3)] bg-[#0f0f0f]/90 backdrop-blur-2xl text-left"
            >
              {/* Close button */}
              <button 
                onClick={() => setIsSpecsOpen(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#8A2BE2] text-[28px] animate-pulse">headphones</span>
                <div>
                  <h3 className="font-headline-lg text-[22px] text-primary font-bold">Sonic Pro ANC</h3>
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
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/5 px-2 rounded transition-colors group">
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
                  className="px-5 py-2.5 bg-primary text-surface hover:bg-primary/95 text-[12px] font-label-caps tracking-widest uppercase rounded-lg shadow-[0_0_15px_rgba(138,43,226,0.4)] transition-all font-semibold cursor-pointer"
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
