"use client"; // Required for Next.js app router

import { createContext, useContext, useState } from "react";

type NavContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

// Create Context
const ModalContext = createContext<NavContextType | undefined>(undefined);

// Provider Component
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom Hook for easy access
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};