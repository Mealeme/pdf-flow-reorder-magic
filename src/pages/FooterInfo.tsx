import React from "react";
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
  Star
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const FooterInfo = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation onMenuClick={() => {}} />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
              About NewMicro
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learn more about our mission, services, and commitment to providing free, high-quality PDF tools for everyone.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">🎯 Our Mission</CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Democratizing PDF tools for everyone
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We believe that powerful PDF tools should be accessible to everyone, regardless of their budget. 
                Our platform was built with the community in mind, offering professional-grade PDF manipulation 
                capabilities completely free of charge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-2xl">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Community First</h3>
                  <p className="text-green-700">Built for users, by users, with love for the community.</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-2xl">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Lightning Fast</h3>
                  <p className="text-blue-700">Optimized algorithms for quick and efficient processing.</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-2xl">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Privacy Focused</h3>
                  <p className="text-purple-700">Your files never leave your device. Complete privacy guaranteed.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🛠️ Our Complete Tool Suite</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover all the powerful PDF tools we offer completely free
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">PDF Reordering</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 text-sm">Intelligent page reordering with custom sequences</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Free
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">PDF Compression</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 text-sm">Reduce file size while maintaining quality</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Free
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">PDF to World</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 text-sm">Convert PDFs to various world formats</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Free
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Photo to Image</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 text-sm">Convert photos to various image formats</p>
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
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden">
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
                      <h4 className="font-semibold text-gray-800">100% Free Forever</h4>
                      <p className="text-gray-600 text-sm">No hidden costs, no premium features, no subscriptions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Unlimited Usage</h4>
                      <p className="text-gray-600 text-sm">Process as many files as you need, whenever you need them</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">No File Size Limits</h4>
                      <p className="text-gray-600 text-sm">Handle documents of any size with our powerful engine</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Privacy First</h4>
                      <p className="text-gray-600 text-sm">Your files never leave your device, complete privacy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Modern Technology</h4>
                      <p className="text-gray-600 text-sm">Built with the latest web technologies for best performance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Community Driven</h4>
                      <p className="text-gray-600 text-sm">Features and improvements based on user feedback</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">📞 Get in Touch</CardTitle>
              <CardDescription className="text-gray-100 text-lg">
                We'd love to hear from you
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                                                              <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                         <Mail className="h-5 w-5 text-blue-600" />
                       </div>
                       <div>
                         <p className="font-medium text-gray-800">Email</p>
                         <p className="text-gray-600">newmicroofficial@gmail.com</p>
                       </div>
                     </div>
                                           <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Globe className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Website</p>
                          <p className="text-gray-600">www.newmicro.live</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Github className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">GitHub</p>
                          <p className="text-gray-600">github.com/newmicro</p>
                        </div>
                      </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/photo-to-image'}
                    >
                      🖼️ Try Photo to Image
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/pdf-compress'}
                    >
                      📦 Try PDF Compression
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/pdf-to-world'}
                    >
                      🌍 Try PDF to World
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/'}
                    >
                      🏠 Back to Home
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials Section */}
          <div className="text-center bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">What Our Users Say</h3>
            <p className="text-gray-600 mb-6">
              "This tool has saved me hours of work. The PDF reordering feature is incredibly intuitive and fast!"
            </p>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
                         <p className="text-sm text-gray-500 mt-2">- Nikhil Kadam</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FooterInfo;
