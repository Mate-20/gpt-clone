'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const randomChatId = `chat${uuidv4()}`;
    router.replace(`/${randomChatId}`);
  }, [router]);

  return null; // No JSX rendered
}