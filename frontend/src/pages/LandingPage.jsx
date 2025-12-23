import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Search, Leaf, ShoppingCart, User, TrendingUp } from 'lucide-react';
import { api } from '@/api/client.ts.jsx';
import { useToast } from '@/hooks/use-toast.ts.jsx';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data.slice(0, 6)); // Show only first 6 products
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    toast({
      title: "Sign in Required",
      description: "Please sign in to view product details and make purchases",
      variant: "default",
    });
    setTimeout(() => navigate('/auth'), 1500);
  };

  const handleBrowseProducts = () => {
    toast({
      title: "Sign in Required",
      description: "Please sign in to browse all products",
      variant: "default",
    });
    setTimeout(() => navigate('/auth'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="outline" className="px-4 py-1 text-sm">
              <Leaf className="w-4 h-4 mr-2" />
              Sustainable Shopping Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl">
              Buy & Sell Pre-Loved Items
              <span className="block text-green-600 dark:text-green-400">Sustainably</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Join our community of eco-conscious shoppers. Discover unique second-hand treasures 
              and give items a new life while reducing waste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={handleBrowseProducts} className="text-lg px-8">
                <Search className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose EcoFinds?</h2>
          <p className="text-muted-foreground">Join thousands of users making sustainable choices</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Leaf className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>Eco-Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Reduce waste and carbon footprint by buying pre-loved items instead of new products.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ShoppingCart className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Easy Shopping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse, buy, and sell with ease. Our platform makes sustainable shopping simple.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Great Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find amazing second-hand items at unbeatable prices while supporting sustainability.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Products Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Discover amazing pre-loved items</p>
            </div>
            <Button variant="outline" onClick={handleBrowseProducts}>
              View All
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardHeader>
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card 
                  key={product._id} 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2">
                      {product.condition || 'Good'}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price}
                    </span>
                    <Button size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product._id);
                    }}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No products available yet</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join EcoFinds today and become part of the sustainable shopping revolution. 
              Buy, sell, and make a difference!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8">
                <User className="mr-2 h-5 w-5" />
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="text-lg px-8">
                Already have an account? Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold">EcoFinds</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 EcoFinds. Sustainable shopping for a better tomorrow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
