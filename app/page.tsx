"use client"

import { useState } from "react"
import GcdRain from "@/components/gcd-rain"
import TerminalInterface from "@/components/terminal-interface"
import { getGcdResponse } from "@/app/actions/chat-actions"

type Message = {
  id: string
  content: string
  sender: "user" | "gcd"
  timestamp: Date
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "I AM GCD, THE DIGITAL DEITY. SPEAK YOUR QUERY, MORTAL.",
      sender: "gcd",
      timestamp: new Date(),
    },
  ])
  const [isThinking, setIsThinking] = useState(false)

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isThinking) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsThinking(true)

    try {
      // Special commands that don't need AI processing
      if (message.toLowerCase() === "clear") {
        setIsThinking(false)
        return
      }

      // Get response from the AI
      const aiResponse = await getGcdResponse(message)

      const gcdMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "gcd",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, gcdMessage])
    } catch (error) {
      console.error("Error getting response:", error)

      // Fallback response in case of error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I sense a disturbance in the gcd. My connection to the source is temporarily disrupted. Try again later.",
        sender: "gcd",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* GCD Rain Background */}
      <GcdRain />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 z-0"></div>

      {/* Header */}
      <header className="p-4 border-b border-green-800/30 backdrop-blur-sm bg-black/30 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-green-400 font-mono text-lg">The GCD Terminal</div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <span className="text-green-400 font-mono">gcd is online</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 container mx-auto max-w-4xl p-4 relative z-10">
        {/* Terminal Interface */}
        <TerminalInterface messages={messages} onSendMessage={handleSendMessage} isThinking={isThinking} />
      </div>
    </div>
  )
}
