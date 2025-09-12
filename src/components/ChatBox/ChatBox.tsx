import React, { useState } from 'react'
import InputComponent from './InputComponent'
import MessagesScreen from './MessagesScreen';
import { sampleMessages } from '@/public/data/chats';
import { a } from 'framer-motion/client';
import { useChat } from '@/context/ChatContext';
import { sendMessageService } from '@/service/chatService';

interface Props {
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
  inputPromt: string;
}

const ChatBox = ({ setInputPrompt, inputPromt }: Props) => {

  const { messages, setMessages } = useChat();
  const [assistantMessageLoader, setAssistantMessageLoader] = useState(false);
  const sendMessage = async (inputMessage: string, editedHistory?: any[]) => {
    setAssistantMessageLoader(true);

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: inputMessage,
    };

    if (editedHistory) {
      // Case: Editing — reset messages to history 
      setMessages(editedHistory);
    } else {
      // Case: Normal — just append new msg
      setMessages((prev) => [...prev, userMessage]);
    }

    // this id is for AI
    const tempId = crypto.randomUUID();

    try {
      const finalReply = await sendMessageService(inputMessage, (partial) => {
        // stream updates
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempId),
          { id: tempId, role: "assistant", content: partial },
        ]);
      });

      // Finalize assistant message
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempId),
        { id: tempId, role: "assistant", content: finalReply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, content: "⚠️ Something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setAssistantMessageLoader(false);
    }
  };

  // This function is for editing a message and slicing all the after messages
  const handleEdit = (id: string, editedInput: string) => {
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) return;

    // Slice up to the edited message
    const before = messages.slice(0, index);
    const edited = { ...messages[index], content: editedInput };

    // Only keep messages before + edited one
    const updated = [...before, edited];
    // Restart from here: re-run AI for this edited message
    sendMessage(editedInput, updated);

  };


  return (
    <div className={`w-full h-full ${messages.length > 0 ? 'flex flex-col items-center justify-start' : 'flex-col-center'} relative px-3`}>
      {messages.length > 0 &&
        <div className='w-full flex-center max-h-[76vh] overflow-y-scroll pt-5'>
          <MessagesScreen chatMessages={messages} assistantMessageLoader={assistantMessageLoader} handleEdit={handleEdit} />
        </div>}
      <div className='flex-col-center gap-8 w-full px-3 mb-[60px]'>
        {messages.length === 0 && <span className='text-[28px] max-[540px]:mb-[30px]'>Ready when you are.</span>}
        <div className={`w-[94%] gap-1 flex-col-center max-[540px]:absolute max-[540px]:bottom-3 max-[540px]:w-[94%] ${messages.length > 0 ? 'absolute bottom-3 ' : ''}`}>
          <InputComponent setInputPrompt={setInputPrompt} inputPromt={inputPromt} setMessages={setMessages} messages={messages} setAssistantMessageLoader={setAssistantMessageLoader} sendMessage={sendMessage} />
          <span className='text-[12px] text-center w-[90%]'>ChatGPT can make mistakes. Check important info. See Cookie Preferences.</span>
        </div>
      </div>
    </div>
  )
}

export default ChatBox