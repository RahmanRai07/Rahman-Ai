import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Mic, MicOff, Volume2, VolumeX, User, Bot, Trash2 } from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SYSTEM_PROMPT = `You are Rai, an intelligent AI career assistant for Indian college students. 
You are knowledgeable about placement preparation, technical interviews, resume building, 
aptitude tests, coding challenges, and the Indian job market. Be helpful, encouraging, and specific.`;

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Load chat history from API
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data.map((m: any) => ({ role: m.role as 'user' | 'model', content: m.content })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg = { role: 'user' as const, content: messageText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMsg),
      });

      const contents = [];
      // Add system context as first exchange
      contents.push({ role: 'user', parts: [{ text: SYSTEM_PROMPT }] });
      contents.push({ role: 'model', parts: [{ text: 'Understood! I am Rai, your career assistant. How can I help you today?' }] });
      // Add conversation history
      for (const m of updatedMessages) {
        contents.push({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.content }] });
      }

      const response = await ai.models.generateContent({
        model: MODELS.text,
        contents,
      });

      const modelMsg = { role: 'model' as const, content: response.text || "I'm sorry, I couldn't process that." };
      setMessages(prev => [...prev, modelMsg]);

      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelMsg),
      });
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please check your API key and try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSpeak = (text: string, index: number) => {
    if (speakingIndex !== null) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`]/g, ''));
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const clearHistory = async () => {
    setMessages([]);
    // Optionally clear from server
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col pt-24 pb-6 px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest">Neural Chat — Rai Assistant</h2>
        {messages.length > 0 && (
          <button onClick={clearHistory} className="flex items-center gap-1 text-white/20 hover:text-red-400 transition-colors text-xs">
            <Trash2 size={12} /> Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-20 h-20 bg-violet-glow/10 rounded-2xl flex items-center justify-center border border-violet-glow/20 shadow-lg shadow-violet-glow/10"
            >
              <Bot size={40} className="text-violet-glow" />
            </motion.div>
            <div className="space-y-2">
              <div className="label-mono">Neural Assistant Active</div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">System <span className="text-violet-glow">Rai</span></h2>
              <p className="text-white/40 max-w-sm font-medium">Intelligent career guidance powered by Gemini. Awaiting your request...</p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              {['How to crack TCS NQT?', 'Review my resume tips', 'Top DSA topics for placements', 'Mock interview questions'].map(q => (
                <button key={q} onClick={() => handleSend(q)}
                  className="p-3 text-left text-xs text-white/60 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
              msg.role === 'user' ? 'bg-gradient-to-br from-electric-blue to-violet-glow' : 'bg-white/5 border border-white/10'
            }`}>
              {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-violet-glow" />}
            </div>
            <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`glass-card p-4 inline-block text-left ${
                msg.role === 'user' ? 'bg-violet-glow text-white shadow-lg shadow-violet-glow/20' : 'bg-white/5 border border-white/10 text-white/80'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none font-medium leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              {msg.role === 'model' && (
                <button
                  onClick={() => handleSpeak(msg.content, i)}
                  className="block text-white/40 hover:text-violet-glow transition-colors"
                  title={speakingIndex === i ? 'Stop speaking' : 'Read aloud'}
                >
                  {speakingIndex === i ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Bot size={20} className="text-violet-glow" />
            </div>
            <div className="glass-card p-4 flex gap-1 items-center bg-white/5 border-white/10">
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-violet-glow rounded-full" />
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-violet-glow rounded-full" />
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-violet-glow rounded-full" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 glass-card p-2 flex gap-2 bg-white/[0.02] border-white/10 rounded-2xl">
        <button
          onClick={handleMic}
          className={`p-3 rounded-xl transition-all ${isListening ? 'bg-violet-glow text-white animate-pulse' : 'hover:bg-white/5 text-white/40'}`}
          title={isListening ? 'Stop listening' : 'Voice input'}
        >
          {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder={isListening ? 'Listening...' : 'Ask anything about your career...'}
          className="flex-1 bg-transparent border-none focus:ring-0 px-2 text-white placeholder:text-white/20 font-medium"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="btn-primary p-3 rounded-xl disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
