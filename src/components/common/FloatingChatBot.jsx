import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { detectIntent, getQuickReplies } from '../../utils/chatbotEngine';
import { getAIResponse } from '../../services/aiService';

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm DSU LifeLink AI. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // 1. Check local intent
    const intent = detectIntent(currentInput);

    // 2. If it's an emergency or a definite local intent, respond immediately
    if (!intent.fallback) {
      setTimeout(() => {
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
      }, 600);
      return;
    }

    // 3. Fallback to AI (ChatGPT)
    const aiResponse = await getAIResponse(currentInput);
    
    setMessages(prev => [...prev, {
      id: Date.now() + 2,
      text: aiResponse.text,
      isBot: true,
      isError: aiResponse.isError
    }]);
    setIsTyping(false);
  };

  const handleQuickReply = (reply) => {
    const userMsg = { id: Date.now(), text: reply.label, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const intent = detectIntent(reply.label);
      const botMsg = { 
        id: Date.now() + 1, 
        text: intent.response, 
        isBot: true,
        action: intent.action,
        isEmergency: intent.isEmergency
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const executeAction = (action) => {
    if (action === 'SOS_TRIGGER') {
      alert("CRITICAL SOS DEPLOYED via ChatBot! All nearby help notified.");
      setIsOpen(false);
    } else if (action) {
      navigate(action);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-full sm:w-[350px] md:w-[400px] h-[500px] mb-4 bg-white rounded-3xl shadow-2xl border border-blue-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-inner relative">
                <Bot className="w-6 h-6 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-700 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-wide">LifeLink Bot</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Online & Ready
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 group"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-in zoom-in-95 duration-200`}>
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                  msg.isBot 
                    ? msg.isError 
                      ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-none' 
                      : msg.isEmergency 
                        ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-none' 
                        : 'bg-white border border-blue-50 text-slate-800 rounded-tl-none' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.isBot ? (
                      msg.isEmergency ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <Bot className="w-4 h-4 text-blue-600" />
                    ) : <User className="w-4 h-4 text-blue-100 opacity-70" />}
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
                      {msg.isBot ? 'LifeLink Bot' : 'You'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleQuickReply({ label: s })}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.action && (
                    <button 
                      onClick={() => executeAction(msg.action)}
                      className={`mt-4 px-4 py-2 w-full text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        msg.isEmergency 
                          ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-[1.02]' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {msg.isEmergency ? 'ACTIVATE SOS NOW' : 'Open Section'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-blue-50 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-3 border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth bg-white">
            {getQuickReplies().map((reply, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(reply)}
                className="whitespace-nowrap px-4 py-2 text-xs font-semibold bg-white border border-blue-100 text-blue-600 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm shrink-0"
              >
                {reply.label}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_10px_rgba(30,58,138,0.02)]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type here (e.g., 'blod venum'...)"
                className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 transition-all duration-200 outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`absolute right-1.5 p-2 rounded-xl transition-all duration-300 transform active:scale-90 ${
                  input.trim() ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'bg-slate-200 text-slate-400'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 group relative ${
          isOpen ? 'bg-white border-blue-100' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-slate-50 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-bounce shadow-md">
            1
          </span>
        )}
        {isOpen ? (
          <X className="w-7 h-7 text-blue-600 rotate-0 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
}
