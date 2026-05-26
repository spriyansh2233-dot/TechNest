import React from 'react';

// Shimmer card that resembles ProductCard structure
export function ProductCardSkeleton() {
  return (
    <div className="glass-card p-6 flex flex-col relative overflow-hidden border border-outline-variant/20 h-full animate-pulse">
      {/* Category and Wishlist shimmer */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-16 bg-white/10 rounded"></div>
        <div className="h-8 w-8 rounded-full bg-white/10"></div>
      </div>
      
      {/* Product Image shimmer */}
      <div className="flex items-center justify-center mb-6 h-48 w-full bg-white/5 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
      </div>
      
      {/* Title & Price shimmer */}
      <div className="mt-auto space-y-3">
        <div className="h-5 bg-white/10 rounded w-3/4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="h-4 bg-white/5 rounded w-1/4"></div>
        </div>
        <div className="h-10 bg-white/10 rounded-lg w-full mt-2"></div>
      </div>
    </div>
  );
}

// Grid layout matching the product catalog grids
export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Hero section shimmer loader
export function HeroSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 max-w-container-max mx-auto py-24 animate-pulse">
      <div className="flex flex-col justify-center space-y-6">
        <div className="h-8 w-32 bg-white/10 rounded-full"></div>
        <div className="h-16 w-3/4 bg-white/10 rounded"></div>
        <div className="h-24 w-5/6 bg-white/5 rounded"></div>
        <div className="flex gap-4">
          <div className="h-12 w-40 bg-white/10 rounded-xl"></div>
          <div className="h-12 w-32 bg-white/5 border border-white/10 rounded-xl"></div>
        </div>
      </div>
      <div className="h-[400px] md:h-[500px] bg-white/5 rounded-2xl flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-white/5"></div>
      </div>
    </div>
  );
}
