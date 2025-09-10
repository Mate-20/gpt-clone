'use client'
import React from 'react'
import TempIcon from '@/public/icons/TempChatIcon.svg'
import NavIcon from '@/public/icons/NavbarIcon.svg'
import Image from 'next/image'
import { ChevronDownRegular } from '@fluentui/react-icons'
import { useSidebar } from '@/context/SidebarContext'
import { useModal } from '@/context/ModalBackgroundContext'

const Navbar = () => {
  const {setIsSidebarOpen} = useSidebar();
  const {setIsModalOpen} = useModal();
  
  const handleToggle=() => {
    setIsSidebarOpen(true);
    setIsModalOpen(true);
  }
  return (
    <div className='w-full flex items-center justify-between p-2'>
      <div className='md:hidden block pl-2' onClick={handleToggle}><Image src={NavIcon} alt='icon'/></div>
      <div className='hidden items-center gap-1 hover:bg-[var(--tertiary-hover-bg)] rounded-[var(--border-radius-200)] cursor-pointer px-2 py-1 md:flex'>
        <span className='text-[18px]'>ChatGPT</span>
        <ChevronDownRegular className='w-4 h-4'/>
      </div>
      <div className='hover:bg-[var(--tertiary-hover-bg)] rounded-full cursor-pointer p-2'>
        <Image src={TempIcon} alt='icon'/>
      </div>
      
    </div>
  )
}

export default Navbar