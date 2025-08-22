
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, File } from "lucide-react";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  acceptedFileTypes?: Record<string, string[]>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload, 
  isUploading,
  acceptedFileTypes = { 'application/pdf': ['.pdf'] } 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false,
    disabled: isUploading,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group",
        isDragActive 
          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg scale-105" 
          : "border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md",
        isDragReject && "border-red-500 bg-gradient-to-r from-red-50 to-pink-50",
        isUploading && "opacity-60 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        {isDragActive ? (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-blue-700 font-semibold text-lg">🎯 Drop your file here!</p>
              <p className="text-blue-600 text-sm">Release to upload</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <File className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-lg">
                {isUploading ? "⏳ Uploading..." : "📁 Drag & drop a file here"}
              </p>
              <p className="text-gray-600 text-sm">
                {isUploading ? "Please wait..." : "or click to browse files"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Supports PDF files only</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
