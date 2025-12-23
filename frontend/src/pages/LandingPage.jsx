import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Leaf, User, ArrowRight, Sparkles } from 'lucide-react';
import { SplineHero } from '@/components/ui/spline-hero';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBrowseProducts = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Spline 3D */}
      <div className="relative h-screen overflow-hidden">
        <SplineHero className="h-full" />
        
        <div className="absolute inset-0 z-20 flex items-end justify-center pb-16 sm:pb-24 md:pb-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleBrowseProducts}
                  className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-0 shadow-lg shadow-pink-500/50 w-full sm:w-auto"
                >
                  <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/auth')} 
                  className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 border-pink-500 hover:bg-pink-500/20 hover:border-red-500 w-full sm:w-auto"
                >
                  <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center shadow-lg shadow-pink-500/50">
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
