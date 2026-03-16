import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Layout, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench,
  ChevronRight,
  Save
} from 'lucide-react';

interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: { id: string; company: string; role: string; duration: string; desc: string }[];
  education: { id: string; school: string; degree: string; year: string }[];
  skills: string[];
}

export const ResumeBuilder: React.FC = () => {
  const [data, setData] = useState<ResumeData>({
    personal: { name: '', email: '', phone: '', location: '', summary: '' },
    experience: [],
    education: [],
    skills: []
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Math.random().toString(), company: '', role: '', duration: '', desc: '' }]
    }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { id: Math.random().toString(), school: '', degree: '', year: '' }]
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Neural Resume Builder</h2>
          <p className="text-white/40 font-medium">Craft a high-impact resume with real-time preview.</p>
        </div>
        <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('edit')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-violet-glow text-white' : 'text-white/40 hover:text-white'}`}
          >
            <div className="flex items-center gap-2"><Layout size={14} /> Editor</div>
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-violet-glow text-white' : 'text-white/40 hover:text-white'}`}
          >
            <div className="flex items-center gap-2"><Eye size={14} /> Preview</div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {activeTab === 'edit' ? (
          <div className="lg:col-span-8 space-y-8">
            {/* Personal Info */}
            <section className="glass-card p-8 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <User className="text-violet-glow" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-2">Full Name</label>
                  <input 
                    type="text" 
                    value={data.personal.name}
                    onChange={e => setData(prev => ({ ...prev, personal: { ...prev.personal, name: e.target.value } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-2">Email Address</label>
                  <input 
                    type="email" 
                    value={data.personal.email}
                    onChange={e => setData(prev => ({ ...prev, personal: { ...prev.personal, email: e.target.value } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-2">Professional Summary</label>
                <textarea 
                  value={data.personal.summary}
                  onChange={e => setData(prev => ({ ...prev, personal: { ...prev.personal, summary: e.target.value } }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50 h-32 resize-none"
                />
              </div>
            </section>

            {/* Experience */}
            <section className="glass-card p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <Briefcase className="text-electric-blue" /> Work Experience
                </h3>
                <button onClick={addExperience} className="p-2 bg-violet-glow/10 border border-violet-glow/20 rounded-lg text-violet-glow hover:bg-violet-glow hover:text-white transition-all">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4 relative group">
                    <button 
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 text-white/10 hover:text-coral-glow transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={e => {
                          const newExp = [...data.experience];
                          newExp[idx].company = e.target.value;
                          setData(prev => ({ ...prev, experience: newExp }));
                        }}
                        className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-white"
                      />
                      <input 
                        type="text" 
                        placeholder="Role"
                        value={exp.role}
                        onChange={e => {
                          const newExp = [...data.experience];
                          newExp[idx].role = e.target.value;
                          setData(prev => ({ ...prev, experience: newExp }));
                        }}
                        className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-white"
                      />
                    </div>
                    <textarea 
                      placeholder="Key achievements and responsibilities..."
                      value={exp.desc}
                      onChange={e => {
                        const newExp = [...data.experience];
                        newExp[idx].desc = e.target.value;
                        setData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-white h-24 resize-none"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="lg:col-span-12">
            <div className="max-w-[800px] mx-auto bg-white text-slate-900 p-16 rounded-sm shadow-2xl min-h-[1100px] space-y-12">
              <div className="text-center space-y-4 border-b pb-12">
                <h1 className="text-5xl font-display font-bold tracking-tighter uppercase">{data.personal.name || 'Your Name'}</h1>
                <div className="flex justify-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                  <span>{data.personal.email || 'email@example.com'}</span>
                  <span>•</span>
                  <span>{data.personal.phone || 'Phone Number'}</span>
                  <span>•</span>
                  <span>{data.personal.location || 'Location'}</span>
                </div>
              </div>

              <div className="space-y-12">
                <section className="space-y-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] border-b pb-2">Summary</h2>
                  <p className="text-slate-700 leading-relaxed font-medium">{data.personal.summary || 'A brief professional summary about your skills and goals.'}</p>
                </section>

                <section className="space-y-6">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] border-b pb-2">Experience</h2>
                  <div className="space-y-8">
                    {data.experience.length > 0 ? data.experience.map(exp => (
                      <div key={exp.id} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-lg font-bold">{exp.role || 'Role Title'}</h3>
                          <span className="text-xs font-bold text-slate-500 uppercase">{exp.duration || 'Duration'}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-600">{exp.company || 'Company Name'}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{exp.desc || 'Description of your work and impact.'}</p>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-400 italic">No experience added yet.</p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-8 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <Wrench className="text-amber-400" /> Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full py-4 bg-violet-glow text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-violet-glow/20 hover:scale-105 transition-all">
                  <Save size={20} /> Save Progress
                </button>
                <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                  <Download size={20} /> Export PDF
                </button>
              </div>
            </div>

            <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                <Layout size={14} /> ATS Score
              </div>
              <div className="text-4xl font-display font-bold text-white">84%</div>
              <p className="text-[10px] text-white/40 italic leading-relaxed">
                Your resume structure is highly compatible with modern Applicant Tracking Systems.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
