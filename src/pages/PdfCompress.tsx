import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Compass, Upload, LogOut, User, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import FileUploader from "@/components/FileUploader";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { compressPdf } from "@/utils/conversionUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PdfCompress = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string | null>(null);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(500);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load profile image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes("pdf")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    setPdfFile(file);
    setIsUploading(true);
    setCompressedPdfUrl(null);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
        }, 500);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 300);
  };

  const handleCompression = async () => {
    if (!pdfFile) {
      toast({
        title: "Error",
        description: "Please upload a PDF file first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    toast({
      title: "Compressing PDF",
      description: `Optimizing to target size of ${targetSizeKb}KB...`,
    });

    try {
      const compressedPdfBlob = await compressPdf(pdfFile, targetSizeKb);
      const compressedUrl = URL.createObjectURL(compressedPdfBlob);
      setCompressedPdfUrl(compressedUrl);
      
      toast({
        title: "Compression complete",
        description: "Your PDF has been successfully compressed!",
      });
    } catch (error) {
      console.error("PDF compression failed:", error);
      toast({
        title: "Compression failed",
        description: "An error occurred while compressing your PDF.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedPdfUrl || !pdfFile) {
      toast({
        title: "Error",
        description: "No compressed PDF available to download.",
        variant: "destructive",
      });
      return;
    }
    
    // Create link element
    const link = document.createElement("a");
    link.href = compressedPdfUrl;
    link.download = `compressed-${pdfFile.name}`;
    
    // Append to body and trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(compressedPdfUrl);
    }, 200);
    
    toast({
      title: "Download started",
      description: "Your compressed PDF is being downloaded.",
    });
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation onMenuClick={handleToggleMobileMenu} />
      
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">PDF Compressor</h1>
            <p className="text-gray-600">Reduce your PDF file size without losing quality</p>
          </div>
          
          <Card className="shadow-lg border-gray-200 mb-6">
            <CardHeader>
              <CardTitle>Upload PDF</CardTitle>
              <CardDescription>
                The application will compress your PDF to your desired file size
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader 
                onFileUpload={handleFileUpload} 
                isUploading={isUploading}
                acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
              />
              
              {isUploading && (
                <div className="mt-4">
                  <ProgressBar progress={uploadProgress} />
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Uploading: {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
              
              {pdfFile && !isUploading && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium">File uploaded:</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{pdfFile.name}</p>
                          <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Target size (KB):
                    </label>
                    <Input
                      type="number"
                      value={targetSizeKb}
                      onChange={(e) => setTargetSizeKb(parseInt(e.target.value) || 0)}
                      min={100}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Smaller values result in smaller file sizes but may affect quality
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleCompression} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isProcessing}
                  >
                    <Compass className="mr-2 h-4 w-4" />
                    {isProcessing ? "Compressing..." : "Compress PDF"}
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {compressedPdfUrl && (
                <Button 
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Compressed PDF
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Your files remain private and are not stored on our servers</p>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={handleToggleMobileMenu}>
          <div className="bg-white/95 backdrop-blur-md w-80 h-full p-6 rounded-r-3xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={handleToggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <ul className="space-y-4 pb-4">
                 {/* PDF Tools */}
                 <li className="pt-2">
                   <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">PDF Tools</h3>
                 </li>
                 <li><button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left">PDF Reordering</button></li>
                 <li><button onClick={() => { navigate('/pdf-compress'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl border-2 border-blue-200 font-medium text-left">PDF Compression</button></li>
                 <li><button onClick={() => { navigate('/pdf-to-world'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left">PDF to World</button></li>
                 <li><button onClick={() => { navigate('/photo-to-image'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left">Photo to PDF</button></li>
                 
                 {/* Information */}
                 <li className="pt-4">
                   <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Information</h3>
                 </li>
                 <li><button onClick={() => { navigate('/footer-info'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left">About Us</button></li>
                 <li><button onClick={() => { navigate('/footer-info'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left">Contact & Support</button></li>
                 <li><button onClick={() => { navigate('/privacy-policy'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left">Privacy Policy</button></li>
                                 {isAuthenticated ? (
                   <>
                     {/* Account */}
                     <li className="pt-4">
                       <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Account</h3>
                     </li>
                     <li>
                       <button
                         onClick={() => {
                           navigate('/profile');
                           setIsMobileMenuOpen(false);
                         }}
                         className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left"
                       >
                         <div className="flex items-center">
                           {profileImage ? (
                             <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-blue-200">
                               <img 
                                 src={profileImage} 
                                 alt="Profile" 
                                 className="w-full h-full object-cover"
                               />
                             </div>
                           ) : (
                             <User className="mr-3 h-4 w-4 flex-shrink-0" />
                           )}
                           <span className="truncate">My Profile</span>
                         </div>
                       </button>
                     </li>
                     <li>
                       <button
                         onClick={logout}
                         className="block w-full py-3 px-4 hover:bg-red-50 hover:text-red-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left"
                       >
                         <div className="flex items-center">
                           <LogOut className="mr-3 h-4 w-4" />
                           Sign Out
                         </div>
                       </button>
                     </li>
                   </>
                 ) : (
                  <li>
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl border-2 border-blue-200 font-medium hover:bg-blue-100 hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center">
                        <FileText className="mr-3 h-4 w-4" />
                        Sign In
                      </div>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfCompress;
