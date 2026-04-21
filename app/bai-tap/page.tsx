'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('nvidia_api_key') || ''
    setApiKey(saved)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('nvidia_api_key', apiKey)
      alert('Đã lưu API Key!')
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || !apiKey) return
    
    const userMessage = input.trim()
    const currentMessages = [...messages, { role: 'user' as const, content: userMessage }]
    
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          apiKey, 
          messages: currentMessages 
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      const aiResponse = data.choices[0].message.content
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lỗi: ' + e.message }])
    } finally {
      setLoading(false)
    }
  }

  const submitHomework = async () => {
    const userMsgs = messages.filter(m => m.role === 'user')
    const aiMsgs = messages.filter(m => m.role === 'assistant')
    
    if (userMsgs.length < 1 || aiMsgs.length < 1) {
      alert('Bạn cần chat ít nhất 1 câu hỏi và nhận câu trả lời!')
      return
    }

    try {
      const canvas = document.body
      // Use html2canvas from CDN
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
      document.head.appendChild(script)
      await new Promise(r => script.onload = r)

      // @ts-ignore
      const img = await html2canvas(canvas)
      const screenshot = img.toDataURL('image/png').split(',')[1]

      const formData = new FormData()
      formData.append('screenshot', new Blob([atob(screenshot)], { type: 'image/png' }), 'screenshot.png')
      formData.append('agent', 'Huyen Thang')

      const res = await fetch('https://trangden.vn/agentsee/api/bai-tap/3549/564d60b09cb940e96a9ea2c76f9ecbc4/tuan-1/bai-6/cau-1', {
        method: 'POST',
        body: formData
      })

      const result = await res.json()
      if (result.success) alert('Nộp bài thành công! 🎉')
      else alert('Lỗi: ' + (result.message || 'Không thể nộp'))
    } catch (e: any) {
      alert('Lỗi: ' + e.message)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] flex flex-col">
      <header className="bg-[#12121a] border-b border-[#1e1e2e] p-4 flex items-center gap-3 flex-wrap">
        <input 
          type="password" 
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="NVIDIA API Key"
          className="flex-1 min-w-[200px] px-4 py-2 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg"
        />
        <button onClick={saveApiKey} className="px-4 py-2 bg-[#6366f1] rounded-lg">Save</button>
        <a href="https://build.nvidia.com/models" target="_blank" className="text-[#6366f1] text-sm">Lấy API Key</a>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-[#9ca3af] mt-12">Hãy nhập tin nhắn để bắt đầu</div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`max-w-[80%] px-4 py-3 rounded-xl ${
            msg.role === 'user' 
              ? 'bg-[#1e1b4b] ml-auto rounded-br-sm' 
              : 'bg-[#18181b] mr-auto rounded-bl-sm'
          }`}>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}

        {loading && (
          <div className="max-w-[80%] bg-[#18181b] px-4 py-3 rounded-xl mr-auto">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#9ca3af] rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
              <span className="w-2 h-2 bg-[#9ca3af] rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
              <span className="w-2 h-2 bg-[#9ca3af] rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[#12121a] border-t border-[#1e1e2e] p-4 flex gap-3">
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Nhập tin nhắn..."
          disabled={loading}
          className="flex-1 px-4 py-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg"
        />
        <button 
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-[#6366f1] rounded-lg disabled:opacity-50"
        >
          Gửi
        </button>
      </div>

      <div className="fixed bottom-4 left-4 flex items-center gap-2 text-[#9ca3af]">
        <img src="https://lh3.googleusercontent.com/a/ACg8ocJLGCzeKxlZmL3zVNZcrRd3LPEN1oWWxec8xZDT2KNLZKOr5w=s96-c" className="w-8 h-8 rounded-full" />
        <span>Được tạo bởi Huyen Thang</span>
      </div>

      <button 
        onClick={submitHomework}
        className="fixed bottom-6 right-6 px-6 py-3 bg-[#22c55e] rounded-lg text-white font-semibold shadow-lg"
      >
        Nộp bài
      </button>
    </main>
  )
}