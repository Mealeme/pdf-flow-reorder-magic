
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FileUploader from "@/components/FileUploader";
import ProgressBar from "@/components/ProgressBar";
import { reorderPdf } from "@/utils/pdfUtils";

const Index = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [reorderedPdfUrl, setReorderedPdfUrl] = useState<string | null>(null);
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
      description: "Reordering pages based on custom sequence...",
    });

    try {
      const reorderedPdfBlob = await reorderPdf(file);
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
    }, 200);
    
    toast({
      title: "Download started",
      description: "Your reordered PDF is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">PDF Page Reordering Tool</h1>
          <p className="text-gray-600">Upload your PDF and we'll automatically reorder the pages</p>
        </div>
        
        <Card className="shadow-lg border-gray-200 mb-6">
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
            <CardDescription>
              The application will automatically rearrange your PDF pages according to our custom sequence
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          <CardFooter className="flex justify-end">
            {reorderedPdfUrl && (
              <Button 
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Reordered PDF
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Upload your PDF file and our system will automatically reorder the pages</p>
          <p className="mt-1">Your files remain private and are not stored on our servers</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
