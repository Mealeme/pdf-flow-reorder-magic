import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Shield,
  Zap,
  Users,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Heart,
  CheckCircle,
  Star,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TypewriterEffect from "@/components/TypewriterEffect";
import FloatingParticlesBackground, { GravityParticlesBackground } from "@/components/ParticlesBackground";
import ThreeDCube from "@/components/ThreeDCube";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const FooterInfo = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Load profile photo from API
  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (user?.userId) {
        try {
          const res = await fetch(`/api/profile/get/${user.userId}`);
          const profile = await res.json();
          if (profile?.photoUrl) {
            setPhotoUrl(profile.photoUrl);
          }
        } catch (error) {
          console.error('Error loading profile photo:', error);
        }
      }
    };

    loadProfilePhoto();

    // Listen for photo update events
    const handlePhotoUpdate = (event: CustomEvent) => {
      setPhotoUrl(event.detail);
    };

    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate as EventListener);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate as EventListener);
    };
  }, [user?.userId]);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <FloatingParticlesBackground />
      <ThreeDCube />
      <Navigation onMenuClick={handleToggleMobileMenu} />
      
      <main className="flex-grow p-4 md:p-8 relative" style={{ zIndex: 10 }}>
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
              <TypewriterEffect
                text="About NewMicro"
                speed={80}
                className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent"
                cursorClassName="text-blue-600 dark:text-blue-400"
              />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Learn more about our mission, services, and commitment to providing free, high-quality PDF tools for everyone.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden glow-border-blue">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">🎯 Our Mission</CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Democratizing PDF tools for everyone
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                We believe that powerful PDF tools should be accessible to everyone, regardless of their budget.
                Our platform was built with the community in mind, offering professional-grade PDF manipulation
                capabilities completely free of charge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">Community First</h3>
                  <p className="text-green-700 dark:text-green-300">Built for users, by users, with love for the community.</p>
                </div>
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-2">Lightning Fast</h3>
                  <p className="text-blue-700 dark:text-blue-300">Optimized algorithms for quick and efficient processing.</p>
                </div>
                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-2">Privacy Focused</h3>
                  <p className="text-purple-700 dark:text-purple-300">Your files never leave your device. Complete privacy guaranteed.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">🛠️ Our Complete Tool Suite</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover all the powerful PDF tools we offer completely free
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm glow-border">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-800 dark:text-white">PDF Reordering</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Intelligent page reordering with custom sequences</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Free
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm glow-border">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-800 dark:text-white">PDF Compression</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Reduce file size while maintaining quality</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Free
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm glow-border">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-800 dark:text-white">PDF to World</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Convert PDFs to various world formats</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Free
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm glow-border">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-800 dark:text-white">Photo to Image</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Convert photos to various image formats</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Free
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden glow-border-blue">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">✨ Why Choose Us?</CardTitle>
              <CardDescription className="text-indigo-100 text-lg">
                The advantages that make us stand out
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">100% Free Forever</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">No hidden costs, no premium features, no subscriptions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Unlimited Usage</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Process as many files as you need, whenever you need them</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">No File Size Limits</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Handle documents of any size with our powerful engine</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Privacy First</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Your files never leave your device, complete privacy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Modern Technology</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Built with the latest web technologies for best performance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Community Driven</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Features and improvements based on user feedback</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Testimonials Section */}
          <div className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-600 glow-border">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">What Our Users Say</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              "This tool has saved me hours of work. The PDF reordering feature is incredibly intuitive and fast!"
            </p>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">- Nikhil Kadam</p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm" onClick={handleToggleMobileMenu}>
          <GravityParticlesBackground isMobileMenu={true} />
          <div className="bg-gray-800/95 backdrop-blur-md w-80 h-full p-6 rounded-r-3xl shadow-2xl flex flex-col relative z-20" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Menu</h2>
              <button
                onClick={handleToggleMobileMenu}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <ul className="space-y-4 pb-4">
                {/* All Navigation Items */}
                <li>
                  <button
                    onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                    className="group relative block w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl border-2 border-blue-200 font-medium text-left hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">PDF Reordering</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/photo-to-image'); setIsMobileMenuOpen(false); }}
                    className="group relative block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 font-medium text-left hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Photo to PDF</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/pdf-compress'); setIsMobileMenuOpen(false); }}
                    className="group relative block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 font-medium text-left hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">PDF Compression</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/pdf-to-world'); setIsMobileMenuOpen(false); }}
                    className="group relative block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 font-medium text-left hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">PDF to Text</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }}
                    className="group relative block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 font-medium text-left hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Pricing</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/footer-info'); setIsMobileMenuOpen(false); }}
                    className="group relative block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 font-medium text-left hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">About Us</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/footer-info'); setIsMobileMenuOpen(false); }}
                    className="group relative block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 font-medium text-left hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Contact & Support</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/privacy-policy'); setIsMobileMenuOpen(false); }}
                    className="group relative block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 font-medium text-left hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Privacy Policy</span>
                  </button>
                </li>

                {/* Account Section */}
                {isAuthenticated ? (
                  <>
                    <li className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-blue-200">
                            <img
                              src="/favicon.svg"
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="truncate">My Profile</span>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="block w-full py-3 px-4 hover:bg-red-50 hover:text-red-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign Out
                        </div>
                      </button>
                    </li>
                  </>
                ) : (
                 <li className="pt-4 border-t border-gray-200">
                   <button
                     onClick={() => {
                       navigate('/login');
                       setIsMobileMenuOpen(false);
                     }}
                     className="group relative block w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl border-2 border-blue-200 font-medium hover:scale-105 transition-all duration-300 overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                     <div className="flex items-center relative z-10 transition-colors duration-300 group-hover:text-white">
                       <FileText className="mr-3 h-4 w-4 transition-colors duration-300 group-hover:text-white" />
                       <span className="transition-colors duration-300 group-hover:text-white">Sign In</span>
                     </div>
                   </button>
                 </li>
               )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterInfo;
