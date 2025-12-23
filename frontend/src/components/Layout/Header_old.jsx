import React, { useState } from 'react';
import logoImg from '@/components/Layout/logo.jpg';
import { Package, Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const navItems = [
    { label: 'Products', path: '/products' },
    { label: 'My Listings', path: '/my-listings' },
    { label: 'Cart', path: '/cart' },
    { label: 'Profile', path: '/profile' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation('/products')}
          >
            <div className="h-12 w-12 rounded-full overflow-hidden ring-1 ring-white/20 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src={logoImg}
                alt="Logo"
                className="h-full w-full object-cover select-none"
                draggable={false}
              />
            </div>
            <span className="text-2xl font-light tracking-tight text-foreground">
              Thrift earth
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavigation('/products')}
              className={`text-sm font-medium transition-colors hover:text-[#00BFFF] relative ${
                location.pathname === '/products' ? 'text-[#00BFFF]' : 'text-gray-300'
              }`}
            >
              Products
            </button>

            {user ? (
              <>
                {navItems.filter(item => item.label !== 'Profile' && item.label !== 'Products').map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`text-sm font-medium transition-colors hover:text-[#00BFFF] relative ${
                      location.pathname === item.path ? 'text-[#00BFFF]' : 'text-gray-300'
                    }`}
                  >
                    {item.label}
                    {item.label === 'Cart' && cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#00BFFF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                ))}

                {/* Profile Avatar */}
                <div
                  className="w-10 h-10 rounded-full overflow-hidden border border-gray-600 hover:ring-2 hover:ring-[#00BFFF] cursor-pointer transition-all"
                  onClick={() => handleNavigation('/profile')}
            >
              {user?.profileImage || user?.avatar ? (
                <img
                  src={user?.profileImage || user?.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00BFFF] to-[#00B894] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="ml-4 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Logout
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Tray */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-primary to-primary/80 rounded-full"></div>
                  </div>
                </div>
                <span className="font-light text-lg">thrift earth</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-4 space-y-4">
              {navItems.filter(item => item.label !== 'Profile').map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                    location.pathname === item.path
                      ? 'bg-[#00BFFF] text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.label === 'Cart' && cartItemCount > 0 && (
                    <span className="bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600">
                    {user?.profileImage || user?.avatar ? (
                      <img
                        src={user?.profileImage || user?.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00BFFF] to-[#00B894] flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
