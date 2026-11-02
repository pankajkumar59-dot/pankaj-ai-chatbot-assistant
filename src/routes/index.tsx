import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Send, Sparkles, Square } from 'lucide-react'
import { Streamdown } from 'streamdown'

import { useAIChat } from '@/lib/ai-hook'
import type { ChatMessages } from '@/lib/ai-hook'

const SUGGESTIONS = [
  "What's the weather like in Lisbon right now?",
  'Help me brainstorm names for a coffee shop',
  'Explain how neural networks work, simply',
  'Draft a polite email asking for a deadline extension',
]

function Messages({ messages }: { messages: ChatMessages }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  if (!messages.length) {
    return null
  }

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto pb-4 min-h-0"
    >
      <div className="max-w-3xl mx-auto w-full px-4">
        {messages.map((message) => {
          const isUser = message.role === 'user'
          return (
            <div key={message.id} className="py-3">
              <div
                className={`flex items-start gap-3 max-w-3xl mx-auto w-full ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {isUser ? 'You' : <Sparkles className="w-4 h-4" />}
                </div>
                <div
                  className={`flex-1 min-w-0 rounded-2xl px-4 py-3 ${
                    isUser
                      ? 'bg-indigo-600 text-white max-w-[85%] ml-auto'
                      : 'bg-slate-100 text-slate-900 max-w-[85%]'
                  }`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === 'text' && part.content) {
                      return (
                        <div
                          className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}
                          key={index}
                        >
                          <Streamdown>{part.content}</Streamdown>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Home() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, stop } = useAIChat()

  const submit = (text: string) => {
    if (text.trim() && !isLoading) {
      sendMessage(text)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="h-16 flex items-center gap-3 px-6 border-b flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="font-semibold text-slate-900 leading-tight">
            Lumen
          </div>
          <div className="text-xs text-slate-500 leading-tight">
            Your AI assistant
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto w-full">
              <h1 className="text-4xl font-bold mb-3 text-slate-900">
                Ask Lumen anything
              </h1>
              <p className="mb-8 text-slate-600">
                Get quick answers, brainstorm ideas, draft writing, or check
                the weather anywhere in the world.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => submit(suggestion)}
                    className="text-left text-sm px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-slate-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <Messages messages={messages} />

        <div className="sticky bottom-0 left-0 right-0 border-t z-10 bg-white">
          <div className="max-w-3xl mx-auto w-full px-4 py-3">
            {isLoading && (
              <div className="flex items-center justify-center mb-3">
                <button
                  onClick={stop}
                  className="px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                >
                  <Square className="w-4 h-4 fill-current" />
                  Stop
                </button>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(input)
              }}
            >
              <div className="relative max-w-xl mx-auto flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Lumen anything..."
                  className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-3 rounded-full bg-indigo-600 text-white disabled:opacity-40 disabled:bg-slate-300 hover:bg-indigo-700 transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
