'use client';
import ChatBox from "@/components/ChatBox/ChatBox";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [inputPromt, setInputPrompt] = useState("");
  return (
    <div className="h-full w-full">
      <ChatBox setInputPrompt={setInputPrompt} inputPromt={inputPromt}/>
    </div>
  );
}
