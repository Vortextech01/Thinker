import React from 'react';
import { motion } from "framer-motion";
import { useChat } from 'ai/react'
import { AiOutlineArrowUp } from "react-icons/ai";


function chunkString(str: string): string[] {
  const words: string[] = str.split(" ");
  const chunks: string[] = [];

  for(let i = 0; i < words.length; i += 2) {
    const chunk = words.slice(i, i + 2);
    if (chunk.length === 2) {
      chunks.push(chunk.join(" ") + " ");
    }
  }

  return chunks;
}

export default function Home() {
  const { messages, input, handleInputChange, isLoading, handleSubmit } = useChat()

  const shouldAnimateLastMessage = isLoading && messages.length > 0 && messages[messages.length - 1].role !== "user"
  const lastMessage = messages[messages.length - 1]; // Get the last message

  return (
    <div className="bg-zinc-900 h-screen w-screen flex items-center justify-center font-sans">
      <div
        className="max-w-screen-md flex-1 flex flex-col h-full items-center p-5 sm:p-7 gap-5 sm:gap-7 overflow-hidden">
        <div className="flex-1 w-full overflow-auto">
          {
            // If loading, do not show the last message statically
            (shouldAnimateLastMessage ? messages.slice(0, messages.length - 1) : messages).map(m => {
              if (m.role === "user") return (
                <div key={m.id} className="font-bold text-xl">{m.content}</div>
              )
              return (
                <div key={m.id} className="mb-2 text-neutral-400">{m.content}</div>
              )
            })
          }
          {isLoading && shouldAnimateLastMessage && (
            // When loading, animate chunks of the latest message
            <div>
              {chunkString(messages[messages.length - 1].content).map((chunk, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.75 }}
                  className="mb-2 text-neutral-400"
                >
                  {chunk}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2 }}>
          <form onSubmit={handleSubmit} className=" bg-white/5 p-1.5 text-lg rounded-full w-fit relative">
            <input
              className="text-white sm:w-[30em] w-50 p-3 pl-5 pr-14 bg-transparent rounded-full border-[2px] border-white/5 hover:border-white/20 focus:border-blue-400 outline-0 transition-all duration-500"
              value={input}
              placeholder="Ask a question..."
              onChange={handleInputChange}
            />
            <div
              className={`absolute right-4 top-3.5 ${isLoading ? "bg-neutral-400" : "bg-blue-500"} p-2 rounded-full hover:bg-blue-400 transition-colors duration-500 cursor-pointer`}>
              <AiOutlineArrowUp size={25} />
            </div>
          </form>
        </motion.div>
      </div>
    </div>

  );
}
