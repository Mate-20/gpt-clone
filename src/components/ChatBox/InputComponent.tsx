// components/InputComponent.tsx
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import ToolsIcon from "@/public/icons/ToolsIcon.svg"
import MicIcon from "@/public/icons/MicIcon.svg"
import UpArrowIcon from "@/public/icons/UpArrowIcon.svg"
import FileUploadButton from './FileuploadButton'
import FilePreview from './FilePreview'
import { UploadedFile } from '@/types/upload'
import LimitReached from './LimitReached'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useUpload } from '@/context/UploadImageContext'

interface Props {
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
  inputPromt: string;
  onSend?: (message: string, files: UploadedFile[]) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  promptsLength: number;
  setAssistantMessageLoader: (value: boolean) => void;
  sendMessage: (inputMessage: string, fileUrl: string) => Promise<void>;
  limitCrossed: boolean
}

const InputComponent = ({ setInputPrompt, inputPromt, onSend, sendMessage, limitCrossed, promptsLength }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const baseHeight = 28;
  // const {
  //   uploadedFiles,
  //   isUploading,
  //   error,
  //   addFiles,
  //   removeFile,
  //   clearFiles,
  //   formatFileSize,
  //   hasFiles
  // } = useFileUpload({
  //   maxFiles: 5,
  //   maxFileSize: 25, // 25MB
  //   acceptedTypes: ['image/*', '.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx'],
  // });

  const { files, isUploading, removeFile, clearFiles } = useUpload();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.max(baseHeight, textareaRef.current.scrollHeight);
      textareaRef.current.style.height = `${Math.min(newHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (inputPromt.trim().length > 0) {
      sendMessage(inputPromt, files[0]?.url || '');
      setInputPrompt('')
      clearFiles()
    }
  };

  const handleFilesSelected = async (files: FileList) => {
    // await addFiles(files);
  };

  // Check if send button should be enabled
  const canSend = (inputPromt.trim().length > 0 || files.length > 0) && !isUploading;

  useEffect(() => {
    console.log("files", files)
  }, [files])
  return (
    <form className='rounded-[var(--border-radius-450)] bg-[var(--secondary-hover-bg)] py-3 px-3 border 
    border-[#343434] flex flex-col max-w-[640px] md:max-w-[760px] w-full' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

      {/* Error message */}
      {/* {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )} */}

      {/* File previews */}
      {files.length > 0 && (
        <div className="pb-3">
          <div className="flex flex-wrap gap-3">
            {files.map((file, key) => (
              <FilePreview
                key={key}
                file={file}
                onRemove={removeFile}
                totalFiles={files.length}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input Field */}
      <SignedIn>
        <textarea
          ref={textareaRef}
          placeholder={files.length > 0 ? 'Add a message or send files...' : 'Ask anything'}
          className='bg-transparent px-2 focus:outline-none placeholder:text-[var(--secondary-text)] resize-none'
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={inputPromt}
          autoFocus
          disabled={isUploading}
          style={{ height: `${baseHeight}px`, maxHeight: "200px", overflowY: "auto" }}
        />
      </SignedIn>
      <SignedOut>
        <textarea
          ref={textareaRef}
          placeholder={'Log in or Sign up to start asking'}
          className='bg-transparent px-2 focus:outline-none placeholder:text-[var(--secondary-text)] cursor-not-allowed resize-none'
          disabled
          style={{ height: `${baseHeight}px`, maxHeight: "200px", overflowY: "auto" }}
        />
      </SignedOut>

      {/* Loading indicator */}
      {isUploading && (
        <div className="flex items-center gap-2 mt-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
          <span className="text-sm text-gray-500">Uploading files...</span>
        </div>
      )}

      {/* Input Feature Icons */}
      <div className='flex items-center justify-between mt-2'>
        <div className='flex items-center gap-2'>
          {/* File Upload Button */}
          <SignedIn>
            <FileUploadButton
              onFilesSelected={handleFilesSelected}
              disabled={isUploading || files.length > 0}
            />
          </SignedIn>

          {/* Tools Button */}
          <div className='flex items-center gap-2 p-2 hover:bg-[var(--primary-hover-bg)] rounded-full cursor-pointer'>
            <Image src={ToolsIcon} alt="tools" />
            <span className='text-[14px]'>Tools</span>
          </div>
          {/* <div className='text-[14px] text-[var(--secondary-text)]'>
            {limitCrossed ? "4/4 prompts left" : `${promptsLength}/4 prompts left`}
          </div> */}
        </div>

        <div className='flex items-center gap-2'>
          {/* Microphone Button */}
          <div className='p-2 hover:bg-[var(--primary-hover-bg)] rounded-full cursor-pointer'>
            <Image src={MicIcon} alt="mic" className='cursor-pointer' />
          </div>

          {/* Send Button */}
          <button
            type='submit'
            disabled={!canSend}
            className={`p-2 rounded-full cursor-pointer transition-all duration-200 ${canSend
              ? "bg-white hover:bg-gray-100"
              : "bg-[#858585]"
              }`}
            style={{ cursor: canSend ? 'pointer' : 'not-allowed' }}
          >
            <Image
              src={UpArrowIcon}
              alt="Send"
              className={`${canSend ? '' : 'opacity-50'}`}
            />
          </button>
        </div>
      </div>

      {/* File upload info */}
      {/* <div className="text-xs text-gray-500 mt-1 text-center">
        Supports images, PDFs, documents up to 25MB each
      </div> */}
    </form>
  )
}

export default InputComponent