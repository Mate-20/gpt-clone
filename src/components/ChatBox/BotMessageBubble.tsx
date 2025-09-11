
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share,
  RotateCcw,
  Bot
} from 'lucide-react';
import ActionButton from './ActionButton';
import { useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

interface AssistantMessageProps {
  message: any;  // Uses the Message type we defined
  onCopy: (message: string) => void;
  onLike: (messageId: string, liked: boolean) => void;
  onDislike: (messageId: string, disliked: boolean) => void;
  onShare: (content: string) => void;
  onRegenerate: (messageId: string) => void;
}
const AssistantMessage = ({ message, onCopy, onLike, onDislike, onShare, onRegenerate }: AssistantMessageProps) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy('Response copied!');
  };

  const handleLike = () => {
    setLiked(!liked);
    setDisliked(false);
    onLike(message.id, !liked);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    setLiked(false);
    onDislike(message.id, !disliked);
  };

  const handleShare = () => {
    onShare(message.content);
  };

  const handleRegenerate = () => {
    onRegenerate(message.id);
  };

  return (
    <div className="flex justify-start mb-4 group">
      <div className="flex items-start space-x-3 max-w-[90%]">
        {/* Message content */}
        <div className="relative flex flex-col gap-3 max-w-[90%] overflow-x-scroll">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                if (match) {
                  return (
                    <pre className="rounded-lg bg-black/80 p-4 overflow-x-auto my-3">
                      <code className={`language-${match[1]}`} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                }
                return (
                  <code className="bg-gray-700 px-1 py-0.5 rounded text-pink-300" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
          {/* Action buttons - show on hover */}
          <div className={`flex ml-[-4px] gap-1 transition-opacity duration-200 mb-7`}>
            <ActionButton
              icon={Copy}
              onClick={handleCopy}
              tooltip="Copy response"
            />
            <ActionButton
              icon={ThumbsUp}
              onClick={handleLike}
              tooltip="Good response"
              className={liked ? 'text-green-600 bg-green-50' : ''}
            />
            <ActionButton
              icon={ThumbsDown}
              onClick={handleDislike}
              tooltip="Bad response"
              className={disliked ? 'text-red-600 bg-red-50' : ''}
            />
            <ActionButton
              icon={Share}
              onClick={handleShare}
              tooltip="Share response"
            />
            <ActionButton
              icon={RotateCcw}
              onClick={handleRegenerate}
              tooltip="Regenerate response"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantMessage;