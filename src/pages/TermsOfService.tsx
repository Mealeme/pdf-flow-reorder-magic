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
              <CardTitle className="text-2xl font-bold mb-2">📋 Terms of Service</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Last updated September 20, 2025
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Agreement to Legal Terms */}
                <ScrollColorText colors={['text-gray-300', 'text-blue-400', 'text-indigo-400', 'text-purple-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                      Agreement to Our Legal Terms
                    </h3>
                    <p className="leading-relaxed mb-4">
                      We are NewMicro ("Company," "we," "us," "our"), a company registered in India at Amrut Garden, Ashok Nagar Nashik, 422008, Nashik, Maharastra 422008.
                    </p>
                    <p className="leading-relaxed mb-4">
                      We operate the website https://newmicro.live (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
                    </p>
                    <p className="leading-relaxed mb-4">
                      These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and NewMicro, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. <strong>IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</strong>
                    </p>
                  </section>
                </ScrollColorText>

                {/* Table of Contents */}
                <ScrollColorText colors={['text-gray-300', 'text-cyan-400', 'text-teal-400', 'text-green-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-600" />
                      Table of Contents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Our Services</li>
                          <li>Intellectual Property Rights</li>
                          <li>User Representations</li>
                          <li>User Registration</li>
                          <li>Products</li>
                          <li>Purchases and Payment</li>
                          <li>Subscriptions</li>
                          <li>Refunds Policy</li>
                          <li>Prohibited Activities</li>
                          <li>User Generated Contributions</li>
                          <li>Contribution License</li>
                          <li>Services Management</li>
                          <li>Privacy Policy</li>
                        </ol>
                      </div>
                      <div>
                        <ol className="list-decimal list-inside space-y-1" start={14}>
                          <li>Term and Termination</li>
                          <li>Modifications and Interruptions</li>
                          <li>Governing Law</li>
                          <li>Dispute Resolution</li>
                          <li>Corrections</li>
                          <li>Disclaimer</li>
                          <li>Limitations of Liability</li>
                          <li>Indemnification</li>
                          <li>User Data</li>
                          <li>Electronic Communications</li>
                          <li>Miscellaneous</li>
                          <li>Contact Us</li>
                        </ol>
                      </div>
                    </div>
                  </section>
                </ScrollColorText>

                {/* 1. Our Services */}
                <ScrollColorText colors={['text-gray-300', 'text-emerald-400', 'text-lime-400', 'text-green-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">1. Our Services</h3>
                    <p className="leading-relaxed">
                      The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
                    </p>
                  </section>
                </ScrollColorText>

                {/* 2. Intellectual Property Rights */}
                <ScrollColorText colors={['text-gray-300', 'text-violet-400', 'text-purple-400', 'text-fuchsia-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">2. Intellectual Property Rights</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-violet-300">Our Intellectual Property</h4>
                        <p className="leading-relaxed mb-4">
                          We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
                        </p>
                        <p className="leading-relaxed mb-4">
                          Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties around the world. The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use only.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-purple-300">Your Use of Our Services</h4>
                        <p className="leading-relaxed mb-4">
                          Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                          <li>access the Services; and</li>
                          <li>download or print a copy of any portion of the Content to which you have properly gained access,</li>
                        </ul>
                        <p className="leading-relaxed">
                          solely for your personal, non-commercial use.
                        </p>
                      </div>
                    </div>
                  </section>
                </ScrollColorText>

                {/* 3. User Representations */}
                <ScrollColorText colors={['text-gray-300', 'text-rose-400', 'text-pink-400', 'text-red-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">3. User Representations</h3>
                    <p className="leading-relaxed mb-4">
                      By using the Services, you represent and warrant that:
                    </p>
                    <ul className="list-decimal list-inside space-y-2 ml-4">
                      <li>all registration information you submit will be true, accurate, current, and complete</li>
                      <li>you will maintain the accuracy of such information and promptly update such registration information as necessary</li>
                      <li>you have the legal capacity and you agree to comply with these Legal Terms</li>
                      <li>you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Services</li>
                      <li>you will not access the Services through automated or non-human means, whether through a bot, script or otherwise</li>
                      <li>you will not use the Services for any illegal or unauthorized purpose</li>
                      <li>your use of the Services will not violate any applicable law or regulation</li>
                    </ul>
                  </section>
                </ScrollColorText>

                {/* 4. User Registration */}
                <ScrollColorText colors={['text-gray-300', 'text-slate-400', 'text-zinc-400', 'text-stone-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">4. User Registration</h3>
                    <p className="leading-relaxed">
                      You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                    </p>
                  </section>
                </ScrollColorText>

                {/* 5. Products & 6. Purchases and Payment */}
                <ScrollColorText colors={['text-gray-300', 'text-yellow-400', 'text-orange-400', 'text-amber-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">5. Products & 6. Purchases and Payment</h3>
                    <div className="space-y-4">
                      <p className="leading-relaxed">
                        All products are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
                      </p>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-yellow-300">Payment Methods</h4>
                        <p className="leading-relaxed mb-2">We accept the following forms of payment:</p>
                        <ul className="list-disc list-inside ml-4">
                          <li>Razorpay Payment Gateway</li>
                        </ul>
                      </div>
                      <p className="leading-relaxed">
                        You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. All payments shall be in INR. Sales tax will be added to the price of purchases as deemed required by us.
                      </p>
                    </div>
                  </section>
                </ScrollColorText>

                {/* 7. Subscriptions & 8. Refunds Policy */}
                <ScrollColorText colors={['text-gray-300', 'text-indigo-400', 'text-blue-400', 'text-cyan-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">7. Subscriptions & 8. Refunds Policy</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-indigo-300">Billing and Renewal</h4>
                        <p className="leading-relaxed text-red-400 font-medium">No refund will be issued.</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-blue-300">Free Trial</h4>
                        <p className="leading-relaxed">
                          We offer a 1-day free trial to new users who register with the Services. The account will be charged according to the user's chosen subscription at the end of the free trial.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-cyan-300">Cancellation</h4>
                        <p className="leading-relaxed">
                          You can cancel your subscription at any time by contacting us using the contact information provided below. Your cancellation will take effect at the end of the current paid term.
                        </p>
                      </div>
                      <div className="bg-red-900/30 p-4 rounded-xl border border-red-800/50">
                        <h4 className="text-lg font-medium mb-2 text-red-300">Refunds Policy</h4>
                        <p className="leading-relaxed text-red-200">
                          All sales are final and no refund will be issued.
                        </p>
                      </div>
                    </div>
                  </section>
                </ScrollColorText>

                {/* 9. Prohibited Activities */}
                <ScrollColorText colors={['text-gray-700', 'text-orange-700', 'text-amber-700', 'text-yellow-700']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                      9. Prohibited Activities
                    </h3>
                    <p className="leading-relaxed mb-4">
                      You may not access or use the Services for any purpose other than that for which we make the Services available. As a user of the Services, you agree not to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Systematically retrieve data or other content from the Services to create or compile a collection, compilation, database, or directory without written permission from us</li>
                      <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords</li>
                      <li>Circumvent, disable, or otherwise interfere with security-related features of the Services</li>
                      <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services</li>
                      <li>Use any information obtained from the Services in order to harass, abuse, or harm another person</li>
                      <li>Make improper use of our support services or submit false reports of abuse or misconduct</li>
                      <li>Use the Services in a manner inconsistent with any applicable laws or regulations</li>
                      <li>Engage in unauthorized framing of or linking to the Services</li>
                      <li>Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the Services</li>
                      <li>Engage in any automated use of the system, such as using scripts to send comments or messages</li>
                      <li>Delete the copyright or other proprietary rights notice from any Content</li>
                      <li>Attempt to impersonate another user or person or use the username of another user</li>
                      <li>Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services</li>
                      <li>Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code</li>
                      <li>Use the Services as part of any effort to compete with us or otherwise use the Services for any revenue-generating endeavor or commercial enterprise</li>
                    </ul>
                  </section>
                </ScrollColorText>

                {/* 10-13. Additional Sections */}
                <ScrollColorText colors={['text-gray-300', 'text-teal-400', 'text-emerald-400', 'text-green-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">10-13. User Contributions, License, Services Management & Privacy</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-teal-300">User Generated Contributions</h4>
                        <p className="leading-relaxed text-sm">
                          The Services does not offer users to submit or post content. When you create or make available any Contributions, you represent and warrant that your Contributions do not violate any third party rights and comply with all applicable laws.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-emerald-300">Services Management</h4>
                        <p className="leading-relaxed text-sm">
                          We reserve the right, but not the obligation, to monitor the Services for violations of these Legal Terms and take appropriate legal action against anyone who violates these terms.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-green-300">Privacy Policy</h4>
                        <p className="leading-relaxed text-sm">
                          We care about data privacy and security. Please review our Privacy Policy: <a href="https://newmicro.live/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">https://newmicro.live/privacy-policy</a>. The Services are hosted in India.
                        </p>
                      </div>
                    </div>
                  </section>
                </ScrollColorText>

                {/* 14-17. Terms, Modifications, Governing Law, Dispute Resolution */}
                <ScrollColorText colors={['text-gray-300', 'text-purple-400', 'text-violet-400', 'text-indigo-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">14-17. Termination, Modifications, Governing Law & Disputes</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-purple-300">Term and Termination</h4>
                        <p className="leading-relaxed text-sm">
                          These Legal Terms shall remain in full force and effect while you use the Services. We reserve the right to deny access to and use of the Services to any person for any reason or for no reason, including for breach of any representation, warranty, or covenant contained in these Legal Terms.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-violet-300">Modifications and Interruptions</h4>
                        <p className="leading-relaxed text-sm">
                          We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We cannot guarantee the Services will be available at all times.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-indigo-300">Governing Law</h4>
                        <p className="leading-relaxed text-sm">
                          These Legal Terms shall be governed by and defined following the laws of India. NewMicro and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
                        </p>
                      </div>
                    </div>
                  </section>
                </ScrollColorText>

                {/* 18-21. Corrections, Disclaimer, Limitations, Indemnification */}
                <ScrollColorText colors={['text-gray-300', 'text-red-400', 'text-orange-400', 'text-yellow-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">18-21. Corrections, Disclaimer, Limitations & Indemnification</h3>
                    <div className="space-y-4">
                      <div className="bg-red-900/30 p-4 rounded-xl border border-red-800/50">
                        <h4 className="text-lg font-medium mb-2 text-red-300">Disclaimer</h4>
                        <p className="leading-relaxed text-sm text-red-200">
                          THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES.
                        </p>
                      </div>
                      <div className="bg-orange-900/30 p-4 rounded-xl border border-orange-800/50">
                        <h4 className="text-lg font-medium mb-2 text-orange-300">Limitations of Liability</h4>
                        <p className="leading-relaxed text-sm text-orange-200">
                          IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICES.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-yellow-300">Indemnification</h4>
                        <p className="leading-relaxed text-sm">
                          You agree to defend, indemnify, and hold us harmless from and against any loss, damage, liability, claim, or demand made by any third party due to or arising out of your use of the Services or breach of these Legal Terms.
                        </p>
                      </div>
                    </div>
                  </section>
                </ScrollColorText>

                {/* 22-25. Final Sections */}
                <ScrollColorText colors={['text-gray-300', 'text-blue-400', 'text-cyan-400', 'text-teal-400']}>
                  <section>
                    <h3 className="text-xl font-semibold mb-4">22-25. User Data, Electronic Communications & Contact</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-blue-300">User Data</h4>
                        <p className="leading-relaxed text-sm">
                          We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services. You are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-cyan-300">Electronic Communications</h4>
                        <p className="leading-relaxed text-sm">
                          Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications and agree that all agreements, notices, disclosures, and other communications satisfy any legal requirement that such communication be in writing.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2 text-teal-300">Contact Us</h4>
                        <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                          <p className="text-sm">
                            <strong>NewMicro</strong><br />
                            Amrut Garden, Ashok Nagar Nashik, 422008<br />
                            Nashik, Maharastra 422008, India<br />
                            <strong>Email:</strong> <span className="text-blue-300">newmicroofficial@gmail.com</span>
                          </p>
                        </div>
                      </div>
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
