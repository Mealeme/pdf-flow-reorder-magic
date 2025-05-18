
import React from "react";
import { FileText } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">PDF Reorder Tool</h2>
            </div>
            <p className="text-gray-600 text-sm">
              A powerful tool for rearranging PDF pages according to custom sequences.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-3">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">PDF Reordering</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">PDF Compression</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">PDF Merging</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">PDF Splitting</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-3">Pricing</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Free Plan</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Premium Plan - $9.99/mo</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Enterprise - Contact Us</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">FAQs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} PDF Reorder Tool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
