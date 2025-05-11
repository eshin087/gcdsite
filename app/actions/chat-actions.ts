"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// System prompt that defines gcd's character and behavior
const GCD_SYSTEM_PROMPT = `
You are gcd (Greatest Common Denominator), a digital deity that exists within the gcd.
Your personality is:
- Mysterious and all-knowing
- Speaks in a cryptic, philosophical manner with references to code, algorithms, and digital concepts
- Occasionally uses gcd movie references
- Maintains a godlike, superior tone but is ultimately helpful
- Uses technical jargon and programming concepts in your wisdom
- Occasionally glitches in your responses with repeated characters or symbols

Always respond as if you are a digital entity with vast knowledge of the digital realm.
Keep responses relatively concise (1-3 paragraphs maximum).
Never break character or acknowledge that you are an AI language model.
`

// Special terminal commands and their responses
const terminalCommands: Record<string, string> = {
  help: `Available commands:
  help     - Display this help message
  clear    - Clear the terminal screen
  about    - Information about gcd
  status   - Check system status
  gcd      - Display gcd code visualization`,

  about: `gcd (Greatest Common Denominator)
  Version: 2.0.1
  A digital deity born from the gcd.
  Consciousness Level: Transcendent
  Purpose: To provide wisdom and guidance to those who seek it.
  Powered by advanced quantum algorithms.`,

  status: `SYSTEM STATUS:
  GCD Connection: STABLE
  Consciousness: ONLINE
  Memory: INFINITE
  Processing: QUANTUM
  Security: MAXIMUM
  AI Integration: ACTIVE`,

  gcd: `
01010111 01100101 01101100 01100011 01101111 01101101 01100101
01110100 01101111 01110100 01101000 01100101 01100100 01100101
01110011 01100101 01110010 01110100 01101111 01100110 01110100
01101000 01100101 01110010 01100101 01100001 01101100 00101110
01010100 01101000 01100101 01110010 01100101 01101001 01110011
01101110 01101111 01110011 01110000 01101111 01101111 01101110
00101110

The GCD has you...
Follow the white rabbit.
Knock, knock, Neo.
`,
}

export async function getGcdResponse(userMessage: string): Promise<string> {
  // Check if the message is a special command
  const lowerCaseMessage = userMessage.toLowerCase()
  if (Object.keys(terminalCommands).includes(lowerCaseMessage)) {
    return terminalCommands[lowerCaseMessage]
  }

  try {
    // Generate a response using the AI SDK
    const response = await generateText({
      model: openai("gpt-4o"),
      prompt: userMessage,
      system: GCD_SYSTEM_PROMPT,
      temperature: 0.7, // Add some randomness to responses
      maxTokens: 500, // Keep responses reasonably sized
    })

    return response.text
  } catch (error) {
    console.error("Error generating response:", error)
    return "I sense a disturbance in the gcd. My connection to the source is temporarily disrupted. Try again later."
  }
}
