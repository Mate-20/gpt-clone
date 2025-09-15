import React, { useRef } from 'react';
import Image from 'next/image';
import AddIcon from "@/public/icons/AddIcon.svg";
import { useUpload } from '@/context/UploadImageContext';

interface FileUploadButtonProps {
  onFilesSelected: (files: FileList) => void;
  acceptedTypes?: string[];
  multiple?: boolean;
  disabled?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFilesSelected,
  acceptedTypes = ['.png', '.jpg', 'jpeg', '.pdf'],
  multiple = true,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles, files } = useUpload();

  const handleClick = () => fileInputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ❌ Size check
    if (file.size > 2 * 1024 * 1024) {
      alert("File must be smaller than 2 MB.");
      e.target.value = "";
      return;
    }
    if (e.target.files) {
      await uploadFiles(e.target.files);
    }
  };
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <div
        className={`p-2 rounded-full cursor-pointer transition-colors duration-200 ${disabled
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