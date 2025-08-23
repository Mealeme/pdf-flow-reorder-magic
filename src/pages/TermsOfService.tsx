import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, CheckCircle, AlertTriangle, ArrowLeft, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation onMenuClick={() => {}} />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">📋 Terms & Conditions</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Last updated: December 2024
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <div className="space-y-8 text-gray-700">
                
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                    Acceptance of Terms
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    By accessing and using NewMicro ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Description of Service
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    NewMicro provides free, web-based PDF manipulation tools including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>PDF page reordering with custom sequences</li>
                    <li>PDF compression and optimization</li>
                    <li>PDF to various format conversion</li>
                    <li>Photo to image format conversion</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    All tools are provided free of charge with no hidden costs or premium features.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                    Free Service Commitment
                  </h3>
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                    <p className="text-green-800 font-medium mb-3">Our Promise:</p>
                    <ul className="list-disc list-inside text-green-700 space-y-1 ml-4">
                      <li>All features are completely free forever</li>
                      <li>No subscription fees or hidden costs</li>
                      <li>No premium features locked behind paywalls</li>
                      <li>Unlimited usage with no restrictions</li>
                      <li>No file size or page count limits</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                    User Responsibilities
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    As a user of our service, you agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Use the service only for lawful purposes</li>
                    <li>Not upload files that contain malicious code or viruses</li>
                    <li>Respect intellectual property rights of others</li>
                    <li>Not attempt to reverse engineer or hack the service</li>
                    <li>Not use the service for any commercial exploitation without permission</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Privacy & Data</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Your privacy is paramount. Our service operates entirely client-side, meaning:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li><strong>No Data Collection:</strong> We do not collect, store, or process any personal information</li>
                    <li><strong>Client-Side Processing:</strong> All file processing happens in your browser</li>
                    <li><strong>No File Storage:</strong> Your files never leave your device</li>
                    <li><strong>No Tracking:</strong> We don't use cookies or tracking technologies</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    For detailed information, please review our <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a>.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Intellectual Property</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    The service and its original content, features, and functionality are owned by NewMicro and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Users retain full ownership of their uploaded files and processed results.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Limitation of Liability</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    In no event shall NewMicro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Your use or inability to use the service</li>
                    <li>Any changes made to the service</li>
                    <li>Any permanent or temporary cessation of the service</li>
                    <li>Deletion, corruption, or failure to store any content</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Service Availability</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We strive to maintain high service availability, but we do not guarantee:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Uninterrupted or error-free service</li>
                    <li>Immediate resolution of technical issues</li>
                    <li>Compatibility with all devices or browsers</li>
                    <li>Availability during maintenance periods</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    We will make reasonable efforts to notify users of any planned maintenance or service interruptions.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Modifications to Terms</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page. 
                    Your continued use of the service after any changes constitutes acceptance of the new terms. 
                    We encourage you to review these terms periodically.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Governing Law</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which NewMicro operates, 
                    without regard to its conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <p className="text-gray-700">
                      <strong>Email:</strong> legal@newmicro.com<br />
                      <strong>Website:</strong> <a href="/footer-info" className="text-blue-600 hover:text-blue-800 underline">Contact & Support Page</a>
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
    </div>
  );
};

export default TermsOfService;
