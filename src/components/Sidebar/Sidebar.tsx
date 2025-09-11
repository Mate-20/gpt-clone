'use client'
import React from 'react'
import Logo from '@/public/gpt_logo.png'
import SideIcon from '@/public/icons/sidebaricon.svg'
import LibraryIcon from '@/public/icons/LibraryIcon.svg'
import ModelsIcon from '@/public/icons/ModelsIcon.svg'
import NewChatIcon from '@/public/icons/NewChatIcon.svg'
import VideoIcon from '@/public/icons/VideoIcon.svg'
import SearchIcon from '@/public/icons/SearchIcon.svg'
import FolderIcon from '@/public/icons/FolderIcon.svg'
import Image from 'next/image'
import SidebarElement from './SidebarElement'
import { motion } from 'framer-motion'
import { useSidebar } from '@/context/SidebarContext'
import { DismissRegular } from '@fluentui/react-icons'
import { useModal } from '@/context/ModalBackgroundContext'

const Sidebar = () => {
  const links = [
    { name: "New chat", href: "/dashboard/profile", icon: NewChatIcon },
    { name: "Search chats", href: "/dashboard/events", icon: SearchIcon },
    { name: "Library", href: "/dashboard/connections", icon: LibraryIcon },
    { name: "Sora", href: "/dashboard/messages", icon: VideoIcon },
    { name: "GPTs", href: "/dashboard/settings", icon: ModelsIcon },
    { name: "Projects", href: "/dashboard/settings", icon: FolderIcon },
  ];

  const { toggleSidebar, isCollapsed, isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const { setIsModalOpen } = useModal()

  const handleCloseNavbar = () => {
    setIsModalOpen(false);
    setIsSidebarOpen(false);
  }
  return (
    <motion.aside
      animate={{
        width: isCollapsed  ? 52 : 260,
        backgroundColor: isCollapsed
          ? "var(--primary-bg)"
          : "var(--secondary-bg)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`
      h-[100vh] flex-col gap-4 px-2 pt-2 overflow-hidden 
      border-r border-[var(--border-color)] z-50 top-0 left-0
      ${isSidebarOpen ? "absolute flex" : "hidden"}   // toggle via context
      md:flex                 // always show on md+ screens
    `}
    >

      {/* top logo + toggle */}
      <div className="flex items-center justify-between">
        {/* Expanded state */}
        {!isCollapsed && (
          <>
            <div className="p-1 hover:bg-[var(--secondary-hover-bg)] rounded-[var(--border-radius-200)] cursor-pointer">
              <Image
                src={Logo}
                alt="logo"
                style={{ minHeight: 32, minWidth: 32, maxHeight: 32, maxWidth: 32 }}
              />
            </div>
            {!isSidebarOpen ? <div
              className="hover:bg-[var(--secondary-hover-bg)] rounded-[var(--border-radius-200)] flex-center h-[32px] w-[32px] cursor-col-resize"
              onClick={toggleSidebar}
            >
              <Image src={SideIcon} alt="toggle sidebar" />
            </div>
              :
              <div onClick={handleCloseNavbar} className='mb-1'><DismissRegular fontSize={18} /></div>
            }
          </>
        )}
        {/* Collapsed state */}
        {isCollapsed && (
          <div
            className="relative group h-[38px] w-[38px]"
            onClick={toggleSidebar}
          >
            {/* Logo (visible by default, hidden on hover) */}
            <div className="absolute inset-0 flex-center group-hover:hidden p-1 hover:bg-[var(--secondary-hover-bg)] rounded-[var(--border-radius-200)] cursor-pointer">
              <Image src={Logo} alt="logo" style={{ minHeight: 32, minWidth: 32, maxHeight: 32, maxWidth: 32 }} />
            </div>

            {/* SideIcon (hidden by default, visible on hover) */}
            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center hover:bg-[var(--secondary-hover-bg)] rounded-[var(--border-radius-200)] cursor-col-resize">
              <Image src={SideIcon} alt="toggle sidebar" width={20} height={20} />
            </div>
          </div>
        )}
      </div>

      {/* grouped links */}
      <div className="flex flex-col">
        {links.slice(0, 3).map((link, key) => (
          <SidebarElement key={key} name={link.name} icon={link.icon} isClosed={isCollapsed} />
        ))}
      </div>
      <motion.div animate={{ opacity: isCollapsed ? 0 : 1 }} transition={{ duration: 0.2 }}
        className="flex flex-col mt-1">
        {links.slice(3, 5).map((link, key) => (
          <SidebarElement key={key} name={link.name} icon={link.icon} isClosed={isCollapsed} />
        ))}
      </motion.div>
      <motion.div animate={{ opacity: isCollapsed ? 0 : 1 }} transition={{ duration: 0.2 }}
        className="flex flex-col mt-1">
        {links.slice(5).map((link, key) => (
          <SidebarElement key={key} name={link.name} icon={link.icon} isClosed={isCollapsed} />
        ))}
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar