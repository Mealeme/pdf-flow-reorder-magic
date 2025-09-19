import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, CheckCircle, AlertTriangle, ArrowLeft, FileText, Menu, X, LogOut, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TypewriterEffect from "@/components/TypewriterEffect";
import FloatingParticlesBackground, { GravityParticlesBackground } from "@/components/ParticlesBackground";
import ScrollColorText from "@/components/ScrollColorText";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ThreeDCube from "@/components/ThreeDCube";

const TermsOfService = () => {
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
              <TypewriterEffect
                text="Terms of Service"
                speed={80}
                className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent"
                cursorClassName="text-blue-600"
              />
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using our PDF tools and services.
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

          {/* Terms Content */}
          <Card className="shadow-2xl border-0 bg-gray-800/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden glow-border">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">📋 Terms & Conditions</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Last updated: December 2024
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <div className="space-y-8">
                <ScrollColorText colors={['text-gray-300', 'text-blue-400', 'text-indigo-400', 'text-purple-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                      Acceptance of Terms
                    </h3>
                    <p className="leading-relaxed">
                      By accessing and using NewMicro ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
                      If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-cyan-400', 'text-teal-400', 'text-green-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-600" />
                      Description of Service
                    </h3>
                    <p className="leading-relaxed mb-4">
                      NewMicro provides free, web-based PDF manipulation tools including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>PDF page reordering with custom sequences</li>
                      <li>PDF compression and optimization</li>
                      <li>PDF to various format conversion</li>
                      <li>Photo to image format conversion</li>
                    </ul>
                    <p className="leading-relaxed mt-4">
                      All tools are provided through free or paid plans with no hidden costs or premium features.
                    </p>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-emerald-400', 'text-lime-400', 'text-green-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                      Free Service Commitment
                    </h3>
                    <div className="bg-green-900/30 p-6 rounded-2xl border border-green-800/50">
                      <p className="text-green-200 font-medium mb-3">Our Promise:</p>
                      <ul className="list-disc list-inside text-green-300 space-y-1 ml-4">
                        <li>All features are available through free or paid plans</li>
                        <li>No subscription fees or hidden costs</li>
                        <li>No premium features locked behind paywalls</li>
                        <li>Unlimited usage with no restrictions</li>
                        <li>No file size or page count limits</li>
                      </ul>
                    </div>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-700', 'text-orange-700', 'text-amber-700', 'text-yellow-700']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                      User Responsibilities
                    </h3>
                    <p className="leading-relaxed mb-4">
                      As a user of our service, you agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Use the service only for lawful purposes</li>
                      <li>Not upload files that contain malicious code or viruses</li>
                      <li>Respect intellectual property rights of others</li>
                      <li>Not attempt to reverse engineer or hack the service</li>
                      <li>Not use the service for any commercial exploitation without permission</li>
                    </ul>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-violet-400', 'text-purple-400', 'text-fuchsia-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Privacy & Data</h3>
                    <p className="leading-relaxed mb-4">
                      Your privacy is paramount. Our service operates entirely client-side, meaning:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>No Data Collection:</strong> We do not collect, store, or process any personal information</li>
                      <li><strong>Client-Side Processing:</strong> All file processing happens in your browser</li>
                      <li><strong>No File Storage:</strong> Your files never leave your device</li>
                      <li><strong>No Tracking:</strong> We don't use cookies or tracking technologies</li>
                    </ul>
                    <p className="leading-relaxed mt-4">
                      For detailed information, please review our <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a>.
                    </p>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-rose-400', 'text-pink-400', 'text-red-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Intellectual Property</h3>
                    <p className="leading-relaxed mb-4">
                      The service and its original content, features, and functionality are owned by NewMicro and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                    </p>
                    <p className="leading-relaxed">
                      Users retain full ownership of their uploaded files and processed results.
                    </p>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-slate-400', 'text-zinc-400', 'text-stone-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Limitation of Liability</h3>
                    <p className="leading-relaxed mb-4">
                      In no event shall NewMicro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Your use or inability to use the service</li>
                      <li>Any changes made to the service</li>
                      <li>Any permanent or temporary cessation of the service</li>
                      <li>Deletion, corruption, or failure to store any content</li>
                    </ul>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-neutral-400', 'text-gray-400', 'text-gray-500']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Service Availability</h3>
                    <p className="leading-relaxed mb-4">
                      We strive to maintain high service availability, but we do not guarantee:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Uninterrupted or error-free service</li>
                      <li>Immediate resolution of technical issues</li>
                      <li>Compatibility with all devices or browsers</li>
                      <li>Availability during maintenance periods</li>
                    </ul>
                    <p className="leading-relaxed mt-4">
                      We will make reasonable efforts to notify users of any planned maintenance or service interruptions.
                    </p>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-indigo-400', 'text-blue-400', 'text-cyan-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Modifications to Terms</h3>
                    <p className="leading-relaxed">
                      We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page.
                      Your continued use of the service after any changes constitutes acceptance of the new terms.
                      We encourage you to review these terms periodically.
                    </p>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-teal-400', 'text-emerald-400', 'text-green-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Governing Law</h3>
                    <p className="leading-relaxed">
                      These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which NewMicro operates,
                      without regard to its conflict of law provisions.
                    </p>
                  </section>
                </ScrollColorText>

                <ScrollColorText colors={['text-gray-300', 'text-orange-400', 'text-amber-400', 'text-yellow-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                    <p className="leading-relaxed mb-4">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50">
                      <p className="text-gray-300">
                        <strong className="text-gray-200">Email:</strong> <span className="text-blue-300">legal@newmicro.com</span><br />
                        <strong className="text-gray-200">Website:</strong> <a href="/footer-info" className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200">Contact & Support Page</a>
                      </p>
                    </div>
                  </section>
                </ScrollColorText>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.location.href = '/privacy-policy'}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                🔒 Privacy Policy
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/footer-info'}
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

export default TermsOfService;
