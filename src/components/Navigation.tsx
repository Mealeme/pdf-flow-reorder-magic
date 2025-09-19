
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileImage, FileText, Compass, Menu, Image, Info, LogOut, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationProps {
  onMenuClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Load profile photo from API
  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (user?.userId) {
        try {
          const res = await fetch(`/api/profile/get/${user.userId}`);
          const profile = await res.json();
          if (profile?.photoUrl) {
            setPhotoUrl(profile.photoUrl);
          }
        } catch (error) {
          console.error('Error loading profile photo:', error);
        }
      }
    };

    loadProfilePhoto();

    // Listen for photo update events
    const handlePhotoUpdate = (event: CustomEvent) => {
      setPhotoUrl(event.detail);
    };

    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate as EventListener);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate as EventListener);
    };
  }, [user?.userId]);
  
  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
                          <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative w-12 h-12 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
                  {/* Document Icon Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg border border-blue-400"></div>

                  {/* Document Icon Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-10 bg-gray-800 rounded-sm border border-blue-300 relative">
                      {/* Document lines */}
                      <div className="absolute top-2 left-2 right-2 h-0.5 bg-blue-400 rounded"></div>
                      <div className="absolute top-3 left-2 right-3 h-0.5 bg-blue-400 rounded"></div>
                      <div className="absolute top-4 left-2 right-4 h-0.5 bg-blue-400 rounded"></div>
                      <div className="absolute top-5 left-2 right-2 h-0.5 bg-blue-400 rounded"></div>
                    </div>
                  </div>

                  {/* Camera Aperture Overlay */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full border-2 border-gray-800 shadow-md flex items-center justify-center">
                    <div className="w-4 h-4 relative">
                      {/* Aperture blades */}
                      <div className="absolute inset-0 bg-emerald-400 rounded-full"></div>
                      <div className="absolute inset-1 bg-gray-800 rounded-full"></div>
                      {/* Aperture opening */}
                      <div className="absolute inset-2 bg-emerald-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-300 group-hover:from-blue-400 group-hover:to-indigo-400 bg-clip-text text-transparent transition-all duration-300">
                  NewMicro
                </span>
              </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-1">
                         <Link
               to="/"
               className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                 location.pathname === "/"
                   ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                   : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
               }`}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
               <FileText className="mr-2 h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
               <span className="relative z-10 transition-colors duration-300 group-hover:text-white">PDF Reorder</span>
             </Link>
                         <Link
               to="/photo-to-image"
               className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                 location.pathname === "/photo-to-image"
                   ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                   : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
               }`}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
               <Image className="mr-2 h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
               <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Photo to PDF</span>
             </Link>
                         <Link
               to="/pdf-compress"
               className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                 location.pathname === "/pdf-compress"
                   ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                   : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
               }`}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
               <Compass className="mr-2 h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
               <span className="relative z-10 transition-colors duration-300 group-hover:text-white">PDF Compress</span>
             </Link>
                         <Link
               to="/pdf-to-world"
               className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                 location.pathname === "/pdf-to-world"
                   ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                   : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
               }`}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
               <FileText className="mr-2 h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
               <span className="relative z-10 transition-colors duration-300 group-hover:text-white">PDF to Text</span>
             </Link>
                         <Link
               to="/pricing"
               className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                 location.pathname === "/pricing"
                   ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                   : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
               }`}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
               <CreditCard className="mr-2 h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
               <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Pricing</span>
             </Link>
                         <Link
               to="/footer-info"
               className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                 location.pathname === "/footer-info"
                   ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                   : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
               }`}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
               <Info className="mr-2 h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
               <span className="relative z-10 transition-colors duration-300 group-hover:text-white">About</span>
             </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-300 hover:border-blue-400 bg-gray-700 hover:scale-105 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </Link>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden whitespace-nowrap text-gray-300 hover:text-red-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-red-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                  <LogOut className="mr-2 h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                  location.pathname === "/login"
                    ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                    : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                <FileText className="mr-2 h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Sign In</span>
              </Button>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-gray-700 hover:scale-110 hover:rotate-12 transition-all duration-300 ease-out"
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
