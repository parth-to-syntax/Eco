import React, { useState } from 'react';
import logoImg from '@/components/Layout/logo.jpg';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const AuthPage = () => {
  // Default avatar fallback (external URL)
  const DEFAULT_AVATAR_URL = 'https://static.vecteezy.com/system/resources/previews/059/969/644/large_2x/modern-profile-avatar-set-in-black-and-white-featuring-male-and-female-icons-for-ui-design-web-applications-and-professional-use-free-vector.jpg';
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  const initialsFromName = (full) => {
    const parts = full.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '';
    if (parts.length === 1) return parts[0].substring(0,2).toUpperCase();
    return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  };

  const generateInitialsDataUri = (full) => {
    const initials = initialsFromName(full) || '?';
    const bg = '#ef4444'; // Red-500
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>`+
      `<rect width='256' height='256' rx='128' fill='${bg}'/>`+
      `<text x='50%' y='50%' dy='.1em' text-anchor='middle' font-family='Inter,Arial,sans-serif' font-size='110' fill='#fff' font-weight='600'>${initials}</text>`+
      `</svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  };

  const initials = initialsFromName(name);
  
  const { login, signup, isLoading, lastError, debug } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      let success = false;
      const normalizedEmail = email.trim().toLowerCase();
      if (import.meta.env.VITE_DEBUG === '1') {
        console.debug('[AUTH_SUBMIT]', { mode: isLogin ? 'login' : 'register', email: normalizedEmail });
      }
      
  if (isLogin) {
        success = await login(normalizedEmail, password);
        if (!success) {
          toast({
            title: "Login Failed",
            description: lastError || "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
            duration: 5000
          });
          return;
        }
      } else {
        let avatarToSend = null;
        if (avatarFile) {
          avatarToSend = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(avatarFile);
          });
        } else if (name.trim()) {
          avatarToSend = generateInitialsDataUri(name.trim());
        } else {
          avatarToSend = DEFAULT_AVATAR_URL;
        }
	success = await signup(normalizedEmail, password, name, avatarToSend);
        if (!success) {
          const message = lastError || 'Registration failed';
          const isDuplicate = message.toLowerCase().includes('already registered') || 
                            message.toLowerCase().includes('duplicate');
          toast({
            title: isDuplicate ? 'Account Already Exists' : 'Registration Failed',
            description: isDuplicate ? 
              'This email is already registered. Please login or use a different email.' : 
              message,
            variant: 'destructive',
            duration: 5000
          });
          if (import.meta.env.VITE_DEBUG === '1') {
            console.debug('[SIGNUP_FAIL]', { email: normalizedEmail, lastError, isDuplicate });
          }
          return;
        }
      }
      
      if (success) {
        toast({
          title: "Success",
          description: isLogin ? "Welcome back!" : "Account created successfully!",
          duration: 3000,
        });
        navigate('/products');
      }
    } catch (error) {
      console.error('[AUTH_SUBMIT_ERROR]', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Something went wrong. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-4 mb-8 select-none">
          <div className="h-16 w-16 rounded-full overflow-hidden ring-1 ring-white/20 shadow-sm transition-transform duration-300">
            <img
              src={logoImg}
              alt="Logo"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            thrift earth
          </h1>
        </div>

        <Card className="backdrop-blur-md bg-card/80 border border-border/50 shadow-strong">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-light">
              {isLogin ? 'Welcome Back' : 'Join Thrift Earth'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Create an account to start buying and selling'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your display name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar (optional)</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center overflow-hidden border border-border ring-1 ring-white/10 relative">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="avatar preview"
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : name.trim() ? (
                        <div className="w-full h-full flex items-center justify-center bg-red-500 text-white font-semibold text-lg select-none">
                          {initials}
                        </div>
                      ) : (
                        <img
                          src={DEFAULT_AVATAR_URL}
                          alt="default avatar"
                          className="w-full h-full object-cover opacity-80"
                          draggable={false}
                        />
                      )}
                    </div>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                          const reader = new FileReader();
                          reader.onload = () => setAvatarPreview(reader.result);
                          reader.readAsDataURL(file);
                        } else {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }
                      }}
                      className="bg-background/50"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};