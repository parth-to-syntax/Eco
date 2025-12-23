import React from 'react';
import { Header } from '@/components/Layout/Header';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, User, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const ProductDetailPage = () => {
  const { productId } = useParams();
  const { products, addToCart } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-light mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Sign in Required",
        description: "Please sign in to add items to your cart",
        variant: "default",
      });
      setTimeout(() => navigate('/auth'), 1500);
      return;
    }
    
    const success = await addToCart(product.id);
    if (success) {
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
        duration: 2500,
      });
    } else {
      toast({
        title: "Cannot add to cart",
        description: "You cannot add your own products to cart.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4 animate-fade-in">
              <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <div className="text-muted-foreground">Product Image</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Image dots indicator */}
              {product.images && product.images.length > 1 && (
                <div className="flex justify-center space-x-2">
                  {product.images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div>
                <Badge variant="secondary" className="mb-3">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-light tracking-tight mb-4">
                  {product.title}
                </h1>
                <div className="text-3xl font-semibold text-[#00BFFF] mb-6">
                  ₹{product.price.toFixed(2)}
                </div>
              </div>

              <Card className="bg-[#1B1B1B]/80 backdrop-blur-sm border border-gray-700">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-3 text-white">Product Description</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#1B1B1B]/80 backdrop-blur-sm border border-gray-700">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4 text-white">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Condition:</span>
                        <span className="text-white capitalize">{product.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quantity:</span>
                        <span className="text-white">{product.quantity}</span>
                      </div>
                      {product.yearOfManufacture && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Year:</span>
                          <span className="text-white">{product.yearOfManufacture}</span>
                        </div>
                      )}
                      {product.brand && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Brand:</span>
                          <span className="text-white">{product.brand}</span>
                        </div>
                      )}
                      {product.model && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Model:</span>
                          <span className="text-white">{product.model}</span>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Dimensions:</span>
                          <span className="text-white">{product.dimensions}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {product.weight && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Weight:</span>
                          <span className="text-white">{product.weight}</span>
                        </div>
                      )}
                      {product.material && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Material:</span>
                          <span className="text-white">{product.material}</span>
                        </div>
                      )}
                      {product.color && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Color:</span>
                          <span className="text-white">{product.color}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Original Packaging:</span>
                        <span className={`${product.originalPackaging ? 'text-[#00B894]' : 'text-gray-500'}`}>
                          {product.originalPackaging ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Manual Included:</span>
                        <span className={`${product.manualIncluded ? 'text-[#00B894]' : 'text-gray-500'}`}>
                          {product.manualIncluded ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {product.workingConditionDescription && (
                <Card className="bg-[#1B1B1B]/80 backdrop-blur-sm border border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-3 text-white">Working Condition</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {product.workingConditionDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-[#1B1B1B]/80 backdrop-blur-sm border border-gray-700">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-3 text-white">Listing Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Listed on:</span>
                      <span className="text-white">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Seller:</span>
                      <span className="text-white">{product?.sellerName || 'Unknown Seller'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Seller:</span>
                      <span className="text-white flex items-center space-x-2">
                        {product.sellerAvatar && (
                          <img src={product.sellerAvatar} alt={product.sellerName || 'Seller'} className="h-6 w-6 rounded-full object-cover" />
                        )}
                        <span>{product.sellerName || 'Unknown'}</span>
                        <span className="text-xs text-gray-500">(#{product.ownerUserId.slice(-6).toUpperCase()})</span>
                      </span>
                    </div>
                    {product.updatedAt !== product.createdAt && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Last updated:</span>
                        <span className="text-white">{new Date(product.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-[#00BFFF] to-[#00B894] hover:from-[#00B894] hover:to-[#00BFFF] text-white text-lg py-6"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => navigate('/cart')}>
                    View Cart
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/products')}>
                    Continue Shopping
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground p-4 bg-muted/10 rounded-lg">
                <p className="mb-1">✓ Secure checkout process</p>
                <p className="mb-1">✓ Easy returns and exchanges</p>
                <p>✓ Fast and reliable shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};