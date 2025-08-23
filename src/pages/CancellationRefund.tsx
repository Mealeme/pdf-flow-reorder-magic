import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { RotateCcw, Clock, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

const CancellationRefund = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation onMenuClick={() => {}} />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-xl hover:scale-110 hover:rotate-6 hover:shadow-2xl transition-all duration-500 ease-out group">
              <RotateCcw className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent mb-4">
              Cancellation & Refund Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Last updated on Sep 14 2024
            </p>
          </div>

          {/* Main Content */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden hover:shadow-3xl transition-all duration-500 ease-out">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">Our Policy</CardTitle>
              <p className="text-green-100 text-lg">
                NIKHIL BABASAHEB KADAM believes in helping its customers as far as possible
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Policy Overview */}
                <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-3" />
                    Liberal Cancellation Policy
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We have a liberal cancellation policy designed to help our customers. Under this policy, we consider cancellation requests within a reasonable timeframe and provide refunds when appropriate.
                  </p>
                </div>

                {/* Cancellation Terms */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Cancellation Terms</h3>
                  <ul className="space-y-4 text-gray-600">
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

                {/* Perishable Items */}
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                  <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3" />
                    Perishable Items
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    NIKHIL BABASAHEB KADAM does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                  </p>
                </div>

                {/* Damaged or Defective Items */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Damaged or Defective Items</h3>
                  <ul className="space-y-4 text-gray-600">
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

                {/* Product Quality Issues */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Quality Issues</h3>
                  <ul className="space-y-4 text-gray-600">
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

                {/* Warranty Items */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Warranty Items</h3>
                  <p className="text-gray-600 leading-relaxed">
                    In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
                  </p>
                </div>

                {/* Refund Processing */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                    <Clock className="w-6 h-6 mr-3" />
                    Refund Processing Time
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    In case of any Refunds approved by the NIKHIL BABASAHEB KADAM, it'll take <strong>2-3 days</strong> for the refund to be processed to the end customer.
                  </p>
                </div>

                {/* Important Notes */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Important Notes</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>All cancellation and refund requests must be made within the specified timeframes.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Customer service decisions are final and binding.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Refund processing times may vary depending on payment method and bank processing.</span>
                    </li>
                  </ul>
                </div>

                {/* Source Reference */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Source</h3>
                  <p className="text-gray-600 leading-relaxed">
                    This cancellation and refund policy is based on the policy from{" "}
                    <a 
                      href="https://merchant.razorpay.com/policy/OwwrzuH5iAvrxz/refund" 
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

export default CancellationRefund;
