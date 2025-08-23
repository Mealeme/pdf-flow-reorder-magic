import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation onMenuClick={() => {}} />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">🔒 Data Privacy & Security</CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Last updated: December 2024
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <div className="space-y-8 text-gray-700">
                
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-green-600" />
                    No Data Collection
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We want to be completely transparent: <strong>we do not collect, store, or process any of your personal data or files</strong>. 
                    All PDF processing happens entirely in your browser on your device.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Your files never leave your computer or device</li>
                    <li>No file uploads to our servers</li>
                    <li>No personal information is collected</li>
                    <li>No tracking cookies or analytics</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Eye className="mr-2 h-5 w-5 text-blue-600" />
                    How It Works
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Our tools use client-side processing, which means:
                  </p>
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-white rounded-xl border border-blue-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-blue-600 font-bold text-lg">1</span>
                        </div>
                        <p className="text-sm font-medium text-blue-800">Upload File</p>
                        <p className="text-xs text-blue-600 mt-1">File stays on your device</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-blue-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-blue-600 font-bold text-lg">2</span>
                        </div>
                        <p className="text-sm font-medium text-blue-800">Process Locally</p>
                        <p className="text-xs text-blue-600 mt-1">All processing in browser</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-blue-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-blue-600 font-bold text-lg">3</span>
                        </div>
                        <p className="text-sm font-medium text-blue-800">Download Result</p>
                        <p className="text-xs text-blue-600 mt-1">File never sent to us</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-purple-600" />
                    Security Measures
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We implement several security measures to protect your privacy:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li><strong>HTTPS Encryption:</strong> All data transmission is encrypted using industry-standard SSL/TLS</li>
                    <li><strong>Client-Side Processing:</strong> No server-side file handling or storage</li>
                    <li><strong>No Cookies:</strong> We don't use tracking cookies or store session data</li>
                    <li><strong>Open Source:</strong> Our code is transparent and can be reviewed by anyone</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-orange-600" />
                    Information We Don't Collect
                  </h3>
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <p className="text-red-800 font-medium mb-3">We explicitly do NOT collect:</p>
                    <ul className="list-disc list-inside text-red-700 space-y-1 ml-4">
                      <li>Personal identification information (names, emails, addresses)</li>
                      <li>PDF file content or metadata</li>
                      <li>IP addresses or location data</li>
                      <li>Browsing history or usage patterns</li>
                      <li>Device information or browser details</li>
                      <li>Any form of analytics or tracking data</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Third-Party Services</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Our service is completely self-contained and doesn't rely on third-party services for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>File processing or conversion</li>
                    <li>Data storage or hosting</li>
                    <li>User analytics or tracking</li>
                    <li>Advertising or marketing</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Rights</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Since we don't collect any personal data, you have complete control:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li><strong>No Data to Access:</strong> There's no personal data stored to request access to</li>
                    <li><strong>No Data to Delete:</strong> No personal information exists to be deleted</li>
                    <li><strong>No Data to Correct:</strong> No personal data is collected that could be incorrect</li>
                    <li><strong>Complete Anonymity:</strong> Use our tools without any identification</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <p className="text-gray-700">
                      <strong>Email:</strong> privacy@newmicro.com<br />
                      <strong>Website:</strong> <a href="/footer-info" className="text-blue-600 hover:text-blue-800 underline">Contact & Support Page</a>
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Changes to This Policy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. 
                    We encourage you to review this policy periodically.
                  </p>
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
    </div>
  );
};

export default PrivacyPolicy;
