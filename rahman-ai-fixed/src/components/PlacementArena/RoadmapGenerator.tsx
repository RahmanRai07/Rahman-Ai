import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Map, Target, ChevronRight, Sparkles, Clock, BookOpen, Zap, ArrowRight, Brain } from 'lucide-react';
import { ai, MODELS } from '../../services/gemini';

interface RoadmapStep {
  phase: string;
  duration: string;
  topics: string[];
  resources: string[];
}

export const RoadmapGenerator: React.FC = () => {
  const [field, setField] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [timeframe, setTimeframe] = useState('3 Months');
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRoadmap = async () => {
    if (!field.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const prompt = `Generate a detailed placement preparation roadmap for a student in "${field}".
        Target Company: ${targetCompany || 'Top Tech Companies'}.
        Timeframe: ${timeframe}.
        
        Return ONLY a valid JSON array (no markdown, no backticks, no explanation) like:
        [{"phase":"Phase 1: Foundations","duration":"Week 1-2","topics":["Topic A","Topic B"],"resources":["LeetCode","YouTube"]}]
        
        Generate 4-6 phases appropriate for the timeframe.`;

      const response = await ai.models.generateContent({ model: MODELS.flash, contents: prompt });
      const text = response.text?.replace(/```json|```/g, '').trim() || '[]';
      const data = JSON.parse(text);
      setRoadmap(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate roadmap. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {!roadmap ? (
        <div className="space-y-12 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-violet-glow/20 border border-violet-glow/30 flex items-center justify-center mx-auto">
              <Map size={40} className="text-violet-glow" />
            </div>
            <h2 className="text-4xl font-display font-bold text-white">Neural Roadmap Generator</h2>
            <p className="text-white/40 font-medium max-w-xl mx-auto">Architect your career path with AI. Get a personalized step-by-step plan.</p>
          </div>

          <div className="glass-card p-10 space-y-8 text-left max-w-2xl mx-auto">
            {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-2">Your Field *</label>
                <input type="text" placeholder="e.g. Full Stack, Data Science" value={field} onChange={e => setField(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-2">Target Company</label>
                <input type="text" placeholder="e.g. Amazon, Google (Optional)" value={targetCompany} onChange={e => setTargetCompany(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-2">Timeframe</label>
              <div className="flex flex-wrap gap-3">
                {['1 Month', '3 Months', '6 Months', '1 Year'].map(time => (
                  <button key={time} onClick={() => setTimeframe(time)}
                    className={`px-6 py-2 rounded-full text-xs font-bold border transition-all ${timeframe === time ? 'bg-violet-glow border-violet-glow text-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={generateRoadmap} disabled={isLoading || !field.trim()}
              className="w-full py-4 bg-violet-glow hover:bg-violet-glow/80 disabled:opacity-50 text-white rounded-2xl font-bold shadow-2xl shadow-violet-glow/20 flex items-center justify-center gap-3 transition-all">
              {isLoading ? <><Sparkles className="animate-spin" size={20} /> Synthesizing Path...</> : <><Zap size={20} /> Generate My Roadmap</>}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setRoadmap(null)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <div>
                <h3 className="text-2xl font-display font-bold text-white">{field} Roadmap</h3>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Target: {targetCompany || 'General Tech'} · {timeframe}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 relative">
            <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-glow via-electric-blue to-transparent opacity-20" />
            {roadmap.map((step, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative pl-24">
                <div className="absolute left-5 top-4 w-6 h-6 rounded-full bg-brand-indigo border-4 border-violet-glow shadow-[0_0_15px_rgba(139,92,246,0.5)] z-10" />
                <div className="glass-card p-8 space-y-6 hover:bg-white/[0.05] transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-xl font-display font-bold text-white group-hover:text-violet-glow transition-colors">{step.phase}</h4>
                      <div className="flex items-center gap-2 text-xs text-white/40 font-bold uppercase tracking-widest">
                        <Clock size={12} className="text-violet-glow" /> {step.duration}
                      </div>
                    </div>
                    <Target size={20} className="text-white/20 group-hover:text-violet-glow transition-colors" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2"><BookOpen size={12} /> Core Topics</h5>
                      <div className="flex flex-wrap gap-2">
                        {step.topics?.map(topic => (
                          <span key={topic} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 font-medium">{topic}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2"><Brain size={12} /> Resources</h5>
                      <ul className="space-y-2">
                        {step.resources?.map(res => (
                          <li key={res} className="flex items-center gap-2 text-xs text-white/40 font-medium">
                            <ArrowRight size={10} className="text-violet-glow" /> {res}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
