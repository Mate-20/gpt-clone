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

const Sidebar = () => {
  const links = [
    { name: "New chat", href: "/dashboard/profile", icon: NewChatIcon },
    { name: "Search chats", href: "/dashboard/events", icon: SearchIcon },
    { name: "Library", href: "/dashboard/connections", icon: LibraryIcon },
    { name: "Sora", href: "/dashboard/messages", icon: VideoIcon },
    { name: "GPTs", href: "/dashboard/settings", icon: ModelsIcon },
    { name: "Projects", href: "/dashboard/settings", icon: FolderIcon },
  ];

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 52 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-[var(--secondary-bg)] h-[100vh] flex flex-col gap-5 px-2 pt-3 overflow-hidden"
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
            <div
              className="hover:bg-[var(--secondary-hover-bg)] rounded-[var(--border-radius-200)] flex items-center justify-center h-[32px] w-[32px] cursor-col-resize"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Image src={SideIcon} alt="toggle sidebar" />
            </div>
          </>
        )}
        {/* Collapsed state */}
        {isCollapsed && (
          <div
            className="relative group h-[38px] w-[38px]"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {/* Logo (visible by default, hidden on hover) */}
            <div className="absolute inset-0 flex items-center justify-center group-hover:hidden p-1 hover:bg-[var(--secondary-hover-bg)] rounded-[var(--border-radius-200)] cursor-pointer">
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
        className="flex flex-col">
        {links.slice(3, 5).map((link, key) => (
          <SidebarElement key={key} name={link.name} icon={link.icon} isClosed={isCollapsed} />
        ))}
      </motion.div>
      <motion.div animate={{ opacity: isCollapsed ? 0 : 1 }} transition={{ duration: 0.2 }}
        className="flex flex-col">
        {links.slice(5).map((link, key) => (
          <SidebarElement key={key} name={link.name} icon={link.icon} isClosed={isCollapsed} />
        ))}
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar