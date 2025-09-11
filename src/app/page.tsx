'use client';
import ChatBox from "@/components/ChatBox/ChatBox";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [inputPromt, setInputPrompt] = useState("");
  return (
    <div className="h-[94%] w-full flex flex-col">
      <ChatBox setInputPrompt={setInputPrompt} inputPromt={inputPromt} />
    </div>
  );
}
