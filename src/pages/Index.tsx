
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, LogOut, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUploader from "@/components/FileUploader";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PdfPreview from "@/components/PdfPreview";
import { reorderPdf } from "@/utils/pdfUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [reorderedPdfUrl, setReorderedPdfUrl] = useState<string | null>(null);
  const [sequenceType, setSequenceType] = useState<string>("9");
  const [showPreview, setShowPreview] = useState(false);
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
    setReorderedPdfUrl(null);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          processFile(file);
        }, 500);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 300);
  };

  const processFile = async (file: File) => {
    toast({
      title: "Processing PDF",
      description: `Reordering pages using sequence type ${sequenceType}...`,
    });

    try {
      const reorderedPdfBlob = await reorderPdf(file, sequenceType);
      const reorderedUrl = URL.createObjectURL(reorderedPdfBlob);
      setReorderedPdfUrl(reorderedUrl);
      
      toast({
        title: "Processing complete",
        description: "Your PDF has been successfully reordered!",
      });
    } catch (error) {
      console.error("PDF processing failed:", error);
      toast({
        title: "Processing failed",
        description: "An error occurred while reordering your PDF.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!reorderedPdfUrl || !pdfFile) {
      toast({
        title: "Error",
        description: "No processed PDF available to download.",
        variant: "destructive",
      });
      return;
    }
    
    // Create link element
    const link = document.createElement("a");
    link.href = reorderedPdfUrl;
    link.download = `reordered-${pdfFile.name}`;
    
    // Append to body and trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(reorderedPdfUrl); // Free up memory
      setReorderedPdfUrl(null); // Reset URL state
    }, 200);
    
    toast({
      title: "Download started",
      description: "Your reordered PDF is being downloaded.",
    });
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sequenceOptions = [
    { value: "6", label: "6-page chunk order" },
    { value: "9", label: "9-page chunk order (Default)" },
    { value: "12", label: "12-page chunk order" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation onMenuClick={handleToggleMobileMenu} />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
                     <div className="text-center mb-12">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl hover:scale-110 hover:rotate-6 hover:shadow-2xl transition-all duration-500 ease-out group">
               <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
             </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
              NewMicro - PDF Page Reordering Tool
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Transform your PDFs with intelligent page reordering. Upload, select your pattern, and download in seconds.
            </p>
          </div>
          
          {/* Main Upload Card */}
                     <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 ease-out">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <CardTitle className="text-2xl font-bold mb-2">Upload & Reorder PDF</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Choose your reordering sequence and let our AI handle the rest
              </CardDescription>
            </div>
            <CardContent className="p-8">
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  🎯 Select Reordering Sequence
                </label>
                <Select 
                  value={sequenceType} 
                  onValueChange={setSequenceType}
                >
                  <SelectTrigger className="w-full md:w-[400px] h-14 text-lg border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl transition-all duration-200">
                    <SelectValue placeholder="Choose your reordering pattern" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    {sequenceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="text-lg py-3 hover:bg-blue-50">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-3 ml-1">
                  ✨ Each sequence creates a unique page arrangement pattern
                </p>
              </div>
              
                             <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-100 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                 <FileUploader 
                   onFileUpload={handleFileUpload} 
                   isUploading={isUploading}
                 />
               </div>
              
              {isUploading && (
                               <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                 <ProgressBar progress={uploadProgress} />
                 <p className="text-center text-gray-600 mt-3 font-medium">
                   📤 Uploading: {Math.round(uploadProgress)}%
                 </p>
               </div>
              )}
              
              {pdfFile && !isUploading && (
                                 <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 hover:from-green-100 hover:to-emerald-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                   <div className="flex items-center">
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 hover:scale-110 transition-transform duration-300">
                       <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                     </div>
                     <div>
                       <p className="text-lg font-semibold text-green-800">File Ready!</p>
                       <p className="text-green-700">{pdfFile.name}</p>
                       <p className="text-sm text-green-600">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                     </div>
                   </div>
                 </div>
              )}
            </CardContent>
            <CardFooter className="p-8 pt-0">
              {reorderedPdfUrl && (
                <div className="w-full flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => setShowPreview(true)}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14 text-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    <Eye className="mr-3 h-5 w-5" />
                    Preview PDF
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    size="lg"
                    className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Download className="mr-3 h-5 w-5" />
                    Download PDF
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
          
          {/* Features Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">✨ All Features Are Completely Free!</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Enjoy unlimited access to all our premium PDF tools without any restrictions or hidden costs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <div className="group bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 hover:border-blue-200 transition-all duration-300">
                 <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🚀 Unlimited PDFs</h3>
                <p className="text-gray-600 leading-relaxed">Process as many PDFs as you need, whenever you need them. No daily limits or restrictions.</p>
              </div>
              
                             <div className="group bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 hover:border-blue-200 transition-all duration-300">
                 <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">📄 Unlimited Pages</h3>
                <p className="text-gray-600 leading-relaxed">No page count restrictions. Handle documents of any size with our powerful processing engine.</p>
              </div>
              
                             <div className="group bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 hover:border-purple-200 transition-all duration-300">
                 <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">🎨 All Features</h3>
                <p className="text-gray-600 leading-relaxed">Access to every tool, pattern, and customization option. No premium features locked behind paywalls.</p>
              </div>
            </div>
          </div>
          
          {/* Trust Section */}
                     <div className="text-center bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 hover:bg-white/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-500 ease-out">
             <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 hover:rotate-6 transition-all duration-300">
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
             </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">🔒 Your Privacy Matters</h3>
            <p className="text-gray-600">
              Your files remain completely private and are never stored on our servers. Process with confidence.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {showPreview && reorderedPdfUrl && pdfFile && (
        <PdfPreview
          pdfUrl={reorderedPdfUrl}
          fileName={pdfFile.name}
          onDownload={handleDownload}
          onClose={handlePreviewClose}
        />
      )}
      
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
                 <li><button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl border-2 border-blue-200 font-medium text-left">PDF Reordering</button></li>
                 <li><button onClick={() => { navigate('/pdf-compress'); setIsMobileMenuOpen(false); }} className="block w-full py-3 px-4 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left">PDF Compression</button></li>
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

export default Index;
