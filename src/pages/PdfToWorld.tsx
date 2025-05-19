
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FileUploader from "@/components/FileUploader";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { pdfToText } from "@/utils/conversionUtils";

const PdfToWorld = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
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
    setExtractedText(null);
    
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
    setIsProcessing(true);
    toast({
      title: "Processing PDF",
      description: "Extracting text from your PDF...",
    });

    try {
      const text = await pdfToText(file);
      setExtractedText(text);
      
      toast({
        title: "Extraction complete",
        description: "Text has been successfully extracted from your PDF!",
      });
    } catch (error) {
      console.error("PDF text extraction failed:", error);
      toast({
        title: "Processing failed",
        description: "An error occurred while extracting text from your PDF.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!extractedText) {
      toast({
        title: "Error",
        description: "No extracted text available to download.",
        variant: "destructive",
      });
      return;
    }
    
    // Create text file from extracted text
    const textBlob = new Blob([extractedText], { type: "text/plain" });
    const textUrl = URL.createObjectURL(textBlob);
    
    // Create link element
    const link = document.createElement("a");
    link.href = textUrl;
    link.download = pdfFile ? `${pdfFile.name.replace('.pdf', '')}.txt` : "extracted-text.txt";
    
    // Append to body and trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(textUrl);
    }, 200);
    
    toast({
      title: "Download started",
      description: "Your extracted text file is being downloaded.",
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">PDF to Text Converter</h1>
            <p className="text-gray-600">Extract text content from your PDF documents</p>
          </div>
          
          <Card className="shadow-lg border-gray-200 mb-6">
            <CardHeader>
              <CardTitle>Upload PDF</CardTitle>
              <CardDescription>
                The application will extract text content from your PDF
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
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">File uploaded:</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{pdfFile.name}</p>
                        <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    
                    {isProcessing && <p className="text-sm text-blue-600">Processing...</p>}
                  </div>
                </div>
              )}
              
              {extractedText && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Extracted Text</h3>
                  <div className="border rounded-md p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{extractedText}</pre>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {extractedText && (
                <Button 
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Text File
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
                <li><a href="/pdf-compress" className="block py-2 hover:text-blue-600">PDF Compress</a></li>
                <li><a href="/pdf-to-world" className="block py-2 text-blue-600 font-medium">PDF to Text</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfToWorld;
