
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface PdfPreviewProps {
  pdfUrl: string;
  fileName: string;
  onDownload: () => void;
  onClose: () => void;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ 
  pdfUrl, 
  fileName, 
  onDownload, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Preview: {fileName}</h2>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-grow overflow-auto p-4">
          <iframe 
            src={`${pdfUrl}#toolbar=0`} 
            className="w-full h-full min-h-[60vh] border rounded"
            title="PDF Preview"
          />
        </div>
        
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
