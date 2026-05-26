import React from 'react';

export default function AdminDashboard({ 
  user, 
  products, 
  adminOrders, 
  adminUsers, 
  adminTab, 
  setAdminTab,
  newProduct,
  setNewProduct,
  editingProduct,
  setEditingProduct,
  handleCreateProduct,
  handleEditProductSubmit,
  handleDeleteProduct,
  handleUpdateOrderStatus,
  showToast,
  navigate,
  api
}) {
  return (
    <div className="animate-fadeIn max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary mb-2">Admin Dashboard</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage products, orders, and users.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => { navigate('/shop'); }}
            className="px-6 py-3 bg-surface-container-highest border border-outline-variant/30 text-primary font-label-caps text-[12px] uppercase tracking-widest rounded hover:border-primary/50 transition-colors"
          >
            Back to Store
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-outline-variant/30 mb-8 gap-8 overflow-x-auto">
        <button 
          onClick={() => setAdminTab('products')}
          className={`pb-4 font-label-caps text-[12px] uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
            adminTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Products ({products.length})
        </button>
        <button 
          onClick={() => setAdminTab('orders')}
          className={`pb-4 font-label-caps text-[12px] uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
            adminTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Orders ({adminOrders.length})
        </button>
        <button 
          onClick={() => setAdminTab('users')}
          className={`pb-4 font-label-caps text-[12px] uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
            adminTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Users ({adminUsers.length})
        </button>
      </div>

      {/* TAB CONTENT: PRODUCTS */}
      {adminTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form column (Left) */}
          <div className="lg:col-span-5 glass-card p-8 h-max">
            <h3 className="font-headline-lg text-[20px] text-primary border-b border-outline-variant/30 pb-4 mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]" data-icon="add_circle">add_circle</span>
                <span>{editingProduct ? 'Edit Product' : 'Add New Product'}</span>
              </span>
              {editingProduct && (
                <button 
                  onClick={() => setEditingProduct(null)} 
                  className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </h3>

            <form onSubmit={editingProduct ? handleEditProductSubmit : handleCreateProduct} className="space-y-6">
              <div>
                <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">Product Name</label>
                <input 
                  type="text" 
                  required 
                  value={editingProduct ? editingProduct.name : newProduct.name} 
                  onChange={(e) => {
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, name: e.target.value});
                    } else {
                      setNewProduct({...newProduct, name: e.target.value});
                    }
                  }}
                  placeholder="e.g. Wireless Headphones" 
                  className="w-full bg-surface-variant border border-outline-variant/30 rounded p-4 font-body-md text-[14px] text-primary outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={editingProduct ? editingProduct.price : newProduct.price} 
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || ''});
                      } else {
                        setNewProduct({...newProduct, price: parseFloat(e.target.value) || ''});
                      }
                    }}
                    placeholder="149.99" 
                    className="w-full bg-surface-variant border border-outline-variant/30 rounded p-4 font-body-md text-[14px] text-primary outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">Discount ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={editingProduct ? (editingProduct.discount || 0) : (newProduct.discount || 0)} 
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({...editingProduct, discount: parseFloat(e.target.value) || 0});
                      } else {
                        setNewProduct({...newProduct, discount: parseFloat(e.target.value) || 0});
                      }
                    }}
                    placeholder="0.00" 
                    className="w-full bg-surface-variant border border-outline-variant/30 rounded p-4 font-body-md text-[14px] text-primary outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">Stock</label>
                  <input 
                    type="number" 
                    required 
                    value={editingProduct ? editingProduct.stock : newProduct.stock} 
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0});
                      } else {
                        setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0});
                      }
                    }}
                    placeholder="25" 
                    className="w-full bg-surface-variant border border-outline-variant/30 rounded p-4 font-body-md text-[14px] text-primary outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">Category</label>
                <select 
                  value={editingProduct ? editingProduct.category : newProduct.category} 
                  onChange={(e) => {
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, category: e.target.value});
                    } else {
                      setNewProduct({...newProduct, category: e.target.value});
                    }
                  }}
                  className="w-full bg-surface-variant border border-outline-variant/30 rounded p-4 font-body-md text-[14px] text-primary outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Audio">Audio</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Smart Devices">Smart Devices</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">Product Image URL</label>
                <input 
                  type="url" 
                  required 
                  value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl} 
                  onChange={(e) => {
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, imageUrl: e.target.value});
                    } else {
                      setNewProduct({...newProduct, imageUrl: e.target.value});
                    }
                  }}
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full bg-surface-variant border border-outline-variant/30 rounded p-4 font-body-md text-[14px] text-primary outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">Or Upload Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    showToast('Transmitting visual data...', 'info');
                    try {
                      const res = await api.post('/api/products/upload-image', formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                      });
                      if (editingProduct) {
                        setEditingProduct({...editingProduct, imageUrl: res.data.url});
                      } else {
                        setNewProduct({...newProduct, imageUrl: res.data.url});
                      }
                      showToast('Transmission complete.', 'success');
                    } catch (err) {
                      showToast('Transmission failed.', 'error');
                    }
                  }}
                  className="w-full bg-surface-variant border border-outline-variant/30 rounded p-3 font-body-md text-[14px] text-primary outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:font-label-caps file:text-[10px] file:uppercase file:tracking-widest file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {(editingProduct ? editingProduct.imageUrl : newProduct.imageUrl) && (
                  <div className="mt-4 border border-outline-variant/30 p-2 rounded bg-surface-container-highest">
                    <img 
                      src={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl} 
                      alt="Preview" 
                      className="h-32 w-full object-contain mix-blend-screen"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">Product Description</label>
                <textarea 
                  required
                  rows="4"
                  value={editingProduct ? editingProduct.description : newProduct.description}
                  onChange={(e) => {
                    if (editingProduct) {
                      setEditingProduct({...editingProduct, description: e.target.value});
                    } else {
                      setNewProduct({...newProduct, description: e.target.value});
                    }
                  }}
                  placeholder="Detailed specifications..."
                  className="w-full bg-surface-variant border border-outline-variant/30 rounded p-4 font-body-md text-[14px] text-primary outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-primary text-surface font-label-caps text-[12px] uppercase tracking-widest rounded hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(138,43,226,0.3)]"
              >
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>

          {/* List column (Right) */}
          <div className="lg:col-span-7">
            <div className="glass-card overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container-highest font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
                    <th className="p-4 font-medium">Image</th>
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {products.map((prod) => (
                    <tr key={`inventory-${prod.id}`} className="hover:bg-surface-variant/50 transition-colors">
                      <td className="p-4">
                        <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 object-contain rounded border border-outline-variant/30 bg-surface" />
                      </td>
                      <td className="p-4">
                        <p className="font-body-md text-[14px] text-primary line-clamp-1">{prod.name}</p>
                        <span className="font-mono-technical text-[10px] text-on-surface-variant">{prod.category}</span>
                      </td>
                      <td className="p-4 font-mono-technical text-[14px] text-primary">
                        ${prod.price.toFixed(2)}
                        {prod.discount > 0 && (
                          <span className="block text-[10px] text-error">-${prod.discount.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded font-mono-technical text-[10px] uppercase border ${
                          prod.stock === 0 ? 'bg-error/10 text-error border-error/20' :
                          prod.stock < 5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingProduct(prod);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-2 bg-surface-container-highest hover:bg-primary/20 text-on-surface-variant hover:text-primary rounded border border-outline-variant/30 transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[16px]" data-icon="edit">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 bg-surface-container-highest hover:bg-error/20 text-on-surface-variant hover:text-error rounded border border-outline-variant/30 transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[16px]" data-icon="delete">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="font-headline-lg text-[20px] text-primary border-b border-outline-variant/30 pb-4 flex items-center justify-between">
            <span>Customer Orders ({adminOrders.length})</span>
          </h3>

          {adminOrders.length === 0 ? (
            <div className="glass-card p-16 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4" data-icon="local_shipping">local_shipping</span>
              <h4 className="font-headline-lg text-[18px] text-primary">No orders found</h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminOrders.map((order) => (
                <div 
                  key={`adminOrder-${order.id}`} 
                  className="glass-card p-6 space-y-4 relative"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Customer Email</span>
                      <h4 className="font-mono-technical text-[14px] text-primary">{order.user.email}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono-technical text-[10px] text-on-surface-variant">REF: #{order.id}</span>
                      <span className={`px-3 py-1 rounded font-mono-technical text-[10px] uppercase border ${
                        order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        order.status === 'CANCELLED' ? 'bg-error/10 text-error border-error/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* List items info */}
                  <div className="border-t border-b border-outline-variant/30 py-4 space-y-2">
                    {order.items?.map((item) => (
                      <div key={`adminOrderItem-${item.id}`} className="flex justify-between font-body-md text-[14px] text-on-surface-variant">
                        <span className="line-clamp-1 w-3/4">• {item.product.name} (x{item.quantity})</span>
                        <span className="font-mono-technical text-primary">${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2 flex-wrap">
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Order Total</span>
                      <span className="font-mono-technical text-[18px] text-primary">${order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.status === 'PAID' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                          className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 font-label-caps text-[10px] uppercase tracking-widest rounded hover:bg-blue-500/20 transition-colors inline-flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[14px]" data-icon="local_shipping">local_shipping</span>
                          <span>Mark as Shipped</span>
                        </button>
                      )}

                      {order.status !== 'CANCELLED' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                          className="px-4 py-2 bg-error/10 text-error border border-error/20 font-label-caps text-[10px] uppercase tracking-widest rounded hover:bg-error/20 transition-colors"
                        >
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
      )}

      {/* TAB CONTENT: USERS */}
      {adminTab === 'users' && (
        <div className="glass-card p-8 space-y-6">
          <h3 className="font-headline-lg text-[20px] text-primary border-b border-outline-variant/30 pb-4 flex items-center justify-between">
            <span>Registered Users ({adminUsers.length})</span>
          </h3>
          {adminUsers.length === 0 ? (
            <p className="font-body-md text-[14px] text-on-surface-variant">No registered users found.</p>
          ) : (
            <div className="divide-y divide-outline-variant/30 max-h-[500px] overflow-y-auto pr-4">
              {adminUsers.map(u => (
                <div key={u.id} className="py-4 flex items-center justify-between hover:bg-surface-variant/30 transition-colors px-2 rounded">
                  <div>
                    <p className="font-body-lg text-[16px] text-primary">{u.name}</p>
                    <p className="font-mono-technical text-[12px] text-on-surface-variant">{u.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded font-mono-technical text-[10px] uppercase tracking-widest border ${
                    u.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'
                  }`}>{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
