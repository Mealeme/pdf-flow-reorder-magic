
import React from "react";
import { FileText, ExternalLink, Globe, Github } from "lucide-react";
import ThreeDCube from "@/components/ThreeDCube";
import FloatingParticlesBackground from "@/components/ParticlesBackground";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white border-t border-gray-700 glow-border relative">
      <FloatingParticlesBackground />
      <ThreeDCube />
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6 group glow-border rounded-2xl p-4">
              <div className="relative w-12 h-12 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
                {/* Document Icon Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg border border-blue-500"></div>

                {/* Document Icon Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-10 bg-gray-800 rounded-sm border border-blue-400 relative">
                    {/* Document lines */}
                    <div className="absolute top-2 left-2 right-2 h-0.5 bg-blue-400 rounded"></div>
                    <div className="absolute top-3 left-2 right-3 h-0.5 bg-blue-400 rounded"></div>
                    <div className="absolute top-4 left-2 right-4 h-0.5 bg-blue-400 rounded"></div>
                    <div className="absolute top-5 left-2 right-2 h-0.5 bg-blue-400 rounded"></div>
                  </div>
                </div>

                {/* Camera Aperture Overlay */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-lime-500 to-emerald-600 rounded-full border-2 border-gray-700 shadow-md flex items-center justify-center">
                  <div className="w-4 h-4 relative">
                    {/* Aperture blades */}
                    <div className="absolute inset-0 bg-emerald-500 rounded-full"></div>
                    <div className="absolute inset-1 bg-gray-800 rounded-full"></div>
                    {/* Aperture opening */}
                    <div className="absolute inset-2 bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">NewMicro</h2>
                <p className="text-blue-300 text-sm group-hover:text-blue-200 transition-colors duration-300">Professional PDF Solutions</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A powerful and intelligent tool for rearranging PDF pages according to custom sequences.
              Built with modern technology for the best user experience.
            </p>
            <div className="mt-4">
              <a
                href="/footer-info"
                className="inline-flex items-center text-blue-400 hover:text-blue-200 hover:scale-105 transition-all duration-300 text-sm group"
              >
                Learn more about us <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1 sm:col-span-1 glow-border rounded-2xl p-4">
            <h3 className="font-semibold text-white mb-4 text-lg">🛠️ Services</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                PDF Reordering
              </a></li>
              <li><a href="/pdf-compress" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                PDF Compression
              </a></li>
              <li><a href="/pdf-to-world" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                PDF to World
              </a></li>
              <li><a href="/photo-to-image" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                Photo to PDF
              </a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-blue-300 hover:scale-105 transition-all duration-300 flex items-center group">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 group-hover:bg-blue-300 transition-all duration-300"></span>
                💰 Pricing Plans
              </a></li>
            </ul>
          </div>
          
          <div className="col-span-1 sm:col-span-1 glow-border rounded-2xl p-4">
            <h3 className="font-semibold text-white mb-4 text-lg">✨ Features</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-400 flex items-center group hover:scale-105 transition-all duration-300">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 group-hover:bg-green-300 transition-all duration-300"></span>
                All tools completely free
              </li>
              <li className="text-gray-400 flex items-center group hover:scale-105 transition-all duration-300">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 group-hover:bg-green-300 transition-all duration-300"></span>
                Unlimited usage
              </li>
              <li className="text-gray-400 flex items-center group hover:scale-105 transition-all duration-300">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 group-hover:bg-green-300 transition-all duration-300"></span>
                No page restrictions
              </li>
              <li className="text-gray-400 flex items-center group hover:scale-105 transition-all duration-300">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 group-hover:bg-green-300 transition-all duration-300"></span>
                Privacy focused
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 glow-border rounded-2xl p-4">
            <h3 className="font-semibold text-white mb-4 text-lg">📞 Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-400 mb-4">
                We'd love to hear from you! Contact us for support or feedback.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-xs">Email</p>
                    <p className="text-gray-400 text-xs">newmicroofficial@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600/30 rounded-full flex items-center justify-center">
                    <Globe className="h-4 w-4 text-green-300" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-xs">Website</p>
                    <p className="text-gray-400 text-xs">www.newmicro.live</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center">
                    <Github className="h-4 w-4 text-purple-300" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-xs">GitHub</p>
                    <p className="text-gray-400 text-xs">github.com/newmicro</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50 mt-4 glow-border">
                <p className="text-blue-300 font-medium text-xs">🚀 Ready to get started?</p>
                <p className="text-gray-400 text-xs mt-1">All features are completely free!</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4 md:mb-0">
              <p className="text-gray-500 text-sm text-center md:text-left">
                © 2024 NewMicro. Built with ❤️ for the community.
              </p>
              {/* DMCA Badge */}
              <div className="flex items-center justify-center">
                <a
                  href="https://www.dmca.com/Protection/Status.aspx?ID=b068feb3-ba02-494c-bde3-2c45eb771ff2&refurl=https://newmicro.live/"
                  title="DMCA.com Protection Status"
                  className="dmca-badge hover:scale-105 transition-transform duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://images.dmca.com/Badges/dmca_protected_sml_120l.png?ID=b068feb3-ba02-494c-bde3-2c45eb771ff2"
                    alt="DMCA.com Protection Status"
                    className="h-6 w-auto"
                  />
                </a>
                <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"></script>
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
              <a href="/footer-info" className="text-gray-500 hover:text-blue-400 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                About Us
              </a>
              <a href="/privacy-policy" className="text-gray-500 hover:text-blue-400 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-gray-500 hover:text-blue-400 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Terms of Service
              </a>
              <a href="/terms-and-conditions" className="text-gray-500 hover:text-blue-400 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Terms & Conditions
              </a>
              <a href="/cancellation-refund" className="text-gray-500 hover:text-blue-400 hover:scale-105 transition-all duration-300 whitespace-nowrap">
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
