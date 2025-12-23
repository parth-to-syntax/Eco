import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';

const DataContext = createContext(undefined);

// Function declaration for stable React Fast Refresh boundary
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Static categories removed; now fetched from backend only.

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [purchasesError, setPurchasesError] = useState(null);
  const [categories, setCategories] = useState(['All Categories']);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const { user, isLoading: authLoading } = useAuth();

  // Fetch products from backend
  const mapBackendProduct = (p: any): Product => ({
    id: p._id,
    ownerUserId: (typeof p.seller === 'object' && p.seller?._id) ? p.seller._id : (p.seller || ''),
    sellerName: (typeof p.seller === 'object' && p.seller?.name) ? p.seller.name : undefined,
    sellerAvatar: (typeof p.seller === 'object' && p.seller?.avatar) ? p.seller.avatar : null,
    title: p.title,
    description: p.description,
    category: p.category,
    price: p.price,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
    quantity: p.quantity ?? 1,
    condition: p.condition,
    tags: p.tags,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  });

  const refreshProducts = async () => {
    setLoadingProducts(true);
    setProductsError(null);
    const refreshCategories = async () => {
      setLoadingCategories(true);
      setCategoriesError(null);
      try {
        const res = await api.get('/api/products/categories/list');
        const serverCats = res.data?.categories || [];
        setCategories(['All Categories', ...serverCats]);
      } catch (e) {
        setCategoriesError(e?.response?.data?.message || e.message || 'Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    try {
      const params: any = {};
      // Ask backend to exclude this user's products (server-side filtering) – still filtered client-side as fallback
      if (user) params.excludeSeller = (user as any).id || (user as any)._id;
      const res = await api.get('/api/products', { params });
      const list = Array.isArray(res.data) ? res.data : [];
      refreshCategories();
      setProducts(list.map(mapBackendProduct));
    } catch (e) {
      setProductsError(e?.response?.data?.message || e.message || 'Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // When user state changes (e.g., after login) refresh to exclude their listings from marketplace
  useEffect(() => {
    if (user) {
      refreshProducts();
    }
  }, [user]);

  // Legacy cart/purchase from localStorage kept (can migrate later)
  // Legacy local cart fallback (first load) - will be overwritten by server fetch
  useEffect(() => {
    const storedCart = localStorage.getItem('thrift-earth-cart');
    if (storedCart && !cart) setCart(JSON.parse(storedCart));
  }, [cart]);

  const fetchPurchaseHistory = async () => {
    if (!user) return;
    setLoadingPurchases(true);
    setPurchasesError(null);
    try {
      const res = await api.get('/api/orders/history');
      const orders = res.data?.orders || [];
      const mapped: Purchase[] = orders.map((o: any) => ({
        id: o._id,
        userId: o.user,
        items: o.items.map((it: any) => ({ productId: it.product?._id || it.product, quantity: it.quantity })),
        date: o.createdAt,
        total: o.total,
        paymentMethod: o.paymentMethod || 'razorpay',
        paymentStatus: o.paymentStatus || 'paid'
      }));
      setPurchases(mapped);
    } catch (e) {
      setPurchasesError(e?.response?.data?.message || e.message || 'Failed to load purchase history');
    } finally {
      setLoadingPurchases(false);
    }
  };
  
  const fetchCart = async () => {
    if (!user) return;
    setLoadingCart(true);
    setCartError(null);
    try {
      const res = await api.get('/api/cart');
      const serverCart = res.data?.cart || [];
      const mapped: Cart = {
        userId: (user as any).id || (user as any)._id,
        items: serverCart.map((c: any) => ({ productId: c.product?._id || c.product, quantity: c.quantity }))
      };
      setCart(mapped);
      localStorage.setItem('thrift-earth-cart', JSON.stringify(mapped));
    } catch (e) {
      setCartError(e?.response?.data?.message || e.message || 'Failed to load cart');
    } finally {
      setLoadingCart(false);
    }
  };

  // When auth finishes and user is present, fetch cart and purchases
  useEffect(() => {
    if (!authLoading && user) {
      fetchCart();
      fetchPurchaseHistory();
    }
  }, [authLoading, user]);

  const addProduct = async (data: { title: string; description: string; category: string; price: number; images?[]; condition?; tags?[]; quantity?; details?: any; extras?) => {
    try {
      const payload: any = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        condition: data.condition,
        tags: data.tags,
        details: data.details,
        extras: data.extras,
        workingCondition: data.workingCondition
      };
      if (data.images && data.images.length) payload.images = data.images;
      if (typeof data.quantity === 'number') payload.quantity = data.quantity;
      if (import.meta.env.VITE_DEBUG === '1') {
        console.debug('[API_ADD_PRODUCT_REQUEST]', payload);
      }
      const res = await api.post('/api/products', payload).catch(err => {
        if (import.meta.env.VITE_DEBUG === '1') {
          console.error('[API_ADD_PRODUCT_ERROR]', err?.response?.status, err?.response?.data);
        }
        throw err;
      });
      if (import.meta.env.VITE_DEBUG === '1') {
        console.debug('[API_ADD_PRODUCT_RESPONSE]', res.status, res.data?._id || res.data?.id);
      }
      const mapped = mapBackendProduct(res.data);
      setProducts(prev => [mapped, ...prev]);
      return true;
    } catch (e) {
      if (import.meta.env.VITE_DEBUG === '1') {
        console.error('[ADD_PRODUCT_FAIL]', e);
      }
      return false;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const payload: any = { ...updates };
      if (updates.images) payload.images = updates.images;
      const res = await api.put(`/api/products/${id}`, payload);
      const mapped = mapBackendProduct(res.data);
      setProducts(prev => prev.map(p => p.id === id ? mapped : p));
      return true;
    } catch (e) {
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (e) {
      return false;
    }
  };

  const addToCart = async (productId, quantity: number = 1) => {
    try {
      await api.post('/api/cart/add', { productId, quantity });
      fetchCart();
    } catch (e) {
      // silent for now
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/api/cart/remove/${productId}`);
      fetchCart();
    } catch (e) {}
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!cart) return;
    const current = cart.items.find(i => i.productId === productId);
    if (!current) return;
    const diff = quantity - current.quantity;
    if (diff === 0) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    try {
      if (diff > 0) {
        await api.post('/api/cart/add', { productId, quantity: diff });
      } else {
        await api.patch(`/api/cart/decrease/${productId}`, { quantity: Math.abs(diff) });
      }
      fetchCart();
    } catch (e) {}
  };

  const clearCart = () => {
    if (!cart) return;
    setCart({ ...cart, items: [] });
    localStorage.setItem('thrift-earth-cart', JSON.stringify({ ...cart, items: [] }));
  };

  const checkout = async (paymentMethod: 'pay_later' | 'razorpay' = 'razorpay') => {
    if (!cart || cart.items.length === 0) return;

    try {
  await api.post('/api/orders/checkout', { paymentMethod });
      // server clears cart; we mirror that locally
      clearCart();
      // refresh history
      fetchPurchaseHistory();
  fetchCart();
    } catch (e) {
      // swallow for now; could set an error state
    }
  };

  const getProductsByCategory = (category) => {
    if (category === 'All Categories') return products;
    return products.filter(product => product.category === category);
  };

  const searchProducts = (query) => {
    return products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getUserProducts = (userId) => {
    return products.filter(product => product.ownerUserId === userId);
  };

  // Initialize cart for user
  useEffect(() => {
    const currentUser = localStorage.getItem('thrift-earth-user');
    if (currentUser && !cart) {
      const user = JSON.parse(currentUser);
      const userCart = { userId: user.id, items: [] };
      setCart(userCart);
      localStorage.setItem('thrift-earth-cart', JSON.stringify(userCart));
    }
  }, [cart]);

  return (
    <DataContext.Provider value={{
      products,
      loadingProducts,
      productsError,
      refreshProducts,
  cart,
  loadingCart,
  cartError,
      purchases,
      addProduct,
        categories,
        loadingCategories,
        categoriesError,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      checkout,
      getProductsByCategory,
      searchProducts,
      getUserProducts,
    }}>
      {children}
    </DataContext.Provider>
  );
};