import React, { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Check, X, ShoppingBag, Package, Mail, Phone, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { purchases, products } = useData();
  const { toast } = useToast();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // Local optional profile fields not yet persisted on backend (phone, profileImage)
  const [editForm, setEditForm] = useState({
    name: (user as any)?.name || '',
    email: (user as any)?.email || '',
    phone: '',
    profileImage: ''
  });

  const userPurchases = purchases.filter(purchase => purchase.userId === ((user as any)?.id || (user as any)?._id));

  const handleSaveProfile = () => {
    if (editForm.username.trim() && editForm.email.trim()) {
      updateProfile({
        name: editForm.name.trim(),
        email: editForm.email.trim()
        // phone/profileImage are only client-side placeholders for now
      } as any);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: (user as any)?.name || '',
      email: (user as any)?.email || '',
      phone: '',
      profileImage: ''
    });
    setIsEditingProfile(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setEditForm(prev => ({ ...prev, profileImage: e.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getPurchasedProducts = (purchase: any) => {
    return purchase.items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      return { ...item, product };
    }).filter((item: any) => item.product);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-8 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-2xl font-light tracking-tight">Profile Settings</h1>
                {!isEditingProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center overflow-hidden">
                      {editForm.profileImage ? (
                        <img
                          src={editForm.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    {isEditingProfile && (
                      <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {isEditingProfile && (
                    <p className="text-xs text-muted-foreground text-center">
                      Click camera icon to upload
                    </p>
                  )}
                </div>

                {/* Profile Information */}
                <div className="md:col-span-2 space-y-4">
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="mt-1"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button onClick={handleSaveProfile} className="flex-1">
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{(user as any)?.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">Not provided</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Member since:</span>
                        <span className="font-medium">{new Date(user?.createdAt || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase History */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Purchase History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userPurchases.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No purchases yet</h3>
                  <p className="text-muted-foreground">
                    Your purchase history will appear here once you make your first order
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userPurchases.map((purchase, index) => (
                    <div 
                      key={purchase.id} 
                      className="border border-border/50 rounded-lg p-4 bg-background/50 animate-fade-in"
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">
                            Order #{purchase.id.slice(-8).toUpperCase()}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(purchase.date).toLocaleDateString()} at{' '}
                            {new Date(purchase.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-col items-end">
                            <Badge variant={purchase.paymentStatus === 'paid' ? 'secondary' : 'outline'}>
                              {purchase.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                            </Badge>
                            <span className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">
                              {purchase.paymentMethod.replace('_', ' ')}
                            </span>
                            <p className="text-lg font-semibold text-primary mt-1">
                              ₹{purchase.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {getPurchasedProducts(purchase).map((item: any) => (
                          <div key={item.productId} className="flex items-center space-x-3 p-2 rounded bg-muted/20">
                            <div className="w-12 h-12 bg-gradient-to-br from-muted/20 to-muted/40 rounded flex items-center justify-center flex-shrink-0">
                              <div className="text-xs text-muted-foreground">Img</div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-1">
                                {item.product?.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Quantity: {item.quantity} × ₹{item.product?.price.toFixed(2)}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.product?.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};