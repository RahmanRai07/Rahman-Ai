import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  DollarSign, 
  Calendar, 
  Briefcase, 
  Target, 
  MessageSquare, 
  TrendingUp, 
  ChevronRight, 
  X, 
  ExternalLink, 
  Clock, 
  Timer, 
  BookOpen, 
  Highlighter, 
  Bell,
  History,
  Award
} from 'lucide-react';

interface RoleData {
  title: string;
  skills: string[];
  rounds: string[];
  hiringStatus: 'Hiring' | 'Not Hiring' | 'Coming Soon';
  baseSalary: string;
  fiveYearGrowth: string;
}

interface CompanyData {
  name: string;
  founder: string;
  coFounder: string;
  established: string;
  headquarters: string;
  industry: string;
  revenue: string;
  employees: string;
  history: string;
  services: string[];
  hiringPattern: string;
  eligibility: string;
  aptitudeFormat: string;
  technicalFocus: string[];
  hrStyle: string;
  hrQuestions: { q: string; a: string }[];
  aiTrends: string;
  prepPriority: string[];
  roles: RoleData[];
  links: { label: string; url: string }[];
}

const COMPANY_DB: Record<string, CompanyData> = {
  'accenture': {
    name: 'Accenture',
    founder: 'Clarence DeLany',
    coFounder: 'Arthur Andersen',
    established: '1989 (as Andersen Consulting)',
    headquarters: 'Dublin, Ireland',
    industry: 'Professional Services, IT Consulting',
    revenue: '$64.1 Billion (2023)',
    employees: '733,000+',
    history: 'Accenture began as the business and technology consulting division of accounting firm Arthur Andersen in the early 1950s. It separated from Arthur Andersen in 1989 and was renamed Accenture in 2001. The name "Accenture" is derived from "Accent on the future". Today, it is a Fortune Global 500 company and one of the largest consulting firms in the world.',
    services: ['Strategy & Consulting', 'Technology', 'Operations', 'Industry X', 'Song'],
    hiringPattern: 'High volume hiring through on-campus and off-campus drives. Focuses on cognitive and technical ability.',
    eligibility: '60% or 6.5 CGPA throughout (10th, 12th, Graduation). No active backlogs.',
    aptitudeFormat: 'Cognitive (Critical Thinking, Abstract Reasoning) + Technical (Pseudo-code, Networking, Cloud).',
    technicalFocus: ['Java/Python', 'Cloud Computing', 'Data Structures', 'SQL'],
    hrStyle: 'Values-based and behavioral. Focuses on adaptability and client-centric mindset.',
    hrQuestions: [
      { q: 'Why do you want to join Accenture?', a: 'Focus on their innovation-led approach and commitment to continuous learning.' },
      { q: 'Describe a time you worked in a diverse team.', a: 'Highlight collaboration, conflict resolution, and achieving a common goal.' }
    ],
    aiTrends: 'Increasing focus on Generative AI and Cloud transformation projects.',
    prepPriority: ['Critical Reasoning', 'Pseudo-code', 'Cloud Basics'],
    roles: [
      {
        title: 'Associate Software Engineer',
        skills: ['Java', 'Python', 'Basic Cloud', 'SQL'],
        rounds: ['Cognitive Assessment', 'Technical Interview', 'HR Interview'],
        hiringStatus: 'Hiring',
        baseSalary: '₹4.5 - ₹6.5 LPA',
        fiveYearGrowth: '₹12 - ₹18 LPA'
      },
      {
        title: 'Data Analyst',
        skills: ['Python', 'Tableau', 'Statistics', 'SQL'],
        rounds: ['Aptitude Test', 'Case Study', 'Technical Interview'],
        hiringStatus: 'Coming Soon',
        baseSalary: '₹5.0 - ₹7.0 LPA',
        fiveYearGrowth: '₹14 - ₹20 LPA'
      }
    ],
    links: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Accenture' },
      { label: 'Official Careers', url: 'https://www.accenture.com/in-en/careers' },
      { label: 'Glassdoor Reviews', url: 'https://www.glassdoor.co.in/Reviews/Accenture-Reviews-E4138.htm' }
    ]
  },
  'tcs': {
    name: 'Tata Consultancy Services (TCS)',
    founder: 'J.R.D. Tata',
    coFounder: 'F.C. Kohli',
    established: '1968',
    headquarters: 'Mumbai, India',
    industry: 'IT Services & Consulting',
    revenue: '$27.9 Billion (2023)',
    employees: '614,000+',
    history: 'TCS was founded in 1968 by a division of Tata Sons. Its early contracts included punch card services to sister company TISCO (now Tata Steel), working on an inventory management system for the Central Bank of India. In 1975, TCS delivered an electronic depository and clearing system for the Swiss National Bank. It is now the largest IT services company in India.',
    services: ['Cloud', 'Cognitive Business Operations', 'Consulting', 'Cybersecurity', 'Data & Analytics'],
    hiringPattern: 'NQT (National Qualifier Test) is the primary entry point for Ninja and Digital roles.',
    eligibility: '60% throughout. Maximum 1 backlog allowed at the time of NQT.',
    aptitudeFormat: 'Numerical Ability, Verbal Ability, Reasoning Ability, and Programming Logic.',
    technicalFocus: ['C/C++/Java', 'DBMS', 'Operating Systems', 'SDLC'],
    hrStyle: 'Traditional and stable. Focuses on long-term commitment and cultural fit.',
    hrQuestions: [
      { q: 'What do you know about TCS services?', a: 'Mention their wide range of industries like BFSI, Retail, and Manufacturing.' },
      { q: 'Are you willing to relocate?', a: 'Show flexibility and enthusiasm for new opportunities.' }
    ],
    aiTrends: 'Heavy investment in AI.Cloud and sustainable technology solutions.',
    prepPriority: ['Aptitude (Numerical)', 'Coding (Basic)', 'DBMS'],
    roles: [
      {
        title: 'Ninja Developer',
        skills: ['C/C++', 'Java', 'DBMS', 'OS'],
        rounds: ['NQT', 'Technical Interview', 'HR Interview'],
        hiringStatus: 'Hiring',
        baseSalary: '₹3.36 - ₹3.6 LPA',
        fiveYearGrowth: '₹8 - ₹12 LPA'
      },
      {
        title: 'Digital Developer',
        skills: ['Advanced Coding', 'Full Stack', 'AI/ML', 'Cloud'],
        rounds: ['Advanced NQT', 'Technical Interview', 'HR Interview'],
        hiringStatus: 'Hiring',
        baseSalary: '₹7.0 - ₹7.5 LPA',
        fiveYearGrowth: '₹15 - ₹22 LPA'
      }
    ],
    links: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Tata_Consultancy_Services' },
      { label: 'TCS NextStep', url: 'https://nextstep.tcs.com/' },
      { label: 'AmbitionBox', url: 'https://www.ambitionbox.com/reviews/tcs-reviews' }
    ]
  }
};

