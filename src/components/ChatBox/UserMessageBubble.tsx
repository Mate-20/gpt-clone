import React, { useState } from 'react'
import ActionButton from './ActionButton';
import {
  Copy,
  Edit3,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import { s } from 'framer-motion/client';
interface UserMessageBubbleProps {
  message: any;
  onEdit: (id: string, newContent: string) => void;
  onCopy: (message: string) => void;
}
const UserMessageBubble = ({ message, onEdit, onCopy }: UserMessageBubbleProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onEdit(message.id, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy('Message copied!');
  };

  const handleHover = () => {
    if (message.content.includes("1z66y5vt2h.ucarecd.net")) {
      return;
    } else {
      setIsHovered(true);
    }
  }
  return (
    <div className="flex justify-end mb-2 group w-full">
      <div className="flex flex-col items-end space-x-3 w-full"
        onMouseEnter={handleHover}
        onMouseLeave={() => setIsHovered(false)}>
        {/* Message content */}
        <div className={`relative ${isEditing ? "w-full" : "max-w-[80%]"}`}>
          {isEditing ? (
            <div className="bg-[var(--tertiary-hover-bg)] text-white rounded-[var(--border-radius-450)] px-4 py-3 w-full">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-transparent rounded-lg p-2 resize-none focus:outline-none"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button className='bg-[#212121] hover:bg-[#2f2f2f] rounded-full px-3 py-[6px] text-[14px] font-medium' onClick={handleCancelEdit}>Cancel</button>
                <button className='bg-white hover:bg-[#ececec] rounded-full px-3 py-[6px] text-black text-[14px] font-medium' onClick={handleSaveEdit}>Send</button>
              </div>
            </div>
          ) : (
            <div className={`flex flex-col ${message.imageUrl || message?.fileContent?.type.includes("pdf") ? "gap-2 items-end" : ""} w-full`}>
              {message.imageUrl && <Image src={message.imageUrl} alt="image" className='rounded-md' width={250} height={250} />}
              {message?.fileContent?.type?.includes("pdf") &&
                <div
                  className="relative group flex items-center rounded-[var(--border-radius-300)] border border-[#3f3f3f] p-2 gap-2 w-[280px]"
                >
                  {/* File icon based on type */}
                  <div className='bg-[#FA423E] rounded-[var(--border-radius-200)] w-10 h-10 flex-center'>
                    <FileText size={16} className="text-white" />
                  </div>
                  <div className='text-[14px]'>
                    {/* File Name */}
                    <div className="truncate font-semibold">{message.fileContent.name}</div>
                    {/* File extension */}
                    <span className="">
                      {/* {file.name.split('.').pop()?.substring(0, 3).toUpperCase()} */}
                      PDF
                    </span>
                  </div>
                </div>
              }
              <div className="bg-[var(--secondary-hover-bg)] text-white rounded-2xl px-4 py-3 whitespace-pre-wrap w-fit">
                {message.content}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons - show on hover */}
        <div className={`flex space-x-1 mt-2 transition-opacity duration-100 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <ActionButton
            icon={Copy}
            onClick={handleCopy}
            tooltip="Copy"
          />
          {/* <ActionButton
            icon={Edit3}
            onClick={handleEdit}
            tooltip="Edit message"
          /> */}

        </div>

      </div>
    </div>
  );
};


export default UserMessageBubble