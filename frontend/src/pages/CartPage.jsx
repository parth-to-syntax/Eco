import React from 'react';
import { Header } from '@/components/Layout/Header';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RazorpayCheckout } from '@/components/RazorpayCheckout';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const CartPage = () => {
  const { cart, products, updateCartQuantity, removeFromCart, checkout } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const cartItems = cart?.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product) || [];

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "Product removed from cart",
    });
  };

  const handlePaymentSuccess = () => {
    if (cartItems.length === 0) return;
    checkout('razorpay');
    toast({
      title: 'Order placed!',
      description: 'Your payment was successful and order is placed.'
    });
    navigate('/profile');
  };

  const handlePayLater = () => {
    if (cartItems.length === 0) return;
    checkout('pay_later');
    toast({
      title: 'Order created (Pay Later)',
      description: 'You chose Pay Later. Complete payment later from your orders section.'
    });
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-light tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Discover amazing products and add them to your cart
              </p>
              <Button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <Card
                  key={item.productId}
                  className="bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-xs text-muted-foreground">Image</div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">
                          {item.product?.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {item.product?.category}
                        </Badge>
                        <p className="text-lg font-semibold text-primary">
                          ₹{item.product?.price.toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="h-8 w-8 p-0 border-gray-700 hover:bg-red-500/20 hover:border-red-500"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="h-8 w-8 p-0 border-gray-700 hover:bg-red-500/20 hover:border-red-500"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 sticky top-24 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="line-clamp-1 flex-1">
                          {item.product?.title} × {item.quantity}
                        </span>
                        <span className="font-medium ml-2">
                          ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total</span>
                      <span className="text-xl font-semibold text-primary">
                        ₹{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={handlePayLater}
                      disabled={cartItems.length === 0}
                      variant="outline"
                      className="w-full border-dashed"
                    >
                      Pay Later
                    </Button>
                    <RazorpayCheckout
                      amount={totalPrice}
                      onSuccess={handlePaymentSuccess}
                      disabled={cartItems.length === 0}
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
                    >
                      Pay Now (Razorpay) ₹{totalPrice.toFixed(2)}
                    </RazorpayCheckout>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/products')}
                    className="w-full mt-3"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};