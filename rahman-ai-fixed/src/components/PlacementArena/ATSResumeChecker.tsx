import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileUp, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  FileText, 
  X, 
  Loader2,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ATSResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  matchPercentage: number;
  keywords: { word: string; found: boolean }[];
}

import { analyzeResume } from '../../services/gemini';

export const ATSResumeChecker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const runAnalysis = async () => {
    if (!file || !role) return;
    setIsAnalyzing(true);
    
    try {
      const base64 = await fileToBase64(file);
      const analysis = await analyzeResume(base64, role, company);
      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-display font-bold text-white">ATS Resume Checker</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Upload your resume and get instant AI-powered feedback on how well it matches your target role and company.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="glass-card p-8 border-white/10 space-y-6">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest">Target Role</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Software Engineer, Data Scientist"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest">Target Company (Optional)</label>
              <input 
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Accenture, TCS"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest">Upload Resume (PDF)</label>
              <div className="relative group">
                <input 
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 group-hover:border-violet-glow/50 group-hover:bg-white/5'
                }`}>
                  {file ? (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 text-emerald-500 mx-auto" />
                      <p className="text-white font-bold">{file.name}</p>
                      <p className="text-white/40 text-xs">Click or drag to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileUp className="w-12 h-12 text-white/20 mx-auto group-hover:text-violet-glow transition-colors" />
                      <p className="text-white/60 font-medium">Click to upload or drag & drop</p>
                      <p className="text-white/20 text-xs">PDF format only (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={runAnalysis}
              disabled={!file || !role || isAnalyzing}
              className="w-full py-4 bg-violet-glow hover:bg-violet-glow/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-violet-glow/20"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Run AI Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 glass-card border-white/10 border-dashed"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-display font-bold text-white/60 mb-2">Ready for Analysis</h3>
                <p className="text-white/30 text-sm">Upload your resume and specify a role to see your ATS score and feedback.</p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 glass-card border-white/10"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-violet-glow/20 border-t-violet-glow animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-violet-glow animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">AI is Scanning...</h3>
                <div className="space-y-2 w-full max-w-xs">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-violet-glow"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Checking keyword density</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Score Card */}
                <div className="glass-card p-8 border-white/10 bg-gradient-to-br from-violet-glow/10 to-transparent">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-display font-bold text-white">Overall Score</h3>
                      <p className="text-white/40 text-sm">Based on {role} requirements</p>
                    </div>
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                        <motion.circle 
                          cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                          strokeDasharray="251.2"
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 251.2 - (251.2 * result.score) / 100 }}
                          className="text-violet-glow"
                        />
                      </svg>
                      <span className="absolute text-2xl font-display font-bold text-white">{result.score}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Match Rate</p>
                      <p className="text-xl font-display font-bold text-emerald-500">{result.matchPercentage}%</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Keywords</p>
                      <p className="text-xl font-display font-bold text-violet-glow">{result.keywords.filter(k => k.found).length}/{result.keywords.length}</p>
                    </div>
                  </div>
                </div>

                {/* Feedback Tabs */}
                <div className="space-y-4">
                  <div className="glass-card p-6 border-white/10 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Strengths
                    </h4>
                    <ul className="space-y-3">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-white/60 flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-6 border-white/10 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-coral-glow" /> Critical Weaknesses
                    </h4>
                    <ul className="space-y-3">
                      {result.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-white/60 flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-coral-glow mt-1.5 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-6 border-white/10 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-electric-blue" /> Recommended Improvements
                    </h4>
                    <ul className="space-y-3">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="text-sm text-white/60 flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-electric-blue mt-1.5 shrink-0" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
