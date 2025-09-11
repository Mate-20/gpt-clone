import React from 'react';
import { motion } from 'framer-motion';

const ChatLoader = () => {
  return (
    <div className="flex items-center justify-center py-2">
      <motion.span
        className="block w-3 h-3 rounded-full bg-white shadow"
        animate={{
          opacity: [0.7, 1, 0.7], // fades in and out
          scale: [1, 1.15, 1],     // scales up and back
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
