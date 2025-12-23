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
    { label: 'Products', path: '/products', authRequired: true },
    { label: 'My Listings', path: '/my-listings', authRequired: true },
    { label: 'Cart', path: '/cart', authRequired: true },
    { label: 'Profile', path: '/profile', authRequired: true },
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
            onClick={() => handleNavigation('/')}
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
            {navItems.filter(item => !item.authRequired || user).map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`text-sm font-medium transition-colors hover:text-red-500 relative ${
                  location.pathname === item.path ? 'text-red-500' : 'text-gray-300'
                }`}
              >
                {item.label}
                {item.label === 'Cart' && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            ))}

            {user ? (
              <>
                {/* Profile Avatar */}
                <div
                  className="w-10 h-10 rounded-full overflow-hidden border border-gray-600 hover:ring-2 hover:ring-red-500 cursor-pointer transition-all"
                  onClick={() => handleNavigation('/profile')}
                >
                  {user?.profileImage || user?.avatar ? (
                    <img
                      src={user?.profileImage || user?.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
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
              </>
            ) : (
              <Button
                onClick={() => handleNavigation('/auth')}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white"
              >
                Sign In
              </Button>
            )}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/90 backdrop-blur-md">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <span className="text-xl font-light text-white">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.filter(item => !item.authRequired || user).map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                    location.pathname === item.path
                      ? 'bg-red-500 text-white'
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

              {user ? (
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
                        <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
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
              ) : (
                <div className="pt-4 border-t border-gray-700">
                  <Button
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white"
                    onClick={() => handleNavigation('/auth')}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
