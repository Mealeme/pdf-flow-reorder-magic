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
              <CardTitle className="text-2xl font-bold mb-2">🔒 Privacy Policy</CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Last updated: September 20, 2025
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <div className="space-y-8 text-gray-300 leading-relaxed">
                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">AGREEMENT TO OUR LEGAL TERMS</h3>
                  <p className="mb-4">
                    We are NewMicro ("Company," "we," "us," "our"), a company registered in India at Amrut Garden, Ashok Nagar Nashik, 422008, Nashik, Maharastra 422008.
                  </p>
                  <p className="mb-4">
                    We operate the website <a href="https://newmicro.live" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">https://newmicro.live</a> (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
                  </p>
                  <p className="mb-4">
                    You can contact us by email at <a href="mailto:newmicroofficial@gmail.com" className="text-blue-400 hover:text-blue-300 underline">newmicroofficial@gmail.com</a> or by mail to Amrut Garden, Ashok Nagar Nashik, 422008, Nashik, Maharastra 422008, India.
                  </p>
                  <p className="mb-4">
                    These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and NewMicro, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. <strong>IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</strong>
                  </p>
                  <p className="mb-4">
                    Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.
                  </p>
                  <p className="mb-4">
                    All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services. If you are a minor, you must have your parent or guardian read and agree to these Legal Terms prior to you using the Services.
                  </p>
                  <p>
                    We recommend that you print a copy of these Legal Terms for your records.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">TABLE OF CONTENTS</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                    <li>OUR SERVICES</li>
                    <li>INTELLECTUAL PROPERTY RIGHTS</li>
                    <li>USER REPRESENTATIONS</li>
                    <li>USER REGISTRATION</li>
                    <li>PRODUCTS</li>
                    <li>PURCHASES AND PAYMENT</li>
                    <li>SUBSCRIPTIONS</li>
                    <li>REFUNDS POLICY</li>
                    <li>SOFTWARE</li>
                    <li>PROHIBITED ACTIVITIES</li>
                    <li>USER GENERATED CONTRIBUTIONS</li>
                    <li>CONTRIBUTION LICENSE</li>
                    <li>SERVICES MANAGEMENT</li>
                    <li>PRIVACY POLICY</li>
                    <li>TERM AND TERMINATION</li>
                    <li>MODIFICATIONS AND INTERRUPTIONS</li>
                    <li>GOVERNING LAW</li>
                    <li>DISPUTE RESOLUTION</li>
                    <li>CORRECTIONS</li>
                    <li>DISCLAIMER</li>
                    <li>LIMITATIONS OF LIABILITY</li>
                    <li>INDEMNIFICATION</li>
                    <li>USER DATA</li>
                    <li>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</li>
                    <li>MISCELLANEOUS</li>
                    <li>CONTACT US</li>
                  </ol>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">1. OUR SERVICES</h3>
                  <p>
                    The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">2. INTELLECTUAL PROPERTY RIGHTS</h3>
                  <p className="mb-4"><strong>Our intellectual property</strong></p>
                  <p className="mb-4">
                    We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
                  </p>
                  <p className="mb-4">
                    Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties around the world.
                  </p>
                  <p className="mb-4">
                    The Content and Marks are provided in or through the Services "AS IS" for your internal business purpose only.
                  </p>
                  <p className="mb-4"><strong>Your use of our Services</strong></p>
                  <p className="mb-4">
                    Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                    <li>access the Services; and</li>
                    <li>download or print a copy of any portion of the Content to which you have properly gained access, solely for your internal business purpose.</li>
                  </ul>
                  <p className="mb-4">
                    Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                  </p>
                  <p className="mb-4">
                    If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: <a href="mailto:newmicroofficial@gmail.com" className="text-blue-400 hover:text-blue-300 underline">newmicroofficial@gmail.com</a>. If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.
                  </p>
                  <p className="mb-4">
                    We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.
                  </p>
                  <p className="mb-4"><strong>Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.</strong></p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">6. PURCHASES AND PAYMENT</h3>
                  <p className="mb-4">
                    We accept the following forms of payment:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                    <li>Razorpay Payment Gateway</li>
                  </ul>
                  <p className="mb-4">
                    You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in INR.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">7. SUBSCRIPTIONS</h3>
                  <p className="mb-4"><strong>Free Trial</strong></p>
                  <p className="mb-4">
                    We offer a 30-day free trial to new users who register with the Services. The account will be charged according to the user's chosen subscription at the end of the free trial.
                  </p>
                  <p className="mb-4"><strong>Cancellation</strong></p>
                  <p className="mb-4">
                    You can cancel your subscription at any time by contacting us using the contact information provided below. Your cancellation will take effect at the end of the current paid term. If you have any questions or are unsatisfied with our Services, please email us at <a href="mailto:newmicroofficial@gmail.com" className="text-blue-400 hover:text-blue-300 underline">newmicroofficial@gmail.com</a>.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">8. REFUNDS POLICY</h3>
                  <p>
                    All sales are final and no refund will be issued.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">14. PRIVACY POLICY</h3>
                  <p>
                    We care about data privacy and security. Please review our Privacy Policy: <a href="https://newmicro.live/privacy-policy" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">https://newmicro.live/privacy-policy</a>. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in India. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in India, then through your continued use of the Services, you are transferring your data to India, and you expressly consent to have your data transferred to and processed in India.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">17. GOVERNING LAW</h3>
                  <p>
                    These Legal Terms shall be governed by and defined following the laws of India. NewMicro and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">20. DISCLAIMER</h3>
                  <p>
                    THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">21. LIMITATIONS OF LIABILITY</h3>
                  <p>
                    IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">26. CONTACT US</h3>
                  <p className="mb-4">
                    In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
                  </p>
                  <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50">
                    <p className="text-gray-300">
                      <strong className="text-gray-200">NewMicro</strong><br />
                      Amrut Garden, Ashok Nagar Nashik, 422008<br />
                      Nashik, Maharastra 422008<br />
                      India<br />
                      <a href="mailto:newmicroofficial@gmail.com" className="text-blue-400 hover:text-blue-300 underline">newmicroofficial@gmail.com</a>
                    </p>
                  </div>
                </section>
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
