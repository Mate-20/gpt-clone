import React, { useEffect, useState } from 'react';
import AssistantMessage from './BotMessageBubble';
import UserMessageBubble from './UserMessageBubble';
import ActionButton from './ActionButton';
import ChatLoader from '../ChatLoader';

interface Props {
  chatMessages: any[];
  assistantMessageLoader: boolean
}

// Main Chat Messages Component
const MessagesScreen = ({ chatMessages,assistantMessageLoader }: Props) => {

  useEffect(() => {
    console.log("📩 Updated messages:", chatMessages);
  }, [chatMessages]);

  const [notification, setNotification] = useState('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  const handleEdit = (messageId: string, newContent: string) => {
    console.log('Edit message:', messageId, newContent);
    showNotification('Message edited!');
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
        {chatMessages.map((message) => (
          message.role === 'user' ? (
            <UserMessageBubble
              key={message.id}
              message={message}
              onEdit={handleEdit}
              onCopy={handleCopy}
            />
          ) : (
            <AssistantMessage
              key={message.id}
              message={message}
              onCopy={handleCopy}
              onLike={handleLike}
              onDislike={handleDislike}
              onShare={handleShare}
              onRegenerate={handleRegenerate}
            />
          )
        ))}
        <ChatLoader/>
      </div>
    </div>
  );
};

export default MessagesScreen;