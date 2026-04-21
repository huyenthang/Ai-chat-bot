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
    <main className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`
      }}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="flex-1">
            <input 
              type="password" 
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Nhập NVIDIA API Key..."
              className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
            />
          </div>
          <button onClick={saveApiKey} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-purple-500/30">Lưu</button>
          <a href="https://build.nvidia.com/models" target="_blank" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">Lấy Key</a>
        </div>
      </header>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-24">
              <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">AI Chat</h2>
              <p className="text-gray-400 mb-2">Trò chuyện với Llama 3.1</p>
              <p className="text-gray-500 text-sm">Nhập tin nhắn để bắt đầu cuộc trò chuyện</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                  : 'bg-gradient-to-br from-cyan-500 to-blue-600'
              }`}>
                {msg.role === 'user' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 8v8l6-4z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17l1-5a6 6 0 0112 0l1 5" /></svg>
                )}
              </div>
              <div className={`max-w-[70%] px-5 py-4 rounded-2xl shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white' 
                  : 'bg-white/10 backdrop-blur text-white border border-white/10'
              }`}>
                <p className="whitespace-pre-wrap text-base leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17l1-5a6 6 0 0112 0l1 5" /></svg>
              </div>
              <div className="bg-white/10 backdrop-blur px-5 py-4 rounded-2xl border border-white/10">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                  <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                  <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 bg-black/20 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex gap-3">
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Nhập tin nhắn..."
              disabled={loading}
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-lg"
            />
            <button 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-semibold transition-all shadow-lg hover:shadow-purple-500/30 text-lg"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Credit */}
      <div className="fixed bottom-4 left-4 z-20 flex items-center gap-2 bg-black/30 backdrop-blur px-3 py-2 rounded-full">
        <img src="https://lh3.googleusercontent.com/a/ACg8ocJLGCzeKxlZmL3zVNZcrRd3LPEN1oWWxec8xZDT2KNLZKOr5w=s96-c" className="w-7 h-7 rounded-full" />
        <span className="text-gray-400 text-xs">Được tạo bởi Huyen Thang</span>
      </div>

      {/* Submit Button */}
      <button 
        onClick={submitHomework}
        className="fixed bottom-5 right-5 z-20 px-7 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-2xl text-white font-bold shadow-xl hover:shadow-green-500/30 transition-all text-base"
      >
        Nộp bài
      </button>
    </main>
  )
}