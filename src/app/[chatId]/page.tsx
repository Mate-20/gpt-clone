'use client';
import ChatBox from "@/components/ChatBox/ChatBox";
import { useEffect, useState } from "react";
import { getMessages } from "@/service/getMessagesService";
import { useChat } from "@/context/ChatContext";
import { useParams } from "next/navigation";


export default function Page() {
  const { chatId } = useParams(); // chatId will be the dyna
  const { messages, setMessages } = useChat();

  const [inputPromt, setInputPrompt] = useState("");
  useEffect(() => {
    fetchMessages();  
  }, [])

  const fetchMessages = async () => {
    try {
      const data = await getMessages(chatId as string);
      console.log("messages", data)
      setMessages(data);
    } catch (err) {
      console.log("error")
    }
  }
  return (
    <div className="h-[94vh] w-full flex flex-col">
      <ChatBox setInputPrompt={setInputPrompt} inputPromt={inputPromt} />
    </div>
  );
}
