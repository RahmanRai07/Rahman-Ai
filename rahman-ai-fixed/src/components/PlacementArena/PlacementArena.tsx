import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Brain, Building2, ChevronRight, Sparkles, Trophy, Target, BarChart3, TrendingUp, FileSearch, LayoutDashboard, Bot, Code2, Map, FileText } from 'lucide-react';
import { TypingTest } from './TypingTest';
import { AptitudeSimulator } from './AptitudeSimulator';
import { CompanyIntelligence } from './CompanyIntelligence';
import { ATSResumeChecker } from './ATSResumeChecker';
import { NewsSection } from './NewsSection';
import { MockInterview } from './MockInterview';
import { CodingPractice } from './CodingPractice';
import { RoadmapGenerator } from './RoadmapGenerator';
import { ResumeBuilder } from './ResumeBuilder';
import { JobMatcher } from './JobMatcher';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const radarData = [
  { subject: 'Typing', A: 85, fullMark: 100 },
  { subject: 'Aptitude', A: 72, fullMark: 100 },
  { subject: 'Technical', A: 90, fullMark: 100 },
  { subject: 'Verbal', A: 65, fullMark: 100 },
  { subject: 'Logic', A: 88, fullMark: 100 },
];

type ArenaModule = 'typing' | 'aptitude' | 'intelligence' | 'ats' | 'news' | 'dashboard' | 'mock-interview' | 'coding' | 'roadmap' | 'resume-builder' | 'job-match';

