
import React from "react";
import { FileText, ExternalLink } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="relative w-12 h-12 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
                {/* Document Icon Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl shadow-lg border border-blue-300"></div>
                
                {/* Document Icon Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-10 bg-white rounded-sm border border-blue-200 relative">
                    {/* Document lines */}
                    <div className="absolute top-2 left-2 right-2 h-0.5 bg-blue-300 rounded"></div>
                    <div className="absolute top-3 left-2 right-3 h-0.5 bg-blue-300 rounded"></div>
                    <div className="absolute top-4 left-2 right-4 h-0.5 bg-blue-300 rounded"></div>
                    <div className="absolute top-5 left-2 right-2 h-0.5 bg-blue-300 rounded"></div>
                  </div>
                </div>
                
                {/* Camera Aperture Overlay */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                  <div className="w-4 h-4 relative">
                    {/* Aperture blades */}
                    <div className="absolute inset-0 bg-emerald-400 rounded-full"></div>
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                    {/* Aperture opening */}
                    <div className="absolute inset-2 bg-emerald-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">NewMicro</h2>
                <p className="text-blue-200 text-sm group-hover:text-blue-100 transition-colors duration-300">Professional PDF Solutions</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              A powerful and intelligent tool for rearranging PDF pages according to custom sequences. 
              Built with modern technology for the best user experience.
            </p>
            <div className="mt-4">
              <a 
                href="/footer-info" 
                className="inline-flex items-center text-blue-300 hover:text-blue-100 hover:scale-105 transition-all duration-300 text-sm group"
              >
                Learn more about us <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1 sm:col-span-1">
            <h3 className="font-semibold text-white mb-4 text-lg">🛠️ Services</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                PDF Reordering
              </a></li>
              <li><a href="/pdf-compress" className="text-gray-300 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                PDF Compression
              </a></li>
              <li><a href="/pdf-to-world" className="text-gray-300 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                PDF to World
              </a></li>
              <li><a href="/photo-to-image" className="text-gray-300 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                Photo to PDF
              </a></li>
              <li><a href="/pricing" className="text-gray-300 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                💰 Pricing Plans
              </a></li>
            </ul>
          </div>
          
          <div className="col-span-1 sm:col-span-1">
            <h3 className="font-semibold text-white mb-4 text-lg">✨ Features</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300 flex items-center group hover:scale-105 transition-all duration-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-150 group-hover:bg-green-300 transition-all duration-300"></span>
                All tools completely free
              </li>
              <li className="text-gray-300 flex items-center group hover:scale-105 transition-all duration-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-150 group-hover:bg-green-300 transition-all duration-300"></span>
                Unlimited usage
              </li>
              <li className="text-gray-300 flex items-center group hover:scale-105 transition-all duration-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-300 group-hover:bg-green-300 transition-all duration-300"></span>
                No page restrictions
              </li>
              <li className="text-gray-300 flex items-center group hover:scale-105 transition-all duration-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-150 group-hover:bg-green-300 transition-all duration-300"></span>
                Privacy focused
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-white mb-4 text-lg">📞 Contact</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-300">
                Need help? We're here to support you with all your PDF needs.
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <p className="text-blue-200 font-medium">🚀 Ready to get started?</p>
                <p className="text-gray-300 text-xs mt-1">All features are completely free!</p>
              </div>
              <div className="mt-4">
                <a 
                  href="/footer-info" 
                  className="inline-flex items-center text-blue-300 hover:text-blue-100 transition-colors duration-200 text-sm"
                >
                  Contact & Support <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0 text-center md:text-left">
              © 2024 NewMicro. Built with ❤️ for the community.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
              <a href="/footer-info" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                About Us
              </a>
              <a href="/privacy-policy" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Terms of Service
              </a>
              <a href="/terms-and-conditions" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Terms & Conditions
              </a>
              <a href="/cancellation-refund" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Cancellation & Refund
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
