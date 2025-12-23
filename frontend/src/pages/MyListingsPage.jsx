import React from 'react';
import { Header } from '@/components/Layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const MyListingsPage = () => {
  const { user } = useAuth();
  const { deleteProduct } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProducts, setUserProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUserProducts = React.useCallback(async () => {
    if (!user) return;
    const sellerId = (user as any).id || (user as any)._id;
    if (!sellerId) return; // avoid calling with undefined
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/products?seller=${sellerId}`);
      setUserProducts(res.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchUserProducts();
  }, [fetchUserProducts]);

  const handleEdit = (productId: string) => {
    navigate(`/add-product/${productId}`);
  };

  const handleDelete = async (productId: string, productTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      const ok = await deleteProduct(productId);
      if (ok) {
        setUserProducts(prev => prev.filter(p => p._id === productId ? false : true));
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Failed to delete product',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-light tracking-tight">My Listings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your products and listings
            </p>
          </div>
          <Button
            onClick={() => navigate('/add-product')}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Products Grid */}
        {loading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading your listings...</p>
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-red-400 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchUserProducts}>Retry</Button>
          </div>
        )}
        {!loading && !error && userProducts.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding your first product to sell on Thrift Earth
              </p>
              <Button
                onClick={() => navigate('/add-product')}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            {userProducts.map((product: any, index) => (
              <Card
                key={product._id || product.id}
                className="group overflow-hidden bg-[#1B1B1B]/80 backdrop-blur-sm border border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/product/${product._id || product.id}`)}
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-800/20 to-gray-800/40 flex items-center justify-center overflow-hidden">
                    {Array.isArray(product.images) && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    ) : product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 text-sm">No Image</div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium line-clamp-2 text-sm text-white">{product.title}</h3>
                      <div className="flex flex-col gap-1 ml-2 shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        {product.brand && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {product.brand}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>ID: {(product._id || product.id).toString().slice(-6)}</span>
                      <span>•</span>
                      <span className="capitalize">{product.condition || 'n/a'}</span>
                    </div>
                    
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-[#00BFFF]">₹{Number(product.price).toFixed(2)}</span>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => { e.stopPropagation(); handleEdit(product._id || product.id); }}
                          className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => { e.stopPropagation(); handleDelete(product._id || product.id, product.title); }}
                          className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Listed {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};