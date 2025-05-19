import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Compass, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import FileUploader from "@/components/FileUploader";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { compressPdf } from "@/utils/conversionUtils";

const PdfCompress = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string | null>(null);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(500);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

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
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={handleToggleMobileMenu}>
          <div className="bg-white w-64 h-full p-4" onClick={e => e.stopPropagation()}>
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Menu</h2>
              <ul className="space-y-4">
                <li><a href="/" className="block py-2 hover:text-blue-600">PDF Reordering</a></li>
                <li><a href="/photo-to-image" className="block py-2 hover:text-blue-600">Photo to PDF</a></li>
                <li><a href="/pdf-compress" className="block py-2 text-blue-600 font-medium">PDF Compress</a></li>
                <li><a href="/pdf-to-world" className="block py-2 hover:text-blue-600">PDF to Word</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfCompress;
