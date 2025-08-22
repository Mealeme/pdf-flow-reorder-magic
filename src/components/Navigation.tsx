
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileImage, FileText, Compass, Menu, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onMenuClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onMenuClick }) => {
  const location = useLocation();
  
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                PDF Reorder Tool
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link
              to="/"
              className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent"
              }`}
            >
              <FileText className="mr-2 h-4 w-4" />
              PDF Reorder
            </Link>
            <Link
              to="/photo-to-image"
              className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === "/photo-to-image"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent"
              }`}
            >
              <Image className="mr-2 h-4 w-4" />
              Photo to PDF
            </Link>
            <Link
              to="/pdf-compress"
              className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === "/pdf-compress"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent"
              }`}
            >
              <Compass className="mr-2 h-4 w-4" />
              PDF Compress
            </Link>
            <Link
              to="/pdf-to-world"
              className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === "/pdf-to-world"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent"
              }`}
            >
              <FileText className="mr-2 h-4 w-4" />
              PDF to Text
            </Link>
          </div>
          
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              onClick={onMenuClick} 
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-2">
            <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <span className="text-sm font-medium text-green-700">✨ All Free</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
