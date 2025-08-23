
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileImage, Upload, Plus, X, LogOut, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUploader from "@/components/FileUploader";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { combineImagesToPdf } from "@/utils/conversionUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PhotoToImage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);
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
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc).",
        variant: "destructive",
      });
      return;
    }
    
    setImageFiles(prevFiles => [...prevFiles, file]);
    setConvertedPdfUrl(null);
    
    toast({
      title: "Image added",
      description: `${file.name} has been added to your collection.`,
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setConvertedPdfUrl(null);
  };

  const handleConvertToPdf = async () => {
    if (imageFiles.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to convert to PDF.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setIsConverting(true);
    setConvertedPdfUrl(null);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          processFiles();
        }, 500);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 300);
  };

  const processFiles = async () => {
    toast({
      title: "Processing Images",
      description: "Converting your images to PDF...",
    });

    try {
      const pdfBlob = await combineImagesToPdf(imageFiles);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setConvertedPdfUrl(pdfUrl);
      setIsConverting(false);
      
      toast({
        title: "Conversion complete",
        description: `${imageFiles.length} ${imageFiles.length === 1 ? 'image has' : 'images have'} been successfully converted to PDF!`,
      });
    } catch (error) {
      console.error("Image processing failed:", error);
      setIsConverting(false);
      toast({
        title: "Processing failed",
        description: "An error occurred while converting your images to PDF.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!convertedPdfUrl) {
      toast({
        title: "Error",
        description: "No processed PDF available to download.",
        variant: "destructive",
      });
      return;
    }
    
    // Create link element
    const link = document.createElement("a");
    link.href = convertedPdfUrl;
    link.download = `images_${new Date().getTime()}.pdf`;
    
    // Append to body and trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(convertedPdfUrl);
    }, 200);
    
    toast({
      title: "Download started",
      description: "Your converted PDF is being downloaded.",
    });
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAddMoreImages = () => {
    // This function will trigger the file input click
    document.getElementById('additional-image-input')?.click();
  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Process each file
    Array.from(files).forEach(file => {
      if (file.type.startsWith("image/")) {
        setImageFiles(prevFiles => [...prevFiles, file]);
      } else {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
      }
    });
    
    // Reset the input to allow selecting the same file again
    e.target.value = '';
    
    toast({
      title: "Images added",
      description: `${files.length} image(s) have been added to your collection.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation onMenuClick={handleToggleMobileMenu} />
      
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Photo to PDF Converter</h1>
            <p className="text-gray-600">Upload your images and convert them to PDF format</p>
          </div>
          
          <Card className="shadow-lg border-gray-200 mb-6">
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>
                Upload multiple images to combine into a single PDF document
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imageFiles.length === 0 && (
                <FileUploader 
                  onFileUpload={handleFileUpload} 
                  isUploading={isUploading}
                  acceptedFileTypes={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] }}
                />
              )}
              
              {(isUploading || isConverting) && (
                <div className="mt-4">
                  <ProgressBar progress={uploadProgress} />
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {isUploading ? `Processing: ${Math.round(uploadProgress)}%` : "Converting images to PDF..."}
                  </p>
                </div>
              )}
              
              {imageFiles.length > 0 && !isUploading && !isConverting && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Selected Images ({imageFiles.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-md">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center">
                          <FileImage className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveImage(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Hidden file input for adding more images */}
                  <input 
                    type="file" 
                    id="additional-image-input" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleAdditionalImageUpload} 
                  />
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      onClick={handleAddMoreImages}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add More Images
                    </Button>
                    <Button 
                      onClick={handleConvertToPdf}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FileImage className="mr-2 h-4 w-4" />
                      Convert to PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {convertedPdfUrl && !isConverting && (
                <Button 
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
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
                 <li><button onClick={() => { navigate('/pdf-compress'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left">PDF Compression</button></li>
                 <li><button onClick={() => { navigate('/pdf-to-world'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left">PDF to World</button></li>
                 <li><button onClick={() => { navigate('/photo-to-image'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl border-2 border-blue-200 font-medium text-left">Photo to PDF</button></li>
                 
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

export default PhotoToImage;
