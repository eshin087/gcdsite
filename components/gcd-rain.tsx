"use client"

import { useEffect, useRef } from "react"

export default function GcdRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resize)
    resize()

    // GCD characters - taken from the GCD movie
    const gcdChars = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    // Creating the drops
    const drops: number[] = []

    // Number of columns for the rain
    const columns = Math.floor(canvas.width / 10) // Changed from 20 to 10

    // Initialize all drops to random positions above the screen
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // Drawing the characters
    function draw() {
      // Ensure canvas and context are still valid to address TypeScript errors
      if (!canvas || !ctx) {
        return;
      }

      // Black BG with opacity for the fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set the font and color
      ctx.font = "10px monospace" // Changed from 15px to 10px

      // Loop over drops
      for (let i = 0; i < drops.length; i++) {
        // Get a random character
        const text = gcdChars.charAt(Math.floor(Math.random() * gcdChars.length))

        // Varying green colors for more authentic look
        const greenIntensity = Math.random() * 155 + 100 // 100-255
        ctx.fillStyle = `rgba(0, ${greenIntensity}, 0, 0.8)`

        // x coordinate of the drop (i * fontSize), y coordinate is drops[i] * fontSize
        ctx.fillText(text, i * 10, drops[i] * 10) // Changed from 20 to 10

        // Sending the drop back to the top randomly after it has crossed the screen
        // Adding randomness to the reset to make the drops scattered
        if (drops[i] * 10 > canvas.height && Math.random() > 0.975) { // Changed from 20 to 10
          drops[i] = 0
        }

        // Incrementing Y coordinate
        drops[i]++
      }
    }

    // Animation loop
    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-40 pointer-events-none" />
}
