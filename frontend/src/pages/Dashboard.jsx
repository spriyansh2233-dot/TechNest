import React from 'react';

export default function Dashboard({ user, userOrders, setIsChatOpen, handleSendMessage, handleCancelOrder }) {
  return (
    <div className="animate-fadeIn max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 min-h-[80vh]">
      <h2 className="font-headline-xl text-headline-xl text-primary mb-2">My Account</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-12">View your order history and details.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 glass-card bg-surface border border-outline shadow-sm p-8 h-max rounded-3xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-primary mb-2 shadow-inner">
              <span className="material-symbols-outlined text-[40px]" data-icon="person">person</span>
            </div>
            <div>
              <h3 className="font-headline-lg text-[24px] text-primary">{user?.name}</h3>
              <p className="font-body-md text-[14px] text-on-surface-variant mt-1">{user?.email}</p>
            </div>
            <span className="px-3 py-1 text-[10px] font-mono-technical uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-full">
              {user?.role === 'ADMIN' ? 'System Administrator' : 'Customer'}
            </span>
          </div>
        </div>

        {/* Orders History List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-headline-lg text-[20px] text-primary border-b border-outline pb-4 flex items-center justify-between">
            <span>Order History ({userOrders.length})</span>
            <button 
              onClick={() => { setIsChatOpen(true); handleSendMessage("Where is my order?"); }}
              className="text-[12px] text-primary font-label-caps uppercase tracking-widest hover:text-primary/80 inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Track with AI</span>
              <span className="material-symbols-outlined text-[14px]" data-icon="auto_awesome">auto_awesome</span>
            </button>
          </h3>

          {userOrders.length === 0 ? (
            <div className="glass-card bg-surface border border-outline shadow-sm p-12 text-center flex flex-col items-center rounded-3xl">
              <span className="material-symbols-outlined text-outline text-[40px] mb-4" data-icon="inventory_2">inventory_2</span>
              <h4 className="font-headline-lg text-[18px] text-primary mb-2">No active orders</h4>
              <p className="font-body-md text-[14px] text-on-surface-variant">Once you place an order, it will be logged here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="glass-card bg-surface border border-outline shadow-sm hover:shadow-md transition-shadow p-6 space-y-4 relative overflow-hidden rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Order ID</span>
                      <h4 className="font-mono-technical text-[14px] text-primary">#{order.id}</h4>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full font-mono-technical text-[10px] uppercase tracking-widest border ${
                      order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      order.status === 'CANCELLED' ? 'bg-error/10 text-error border-error/20' :
                      'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* List items inside order */}
                  <div className="border-t border-b border-outline py-4 space-y-2">
                    {order.items?.map((item) => (
                      <div key={`orderItem-${item.id}`} className="flex justify-between items-center">
                        <span className="font-body-md text-[14px] text-on-surface-variant line-clamp-1 w-2/3">{item.product.name} (x{item.quantity})</span>
                        <span className="font-mono-technical text-[14px] text-primary">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Order Total</span>
                      <span className="font-mono-technical text-[18px] text-primary">₹{order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setIsChatOpen(true);
                          handleSendMessage(`Check status for order id ${order.id}`);
                        }}
                        className="px-4 py-2 bg-surface-container border border-outline text-primary font-label-caps text-[10px] uppercase tracking-widest rounded-lg hover:border-primary/50 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[14px]" data-icon="local_shipping">local_shipping</span>
                        <span>Track Package</span>
                      </button>
                      
                      {order.status !== 'CANCELLED' && order.status !== 'SHIPPED' && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 bg-error/5 text-error border border-error/20 font-label-caps text-[10px] uppercase tracking-widest rounded-lg hover:bg-error/10 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]" data-icon="cancel">cancel</span>
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
