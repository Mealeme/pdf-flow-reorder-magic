
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileImage, FileText, Compass, Menu, Image, Info, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationProps {
  onMenuClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load profile image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);
  
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
                         <Link to="/" className="flex items-center space-x-3 group">
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
               <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                 NewMicro
               </span>
             </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-1">
                         <Link
               to="/"
               className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                 location.pathname === "/"
                   ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md"
                   : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200"
               }`}
             >
              <FileText className="mr-2 h-4 w-4" />
              PDF Reorder
            </Link>
                         <Link
               to="/photo-to-image"
               className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                 location.pathname === "/photo-to-image"
                   ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md"
                   : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200"
               }`}
             >
              <Image className="mr-2 h-4 w-4" />
              Photo to PDF
            </Link>
                         <Link
               to="/pdf-compress"
               className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                 location.pathname === "/pdf-compress"
                   ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md"
                   : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200"
               }`}
             >
              <Compass className="mr-2 h-4 w-4" />
              PDF Compress
            </Link>
                         <Link
               to="/pdf-to-world"
               className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                 location.pathname === "/pdf-to-world"
                   ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md"
                   : "text-gray-700 border-2 border-transparent hover:border-blue-200"
               }`}
             >
              <FileText className="mr-2 h-4 w-4" />
              PDF to Text
            </Link>
                         <Link
               to="/footer-info"
               className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                 location.pathname === "/footer-info"
                   ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md"
                   : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200"
               }`}
             >
              <Info className="mr-2 h-4 w-4" />
              About
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-200 hover:border-blue-300 hover:scale-105 hover:shadow-lg transition-all duration-300 overflow-hidden bg-blue-50"
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                </Link>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium border-2 border-red-200 text-red-600 hover:bg-red-50 hover:scale-105 hover:shadow-lg hover:border-red-300 transition-all duration-300 whitespace-nowrap"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:scale-105 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
              >
                <FileText className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              onClick={onMenuClick} 
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-110 hover:rotate-12 transition-all duration-300 ease-out"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
