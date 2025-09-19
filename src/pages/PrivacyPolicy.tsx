import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, FileText, ArrowLeft, Menu, X, LogOut, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TypewriterEffect from "@/components/TypewriterEffect";
import FloatingParticlesBackground, { GravityParticlesBackground } from "@/components/ParticlesBackground";
import ScrollColorText from "@/components/ScrollColorText";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ThreeDCube from "@/components/ThreeDCube";

const PrivacyPolicy = () => {
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent mb-4">
              <TypewriterEffect
                text="Privacy Policy"
                speed={80}
                className="bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent"
                cursorClassName="text-green-600"
              />
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your privacy is our top priority. Learn how we protect your data and ensure complete confidentiality.
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Privacy Policy Content */}
          <Card className="shadow-2xl border-0 bg-gray-800/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden glow-border">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">🔒 Data Privacy & Security</CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Last updated: December 2024
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <div className="space-y-8">
                <ScrollColorText colors={['text-gray-300', 'text-blue-400', 'text-purple-400', 'text-green-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Lock className="mr-2 h-5 w-5 text-green-600" />
                      No Data Collection
                    </h3>
                    <p className="leading-relaxed mb-4">
                      We want to be completely transparent: <strong>we do not collect, store, or process any of your personal data or files</strong>.
                      All PDF processing happens entirely in your browser on your device.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Your files never leave your computer or device</li>
                      <li>No file uploads to our servers</li>
                      <li>No personal information is collected</li>
                      <li>No tracking cookies or analytics</li>
                    </ul>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-indigo-400', 'text-pink-400', 'text-red-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Eye className="mr-2 h-5 w-5 text-blue-600" />
                      How It Works
                    </h3>
                    <p className="leading-relaxed mb-4">
                      Our tools use client-side processing, which means:
                    </p>
                    <div className="bg-blue-900/30 p-6 rounded-2xl border border-blue-800/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-gray-800/60 rounded-xl border border-blue-700/50 hover:bg-gray-700/60 transition-colors duration-300">
                          <div className="w-12 h-12 bg-blue-600/40 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-300 font-bold text-lg">1</span>
                          </div>
                          <p className="text-sm font-medium text-blue-200">Upload File</p>
                          <p className="text-xs text-blue-300 mt-1">File stays on your device</p>
                        </div>
                        <div className="p-4 bg-gray-800/60 rounded-xl border border-blue-700/50 hover:bg-gray-700/60 transition-colors duration-300">
                          <div className="w-12 h-12 bg-blue-600/40 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-300 font-bold text-lg">2</span>
                          </div>
                          <p className="text-sm font-medium text-blue-200">Process Locally</p>
                          <p className="text-xs text-blue-300 mt-1">All processing in browser</p>
                        </div>
                        <div className="p-4 bg-gray-800/60 rounded-xl border border-blue-700/50 hover:bg-gray-700/60 transition-colors duration-300">
                          <div className="w-12 h-12 bg-blue-600/40 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-300 font-bold text-lg">3</span>
                          </div>
                          <p className="text-sm font-medium text-blue-200">Download Result</p>
                          <p className="text-xs text-blue-300 mt-1">File never sent to us</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-teal-400', 'text-cyan-400', 'text-blue-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-purple-600" />
                      Security Measures
                    </h3>
                    <p className="leading-relaxed mb-4">
                      We implement several security measures to protect your privacy:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>HTTPS Encryption:</strong> All data transmission is encrypted using industry-standard SSL/TLS</li>
                      <li><strong>Client-Side Processing:</strong> No server-side file handling or storage</li>
                      <li><strong>No Cookies:</strong> We don't use tracking cookies or store session data</li>
                      <li><strong>Open Source:</strong> Our code is transparent and can be reviewed by anyone</li>
                    </ul>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-orange-400', 'text-amber-400', 'text-yellow-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-orange-600" />
                      Information We Don't Collect
                    </h3>
                    <div className="bg-red-900/30 p-6 rounded-2xl border border-red-800/50">
                      <p className="text-red-200 font-medium mb-3">We explicitly do NOT collect:</p>
                      <ul className="list-disc list-inside text-red-300 space-y-1 ml-4">
                        <li>Personal identification information (names, emails, addresses)</li>
                        <li>PDF file content or metadata</li>
                        <li>IP addresses or location data</li>
                        <li>Browsing history or usage patterns</li>
                        <li>Device information or browser details</li>
                        <li>Any form of analytics or tracking data</li>
                      </ul>
                    </div>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-emerald-400', 'text-lime-400', 'text-green-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Third-Party Services</h3>
                    <p className="leading-relaxed mb-4">
                      Our service is completely self-contained and doesn't rely on third-party services for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>File processing or conversion</li>
                      <li>Data storage or hosting</li>
                      <li>User analytics or tracking</li>
                      <li>Advertising or marketing</li>
                    </ul>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-violet-400', 'text-purple-400', 'text-fuchsia-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Your Rights</h3>
                    <p className="leading-relaxed mb-4">
                      Since we don't collect any personal data, you have complete control:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>No Data to Access:</strong> There's no personal data stored to request access to</li>
                      <li><strong>No Data to Delete:</strong> No personal information exists to be deleted</li>
                      <li><strong>No Data to Correct:</strong> No personal data is collected that could be incorrect</li>
                      <li><strong>Complete Anonymity:</strong> Use our tools without any identification</li>
                    </ul>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-rose-400', 'text-pink-400', 'text-red-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                    <p className="leading-relaxed mb-4">
                      If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                    </p>
                    <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50">
                      <p className="text-gray-300">
                        <strong className="text-gray-200">Email:</strong> <span className="text-blue-300">privacy@newmicro.com</span><br />
                        <strong className="text-gray-200">Website:</strong> <a href="/footer-info" className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200">Contact & Support Page</a>
                      </p>
                    </div>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-slate-400', 'text-zinc-400', 'text-stone-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Changes to This Policy</h3>
                    <p className="leading-relaxed">
                      We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
                      We encourage you to review this policy periodically.
                    </p>
                  </section>
                </ScrollColorText>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.location.href = '/footer-info'}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                📞 Contact Support
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                🏠 Back to Home
              </Button>
            </div>
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

export default PrivacyPolicy;
