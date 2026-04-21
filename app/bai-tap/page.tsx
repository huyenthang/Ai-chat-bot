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
    <main className="min-h-screen bg-gradient-to-b from-[#0d0d12] to-[#18181b] text-white flex flex-col">
      {/* Header */}
      <header className="bg-[#12121a]/80 backdrop-blur-md border-b border-[#2a2a3a] p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3 flex-wrap">
          <input 
            type="password" 
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="NVIDIA API Key"
            className="flex-1 min-w-[250px] px-4 py-2.5 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button onClick={saveApiKey} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-sm font-medium transition-all">Lưu</button>
          <a href="https://build.nvidia.com/models" target="_blank" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">Lấy API Key</a>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <p className="text-gray-400 text-lg">Chào bạn! Hãy nhập tin nhắn để bắt đầu</p>
              <p className="text-gray-600 text-sm mt-2">Sử dụng AI Llama 3.1</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600'
              }`}>
                {msg.role === 'user' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 8v8l6-4z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )}
              </div>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30' 
                  : 'bg-[#1a1a24] border border-[#2a2a3a]'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="bg-[#1a1a24] border border-[#2a2a3a] px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-[#12121a]/80 backdrop-blur-md border-t border-[#2a2a3a] p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập tin nhắn..."
            disabled={loading}
            className="flex-1 px-5 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button 
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 rounded-xl font-medium transition-all"
          >
            Gửi
          </button>
        </div>
      </div>

      {/* Credit */}
      <div className="fixed bottom-4 left-4 flex items-center gap-2 text-gray-500">
        <img src="https://lh3.googleusercontent.com/a/ACg8ocJLGCzeKxlZmL3zVNZcrRd3LPEN1oWWxec8xZDT2KNLZKOr5w=s96-c" className="w-8 h-8 rounded-full" />
        <span className="text-sm">Được tạo bởi Huyen Thang</span>
      </div>

      {/* Submit Button */}
      <button 
        onClick={submitHomework}
        className="fixed bottom-5 right-5 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl text-white font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:scale-105"
      >
        Nộp bài
      </button>
    </main>
  )
}