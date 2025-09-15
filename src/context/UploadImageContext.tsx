// context/UploadContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { UploadClient } from "@uploadcare/upload-client";

type UploadedFile = {
  url: string;
  name: string;
  type: string;
};

type UploadContextType = {
  files: UploadedFile[];
  isUploading: boolean;
  uploadFiles: (fileList: FileList) => Promise<void>;
  clearFiles: () => void;
  removeFile: (url: string) => void; // ✅ New
  fileExractedText: string 

};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fileExractedText, setFileExractedText] = useState<string>("");

  // ✅ Uploadcare client (replace with your real public key)
  const client = new UploadClient({ publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY! });

  const uploadFiles = async (fileList: FileList) => {
    try {
      setIsUploading(true);
      const uploaded: UploadedFile[] = [];

      for (const file of Array.from(fileList)) {
        if (file.size > 2 * 1024 * 1024) {
          // console.warn(`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
          navigator.clipboard.writeText("File too large. Maximum size is 2MB.");
          continue;
        }
        const result = await client.uploadFile(file);
        let fileUrl = result.cdnUrl!;
        // Replace cdn domain
        fileUrl = fileUrl.replace("https://ucarecdn.com", "https://1z66y5vt2h.ucarecd.net");

        // Fix for PDFs: append filename if missing
        if (result.mimeType?.includes("pdf")) {
          fileUrl = `${fileUrl}${result.name}`;
        }
        uploaded.push({
          url: fileUrl,
          name: result.name!,
          type: result.mimeType!,
        });
        if (result.mimeType === "application/pdf") {
          const res = await fetch("/api/parse-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl }),
          });
          const { text } = await res.json();
          setFileExractedText(text)
        }

      }

      setFiles((prev) => [...prev, ...uploaded]);

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFiles = () => setFiles([]);

  // ✅ Remove a single file by URL
  const removeFile = (url: string) => {
    setFiles((prev) => prev.filter((file) => file.url !== url));
  };

  return (
    <UploadContext.Provider
      value={{ files, isUploading, uploadFiles, clearFiles, removeFile,fileExractedText }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUpload must be used within UploadProvider");
  return ctx;
};
