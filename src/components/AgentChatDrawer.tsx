import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PaperMeta } from '../types/paper';
import { Send, Bot, User, Loader2, Sparkles, X, MessageSquare, ChevronUp, ChevronDown } from 'lucide-react';

interface AgentChatDrawerProps {
  paperMeta: PaperMeta;
  paperSummary: string;
}

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  paperMeta,
  paperSummary,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Hello! I'm your CS Research Agent. I've analyzed "${paperMeta.title}". You can ask me to explain any equation, discuss PyTorch implementation details, analyze hardware constraints, or brainstorm code for your internship projects!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperTitle: paperMeta.title,
          paperSummary,
          userQuestion: userMsg.content,
          previousHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Could not process query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, an error occurred while connecting to the CS Research Agent.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    'How do I test Project 1 on a consumer GPU like RTX 3060?',
    'Explain the key mathematical difference between this and prior models.',
    'Write the minimal PyTorch layer forward pass for this.',
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-2xl shadow-indigo-600/40 border border-white/20 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span className="text-sm font-semibold">Ask Research Agent</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      ) : (
        <div className="w-[92vw] sm:w-[440px] h-[520px] rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-slideUp">
          
          {/* Drawer Header */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Research Paper Mentor
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                    Agent
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
                  {paperMeta.title}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none font-sans'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span className="text-[10px] opacity-60 block mt-1 text-right">
                    {m.timestamp}
                  </span>
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Agent thinking with STEM precision...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompt suggestions */}
          <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-850 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="shrink-0 px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 transition truncate max-w-[200px]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask equation, code, PyTorch stack..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
