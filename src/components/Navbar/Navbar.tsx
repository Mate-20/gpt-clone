'use client'
import React from 'react'
import TempIcon from '@/public/icons/TempChatIcon.svg'
import NavIcon from '@/public/icons/NavbarIcon.svg'
import Image from 'next/image'
import { ChevronDownRegular } from '@fluentui/react-icons'
import { useSidebar } from '@/context/SidebarContext'
import { useModal } from '@/context/ModalBackgroundContext'
import UpgradeIcon from '@/public/icons/UpgradeIcon.svg'

const Navbar = () => {
  const { setIsSidebarOpen, setIsCollapsed } = useSidebar();
  const { setIsModalOpen } = useModal();

  const handleToggle = () => {
    setIsSidebarOpen(true);
    setIsModalOpen(true);
    setIsCollapsed(false);
  }
  return (
    <div className='w-full flex items-center justify-between p-2'>
      <div className='md:hidden block pl-2' onClick={handleToggle}><Image src={NavIcon} alt='icon' /></div>
      <div className='hidden items-center gap-1 hover:bg-[var(--tertiary-hover-bg)] rounded-[var(--border-radius-200)] cursor-pointer px-2 py-1 md:flex'>
        <span className='text-[18px]'>ChatGPT</span>
        <ChevronDownRegular className='w-4 h-4' />
      </div>
      <div className='flex items-center gap-1 bg-[#373669] hover:bg-[#414071] cursor-pointer rounded-full px-3 py-2 md:ml-[-60px]'>
        <Image src={UpgradeIcon} alt='icon' />
        <div className='text-[14px]'>Upgrade to Go</div>
      </div>
      <div className='hover:bg-[var(--tertiary-hover-bg)] rounded-full cursor-pointer p-2'>
        <Image src={TempIcon} alt='icon' />
      </div>

    </div>
  )
}

export default Navbar