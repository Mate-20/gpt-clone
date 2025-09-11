// components/InputComponent.tsx
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import ToolsIcon from "@/public/icons/ToolsIcon.svg"
import MicIcon from "@/public/icons/MicIcon.svg"
import UpArrowIcon from "@/public/icons/UpArrowIcon.svg"
import FileUploadButton from './FileuploadButton'
import FilePreview from './FilePreview'
import { useFileUpload } from '@/hooks/useFileUpload'
import { UploadedFile } from '@/types/upload'

interface Props {
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
  inputPromt: string;
  onSend?: (message: string, files: UploadedFile[]) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  messages: any[];
  setAssistantMessageLoader: (value: boolean) => void;
}

const InputComponent = ({ setInputPrompt, inputPromt, onSend, setMessages, messages, setAssistantMessageLoader }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const baseHeight = 28;

  // const sendMessage = async (inputMessage: string) => {
  //   const newMessage = {
  //     id: crypto.randomUUID(),
  //     role: "user" as const,
  //     content: inputMessage,
  //   };

  //   const updatedMessages = [...messages, newMessage];
  //   setMessages(updatedMessages);

  //   const res = await fetch("/api/chat", {
  //     method: "POST",
  //     body: JSON.stringify({ messages: updatedMessages }),
  //   });

  //   if (!res.ok) {
  //     console.error("Chat request failed");
  //     return;
  //   }

  //   const reader = res.body?.getReader();
  //   const decoder = new TextDecoder();
  //   if (!reader) return;

  //   const tempId = crypto.randomUUID();
  //   let botReply = "";

  //   while (true) {
  //     const { done, value } = await reader.read();
  //     if (done) break;

  //     botReply += decoder.decode(value, { stream: true });

  //     setMessages((prev) => [
  //       ...prev.filter((m) => m.id !== tempId), // filter by ID only
  //       { id: tempId, role: "assistant", content: botReply },
  //     ]);
  //   }

  //   // Finalize assistant message (ensure last chunk is stored)
  //   setMessages((prev) => [
  //     ...prev.filter((m) => m.id !== tempId),
  //     { id: tempId, role: "assistant", content: botReply },
  //   ]);
  // };

  // File upload hook
  const sendMessage = async (inputMessage: string) => {
    setAssistantMessageLoader(true);
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: inputMessage,
    };

    // show user’s message in chat
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [userMessage], // 👈 send only the current prompt
      }),
    });

    if (!res.ok) {
      console.error("Chat request failed");
      return;
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;

    const tempId = crypto.randomUUID();
    let botReply = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      botReply += decoder.decode(value, { stream: true });

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempId),
        { id: tempId, role: "assistant", content: botReply },
      ]);
    }

    // Finalize assistant message
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== tempId),
      { id: tempId, role: "assistant", content: botReply },
    ]);
    setAssistantMessageLoader(false);
  };

  const {
    uploadedFiles,
    isUploading,
    error,
    addFiles,
    removeFile,
    clearFiles,
    formatFileSize,
    hasFiles
  } = useFileUpload({
    maxFiles: 5,
    maxFileSize: 25, // 25MB
    acceptedTypes: ['image/*', '.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.max(baseHeight, textareaRef.current.scrollHeight);
      textareaRef.current.style.height = `${Math.min(newHeight, 200)}px`;
    }
  };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSend();
  //   }
  // };

  const handleSend = () => {
    // if (inputPromt.trim() || hasFiles) {
    //   onSend?.(inputPromt.trim(), uploadedFiles);
    //   setInputPrompt('');
    //   clearFiles();

    //   // Reset textarea height
    //   if (textareaRef.current) {
    //     textareaRef.current.style.height = `${baseHeight}px`;
    //   }
    // }
    sendMessage(inputPromt);
    setInputPrompt('')
  };

  const handleFilesSelected = async (files: FileList) => {
    await addFiles(files);
  };

  // Check if send button should be enabled
  const canSend = (inputPromt.trim().length > 0 || hasFiles) && !isUploading;

  return (
    <form className='rounded-[var(--border-radius-450)] bg-[var(--secondary-hover-bg)] py-3 px-3 border 
    border-[#343434] flex flex-col max-w-[640px] md:max-w-[760px] w-full' onSubmit={(e) => { e.preventDefault(); handleSend(); }}>

      {/* Error message */}
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* File previews */}
      {hasFiles && (
        <div className="pb-3">
          <div className="flex flex-wrap gap-3">
            {uploadedFiles.map((file) => (
              <FilePreview
                key={file.id}
                file={file}
                onRemove={removeFile}
                formatFileSize={formatFileSize}
                totalFiles={uploadedFiles.length}
              />
            ))}
          </div>
          {/* {uploadedFiles.length > 0 && (
            <button
              onClick={clearFiles}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear all files
            </button>
          )} */}
        </div>
      )}

      {/* Input Field */}
      <textarea
        ref={textareaRef}
        placeholder={hasFiles ? 'Add a message or send files...' : 'Ask anything'}
        className='bg-transparent px-2 focus:outline-none placeholder:text-[var(--secondary-text)] resize-none'
        onChange={handleChange}
        // onKeyDown={handleKeyDown}
        value={inputPromt}
        autoFocus
        disabled={isUploading}
        style={{ height: `${baseHeight}px`, maxHeight: "200px", overflowY: "auto" }}
      />

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
          <FileUploadButton
            onFilesSelected={handleFilesSelected}
            disabled={isUploading}
          />

          {/* Tools Button */}
          <div className='flex items-center gap-2 p-2 hover:bg-[var(--primary-hover-bg)] rounded-full cursor-pointer'>
            <Image src={ToolsIcon} alt="tools" />
            <span className='text-[14px]'>Tools</span>
          </div>
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
              : "bg-[#858585] cursor-not-allowed"
              }`}
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