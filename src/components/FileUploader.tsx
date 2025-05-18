
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, File } from "lucide-react";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, isUploading }) => {
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
    accept: {
      'application/pdf': ['.pdf']
    },
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
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
        isDragReject && "border-red-500 bg-red-50",
        isUploading && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        {isDragActive ? (
          <>
            <Upload className="h-10 w-10 text-blue-500" />
            <p className="text-blue-600 font-medium">Drop your PDF here</p>
          </>
        ) : (
          <>
            <File className="h-10 w-10 text-gray-400" />
            <p className="text-gray-600 font-medium">
              {isUploading ? "Uploading..." : "Drag & drop a PDF file here, or click to select"}
            </p>
            <p className="text-xs text-gray-500">Support for single PDF file only</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
