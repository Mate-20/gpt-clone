import React, { useRef } from 'react';
import Image from 'next/image';
import AddIcon from "@/public/icons/AddIcon.svg";

interface FileUploadButtonProps {
  onFilesSelected: (files: FileList) => void;
  acceptedTypes?: string[];
  multiple?: boolean;
  disabled?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFilesSelected,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt'],
  multiple = true,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <div 
        className={`p-2 rounded-full cursor-pointer transition-colors duration-200 ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-[var(--primary-hover-bg)]'
        }`}
        onClick={handleClick}
        title="Upload files"
      >
        <Image src={AddIcon} alt="Upload files" />
      </div>
    </>
  );
};

export default FileUploadButton;