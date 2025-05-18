
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUploader from "@/components/FileUploader";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PdfPreview from "@/components/PdfPreview";
import { reorderPdf } from "@/utils/pdfUtils";

const Index = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [reorderedPdfUrl, setReorderedPdfUrl] = useState<string | null>(null);
  const [sequenceType, setSequenceType] = useState<string>("9");
  const [showPreview, setShowPreview] = useState(false);
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
    { value: "1", label: "Sequential (No reordering)" },
    { value: "2", label: "2-page grouping" },
    { value: "4", label: "4-page grouping" },
    { value: "6", label: "6-page grouping" },
    { value: "9", label: "9-page grouping (Default)" },
    { value: "16", label: "16-page grouping" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation onMenuClick={handleToggleMobileMenu} />
      
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">PDF Page Reordering Tool</h1>
            <p className="text-gray-600">Upload your PDF and we'll automatically reorder the pages</p>
          </div>
          
          <Card className="shadow-lg border-gray-200 mb-6">
            <CardHeader>
              <CardTitle>Upload PDF</CardTitle>
              <CardDescription>
                The application will reorder your PDF pages according to your selected sequence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Reordering Sequence:
                </label>
                <Select 
                  value={sequenceType} 
                  onValueChange={setSequenceType}
                >
                  <SelectTrigger className="w-full md:w-[350px]">
                    <SelectValue placeholder="Select a sequence type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sequenceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Different sequences will reorder pages in different patterns
                </p>
              </div>
              
              <FileUploader 
                onFileUpload={handleFileUpload} 
                isUploading={isUploading}
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
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{pdfFile.name}</p>
                        <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {reorderedPdfUrl && (
                <>
                  <Button 
                    onClick={() => setShowPreview(true)}
                    variant="outline"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
          
          <div className="mt-8 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Pricing Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Free</h3>
                  <p className="text-2xl font-bold mb-4">$0<span className="text-sm font-normal">/month</span></p>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li>✓ Up to 5 PDFs per day</li>
                    <li>✓ Max 50 pages per PDF</li>
                    <li>✓ Standard reordering patterns</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200 relative">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                    POPULAR
                  </div>
                  <h3 className="font-semibold mb-2">Premium</h3>
                  <p className="text-2xl font-bold mb-4">$9.99<span className="text-sm font-normal">/month</span></p>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li>✓ Unlimited PDFs</li>
                    <li>✓ Up to 200 pages per PDF</li>
                    <li>✓ All reordering patterns</li>
                    <li>✓ Advanced customization</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Enterprise</h3>
                  <p className="text-2xl font-bold mb-4">Contact Us</p>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li>✓ Unlimited usage</li>
                    <li>✓ Unlimited page count</li>
                    <li>✓ Custom reordering algorithms</li>
                    <li>✓ API access</li>
                    <li>✓ Dedicated support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Your files remain private and are not stored on our servers</p>
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
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={handleToggleMobileMenu}>
          <div className="bg-white w-64 h-full p-4" onClick={e => e.stopPropagation()}>
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Menu</h2>
              <ul className="space-y-4">
                <li><a href="#" className="block py-2 hover:text-blue-600">Services</a></li>
                <li><a href="#" className="block py-2 hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="block py-2 hover:text-blue-600">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
