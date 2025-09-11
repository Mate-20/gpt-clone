import { useState, useCallback } from 'react';
import { UploadedFile } from '@/types/upload';

interface UseFileUploadProps {
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  onFilesChange?: (files: UploadedFile[]) => void;
}

export const useFileUpload = ({
  maxFiles = 10,
  maxFileSize = 25, // 25MB default
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt'],
  onFilesChange
}: UseFileUploadProps = {}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to determine file type
  const getFileType = (file: File): 'image' | 'document' | 'other' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf' || 
        file.type.includes('document') || 
        file.type.includes('text') ||
        file.name.toLowerCase().endsWith('.pdf') ||
        file.name.toLowerCase().endsWith('.doc') ||
        file.name.toLowerCase().endsWith('.docx') ||
        file.name.toLowerCase().endsWith('.txt')) {
      return 'document';
    }
    return 'other';
  };

  // Create preview for images
  const createPreview = async (file: File): Promise<string | undefined> => {
    if (!file.type.startsWith('image/')) return undefined;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File "${file.name}" is too large. Maximum size is ${maxFileSize}MB.`;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      if (type.includes('*')) {
        const baseType = type.replace('*', '');
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `File type "${file.type}" is not supported.`;
    }

    return null;
  };

  // Add files
  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    setIsUploading(true);

    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      setError(`Cannot upload more than ${maxFiles} files.`);
      setIsUploading(false);
      return;
    }

    const newUploadedFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      // Validate each file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      // Create preview if it's an image
      const preview = await createPreview(file);

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        type: getFileType(file),
        name: file.name,
        size: file.size,
        uploadedAt: new Date()
      };

      newUploadedFiles.push(uploadedFile);
    }

    const updatedFiles = [...uploadedFiles, ...newUploadedFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    setIsUploading(false);
  }, [uploadedFiles, maxFiles, maxFileSize, acceptedTypes, onFilesChange]);

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  }, [uploadedFiles, onFilesChange]);

  // Clear all files
  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    onFilesChange?.([]);
    setError(null);
  }, [onFilesChange]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    uploadedFiles,
    isUploading,
    error,
    addFiles,
    removeFile,
    clearFiles,
    formatFileSize,
    hasFiles: uploadedFiles.length > 0
  };
};