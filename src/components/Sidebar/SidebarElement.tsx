"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  icon: string;
  name?: string;
  isClosed: boolean;
}

const SidebarElement = ({ icon, name, isClosed }: Props) => {
  return (
    <div className="flex items-center gap-[6px] p-2 hover:bg-[var(--secondary-hover-bg)] rounded-[var(--border-radius-200)] cursor-pointer">
      <Image src={icon} alt="icon" width={20} height={20} />
      {/* animate text hide/show */}
      <motion.div
        initial={false}
        animate={{ opacity: isClosed ? 0 : 1, x: isClosed ? -10 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-[14px] whitespace-nowrap overflow-hidden"
      >
        {!isClosed && name}
      </motion.div>
    </div>
  );
};

export default SidebarElement;
