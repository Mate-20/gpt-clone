import React, { useEffect, useState } from 'react'
import InputComponent from './InputComponent'
import MessagesScreen from './MessagesScreen';
import { sampleMessages } from '@/public/data/chats';
import { a, div } from 'framer-motion/client';
import { useChat } from '@/context/ChatContext';
import { sendMessageService } from '@/service/chatService';
import LimitReached from './LimitReached';

interface Props {
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
  inputPromt: string;
}

const ChatBox = ({ setInputPrompt, inputPromt }: Props) => {

  const { messages, setMessages } = useChat();
  const [limitCrossed, setLimitCrossed] = useState(false);
  const [promptsLength, setPromptsLength] = useState(0);
  const [assistantMessageLoader, setAssistantMessageLoader] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("limitCrossed") == "true") {
      setLimitCrossed(true);
    }
  }, [])
  const sendMessage = async (inputMessage: string, editedHistory?: any[]) => {
    if (limitCrossed) return;
    
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

  // Setting the limit to 10 with local storage
  useEffect(() => {
    if (messages.length >= 10) {
      window.localStorage.setItem('limitCrossed', "true");
      setLimitCrossed(true);
    }
    const length = messages.filter((m)=>m.role == "user").length
    setPromptsLength(length)
  }, [messages])

  // This function is for editing a message and slicing all the after messages
  const handleEdit = (id: string, editedInput: string) => {
    if (limitCrossed) return;
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
        {messages.length === 0 &&
          <div className='flex flex-col items-center gap-1 w-full max-[780px]:mb-[40px]'>
            <span className='text-[28px]'>Temporary Chat</span>
            <span className='text-center text-[16px] text-[var(--secondary-text)] w-[220px] max-[780px]:hidden'>This chat won't appear in history, use or update ChatGPT's memory, or be used to train our models. For safety purposes, we may keep a copy of this chat for up to 30 days.</span>
          </div>
        }
        <div className={`w-[94%] gap-1 flex-col-center max-[780px]:absolute max-[780px]:bottom-3 max-[780px]:w-[94%] ${messages.length > 0 ? 'absolute bottom-3 ' : ''}`}>
          {limitCrossed && <div className='mb-4 w-full flex justify-center'>
            <LimitReached />
          </div>}
          <InputComponent setInputPrompt={setInputPrompt} inputPromt={inputPromt} setMessages={setMessages} promptsLength={promptsLength} setAssistantMessageLoader={setAssistantMessageLoader} sendMessage={sendMessage} limitCrossed={limitCrossed}/>
          <span className='text-[12px] text-center w-[90%]'>ChatGPT can make mistakes. Check important info. See Cookie Preferences.</span>
        </div>
      </div>
    </div>
  )
}

export default ChatBox