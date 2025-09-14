'use client'
// ChatContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type ChatContextType = {
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  clearMessages: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<any[]>([]);

  const clearMessages = () => setMessages([]);

  return (
    <ChatContext.Provider value={{ messages, setMessages, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
