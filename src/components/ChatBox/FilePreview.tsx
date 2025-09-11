import React, { useState } from 'react';
import Image from 'next/image';
import { X, FileText, File } from 'lucide-react';
import { UploadedFile } from '@/types/upload';

interface FilePreviewProps {
  file: UploadedFile;
  onRemove: (fileId: string) => void;
  formatFileSize: (bytes: number) => string;
  totalFiles: number;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  formatFileSize,
  totalFiles
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(file.id);
  };

  if (file.type === 'image' && file.preview) {
    return (
      <div
        className="relative group"
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative ${totalFiles > 1 ? 'w-[60px] h-[60px]' : 'w-[144px] h-[144px]'} rounded-[var(--border-radius-400)] overflow-hidden border border-[var(--border-color)]`}>
          <Image
            src={file.preview}
            alt={file.name}
            fill
            className="object-cover"
            sizes="80px"
          />
          {/* Remove button */}
          {/* {isHovered && ( */}
          <button
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-white text-black rounded-full p-1 transition-colors duration-200 shadow-lg"
            title="Remove file"
          >
            <X size={totalFiles > 1 ? 10 : 14} />
          </button>
          {/* )} */}
        </div>
        {/* File name tooltip */}
        {/* <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 truncate max-w-20 text-center">
          {file.name}
        </div> */}
      </div>
    );
  }

  // Document preview
  return (
    <div
      className="relative group flex items-center rounded-[var(--border-radius-300)] border border-[#3f3f3f] p-2 gap-2 w-[280px]"
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      {/* File icon based on type */}
      <div className='bg-[#FA423E] rounded-[var(--border-radius-200)] w-10 h-10 flex-center'>
        {file.name.toLowerCase().endsWith('.pdf') ? (
          <FileText size={16} className="text-white" />
        ) : (
          <File size={16} className="text-white" />
        )}
      </div>
      <div className='text-[14px]'>
        {/* File Name */}
        <div className="truncate font-semibold">{file.name}</div>
        {/* File extension */}
        <span className="">
          {file.name.split('.').pop()?.substring(0, 3).toUpperCase()}
        </span>
      </div>
      {/* Remove button */}
      {/* {isHovered && ( */}
      <button
        onClick={handleRemove}
        className="absolute top-1 right-1 bg-white text-black rounded-full p-1 transition-colors duration-200 shadow-lg"
        title="Remove file"
      >
        <X size={12} />
      </button>
      {/* )} */}

      {/* File info tooltip */}
      {/* <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 text-center w-24">
        <div className="truncate">{file.name}</div>
        <div className="text-gray-400">{formatFileSize(file.size)}</div>
      </div> */}
    </div>
  );
};

export default FilePreview;
