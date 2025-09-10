'use client'
import React from 'react'
import { useModal } from '@/context/ModalBackgroundContext';

const ModalBlackScreen = () => {
  const { isModalOpen } = useModal();
  return (
    <div className={`${isModalOpen ? "h-[100vh] w-[100vw]" : "h-[0vh] w-[0vw]"} bg-[#00000080] absolute top-0 left-0 z-40`}></div>
  )
}

export default ModalBlackScreen