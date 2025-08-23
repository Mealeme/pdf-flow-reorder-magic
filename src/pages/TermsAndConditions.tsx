import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FileText, Shield, AlertTriangle, ExternalLink } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation onMenuClick={() => {}} />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl hover:scale-110 hover:rotate-6 hover:shadow-2xl transition-all duration-500 ease-out group">
              <FileText className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
              Terms and Conditions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Last updated on Sep 14 2024
            </p>
          </div>

          {/* Main Content */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden hover:shadow-3xl transition-all duration-500 ease-out">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">Legal Terms</CardTitle>
              <p className="text-blue-100 text-lg">
                Please read these terms and conditions carefully before using our services
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Definitions */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                    <Shield className="w-6 h-6 mr-3" />
                    Definitions
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean <strong>NIKHIL BABASAHEB KADAM</strong>, whose registered/operational office is sambhajinager maharastra, lakhani Aurangabad MAHARASHTRA 431115. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
                  </p>
                </div>

                {/* General Terms */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">General Terms</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Your use of the website and/or purchase from us are governed by following Terms and Conditions:
                  </p>
                  <ul className="space-y-4 text-gray-600">
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

                {/* Intellectual Property */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Intellectual Property</h3>
                  <ul className="space-y-4 text-gray-600">
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

                {/* Links and External Content */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">External Links and Content</h3>
                  <ul className="space-y-4 text-gray-600">
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

                {/* Legal Jurisdiction */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Legal Jurisdiction</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.
                  </p>
                </div>

                {/* Liability */}
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                  <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-3" />
                    Limitation of Liability
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
                  </p>
                </div>

                {/* Source Reference */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Source</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These terms and conditions are based on the policy from{" "}
                    <a 
                      href="https://merchant.razorpay.com/policy/OwwrzuH5iAvrxz/terms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                    >
                      Razorpay Merchant Policy <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
