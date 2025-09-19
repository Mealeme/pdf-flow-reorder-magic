import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TypewriterEffect from "@/components/TypewriterEffect";
import FloatingParticlesBackground from "@/components/ParticlesBackground";
import ScrollColorText from "@/components/ScrollColorText";
import { FileText, Shield, AlertTriangle, ExternalLink, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ThreeDCube from "@/components/ThreeDCube";

const TermsAndConditions = () => {
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl hover:scale-110 hover:rotate-6 hover:shadow-2xl transition-all duration-500 ease-out group">
              <FileText className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
              <TypewriterEffect
                text="Terms and Conditions"
                speed={80}
                className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent"
                cursorClassName="text-blue-600"
              />
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Last updated on Sep 14 2025
            </p>
          </div>

          {/* Main Content */}
          <Card className="shadow-2xl border-0 bg-gray-800/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden hover:shadow-3xl transition-all duration-500 ease-out glow-border">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">Legal Terms</CardTitle>
              <p className="text-blue-100 text-lg">
                Please read these terms and conditions carefully before using our services
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Definitions */}
                <ScrollColorText colors={['text-gray-300', 'text-blue-400', 'text-indigo-400', 'text-purple-400']}>
                  <div className="bg-blue-900/30 p-6 rounded-2xl border border-blue-800/50">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-200">
                      <Shield className="w-6 h-6 mr-3 text-blue-400" />
                      Definitions
                    </h3>
                    <p className="leading-relaxed text-gray-300">
                      For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean <strong className="text-blue-300">NIKHIL BABASAHEB KADAM</strong>, whose registered/operational office is sambhajinager maharastra, lakhani Aurangabad MAHARASHTRA 431115. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
                    </p>
                  </div>
                </ScrollColorText>

                {/* General Terms */}
                <ScrollColorText colors={['text-gray-300', 'text-cyan-400', 'text-teal-400', 'text-green-400']}>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">General Terms</h3>
                    <p className="leading-relaxed mb-4">
                      Your use of the website and/or purchase from us are governed by following Terms and Conditions:
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>The content of the pages of this website is subject to change without notice.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</span>
                      </li>
                    </ul>
                  </div>
                </ScrollColorText>

                {/* Intellectual Property */}
                <ScrollColorText colors={['text-gray-300', 'text-emerald-400', 'text-lime-400', 'text-green-400']}>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Intellectual Property</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</span>
                      </li>
                    </ul>
                  </div>
                </ScrollColorText>

                {/* Links and External Content */}
                <ScrollColorText colors={['text-gray-300', 'text-orange-400', 'text-amber-400', 'text-yellow-400']}>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">External Links and Content</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>You may not create a link to our website from another website or document without NIKHIL BABASAHEB KADAM's prior written consent.</span>
                      </li>
                    </ul>
                  </div>
                </ScrollColorText>

                {/* Legal Jurisdiction */}
                <ScrollColorText colors={['text-gray-300', 'text-violet-400', 'text-purple-400', 'text-fuchsia-400']}>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Legal Jurisdiction</h3>
                    <p className="leading-relaxed">
                      Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.
                    </p>
                  </div>
                </ScrollColorText>

                {/* Liability */}
                <ScrollColorText colors={['text-gray-300', 'text-rose-400', 'text-pink-400', 'text-red-400']}>
                  <div className="bg-amber-900/30 p-6 rounded-2xl border border-amber-800/50">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-amber-200">
                      <AlertTriangle className="w-6 h-6 mr-3 text-amber-400" />
                      Limitation of Liability
                    </h3>
                    <p className="leading-relaxed text-gray-300">
                      We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
                    </p>
                  </div>
                </ScrollColorText>

                {/* Source Reference */}
                <ScrollColorText colors={['text-gray-300', 'text-slate-400', 'text-zinc-400', 'text-stone-400']}>
                  <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Source</h3>
                    <p className="leading-relaxed text-gray-300">
                      These terms and conditions are based on the policy from{" "}
                      <a
                        href="https://merchant.razorpay.com/policy/OwwrzuH5iAvrxz/terms"
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

export default TermsAndConditions;