export const CompanyIntelligence: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [roleSearch, setRoleSearch] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [note, setNote] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeLeft === 0 && isTimerRunning) {
        alert('Break time over! Time to get back to work.');
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const key = search.toLowerCase().trim();
    if (COMPANY_DB[key]) {
      setSelectedCompany(COMPANY_DB[key]);
      setSelectedRole(null);
    } else {
      // Use a custom toast or state instead of alert to avoid potential issues
      console.log('Company data not found');
    }
  };

  const filteredRoles = selectedCompany?.roles.filter(role => 
    role.title.toLowerCase().includes(roleSearch.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-display font-bold text-white mb-4">Company Insights — Prepare Smarter</h2>
        <p className="text-white/60 mb-8">Get deep intelligence on hiring patterns, interview styles, and core focus areas of top IT firms.</p>
        
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-white/20 group-focus-within:text-violet-glow transition-colors" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter Company Name (e.g., Accenture, TCS)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-violet-glow/50 focus:border-violet-glow transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-6 bg-violet-glow hover:bg-violet-glow/80 text-white rounded-xl font-bold transition-all"
          >
            Search
          </button>
        </form>
      </div>

      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
          >
            <div className="glass-card w-full max-w-6xl max-h-[90vh] overflow-y-auto relative p-0 border-white/10">
              <button 
                onClick={() => setSelectedCompany(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-12 space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-glow/20 to-electric-blue/20 border border-white/10 flex items-center justify-center shrink-0 shadow-2xl">
                    <Building2 className="w-12 h-12 text-violet-glow" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-4xl font-display font-bold text-white">{selectedCompany.name}</h3>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">Verified</span>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm text-white/40 font-medium">
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-violet-glow" /> {selectedCompany.headquarters}</span>
                      <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-electric-blue" /> {selectedCompany.industry}</span>
                      <span className="flex items-center gap-2"><Users className="w-4 h-4 text-coral-glow" /> {selectedCompany.employees}</span>
                      <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-400" /> {selectedCompany.revenue}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowNotes(!showNotes)}
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all group relative"
                    >
                      <BookOpen className="w-6 h-6" />
                      {isTimerRunning && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-coral-glow rounded-full animate-ping" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-12">
                    {/* History Section */}
                    <section className="space-y-4">
                      <h4 className="text-xl font-display font-bold text-white flex items-center gap-3">
                        <History className="text-violet-glow" /> Company History
                      </h4>
                      <p className="text-white/60 leading-relaxed font-medium bg-white/5 p-6 rounded-2xl border border-white/5 italic">
                        {selectedCompany.history}
                      </p>
                    </section>

                    {/* Roles Section */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-display font-bold text-white flex items-center gap-3">
                          <Briefcase className="text-electric-blue" /> Available Roles
                        </h4>
                        <div className="relative w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input 
                            type="text"
                            value={roleSearch}
                            onChange={(e) => setRoleSearch(e.target.value)}
                            placeholder="Search roles..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredRoles.map((role, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedRole(role)}
                            className={`p-6 rounded-2xl border transition-all text-left group ${
                              selectedRole?.title === role.title 
                                ? 'bg-violet-glow/20 border-violet-glow shadow-lg shadow-violet-glow/10' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <h5 className="text-lg font-bold text-white group-hover:text-violet-glow transition-colors">{role.title}</h5>
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                                role.hiringStatus === 'Hiring' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/10 text-white/40'
                              }`}>
                                {role.hiringStatus}
                              </span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {role.skills.slice(0, 3).map(s => (
                                <span key={s} className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{s}</span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {selectedRole && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-8"
                          >
                            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                              <h5 className="text-2xl font-display font-bold text-white">{selectedRole.title} Specifications</h5>
                              <button onClick={() => setSelectedRole(null)} className="text-white/20 hover:text-white transition-colors">
                                <X size={20} />
                              </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                <div>
                                  <h6 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Required Skills</h6>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedRole.skills.map(s => (
                                      <span key={s} className="px-3 py-1 bg-violet-glow/10 border border-violet-glow/20 rounded-lg text-xs text-violet-glow font-bold">{s}</span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h6 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Interview Rounds</h6>
                                  <div className="space-y-2">
                                    {selectedRole.rounds.map((r, i) => (
                                      <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                                        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">{i+1}</div>
                                        {r}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                  <h6 className="text-xs font-bold text-emerald-500/60 uppercase tracking-widest mb-3">Salary Package (Fresher)</h6>
                                  <p className="text-2xl font-display font-bold text-white">{selectedRole.baseSalary}</p>
                                </div>
                                <div className="p-6 bg-electric-blue/5 rounded-2xl border border-electric-blue/10">
                                  <h6 className="text-xs font-bold text-electric-blue/60 uppercase tracking-widest mb-3">5-Year Growth Projection</h6>
                                  <p className="text-2xl font-display font-bold text-white">{selectedRole.fiveYearGrowth}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  </div>

                  <div className="space-y-8">
                    {/* Quick Stats */}
                    <div className="p-8 bg-violet-glow/10 rounded-3xl border border-violet-glow/20 space-y-6">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-violet-glow" /> AI Analysis
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Hiring Pattern</h5>
                          <p className="text-white/80 text-sm leading-relaxed">{selectedCompany.hiringPattern}</p>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Prep Priority</h5>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedCompany.prepPriority.map(p => (
                              <span key={p} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/60 border border-white/10 uppercase tracking-widest">{p}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Links Section */}
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-electric-blue" /> Resources
                      </h4>
                      <div className="space-y-3">
                        {selectedCompany.links.map((link, idx) => (
                          <a 
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group"
                          >
                            <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{link.label}</span>
                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-violet-glow group-hover:translate-x-1 transition-all" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* HR Questions */}
                    <div className="p-8 bg-coral-glow/5 rounded-3xl border border-coral-glow/10 space-y-6">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-coral-glow" /> HR Insights
                      </h4>
                      <div className="space-y-4">
                        {selectedCompany.hrQuestions.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <p className="text-xs font-bold text-white/80">Q: {item.q}</p>
                            <p className="text-[10px] text-white/40 italic leading-relaxed">Tip: {item.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="pt-12 border-t border-white/5 flex justify-center">
                  <button className="flex items-center gap-2 text-violet-glow font-bold hover:gap-3 transition-all">
                    Click for more detailed analysis <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Notes Sidebar Overlay */}
              <AnimatePresence>
                {showNotes && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-y-0 right-0 w-full md:w-96 bg-brand-indigo border-l border-white/10 shadow-2xl z-20 flex flex-col"
                  >
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                      <h4 className="text-xl font-display font-bold text-white flex items-center gap-3">
                        <BookOpen className="text-violet-glow" /> Study Notes
                      </h4>
                      <button onClick={() => setShowNotes(false)} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                      {/* Timer Section */}
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
                            <Timer size={16} className="text-coral-glow" /> Focus Timer
                          </div>
                          {isTimerRunning && (
                            <span className="text-coral-glow font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
                          )}
                        </div>
                        
                        {!isTimerRunning ? (
                          <div className="grid grid-cols-3 gap-2">
                            {[5, 15, 25].map(m => (
                              <button 
                                key={m}
                                onClick={() => startTimer(m)}
                                className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white/60 transition-all"
                              >
                                {m}m
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button 
                            onClick={() => setIsTimerRunning(false)}
                            className="w-full py-2 bg-coral-glow/20 border border-coral-glow/30 rounded-lg text-xs font-bold text-coral-glow hover:bg-coral-glow hover:text-white transition-all"
                          >
                            Stop Timer
                          </button>
                        )}
                      </div>

                      {/* Note Area */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white/40 uppercase tracking-widest">Quick Notes</h5>
                          <button className="text-white/20 hover:text-violet-glow transition-colors">
                            <Highlighter size={16} />
                          </button>
                        </div>
                        <textarea 
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Jot down important points..."
                          className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-glow/50 resize-none font-medium leading-relaxed"
                        />
                      </div>

                      <div className="p-6 bg-violet-glow/5 rounded-2xl border border-violet-glow/10">
                        <div className="flex items-center gap-2 text-violet-glow text-xs font-bold uppercase tracking-widest mb-2">
                          <Bell size={14} /> Reminder
                        </div>
                        <p className="text-[10px] text-white/40 italic leading-relaxed">
                          Notes are saved locally to your session. Use the highlighter to mark mission-critical information.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
