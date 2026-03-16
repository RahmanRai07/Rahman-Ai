import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Download, Sparkles, Wand2, RefreshCw, Palette, Image as ImageIcon, Send, Bot, User, Layers, Maximize2, Trash2, History, Eye } from 'lucide-react';
import { processImageAction } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

export const ImageEnhancement: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'history'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setOriginalImage(base64);
        setCurrentImage(base64);
        setMessages([{
          id: 'init',
          role: 'assistant',
          content: `✅ Image uploaded! I can analyze and describe transformations for your image. Try commands like:\n- "Describe how to enhance this photo"\n- "What colors would look good here?"\n- "Analyze the composition"\n- "How would a vintage effect look?"`,
          image: base64,
          timestamp: new Date()
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const processCommand = async (command: string) => {
    if (!currentImage || isProcessing || !command.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: command,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      const result = await processImageAction(currentImage, command);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.content || "I analyzed your image.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Error: ${error?.message || 'Failed to process. Please check your Gemini API key.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickActions = [
    { icon: Eye, label: 'Analyze', command: 'Analyze this image in detail: colors, composition, subject, mood' },
    { icon: Sparkles, label: 'Enhance Tips', command: 'How would you enhance the quality and details of this image?' },
    { icon: Palette, label: 'Color Story', command: 'Describe the color palette and suggest improvements' },
    { icon: Layers, label: 'Style Ideas', command: 'Suggest 3 creative artistic styles for this image' },
  ];

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-20 px-6 min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div className="space-y-4">
          <div className="label-mono text-violet-glow/60">Vision AI Studio — Powered by Gemini</div>
          <h2 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter leading-none">Vision</h2>
        </div>
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button onClick={() => setActiveTab('edit')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-violet-glow text-white' : 'text-white/40 hover:text-white'}`}>Editor</button>
          <button onClick={() => setActiveTab('history')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-violet-glow text-white' : 'text-white/40 hover:text-white'}`}>History</button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-12 gap-8">
        {/* Image Preview */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <motion.div layout className="flex-1 glass-card relative overflow-hidden flex items-center justify-center bg-black/40 group min-h-[400px] border-white/5">
            <AnimatePresence mode="wait">
              {currentImage ? (
                <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex items-center justify-center p-4">
                  <img src={currentImage} alt="Current" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
                  <div className="absolute top-8 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setCurrentImage(originalImage)} className="p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all" title="Reset">
                      <RefreshCw size={20} />
                    </button>
                    <a href={currentImage} download="rai-vision.png" className="p-4 rounded-2xl bg-violet-glow text-white shadow-xl hover:scale-110 transition-all">
                      <Download size={20} />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="placeholder" className="text-center space-y-8 p-12">
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-violet-glow/20 rounded-[2.5rem] blur-2xl animate-pulse" />
                    <div className="relative w-full h-full glass-card rounded-[2.5rem] flex items-center justify-center border-violet-glow/30">
                      <Upload className="text-violet-glow" size={48} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white">Upload Your Image</h3>
                  <p className="text-white/40 max-w-sm mx-auto">Upload any image and let Gemini AI analyze and describe creative transformations.</p>
                  <button onClick={() => fileInputRef.current?.click()} className="btn-primary px-12 py-5 text-lg">Select Image</button>
                </motion.div>
              )}
            </AnimatePresence>
            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button key={action.label} onClick={() => processCommand(action.command)} disabled={!currentImage || isProcessing}
                className="glass-card p-6 flex flex-col items-center gap-3 hover:bg-white/5 transition-all disabled:opacity-50 group border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-violet-glow group-hover:scale-110 group-hover:bg-violet-glow/10 transition-all">
                  <action.icon size={24} />
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Chat */}
        <div className="lg:col-span-5 flex flex-col glass-card overflow-hidden bg-black/20 border-white/5 min-h-[600px]">
          <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
            <div className="w-8 h-8 rounded-lg bg-violet-glow/20 flex items-center justify-center text-violet-glow"><Bot size={18} /></div>
            <div>
              <p className="text-xs font-bold text-white">Vision AI Assistant</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Gemini Active</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {activeTab === 'history' ? (
              <div className="grid grid-cols-2 gap-4">
                {messages.filter(m => m.image).map(msg => (
                  <div key={msg.id} className="glass-card p-2 group cursor-pointer" onClick={() => setCurrentImage(msg.image || null)}>
                    <img src={msg.image} className="w-full aspect-square object-cover rounded-lg" />
                    <p className="mt-2 text-[10px] text-white/40 truncate px-1">{msg.content.slice(0, 40)}</p>
                  </div>
                ))}
                {messages.filter(m => m.image).length === 0 && (
                  <div className="col-span-2 py-20 text-center opacity-20"><History size={32} className="mx-auto mb-2" /><p className="text-xs">No history yet.</p></div>
                )}
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <ImageIcon size={48} className="text-white/20" />
                <p className="text-sm font-medium max-w-[200px]">Upload an image to start the Vision AI session.</p>
              </div>
            ) : (
              messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-electric-blue text-white' : 'bg-white/5 border border-white/10 text-violet-glow'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {msg.image && msg.role === 'assistant' && (
                      <img src={msg.image} className="w-24 h-24 object-cover rounded-lg mb-2 border border-white/10" />
                    )}
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-electric-blue/20 text-white border border-electric-blue/30' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-violet-glow"><Bot size={16} /></div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-1 items-center">
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-violet-glow rounded-full" />
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-violet-glow rounded-full" />
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-violet-glow rounded-full" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white/[0.02] border-t border-white/5">
            <div className="relative">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && processCommand(input)}
                placeholder={currentImage ? "Describe what you'd like..." : "Upload an image first..."}
                disabled={!currentImage || isProcessing}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-violet-glow/50 disabled:opacity-50" />
              <button onClick={() => processCommand(input)} disabled={!currentImage || isProcessing || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-violet-glow hover:text-white disabled:opacity-50 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
