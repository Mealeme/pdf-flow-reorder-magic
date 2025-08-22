
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [scale, setScale] = useState(1);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl flex flex-col max-h-[90vh] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-800">PDF Preview</h2>
              <p className="text-sm text-gray-600">{fileName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={zoomIn}
                disabled={scale >= 2}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-grow overflow-auto p-6 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }} className="transition-transform duration-300">
              <iframe 
                src={`${pdfUrl}#toolbar=0`} 
                className="w-full h-full min-h-[60vh]"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="h-12 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium"
          >
            Close Preview
          </Button>
          <Button 
            onClick={onDownload}
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            <Download className="mr-2 h-5 w-5" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