export const PlacementArena: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ArenaModule>('dashboard');

  const modules = [
    {
      id: 'typing',
      title: 'Neural Typing',
      subtitle: 'Speed & Precision',
      icon: <Keyboard className="w-6 h-6" />,
      color: 'from-blue-500/20 to-blue-600/5',
      borderColor: 'border-blue-500/20',
      description: 'Test your WPM and accuracy with our high-precision typing engine.'
    },
    {
      id: 'aptitude',
      title: 'Logic Matrix',
      subtitle: 'Cognitive Training',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-violet-500/20 to-violet-600/5',
      borderColor: 'border-violet-500/20',
      description: 'Simulate real IT company aptitude rounds with timed challenges.'
    },
    {
      id: 'intelligence',
      title: 'HR Intelligence',
      subtitle: 'Behavioral Analysis',
      icon: <Building2 className="w-6 h-6" />,
      color: 'from-emerald-500/20 to-emerald-600/5',
      borderColor: 'border-emerald-500/20',
      description: 'Deep insights into hiring patterns and HR interview analysis.'
    },
    {
      id: 'ats',
      title: 'ATS Optimizer',
      subtitle: 'AI Resume Audit',
      icon: <FileSearch className="w-6 h-6" />,
      color: 'from-amber-500/20 to-amber-600/5',
      borderColor: 'border-amber-500/20',
      description: 'Get instant AI feedback on your resume suitability for specific roles.'
    },
    {
      id: 'news',
      title: 'Global Pulse',
      subtitle: 'Market Intelligence',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-coral-glow/20 to-coral-glow/5',
      borderColor: 'border-coral-glow/20',
      description: 'Latest news on world affairs, tech, AI, and job market innovations.'
    },
    {
      id: 'mock-interview',
      title: 'AI Mock Interview',
      subtitle: 'Real-time Simulation',
      icon: <Bot className="w-6 h-6" />,
      color: 'from-indigo-500/20 to-indigo-600/5',
      borderColor: 'border-indigo-500/20',
      description: 'Simulate high-stakes HR and technical interviews with AI feedback.'
    },
    {
      id: 'coding',
      title: 'Coding Arena',
      subtitle: 'DSA Mastery',
      icon: <Code2 className="w-6 h-6" />,
      color: 'from-emerald-500/20 to-emerald-600/5',
      borderColor: 'border-emerald-500/20',
      description: 'Master data structures and algorithms with AI-guided practice.'
    },
    {
      id: 'roadmap',
      title: 'Career Roadmap',
      subtitle: 'Personalized Path',
      icon: <Map className="w-6 h-6" />,
      color: 'from-pink-500/20 to-pink-600/5',
      borderColor: 'border-pink-500/20',
      description: 'Architect your career path with a personalized AI-generated roadmap.'
    },
    {
      id: 'resume-builder',
      title: 'Resume Builder',
      subtitle: 'High-Impact Design',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-cyan-500/20 to-cyan-600/5',
      borderColor: 'border-cyan-500/20',
      description: 'Craft a professional, ATS-optimized resume in minutes.'
    },
    {
      id: 'job-match',
      title: 'Job Matcher',
      subtitle: 'Neural Matching',
      icon: <Target className="w-6 h-6" />,
      color: 'from-orange-500/20 to-orange-600/5',
      borderColor: 'border-orange-500/20',
      description: 'Find high-compatibility job roles based on your unique skill matrix.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 perspective-1000">
      <AnimatePresence mode="wait">
        {activeModule === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: -5 }}
            className="space-y-20 preserve-3d"
          >
            <div className="text-center max-w-4xl mx-auto space-y-8 preserve-3d">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, translateZ: -50 }}
                animate={{ opacity: 1, scale: 1, translateZ: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-violet-glow/10 border border-violet-glow/20 text-violet-glow text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Career Intelligence
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter leading-[0.9] preserve-3d">
                ARCHITECT YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-violet-glow to-coral-glow">CAREER DESTINY.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/40 leading-relaxed font-medium max-w-2xl mx-auto tracking-tight">
                A high-performance ecosystem combining neural skill testing, 
                behavioral simulation, and global market intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 preserve-3d">
              {modules.map((mod, idx) => (
                <motion.button
                  key={mod.id}
                  initial={{ opacity: 0, y: 20, rotateY: 10 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  whileHover={{ 
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: -5,
                    translateZ: 30
                  }}
                  transition={{ 
                    delay: idx * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  onClick={() => setActiveModule(mod.id as ArenaModule)}
                  className={`group relative p-10 rounded-[2.5rem] border ${mod.borderColor} bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-500 text-left overflow-hidden preserve-3d`}
                >
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                    <div className="scale-[3]">{mod.icon}</div>
                  </div>
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-10 shadow-2xl shadow-black/40 group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">
                      {mod.icon}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">{mod.subtitle}</span>
                    <h3 className="text-3xl font-display font-bold text-white">{mod.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed font-medium group-hover:text-white/60 transition-colors">{mod.description}</p>
                  </div>
                  
                  <div className="mt-10 flex items-center gap-2 text-violet-glow font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                    Enter Arena <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 preserve-3d">
              <motion.div 
                whileHover={{ rotateX: 2, rotateY: -2, translateZ: 10 }}
                className="lg:col-span-7 glass-card p-12 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-violet-glow/5 to-transparent pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                      <Trophy className="text-violet-glow" /> Readiness Matrix
                    </h4>
                    <p className="text-white/40 text-sm font-medium">Neural skill analysis across core domains.</p>
                  </div>
                  <div className="px-6 py-3 bg-violet-glow/10 rounded-2xl border border-violet-glow/20 text-violet-glow text-lg font-display font-bold">
                    72.4% <span className="text-xs uppercase tracking-widest ml-1">Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 600 }} />
                        <Radar
                          name="Skills"
                          dataKey="A"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-8">
                    {[
                      { label: 'Neural Typing', value: 85, color: 'bg-blue-400' },
                      { label: 'Logic Matrix', value: 72, color: 'bg-violet-glow' },
                      { label: 'HR Intelligence', value: 90, color: 'bg-emerald-400' },
                    ].map((skill) => (
                      <div key={skill.label} className="space-y-3">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span className="text-white/40">{skill.label}</span>
                          <span className="text-white">{skill.value}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            className={`h-full ${skill.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.value}%` }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ rotateX: 2, rotateY: 2, translateZ: 10 }}
                className="lg:col-span-5 glass-card p-12 flex flex-col justify-between"
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                      <BarChart3 className="text-emerald-400" /> Activity
                    </h4>
                    <div className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Last 30 Cycles
                    </div>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="flex gap-2.5 flex-wrap justify-center">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.01 }}
                          className={`w-7 h-7 rounded-lg ${
                            i % 7 === 0 ? 'bg-violet-glow/60' : 
                            i % 5 === 0 ? 'bg-violet-glow/40' : 
                            i % 3 === 0 ? 'bg-violet-glow/20' : 'bg-white/5'
                          } border border-white/5 hover:border-white/20 transition-colors cursor-pointer`}
                        />
                      ))}
                    </div>
                    
                    <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <TrendingUp className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-lg text-white font-bold">Weekly Delta</p>
                          <p className="text-white/40 text-sm font-medium">Performance surge detected.</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-display font-bold text-emerald-400">+12.4%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="module"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <button
              onClick={() => setActiveModule('dashboard')}
              className="flex items-center gap-3 text-white/40 hover:text-white transition-all group font-bold text-sm uppercase tracking-widest"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-colors">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </div>
              Back to Arena Matrix
            </button>

            <div className="glass-card p-1">
              {activeModule === 'typing' && <TypingTest onComplete={() => {}} />}
              {activeModule === 'aptitude' && <AptitudeSimulator />}
              {activeModule === 'intelligence' && <CompanyIntelligence />}
              {activeModule === 'ats' && <ATSResumeChecker />}
              {activeModule === 'news' && <NewsSection />}
              {activeModule === 'mock-interview' && <MockInterview />}
              {activeModule === 'coding' && <CodingPractice />}
              {activeModule === 'roadmap' && <RoadmapGenerator />}
              {activeModule === 'resume-builder' && <ResumeBuilder />}
              {activeModule === 'job-match' && <JobMatcher />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
