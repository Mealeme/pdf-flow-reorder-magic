
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileImage, FileText, Compass, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onMenuClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onMenuClick }) => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">PDF Tools</Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === "/"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                PDF Reordering
              </Link>
              <Link
                to="/photo-to-image"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === "/photo-to-image"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <FileImage className="mr-1 h-4 w-4" />
                Photo to PDF
              </Link>
              <Link
                to="/pdf-compress"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === "/pdf-compress"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Compass className="mr-1 h-4 w-4" />
                PDF Compress
              </Link>
              <Link
                to="/pdf-to-world"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === "/pdf-to-world"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <FileText className="mr-1 h-4 w-4" />
                PDF to Text
              </Link>
            </div>
          </div>
          <div className="flex items-center md:hidden">
            <Button variant="ghost" onClick={onMenuClick} className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-2">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
