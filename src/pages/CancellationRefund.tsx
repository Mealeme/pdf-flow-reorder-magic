import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TypewriterEffect from "@/components/TypewriterEffect";
import FloatingParticlesBackground from "@/components/ParticlesBackground";
import ScrollColorText from "@/components/ScrollColorText";
import { RotateCcw, Clock, AlertCircle, CheckCircle, ExternalLink, Menu, X, LogOut, User, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ThreeDCube from "@/components/ThreeDCube";

const CancellationRefund = () => {
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <FloatingParticlesBackground />
      <ThreeDCube />
      <Navigation onMenuClick={handleToggleMobileMenu} />
      
      <main className="flex-grow p-4 md:p-8 relative" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-xl hover:scale-110 hover:rotate-6 hover:shadow-2xl transition-all duration-500 ease-out group">
              <RotateCcw className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent mb-4">
              <TypewriterEffect
                text="Cancellation & Refund Policy"
                speed={80}
                className="bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent"
                cursorClassName="text-green-600"
              />
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Last updated on Sep 14 2024
            </p>
          </div>

          {/* Main Content */}
          <Card className="shadow-2xl border-0 bg-gray-800/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden hover:shadow-3xl transition-all duration-500 ease-out glow-border">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">Our Policy</CardTitle>
              <p className="text-green-100 text-lg">
                NIKHIL BABASAHEB KADAM believes in helping its customers as far as possible
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Policy Overview */}
                <ScrollColorText colors={['text-gray-300', 'text-green-400', 'text-emerald-400', 'text-teal-400']}>
                  <div className="bg-green-900/30 p-6 rounded-2xl border border-green-800/50">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-green-200">
                      <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                      Liberal Cancellation Policy
                    </h3>
                    <p className="leading-relaxed text-gray-300">
                      We have a liberal cancellation policy designed to help our customers. Under this policy, we consider cancellation requests within a reasonable timeframe and provide refunds when appropriate.
                    </p>
                  </div>
                </ScrollColorText>

                {/* Cancellation Terms */}
                <ScrollColorText colors={['text-gray-300', 'text-blue-400', 'text-indigo-400', 'text-purple-400']}>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Cancellation Terms</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>Cancellations will be considered only if the request is made within <strong>2-3 days</strong> of placing the order.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</span>
                      </li>
                    </ul>
                  </div>
                </ScrollColorText>

                {/* Perishable Items */}
                <ScrollColorText colors={['text-gray-300', 'text-orange-400', 'text-amber-400', 'text-yellow-400']}>
                  <div className="bg-amber-900/30 p-6 rounded-2xl border border-amber-800/50">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-amber-200">
                      <AlertCircle className="w-6 h-6 mr-3 text-amber-400" />
                      Perishable Items
                    </h3>
                    <p className="leading-relaxed text-gray-300">
                      NIKHIL BABASAHEB KADAM does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                    </p>
                  </div>
                </ScrollColorText>

                {/* Damaged or Defective Items */}
                <ScrollColorText colors={['text-gray-300', 'text-cyan-400', 'text-teal-400', 'text-green-400']}>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Damaged or Defective Items</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>In case of receipt of damaged or defective items please report the same to our Customer Service team.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>The request will, however, be entertained once the merchant has checked and determined the same at his own end.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>This should be reported within <strong>2-3 days</strong> of receipt of the products.</span>
                      </li>
                    </ul>
                  </div>
                </ScrollColorText>

                {/* Product Quality Issues */}
                <ScrollColorText colors={['text-gray-300', 'text-violet-400', 'text-purple-400', 'text-fuchsia-400']}>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Product Quality Issues</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <strong>2-3 days</strong> of receiving the product.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>The Customer Service Team after looking into your complaint will take an appropriate decision.</span>
                      </li>
                    </ul>
                  </div>
                </ScrollColorText>

                {/* Warranty Items */}
                <ScrollColorText colors={['text-gray-300', 'text-rose-400', 'text-pink-400', 'text-red-400']}>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Warranty Items</h3>
                    <p className="leading-relaxed">
                      In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
                    </p>
                  </div>
                </ScrollColorText>

                {/* Refund Processing */}
                <ScrollColorText colors={['text-gray-300', 'text-slate-400', 'text-zinc-400', 'text-stone-400']}>
                  <div className="bg-blue-900/30 p-6 rounded-2xl border border-blue-800/50">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-200">
                      <Clock className="w-6 h-6 mr-3 text-blue-400" />
                      Refund Processing Time
                    </h3>
                    <p className="leading-relaxed text-gray-300">
                      In case of any Refunds approved by the NIKHIL BABASAHEB KADAM, it'll take <strong className="text-blue-300">2-3 days</strong> for the refund to be processed to the end customer.
                    </p>
                  </div>
                </ScrollColorText>

                {/* Important Notes */}
                <ScrollColorText colors={['text-gray-300', 'text-neutral-400', 'text-gray-400', 'text-gray-500']}>
                  <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Important Notes</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-300">All cancellation and refund requests must be made within the specified timeframes.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-300">Customer service decisions are final and binding.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-300">Refund processing times may vary depending on payment method and bank processing.</span>
                      </li>
                    </ul>
                  </div>
                </ScrollColorText>

                {/* Source Reference */}
                <ScrollColorText colors={['text-gray-300', 'text-indigo-400', 'text-blue-400', 'text-cyan-400']}>
                  <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Source</h3>
                    <p className="leading-relaxed text-gray-300">
                      This cancellation and refund policy is based on the policy from{" "}
                      <a
                        href="https://merchant.razorpay.com/policy/OwwrzuH5iAvrxz/refund"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline inline-flex items-center transition-colors duration-200"
                      >
                        Razorpay Merchant Policy <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </p>
                  </div>
                </ScrollColorText>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm" onClick={handleToggleMobileMenu}>
          <div className="bg-gray-800/95 backdrop-blur-md w-80 h-full p-6 rounded-r-3xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
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

export default CancellationRefund;
