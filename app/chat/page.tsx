'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    const currentMessages = [...messages, { role: 'user' as const, content: userMessage }]
    
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setStreamingContent('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages }),
      })

      if (!res.ok) {
        throw new Error('Failed to get response')
      }

      if (!res.body) {
        throw new Error('No response body')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk
        setStreamingContent(fullContent)
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fullContent },
      ])
      setStreamingContent('')
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h1 className="text-lg font-semibold text-text-primary">AI Agent Chat</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-text-secondary mt-8">
            <p>Ask me anything about AI and AI Agents</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] ${
              msg.role === 'assistant' ? 'mr-auto' : 'ml-auto'
            }`}
          >
            <div
              className={`px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-user-msg text-text-primary'
                  : 'bg-ai-msg text-text-primary'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {streamingContent && (
          <div className="max-w-[80%] mr-auto">
            <div className="bg-ai-msg px-4 py-3 rounded-lg text-text-primary">
              <p className="whitespace-pre-wrap">
                {streamingContent}
                <span className="typing-cursor" />
              </p>
            </div>
          </div>
        )}

        {loading && !streamingContent && (
          <div className="max-w-[80%] mr-auto">
            <div className="bg-ai-msg px-4 py-3 rounded-lg text-text-secondary">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  )
}