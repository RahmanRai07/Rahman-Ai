import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, ChevronRight, Sparkles, Target, Building2, Zap } from 'lucide-react';
import { ai, MODELS } from '../../services/gemini';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  matchScore: number;
  skills: string[];
}

export const JobMatcher: React.FC = () => {
  const [skills, setSkills] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findMatches = async () => {
    if (!skills.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const prompt = `Based on these skills: ${skills}, suggest 5 realistic job roles for a fresher in India in 2026.
        Return ONLY a valid JSON array (no markdown, no backticks):
        [{"title":"...","company":"...","location":"...","salary":"X-Y LPA","type":"Full-time","matchScore":85,"skills":["Skill1","Skill2","Skill3"]}]`;

      const response = await ai.models.generateContent({ model: MODELS.flash, contents: prompt });
      const text = response.text?.replace(/```json|```/g, '').trim() || '[]';
      const data = JSON.parse(text);
      setJobs(data.map((j: any, i: number) => ({ ...j, id: i.toString() })));
    } catch (err: any) {
      setError(err?.message || 'Failed to find matches. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <Target size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-4xl font-display font-bold text-white">Neural Job Matcher</h2>
        <p className="text-white/40 font-medium max-w-xl mx-auto">Enter your skills and find high-compatibility roles across the tech landscape.</p>
      </div>

      <div className="glass-card p-10 space-y-4 max-w-2xl mx-auto">
        {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">{error}</div>}
        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-2">Your Skills</label>
        <div className="relative">
          <input type="text" placeholder="e.g. React, Python, SQL, AWS" value={skills} onChange={e => setSkills(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && findMatches()}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-36 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
          <button onClick={findMatches} disabled={isLoading || !skills.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all flex items-center gap-2">
            {isLoading ? <Sparkles className="animate-spin" size={18} /> : <Zap size={18} />}
            {isLoading ? 'Matching...' : 'Find Jobs'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {jobs.map((job, idx) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 group hover:bg-white/[0.05] transition-all border-white/10 hover:border-emerald-500/30">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-8 h-8 text-white/20 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white group-hover:text-emerald-500 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-widest mt-1">
                      <span className="flex items-center gap-1"><Building2 size={12} /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase size={12} /> {job.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm font-bold">{job.matchScore}% Match</div>
                  <div className="flex flex-col">
                    <span className="text-lg font-display font-bold text-white">{job.salary}</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Per Annum</span>
                  </div>
                  <button className="p-4 bg-white/5 hover:bg-emerald-500 text-white rounded-2xl transition-all">
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mr-4 self-center">Required Skills:</span>
                {job.skills?.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white/60 font-medium border border-white/5">{skill}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {jobs.length === 0 && !isLoading && (
          <div className="text-center py-20 opacity-30">
            <Target size={48} className="mx-auto mb-4" />
            <p className="text-white font-medium">Enter your skills and click "Find Jobs" to get matched roles.</p>
          </div>
        )}
      </div>
    </div>
  );
};
