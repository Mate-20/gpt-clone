import React from 'react';
import { motion } from 'framer-motion';

const ChatLoader = () => {
  return (
    <div className="">
      <motion.span
        className="block w-[14px] h-[14px] rounded-full bg-white shadow"
        animate={{
          opacity: [0.6, 1, 0.6], // fades in and out
          scale: [1, 1.1, 1],     // scales up and back
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: 'loop',
          ease: "linear",
        }}
      />
    </div>
  );
};

export default ChatLoader;
