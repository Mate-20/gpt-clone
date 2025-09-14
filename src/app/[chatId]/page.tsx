'use client';
import ChatBox from "@/components/ChatBox/ChatBox";
import { useEffect, useState } from "react";
import { getMessages } from "@/service/getMessagesService";
import {getMemoIdService} from "@/service/getMemoIdService"
import { useChat } from "@/context/ChatContext";
import { useParams } from "next/navigation";


export default function Page() {
  const { chatId } = useParams(); // chatId will be the dyna
  const { messages, setMessages } = useChat();
  const [mem0Id, setMem0Id] = useState("");

  const [inputPromt, setInputPrompt] = useState("");
  useEffect(() => {
    fetchMessages();  
    fetchMemoId();
  }, [])

  const fetchMemoId = async () => {
    try {
      const data = await getMemoIdService();
      if(data.mem0UserId){
        setMem0Id(data.mem0UserId)
      }
    } catch (err) {
      console.log("error")
    }
  }

  const fetchMessages = async () => {
    try {
      const data = await getMessages(chatId as string);
      setMessages(data);
    } catch (err) {
      console.log("error")
    }
  }
  return (
    <div className="h-[94vh] w-full flex flex-col">
      <ChatBox setInputPrompt={setInputPrompt} inputPromt={inputPromt} mem0Id={mem0Id} chatId={chatId as string}/>
    </div>
  );
}
