import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, User, Bot, Play, RefreshCcw } from 'lucide-react';
import { ai, MODELS } from '../../services/gemini';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface InterviewState {
  isActive: boolean;
  company: string;
  role: string;
  difficulty: 'Entry' | 'Intermediate' | 'Senior';
  type: 'Technical' | 'HR' | 'Mixed';
}

export const MockInterview: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    isActive: false, company: '', role: '', difficulty: 'Entry', type: 'Technical'
  });
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const buildContents = (msgs: Message[], systemPrompt: string) => {
    const contents: any[] = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I am ready to conduct the interview professionally.' }] }
    ];
    for (const m of msgs) {
      contents.push({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] });
    }
    return contents;
  };

  const systemPrompt = `You are a senior interviewer at ${interviewState.company || 'a top tech company'} 
    conducting a ${interviewState.difficulty} level ${interviewState.type} interview for the role of 
    ${interviewState.role || 'Software Engineer'}. Ask one question at a time. 
    React realistically to candidate answers. Keep responses concise and professional.
    Do not evaluate yet — wait until the interview ends.`;

  const startInterview = async () => {
    setInterviewState(prev => ({ ...prev, isActive: true }));
    setIsTyping(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood.' }] },
          { role: 'user', parts: [{ text: 'Begin the interview. Greet the candidate and ask your first question.' }] }
        ]
      });
      setMessages([{ role: 'assistant', content: response.text || "Hello! Welcome. Please introduce yourself.", timestamp: new Date() }]);
    } catch (error: any) {
      setMessages([{ role: 'assistant', content: `⚠️ Error: ${error?.message || 'Check your Gemini API key.'}`, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    try {
      const contents = buildContents(updatedMessages, systemPrompt);
      const response = await ai.models.generateContent({ model: MODELS.flash, contents });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "Let's continue...", timestamp: new Date() }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${error?.message || 'An error occurred.'}`, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const endAndEvaluate = async () => {
    setIsTyping(true);
    try {
      const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
      const prompt = `You just conducted an interview. Based on the following transcript, provide a detailed 
        evaluation with scores (1-10) for: Technical Knowledge, Communication, Confidence, Problem Solving.
        Also give: strengths, areas to improve, and an overall recommendation.
        Format clearly in Markdown.
        
        Transcript:
        ${transcript}`;
      const response = await ai.models.generateContent({ model: MODELS.flash, contents: prompt });
      setEvaluation(response.text || "Evaluation could not be generated.");
    } catch (error: any) {
      setEvaluation(`⚠️ Error generating evaluation: ${error?.message}`);
    } finally {
      setIsTyping(false);
      setInterviewState(prev => ({ ...prev, isActive: false }));
    }
  };

  return (
    <div className="h-[700px] flex flex-col bg-brand-indigo/30 rounded-[2.5rem] border border-white/10 overflow-hidden backdrop-blur-xl">
      {!interviewState.isActive && !evaluation ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-violet-glow/20 border border-violet-glow/30 flex items-center justify-center">
            <Bot size={48} className="text-violet-glow" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-bold text-white">AI Mock Interview</h2>
            <p className="text-white/40 font-medium max-w-xl mx-auto">Simulate high-pressure interviews with AI. Get a full performance audit after.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-2">Target Company</label>
              <input type="text" placeholder="e.g. Google, TCS, Amazon" value={interviewState.company}
                onChange={e => setInterviewState(p => ({ ...p, company: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50" />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-2">Target Role</label>
              <input type="text" placeholder="e.g. Frontend Developer" value={interviewState.role}
                onChange={e => setInterviewState(p => ({ ...p, role: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50" />
            </div>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {(['Technical', 'HR', 'Mixed'] as const).map(type => (
              <button key={type} onClick={() => setInterviewState(p => ({ ...p, type }))}
                className={`px-6 py-2 rounded-full text-xs font-bold border transition-all ${interviewState.type === type ? 'bg-violet-glow border-violet-glow text-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                {type}
              </button>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {(['Entry', 'Intermediate', 'Senior'] as const).map(level => (
              <button key={level} onClick={() => setInterviewState(p => ({ ...p, difficulty: level }))}
                className={`px-6 py-2 rounded-full text-xs font-bold border transition-all ${interviewState.difficulty === level ? 'bg-electric-blue border-electric-blue text-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                {level}
              </button>
            ))}
          </div>
          <button onClick={startInterview}
            className="px-12 py-4 bg-violet-glow hover:bg-violet-glow/80 text-white rounded-2xl font-bold shadow-2xl shadow-violet-glow/20 flex items-center gap-3 transition-all hover:scale-105">
            <Play size={20} /> Start Simulation
          </button>
        </div>
      ) : evaluation ? (
        <div className="flex-1 overflow-y-auto p-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-display font-bold text-white">📊 Interview Audit</h3>
            <button onClick={() => { setEvaluation(null); setMessages([]); setInterviewState(p => ({ ...p, isActive: false })); }}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/60 flex items-center gap-2">
              <RefreshCcw size={14} /> New Session
            </button>
          </div>
          <div className="glass-card p-8 border-violet-glow/20 bg-violet-glow/5">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{evaluation}</ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-glow/20 flex items-center justify-center">
                <Bot size={24} className="text-violet-glow" />
              </div>
              <div>
                <h4 className="text-white font-bold">{interviewState.company || 'AI'} Interviewer</h4>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Simulation · {interviewState.type} · {interviewState.difficulty}</span>
                </div>
              </div>
            </div>
            <button onClick={endAndEvaluate} disabled={messages.length < 2}
              className="px-6 py-2 bg-coral-glow/20 hover:bg-coral-glow/30 border border-coral-glow/30 rounded-xl text-xs font-bold text-coral-glow transition-all disabled:opacity-40">
              End & Evaluate
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-electric-blue' : 'bg-white/5 border border-white/10'}`}>
                  {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-violet-glow" />}
                </div>
                <div className={`max-w-[80%] p-5 rounded-3xl prose prose-invert prose-sm ${msg.role === 'user' ? 'bg-violet-glow text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><Bot size={18} className="text-violet-glow" /></div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <motion.div key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: d }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 border-t border-white/10 bg-white/[0.02]">
            <div className="relative">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-violet-glow/50 resize-none h-20 font-medium" />
              <button onClick={handleSend} disabled={!input.trim() || isTyping}
                className="absolute right-3 bottom-3 p-3 bg-violet-glow hover:bg-violet-glow/80 disabled:opacity-50 text-white rounded-xl transition-all">
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
