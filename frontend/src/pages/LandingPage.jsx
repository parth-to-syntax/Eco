import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Search, Leaf, ShoppingCart, User, TrendingUp, ArrowRight, Sparkles, Package, Globe } from 'lucide-react';
import { api } from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import { SplineHero } from '@/components/ui/spline-hero';

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
      setProducts(response.data.slice(0, 6));
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Spline 3D */}
      <div className="relative h-screen overflow-hidden">
        <SplineHero className="h-full" />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge variant="outline" className="px-6 py-2 text-sm border-emerald-500/50 bg-emerald-500/10">
                <Sparkles className="w-4 h-4 mr-2" />
                Sustainable Shopping Platform
              </Badge>
              
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                Shop
                <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text">
                  Sustainably
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Discover unique pre-loved treasures. Give items a second life while making a positive impact on our planet.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/products')} 
                  className="text-lg px-10 py-7 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 border-0"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/auth')} 
                  className="text-lg px-10 py-7 border-emerald-500/50 hover:bg-emerald-500/10"
                >
                  <User className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      {/* Stats Section */}
      <div className="border-y border-gray-800 bg-gradient-to-b from-black via-gray-900/50 to-black">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: '10K+', sublabel: 'Products Listed', icon: Package },
              { label: '5K+', sublabel: 'Happy Users', icon: User },
              { label: '50K+', sublabel: 'Items Saved', icon: Heart },
              { label: '100%', sublabel: 'Eco-Friendly', icon: Leaf },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <stat.icon className="w-8 h-8 mx-auto text-emerald-400 mb-3" />
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-cyan-500/50 bg-cyan-500/10">
            Why EcoFinds?
          </Badge>
          <h2 className="text-5xl font-bold">
            Shop with <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">Purpose</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands making sustainable choices every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Leaf,
              title: 'Eco-Friendly',
              description: 'Reduce waste and carbon footprint by choosing pre-loved items over new products.',
              gradient: 'from-emerald-500 to-green-600'
            },
            {
              icon: TrendingUp,
              title: 'Great Value',
              description: 'Find amazing second-hand items at unbeatable prices while supporting sustainability.',
              gradient: 'from-blue-500 to-purple-600'
            },
            {
              icon: Globe,
              title: 'Global Impact',
              description: 'Be part of a worldwide movement towards conscious consumption and circular economy.',
              gradient: 'from-cyan-500 to-blue-600'
            },
          ].map((feature, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all hover:scale-105 backdrop-blur">
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-2">
            <Badge variant="outline" className="px-4 py-1 border-emerald-500/50 bg-emerald-500/10 mb-4">
              Featured Items
            </Badge>
            <h2 className="text-5xl font-bold">Trending <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">Products</span></h2>
            <p className="text-gray-400 text-lg">Discover what's popular today</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')}
            className="border-emerald-500/50 hover:bg-emerald-500/10"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden bg-gray-900/50 border-gray-800">
                <div className="aspect-square bg-gray-800 animate-pulse" />
                <CardHeader>
                  <div className="h-4 bg-gray-800 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-800 rounded animate-pulse w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card 
                key={product._id} 
                className="group overflow-hidden bg-gray-900/50 border-gray-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-105"
                onClick={() => handleProductClick(product._id)}
              >
                <div className="aspect-square bg-gray-800 relative overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-16 h-16 text-gray-700" />
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-emerald-500">
                    {product.condition || 'Good'}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-xl">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-400">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
                    ${product.price}
                  </span>
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product._id);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    View
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="text-center py-16">
              <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-700" />
              <p className="text-gray-400 text-lg">No products available yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <Card className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border-2 border-emerald-500/20 backdrop-blur">
          <CardContent className="py-20 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-emerald-400" />
            <h2 className="text-5xl font-bold mb-6">
              Ready to Make a <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">Difference</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join EcoFinds today and become part of the sustainable shopping revolution. 
              Buy, sell, and create positive impact!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')} 
                className="text-lg px-12 py-7 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 border-0"
              >
                <User className="mr-2 h-5 w-5" />
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/products')} 
                className="text-lg px-12 py-7 border-emerald-500/50 hover:bg-emerald-500/10"
              >
                <Search className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EcoFinds</span>
            </div>
            <p className="text-gray-400">
              © 2025 EcoFinds. Sustainable shopping for a better tomorrow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
