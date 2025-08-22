
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className }) => {
  return (
    <div className={cn("w-full bg-gray-100 rounded-full h-3 shadow-inner border border-gray-200", className)}>
      <div
        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
