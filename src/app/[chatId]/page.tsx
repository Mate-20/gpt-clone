'use client';
import ChatBox from "@/components/ChatBox/ChatBox";
import { useEffect, useState } from "react";
import { getMessages } from "@/service/getMessagesService";
import { getMemoIdService } from "@/service/getMemoIdService"
import { useChat } from "@/context/ChatContext";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";


export default function Page() {
  const { chatId } = useParams(); // chatId will be the dynamic
  const { setMessages } = useChat();
  const [mem0Id, setMem0Id] = useState("");
  const [loading, setLoading] = useState(true);

  const [inputPromt, setInputPrompt] = useState("");
  useEffect(() => {
    fetchMessages();
    fetchMemoId();
  }, [])

  const fetchMemoId = async () => {
    try {
      const data = await getMemoIdService();
      if (data.mem0UserId) {
        setMem0Id(data.mem0UserId)
      } else {
        const tempMemoId = uuidv4();
        setMem0Id(tempMemoId)
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
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {loading ?
        <div className="flex items-center justify-center h-[94vh]">
          <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
        :
        <div className="h-[94vh] w-full flex flex-col">
          <ChatBox setInputPrompt={setInputPrompt} inputPromt={inputPromt} mem0Id={mem0Id} chatId={chatId as string} />
        </div>}
    </>

  );
}
