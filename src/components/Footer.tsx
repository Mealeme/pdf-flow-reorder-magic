
import React from "react";
import { FileText } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">PDF Reorder Tool</h2>
                <p className="text-blue-200 text-sm">Professional PDF Solutions</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              A powerful and intelligent tool for rearranging PDF pages according to custom sequences. 
              Built with modern technology for the best user experience.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-white mb-4 text-lg">🛠️ Services</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                PDF Reordering
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                PDF Compression
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                PDF Merging
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                PDF Splitting
              </a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-white mb-4 text-lg">✨ Features</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                All tools completely free
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Unlimited usage
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                No page restrictions
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Privacy focused
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-white mb-4 text-lg">📞 Contact</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-300">
                Need help? We're here to support you with all your PDF needs.
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <p className="text-blue-200 font-medium">🚀 Ready to get started?</p>
                <p className="text-gray-300 text-xs mt-1">All features are completely free!</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 PDF Reorder Tool. Built with ❤️ for the community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
