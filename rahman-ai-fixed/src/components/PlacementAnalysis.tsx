import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, GraduationCap, Code, FileText, Send, ChevronRight, BookOpen, Target, Lightbulb, ArrowRight, Zap } from 'lucide-react';
import { generateCareerAdvice } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

export const PlacementAnalysis: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    college: '',
    course: '',
    graduationDate: '',
    skills: [] as string[],
    careerGoal: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput('');
    }
  };

  const handleAnalyze = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await generateCareerAdvice(formData);
      if (result) {
        setAnalysis(result);
      } else {
        setAnalysis("I'm sorry, I couldn't generate an analysis at this time. Please check your inputs and try again.");
      }
    } catch (error) {
      console.error("Career Analysis Error:", error);
      setAnalysis("An error occurred while generating your roadmap. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-24 pb-12 px-6">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display font-bold text-white tracking-tight"
        >
          Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-violet-glow">Analysis</span>
        </motion.h2>
        <p className="text-white/40 font-medium">Data-driven insights for your professional trajectory.</p>
      </div>

      {!analysis ? (
        <div className="glass-card p-10 space-y-10 bg-white/[0.02] border-white/10">
          <div className="flex justify-between items-center mb-8 max-w-2xl mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${
                  step >= s 
                    ? 'bg-gradient-to-br from-electric-blue to-violet-glow text-white shadow-lg shadow-violet-glow/20' 
                    : 'bg-white/5 border border-white/10 text-white/20'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-20 h-0.5 mx-4 rounded-full transition-all duration-500 ${
                    step > s ? 'bg-violet-glow' : 'bg-white/5'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <GraduationCap size={14} /> Institution
                    </label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Stanford University"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen size={14} /> Academic Stream
                    </label>
                    <input
                      type="text"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <ChevronRight size={14} /> Target Completion Date
                  </label>
                  <input
                    type="month"
                    value={formData.graduationDate}
                    onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full py-5 text-lg">
                  Next Phase <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Code size={14} /> Technical Arsenal
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="input-field"
                      placeholder="Add skill (e.g. React)..."
                    />
                    <button onClick={handleAddSkill} className="btn-secondary px-8">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {formData.skills.map((skill) => (
                      <span key={skill} className="bg-white/5 text-white border border-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-3 shadow-lg">
                        {skill}
                        <button onClick={() => setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })} className="hover:text-violet-glow transition-colors">×</button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-5">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1 py-5 text-lg">Next Phase</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} /> Strategic Objective
                  </label>
                  <textarea
                    value={formData.careerGoal}
                    onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                    className="input-field min-h-[150px] py-4"
                    placeholder="Define your target role (e.g. Senior Frontend Engineer)..."
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1 py-5">Back</button>
                  <button 
                    onClick={(e) => handleAnalyze(e)} 
                    disabled={isAnalyzing}
                    className="btn-primary flex-1 py-5 text-lg"
                  >
                    {isAnalyzing ? <RefreshCw className="animate-spin" /> : <Zap size={20} />}
                    Generate Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 space-y-8 bg-white/[0.02] border-white/10"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-display font-bold flex items-center gap-3 text-white">
              <Lightbulb className="text-violet-glow" /> Strategic Roadmap
            </h3>
            <button onClick={() => setAnalysis(null)} className="text-sm font-bold text-white/40 hover:text-violet-glow transition-colors uppercase tracking-widest">Reset System</button>
          </div>
          <div className="prose prose-invert max-w-none text-white/70 font-medium leading-relaxed">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
