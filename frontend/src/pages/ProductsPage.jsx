import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Layout/Header';
import { SplineHero } from '@/components/ui/spline-hero';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortMode, setSortMode] = useState('newest');
  const [groupBy, setGroupBy] = useState('none');
  const { products, addToCart, loadingProducts, productsError, refreshProducts, categories, loadingCategories, categoriesError } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Ensure scroll is enabled
  React.useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const processedProducts = useMemo(() => {
    let filtered = products.slice();

    // exclude logged-in user's own products from main marketplace view
    if (user) {
      filtered = filtered.filter(p => p.ownerUserId !== user.id);
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a,b) => {
      if (sortMode === 'price-asc') return a.price - b.price;
      if (sortMode === 'price-desc') return b.price - a.price;
      if (sortMode === 'newest') return new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime();
      if (sortMode === 'oldest') return new Date(a.createdAt||0).getTime() - new Date(b.createdAt||0).getTime();
      return 0;
    });

    if (groupBy === 'category') {
      // Group into sections by category; return array with marker objects
      const groups = new Map();
      for (const p of filtered) {
        const key = p.category || 'Uncategorized';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(p);
      }
      // Flatten with headers
      const flat = [];
      for (const [cat, list] of groups.entries()) {
        flat.push({ __group: true, category: cat, count: list.length });
        flat.push(...list);
      }
      return flat;
    }
    return filtered;
  }, [products, selectedCategory, searchQuery, user, sortMode, groupBy]);

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    const success = await addToCart(productId);
    if (success) {
      toast({
        title: "✅ Added to cart",
        description: "Product added to your cart successfully!",
        duration: 2500,
      });
    } else {
      toast({
        title: "🚫 Cannot Add to Cart",
        description: "You cannot purchase your own products!",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Spline */}
      <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
        <SplineHero className="h-full" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white animate-fade-in">
            
          </div>
        </div>
        {/* Smooth gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-background via-background/80 to-transparent z-30 pointer-events-none" />
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 sm:h-10 text-base sm:text-sm bg-[#1B1B1B]/50 backdrop-blur-sm border border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {loadingCategories && (
              <span className="text-xs text-muted-foreground">Loading categories...</span>
            )}
            {!loadingCategories && categoriesError && (
              <span className="text-xs text-red-400">{categoriesError}</span>
            )}
            {!loadingCategories && categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-200 ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-red-500/20' 
                    : 'bg-[#1B1B1B]/50 backdrop-blur-sm border border-gray-700 text-gray-300 hover:bg-red-500/10 hover:border-red-500/50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort & Group Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Sort:</span>
              <select
                value={sortMode}
                onChange={(e) => setSortModee.target.value}
                className="bg-[#1B1B1B]/50 border border-gray-700 rounded px-2 py-1 text-gray-200 text-sm focus:outline-none focus:border-[#00BFFF]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Group:</span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBye.target.value}
                className="bg-[#1B1B1B]/50 border border-gray-700 rounded px-2 py-1 text-gray-200 text-sm focus:outline-none focus:border-[#00BFFF]"
              >
                <option value="none">None</option>
                <option value="category">Category</option>
              </select>
            </div>
            {(searchQuery || selectedCategory !== 'All Categories' || sortMode !== 'newest' || groupBy !== 'none') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); setSortMode('newest'); setGroupBy('none'); }}
                className="border-gray-700 text-gray-300 hover:bg-[#1B1B1B]"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        {loadingProducts && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        )}
        {!loadingProducts && productsError && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{productsError}</p>
            <Button variant="outline" onClick={refreshProducts}>Retry</Button>
          </div>
        )}
  {!loadingProducts && !productsError && processedProducts.filter(p => !p.__group).length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                {products.length === 0 
                  ? "No products available yet. Be the first to list an item!"
                  : "Try adjusting your search or filters"}
              </p>
              {user && (
                <Button onClick={() => navigate('/add-product')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add a product
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {processedProducts.map((product, index) => (
              product.__group ? (
                <div key={`group-${product.category}-${index}`} className="col-span-full mt-8 mb-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-light tracking-wide text-gray-200 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#1B1B1B]/70 border border-gray-700 text-red-400">{product.category}</span>
                      <span className="text-xs text-gray-500">{product.count} item{product.count !== 1 ? 's' : ''}</span>
                    </h2>
                    <div className="h-px flex-1 ml-4 bg-gradient-to-r from-red-500/40 to-transparent" />
                  </div>
                </div>
              ) : (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden bg-[#1B1B1B]/90 backdrop-blur-sm border border-gray-700 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-2 hover:border-red-500/50 animate-fade-in flex flex-col h-full"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-800/40 to-gray-900/60 flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-muted-foreground text-sm font-light">No Image Available</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-5 space-y-3 flex flex-col flex-grow">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-2 text-base text-white leading-tight flex-grow">{product.title}</h3>
                      <Badge variant="secondary" className="text-xs shrink-0 bg-red-500/20 text-red-400 border-red-500/30">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gray-300">Qty:</span> {product.quantity}
                      </span>
                      <span>•</span>
                      <span className="capitalize font-medium">{product.condition}</span>
                      {product.brand && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-gray-300">{product.brand}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed flex-grow">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700/50 mt-auto">
                      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        onClick={(e) => handleAddToCart(product.id, e)}
                        className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-300 font-medium"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )
            ))}
          </div>
        )}
      </section>

      {/* Floating Add Button */}
      {user && (
        <Button
          onClick={() => navigate('/add-product')}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white shadow-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-110 z-40"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      )}
    </div>
  );
};