
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileImage, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FileUploader from "@/components/FileUploader";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { convertImageToPdf } from "@/utils/conversionUtils";

const PhotoToImage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc).",
        variant: "destructive",
      });
      return;
    }
    
    setImageFile(file);
    setIsUploading(true);
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
          processFile(file);
        }, 500);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 300);
  };

  const processFile = async (file: File) => {
    toast({
      title: "Processing Image",
      description: "Converting your image to PDF...",
    });

    try {
      const pdfBlob = await convertImageToPdf(file);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setConvertedPdfUrl(pdfUrl);
      
      toast({
        title: "Conversion complete",
        description: "Your image has been successfully converted to PDF!",
      });
    } catch (error) {
      console.error("Image processing failed:", error);
      toast({
        title: "Processing failed",
        description: "An error occurred while converting your image to PDF.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!convertedPdfUrl || !imageFile) {
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
    link.download = `${imageFile.name.split('.')[0]}.pdf`;
    
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
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                The application will convert your image to a PDF document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader 
                onFileUpload={handleFileUpload} 
                isUploading={isUploading}
                acceptedFileTypes={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] }}
              />
              
              {isUploading && (
                <div className="mt-4">
                  <ProgressBar progress={uploadProgress} />
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Uploading: {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
              
              {imageFile && !isUploading && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">File uploaded:</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <FileImage className="h-8 w-8 text-blue-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{imageFile.name}</p>
                        <p className="text-xs text-gray-500">{(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {convertedPdfUrl && (
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
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={handleToggleMobileMenu}>
          <div className="bg-white w-64 h-full p-4" onClick={e => e.stopPropagation()}>
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Menu</h2>
              <ul className="space-y-4">
                <li><a href="/" className="block py-2 hover:text-blue-600">PDF Reordering</a></li>
                <li><a href="/photo-to-image" className="block py-2 text-blue-600 font-medium">Photo to PDF</a></li>
                <li><a href="/pdf-compress" className="block py-2 hover:text-blue-600">PDF Compress</a></li>
                <li><a href="/pdf-to-world" className="block py-2 hover:text-blue-600">PDF to Word</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoToImage;
