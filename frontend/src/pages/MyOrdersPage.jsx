import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyOrdersPage({ 
  userOrders, 
  handleCancelOrder, 
  setIsChatOpen, 
  handleSendMessage, 
  addToCart, 
  setIsCartOpen, 
  showToast,
  navigate 
}) {
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);

  const getStepStatus = (status, step) => {
    // Steps: 1: Placed, 2: Paid, 3: Shipped, 4: Delivered
    if (status === 'CANCELLED') return 'cancelled';
    
    const statusMap = {
      'PENDING': 1,
      'PAID': 2,
      'SHIPPED': 3,
      'DELIVERED': 4
    };
    
    const currentStep = statusMap[status] || 1;
    if (currentStep >= step) return 'completed';
    if (currentStep + 1 === step) return 'active';
    return 'pending';
  };

  const handleReorder = async (e, items) => {
    e.stopPropagation();
    try {
      for (const item of items) {
        await addToCart(item.product, item.quantity);
      }
      if (showToast) showToast('All items added back to your cart!', 'success');
      if (setIsCartOpen) setIsCartOpen(true);
    } catch (err) {
      if (showToast) showToast('Failed to add items to cart.', 'error');
    }
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-24 min-h-[80vh] mt-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary mb-2">My Orders</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Track shipments, cancel orders, or purchase items again.</p>
        </div>
        <span className="font-mono-technical text-[11px] uppercase tracking-widest text-[#8A2BE2] bg-[#8A2BE2]/5 border border-[#8A2BE2]/20 px-3 py-1.5 rounded-lg font-bold">
          Total Orders: {userOrders.length}
        </span>
      </div>

      {userOrders.length === 0 ? (
        <div className="glass-card p-16 text-center flex flex-col items-center border border-white/10">
          <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant/40 mb-6">
            <span className="material-symbols-outlined text-[36px]">receipt_long</span>
          </div>
          <h3 className="font-headline-lg text-[20px] text-primary mb-2">No orders placed yet</h3>
          <p className="font-body-md text-[14px] text-on-surface-variant mb-8 max-w-[280px]">When you purchase products, your order history will appear here.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-primary text-surface font-label-caps text-[11px] uppercase tracking-widest rounded-lg hover:bg-primary/95 shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all cursor-pointer font-bold"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {userOrders.map((order) => (
            <div 
              key={order.id} 
              className="glass-card border border-white/10 p-6 md:p-8 space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#8A2BE2]/40 to-transparent"></div>

              {/* Order Metadata Header */}
              <div className="flex flex-wrap gap-6 justify-between items-start border-b border-white/5 pb-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest block mb-1 font-semibold">Order Placed</span>
                    <span className="font-body-lg text-[13px] text-primary font-medium">May 26, 2026</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest block mb-1 font-semibold">Order ID</span>
                    <span className="font-mono-technical text-[13px] text-primary font-semibold">#SC-{order.id}</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest block mb-1 font-semibold">Total Cost</span>
                    <span className="font-mono-technical text-[13px] text-primary font-bold">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest block mb-1 font-semibold">Payment Status</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono-technical uppercase tracking-wider font-semibold border ${
                      order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : order.status === 'CANCELLED' 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'Paid' : order.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleReorder(e, order.items)}
                    className="px-4 py-2 border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary hover:text-surface text-primary rounded-lg font-label-caps text-[10px] uppercase tracking-wider transition-all cursor-pointer font-semibold"
                  >
                    Buy It Again
                  </button>
                </div>
              </div>

              {/* Items Summary list */}
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={`orderItem-${item.id}`} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg p-1.5 flex items-center justify-center mix-blend-screen flex-shrink-0">
                      <img src={item.product.imageUrl} alt="" className="max-h-full object-contain filter drop-shadow-md" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-body-lg text-[13px] text-primary font-medium truncate">{item.product.name}</h4>
                      <p className="font-body-md text-[11px] text-on-surface-variant mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-mono-technical text-[13px] text-primary font-semibold flex-shrink-0">
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Status Stepper */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest block font-semibold">Delivery Progress</span>
                
                {order.status === 'CANCELLED' ? (
                  <div className="flex items-center gap-2 text-rose-400 text-[12px] font-semibold bg-rose-500/5 border border-rose-500/15 rounded-xl p-3 w-fit">
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    <span>This order has been cancelled and refunded.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 relative pt-2">
                    {/* Stepper progress bar line */}
                    <div className="absolute top-[21px] left-[12.5%] right-[12.5%] h-0.5 bg-white/10 z-0">
                      <div 
                        className="h-full bg-[#8A2BE2] transition-all duration-500" 
                        style={{ 
                          width: order.status === 'PENDING' ? '0%' : 
                                 order.status === 'PAID' ? '33.33%' : 
                                 order.status === 'SHIPPED' ? '66.66%' : '100%' 
                        }}
                      />
                    </div>

                    {[
                      { label: 'Confirmed', icon: 'check_circle' },
                      { label: 'Processing', icon: 'inventory' },
                      { label: 'Shipped', icon: 'local_shipping' },
                      { label: 'Delivered', icon: 'home' }
                    ].map((step, idx) => {
                      const stepIdx = idx + 1;
                      const statusState = getStepStatus(order.status, stepIdx);
                      return (
                        <div key={idx} className="flex flex-col items-center text-center z-10">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                            statusState === 'completed' 
                              ? 'bg-[#8A2BE2] border-[#8A2BE2] text-surface shadow-[0_0_10px_#8A2BE2]' 
                              : statusState === 'active'
                                ? 'bg-surface border-[#8A2BE2] text-primary shadow-[0_0_10px_rgba(138,43,226,0.3)]'
                                : 'bg-surface border-white/10 text-on-surface-variant'
                          }`}>
                            <span className="material-symbols-outlined text-[15px]">{step.icon}</span>
                          </div>
                          <span className={`font-label-caps text-[9px] uppercase tracking-wider mt-2.5 font-bold ${
                            statusState === 'completed' || statusState === 'active' ? 'text-primary' : 'text-on-surface-variant'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order Actions */}
              {order.status !== 'CANCELLED' && (
                <div className="border-t border-white/5 pt-6 flex flex-wrap gap-3.5">
                  <button 
                    onClick={() => {
                      setIsChatOpen(true);
                      handleSendMessage(`Status inquiry regarding Order SC-${order.id}`);
                    }}
                    className="px-4 py-2.5 bg-surface-container-highest border border-white/10 hover:border-primary/50 text-primary rounded-lg font-label-caps text-[10px] uppercase tracking-wider transition-all cursor-pointer font-semibold flex items-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    <span>Track Package</span>
                  </button>

                  {order.status !== 'SHIPPED' && order.status !== 'DELIVERED' && (
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2.5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg font-label-caps text-[10px] uppercase tracking-wider transition-all cursor-pointer font-semibold flex items-center gap-2 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px]">cancel</span>
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
