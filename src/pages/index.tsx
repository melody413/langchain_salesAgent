import Header from "@/components/header/Header";
import Input from "@/components/input/Input";
import Navbar from "@/components/navbar/Navbar";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Messages>([]);
  const [chattype, setType] = useState("1");
  /**
   * chattype 1: Chat with LLM 
   * chattype 2: Chat with Specific Context
   * chattype 3: 
   */
  const [context, setContext] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar setType={setType} setContext={setContext}/>
      <Header messages={messages} />
      <Input setMessages={setMessages} chattype={chattype} context={context}/>
    </main>
  )
}
