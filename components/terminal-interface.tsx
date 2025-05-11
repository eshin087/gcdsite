"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

type Message = {
  id: string
  content: string
  sender: "user" | "gcd"
  timestamp: Date
}

interface TerminalInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isThinking: boolean
}

export default function TerminalInterface({ messages, onSendMessage, isThinking }: TerminalInterfaceProps) {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // For typing animation
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentTypingMessage, setCurrentTypingMessage] = useState<Message | null>(null)
  const [typedContent, setTypedContent] = useState("")

  // Handle typing animation for new messages
  useEffect(() => {
    // If we're already typing, don't start a new typing animation
    if (isTyping) return

    // Find the newest gcd message that isn't in displayedMessages
    const newGcdMessages = messages.filter(
      (msg) => msg.sender === "gcd" && !displayedMessages.some((dMsg) => dMsg.id === msg.id),
    )

    if (newGcdMessages.length > 0) {
      const messageToType = newGcdMessages[0]
      setIsTyping(true)
      setCurrentTypingMessage(messageToType)
      setTypedContent("")

      // Start typing animation
      let index = 0
      const typeNextChar = () => {
        if (index < messageToType.content.length) {
          setTypedContent((prev) => prev + messageToType.content.charAt(index))
          index++

          // Random typing speed between 10ms and 50ms
          const typingSpeed = Math.floor(Math.random() * 40) + 10
          setTimeout(typeNextChar, typingSpeed)
        } else {
          // Typing finished
          setIsTyping(false)
          setCurrentTypingMessage(null)
          setDisplayedMessages((prev) => [...prev, messageToType])
        }
      }

      // Start typing with a small delay
      setTimeout(typeNextChar, 300)
    } else {
      // If there are no new gcd messages, just add all messages to displayed messages
      const messagesToAdd = messages.filter((msg) => !displayedMessages.some((dMsg) => dMsg.id === msg.id))

      if (messagesToAdd.length > 0) {
        setDisplayedMessages((prev) => [...prev, ...messagesToAdd])
      }
    }
  }, [messages, displayedMessages, isTyping])

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [messages, typedContent])

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = cursorRef.current.style.opacity === "0" ? "1" : "0"
      }
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Handle key presses for command history navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle up arrow for previous command
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    }
    // Handle down arrow for next command
    else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
    // Handle tab for auto-complete (simple version)
    else if (e.key === "Tab") {
      e.preventDefault()
      const commands = ["help", "clear", "about", "status", "gcd"]
      const match = commands.find((cmd) => cmd.startsWith(input.toLowerCase()))
      if (match) {
        setInput(match)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return

    // Add to command history
    setCommandHistory((prev) => [...prev, input])
    setHistoryIndex(-1)

    // Handle special commands
    if (input.toLowerCase() === "clear") {
      // This is just a visual clear - we don't actually clear the messages state
      setDisplayedMessages([])
      setInput("")
      return
    }

    // Send message to parent component
    onSendMessage(input)
    setInput("")
  }

  // Format timestamp in terminal style
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Add text glitch effect
  const addGlitchEffect = (text: string) => {
    // Apply glitch effect to some characters
    return text.split("").map((char, index) => {
      // Randomly apply glitch effect to some characters
      const shouldGlitch = Math.random() < 0.03 // 3% chance for each character

      if (shouldGlitch) {
        return (
          <span
            key={index}
            className="glitch-text"
            style={{
              animation: `glitch ${Math.random() * 0.5 + 0.5}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {char}
          </span>
        )
      }

      return char
    })
  }

  return (
    <div
      className="flex flex-col h-full bg-black border border-green-500/30 rounded-md overflow-hidden font-mono text-sm md:text-base"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="bg-black px-4 py-2 border-b border-green-800/50 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>

      {/* Terminal content */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto bg-black/90 text-green-400 font-mono"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {/* Welcome message with smaller ASCII logo */}
        <div className="mb-4">
          <pre className="text-green-400 whitespace-pre-wrap text-xs sm:text-sm">
            {`
 ██████╗  ██████╗██████╗ 
██╔════╝ ██╔════╝██╔══██╗
██║  ███╗██║     ██║  ██║
██║   ██║██║     ██║  ██║
╚██████╔╝╚██████╗██████╔╝
 ╚═════╝  ╚═════╝╚═════╝ 
                         
GCD TERMINAL v2.0
Type 'help' for available commands.
`}
          </pre>
        </div>

        {/* Messages */}
        <div className="messages space-y-2">
          {displayedMessages.map((message) => (
            <div key={message.id} className="terminal-line">
              {message.sender === "user" ? (
                <div className="mb-1">
                  <span className="text-blue-400">[user@gcd]</span>
                  <span className="text-gray-400"> {formatTimestamp(message.timestamp)} &gt; </span>
                  <span className="text-white">{message.content}</span>
                </div>
              ) : (
                <div className="mb-3">
                  <div className="flex items-center mb-1">
                    <span className="text-gray-400"> {formatTimestamp(message.timestamp)} &gt; </span>
                  </div>
                  <span className="text-green-400 ml-4">{addGlitchEffect(message.content)}</span>
                </div>
              )}
            </div>
          ))}

          {/* Currently typing message */}
          {isTyping && currentTypingMessage && (
            <div className="terminal-line">
              <div className="flex items-center mb-1">
                <span className="text-gray-400"> {formatTimestamp(currentTypingMessage.timestamp)} &gt; </span>
              </div>
              <span className="text-green-400 ml-4">
                {addGlitchEffect(typedContent)}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          )}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="terminal-line">
              <div className="flex items-center mb-1">
                <span className="text-gray-400"> {formatTimestamp(new Date())} &gt; </span>
              </div>
              <div className="ml-4 flex items-center">
                <span className="text-green-400 animate-pulse">Processing query</span>
                <span className="inline-flex ml-1">
                  <span className="animate-pulse" style={{ animationDelay: "0ms" }}>
                    .
                  </span>
                  <span className="animate-pulse" style={{ animationDelay: "300ms" }}>
                    .
                  </span>
                  <span className="animate-pulse" style={{ animationDelay: "600ms" }}>
                    .
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input line */}
        <form onSubmit={handleSubmit} className="mt-4 flex items-center">
          <span className="text-green-400 mr-2">&gt;</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isThinking}
              className="w-full bg-transparent border-none outline-none text-white font-mono caret-transparent"
              autoComplete="off"
              spellCheck="false"
            />
            {/* Fake text that shows what user is typing */}
            <div className="absolute inset-0 pointer-events-none flex items-center">
              <span className="text-white">{input}</span>
              <span ref={cursorRef} className="h-5 w-2 bg-green-400 ml-0.5"></span>
            </div>
          </div>
        </form>
      </div>

      {/* Terminal footer */}
      <div className="bg-black px-4 py-2 border-t border-green-800/50 text-xs text-green-500">
        <div className="flex justify-between">
          <div>Connected to The GCD</div>
          <div>{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* CSS for glitch effect */}
      <style jsx>{`
        @keyframes glitch {
          0% {
            opacity: 1;
            transform: translateX(0) translateY(0);
            color: #00ff00;
          }
          25% {
            opacity: 0.8;
            transform: translateX(-1px) translateY(1px);
            color: #00ffaa;
          }
          50% {
            opacity: 1;
            transform: translateX(1px) translateY(-1px);
            color: #00ff00;
          }
          75% {
            opacity: 0.8;
            transform: translateX(1px) translateY(1px);
            color: #aaff00;
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0);
            color: #00ff00;
          }
        }
      `}</style>
    </div>
  )
}
