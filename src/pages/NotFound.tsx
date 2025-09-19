import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ThreeDCube from "@/components/ThreeDCube";
import FloatingParticlesBackground from "@/components/ParticlesBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <FloatingParticlesBackground />
      <ThreeDCube />
      <Navigation onMenuClick={() => {}} />
      
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative" style={{ zIndex: 10 }}>
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="space-y-4">
            <a 
              href="/" 
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🏠 Return to Home
            </a>
            <div className="text-sm text-gray-500">
              <p>Or try one of these popular pages:</p>
              <div className="flex flex-wrap justify-center gap-4 mt-3">
                <a href="/photo-to-image" className="text-blue-500 hover:text-blue-700 underline">Photo to Image</a>
                <a href="/pdf-compress" className="text-blue-500 hover:text-blue-700 underline">PDF Compress</a>
                <a href="/pdf-to-world" className="text-blue-500 hover:text-blue-700 underline">PDF to World</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
