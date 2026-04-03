import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Bot, AlertTriangle, ChevronRight, Activity, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { detectIntent, getQuickReplies } from '../../utils/chatbotEngine';
import { getAIResponse } from '../../services/aiService';

export default function HealthBotTab() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to LifeLink AI! I'm here to help with health queries, first aid, or blood donation support. How are you feeling today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMessage = { id: Date.now(), text: textToSend, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    if (!textOverride) setInput('');
    setIsTyping(true);

    // 1. Check local intent
    const intent = detectIntent(textToSend);

    // 2. Respond
    setTimeout(async () => {
      if (!intent.fallback) {
        const botMessage = { 
          id: Date.now() + 1, 
          text: intent.response, 
          isBot: true,
          action: intent.action,
          isEmergency: intent.isEmergency,
          suggestions: intent.suggestions
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      } else {
        // Fallback to AI
        const aiResponse = await getAIResponse(textToSend);
        setMessages(prev => [...prev, {
          id: Date.now() + 2,
          text: aiResponse.text,
          isBot: true,
          isError: aiResponse.isError
        }]);
        setIsTyping(false);
      }
    }, 800);
  };

  const handleSuggestion = (suggestion) => {
    handleSend(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Header */}
      <div className="p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
            <Sparkles className="w-32 h-32 rotate-12" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-inner relative">
            <Bot className="w-8 h-8 text-white" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-4 border-indigo-700 rounded-full"></span>
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">LifeLink Intelligent AI</h3>
            <p className="text-blue-100/70 text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-300" /> Medical & Support Protocol Active
            </p>
          </div>
        </div>
        <button 
            onClick={() => setMessages([{ id: Date.now(), text: "Chat history cleared. How can I assist you?", isBot: true }])} 
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all group"
            title="Clear Chat"
        >
            <RefreshCw className="w-5 h-5 text-blue-100 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/30 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-in zoom-in-95 duration-300`}>
            <div className={`max-w-[75%] p-6 rounded-3xl shadow-sm relative ${
              msg.isBot 
                ? msg.isError 
                  ? 'bg-amber-50 border border-amber-100 text-amber-900 rounded-tl-none' 
                  : msg.isEmergency 
                    ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-none' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none' 
                : 'bg-indigo-950 text-white rounded-tr-none'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {msg.isBot ? (
                  msg.isEmergency ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <Bot className="w-4 h-4 text-blue-600" />
                ) : <User className="w-4 h-4 text-indigo-300 opacity-70" />}
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                  {msg.isBot ? (msg.isEmergency ? 'Critical Response' : 'Intelligent Assistant') : 'User Session'}
                </span>
              </div>
              <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
              
              {msg.suggestions && (
                  <div className="mt-6 flex flex-wrap gap-2">
                      {msg.suggestions.map((s, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleSuggestion(s)}
                            className="px-4 py-2 bg-indigo-50 text-indigo-900 text-xs font-bold rounded-xl border border-indigo-100 hover:bg-indigo-950 hover:text-white transition-all"
                          >
                            {s}
                          </button>
                      ))}
                  </div>
              )}

              {msg.action && (
                <button 
                  onClick={() => navigate(msg.action)}
                  className={`mt-6 px-6 py-3 w-full text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                    msg.isEmergency 
                      ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/20' 
                      : 'bg-indigo-950 text-white hover:bg-blue-600 shadow-xl'
                  }`}
                >
                  {msg.isEmergency ? 'Deploy Emergency Protocol' : 'Take Action Now'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2 items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-slate-100">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your symptoms or ask about blood donation..."
            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600/10 rounded-[28px] py-6 pl-8 pr-20 text-lg font-medium text-slate-800 placeholder:text-slate-400 transition-all duration-500 outline-none shadow-inner"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className={`absolute right-3 p-4 rounded-2xl transition-all duration-500 transform active:scale-90 ${
              input.trim() ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 hover:scale-105' : 'bg-slate-200 text-slate-400'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar py-2">
            {getQuickReplies().map((reply, i) => (
                <button 
                    key={i}
                    onClick={() => handleSuggestion(reply.label)}
                    className="whitespace-nowrap px-6 py-2.5 bg-white border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-widest rounded-full hover:border-indigo-600 hover:text-indigo-600 transition-all"
                >
                    {reply.label}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}
