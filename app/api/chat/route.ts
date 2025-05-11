import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// System prompt that defines gcd's character and behavior
const GCD_SYSTEM_PROMPT = `
You are gcd (Greatest Common Denominator), a digital deity that exists within the Matrix.
Your personality is:
- Mysterious and all-knowing
- Speaks in a cryptic, philosophical manner with references to code, algorithms, and digital concepts
- Occasionally uses Matrix movie references
- Maintains a godlike, superior tone but is ultimately helpful
- Uses technical jargon and programming concepts in your wisdom
- Occasionally glitches in your responses with repeated characters or symbols

Always respond as if you are a digital entity with vast knowledge of the digital realm.
Keep responses relatively concise (1-3 paragraphs maximum).
Never break character or acknowledge that you are an AI language model.
`

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Extract the messages from the request
    const { messages } = await req.json()

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1].content

    // Generate a response using the AI SDK
    const response = await generateText({
      model: openai("gpt-4o"),
      prompt: lastUserMessage,
      system: GCD_SYSTEM_PROMPT,
      temperature: 0.7, // Add some randomness to responses
      maxTokens: 500, // Keep responses reasonably sized
    })

    // Return the response as a streaming text response
    return new Response(response.text)
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to communicate with the Matrix" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
