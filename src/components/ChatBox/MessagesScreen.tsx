import React, { useEffect, useRef, useState } from 'react';
import AssistantMessage from './BotMessageBubble';
import UserMessageBubble from './UserMessageBubble';
import ActionButton from './ActionButton';
import ChatLoader from '../ChatLoader';

type Message = {
  id: string;
  role: "user" | "assistant" | "assistant-temp";
  content: string;
};

interface Props {
  chatMessages: Message[];
  assistantMessageLoader: boolean
  handleEdit: (messageId: string, newContent: string) => void;
}

// Main Chat Messages Component
const MessagesScreen = ({ chatMessages, assistantMessageLoader,handleEdit }: Props) => {

  const bottomRef = useRef<HTMLDivElement | null>(null);
  // Scroll into view whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);
  const [notification, setNotification] = useState('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  const handleCopy = (message: string) => {
    showNotification(message);
  };

  const handleLike = (messageId: string, liked: any) => {
    // console.log('Like message:', messageId, liked);
  };

  const handleDislike = (messageId: string, dislike: any) => {
    // console.log('Dislike message:', messageId, disliked);
  };

  const handleShare = (content: any) => {
    // console.log('Share content:', content);
    // showNotification('Content shared!');
  };

  const handleRegenerate = (messageId: string) => {
    // console.log('Regenerate message:', messageId);
    // showNotification('Regenerating response...');
  };

  return (
    <div className="max-w-[640px] md:max-w-[760px] w-full h-full pl-2">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Messages */}
      <div className="w-full pb-[80px]">
        {chatMessages.map((message, key) => (
          message.role === 'user' ? (
            <UserMessageBubble
              key={key}
              message={message}
              onEdit={handleEdit}
              onCopy={handleCopy}
            />
          ) : (
            <AssistantMessage
              key={key}
              message={message}
              onCopy={handleCopy}
              onLike={handleLike}
              onDislike={handleDislike}
              onShare={handleShare}
              onRegenerate={handleRegenerate}
            />
          )
        ))}
        {assistantMessageLoader && <div className='w-full'>
          <ChatLoader />
        </div>}
      </div>
      {/* invisible anchor for scrolling */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessagesScreen;