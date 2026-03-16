import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, User, Mail, School, BookOpen, Calendar, Target, Save, Edit2, Camera } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  onProfileUpdate?: (profile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<{ aptitude: any[], typing: any[] }>({ aptitude: [], typing: [] });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfile(p => p ? { ...p, avatar: base64 } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data || {
          name: 'Explorer',
          email: 'explorer@rahman.ai',
          college: 'Indian Institute of Technology',
          course: 'Computer Science',
          graduationDate: '2026',
          skills: [],
          careerGoal: 'Software Engineer',
          typingHistory: [],
          aptitudeScores: [],
          readinessScore: 0
        });
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setIsEditing(false);
        onProfileUpdate?.(profile);
      }
    } catch (err) {
      setError('Failed to save profile');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 border-4 border-violet-glow/20 border-t-violet-glow rounded-full animate-spin mx-auto" />
        <p className="text-white/40 font-bold text-xs uppercase tracking-widest">Syncing Neural Profile...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-32 space-y-12 perspective-1000">
      <motion.div 
        initial={{ opacity: 0, y: 20, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        whileHover={{ rotateX: 2, rotateY: -2, translateZ: 10 }}
        className="relative group preserve-3d"
      >
        {/* Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue via-violet-glow to-coral-glow rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative glass-card p-10 md:p-16 overflow-hidden border-white/5 preserve-3d">
          <div className="absolute top-0 right-0 p-10 z-10">
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all backdrop-blur-xl group/btn preserve-3d"
            >
              {isEditing ? (
                <><Save size={18} className="text-emerald-400" /> <span className="text-sm uppercase tracking-widest">Commit Changes</span></>
              ) : (
                <><Edit2 size={18} className="text-violet-glow group-hover/btn:rotate-12 transition-transform" /> <span className="text-sm uppercase tracking-widest">Modify Profile</span></>
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 preserve-3d">
            <div className="relative preserve-3d">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                className="hidden" 
                accept="image/*" 
              />
              <div 
                onClick={() => isEditing && fileInputRef.current?.click()}
                className={`w-48 h-48 rounded-full bg-gradient-to-br from-electric-blue/20 to-violet-glow/20 flex items-center justify-center shadow-2xl overflow-hidden border border-white/10 p-1 transform group-hover:translateZ(20px) ${isEditing ? 'cursor-pointer' : ''}`}
              >
                <div className="w-full h-full rounded-full bg-black/40 flex items-center justify-center overflow-hidden relative group/avatar">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={80} className="text-white/20" />
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-sm">
                      <Camera className="text-white w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-2xl bg-violet-glow flex items-center justify-center shadow-lg shadow-violet-glow/20 border border-white/20 transform group-hover:translateZ(40px)">
                <Zap className="text-white w-8 h-8" />
              </div>
            </div>

            <div className="flex-1 space-y-8 text-center md:text-left pt-4 transform group-hover:translateZ(10px)">
              <div className="space-y-4">
                {isEditing ? (
                  <input 
                    type="text"
                    value={profile?.name}
                    onChange={(e) => setProfile(p => p ? {...p, name: e.target.value} : null)}
                    className="text-5xl md:text-7xl font-display font-bold text-white bg-white/5 border border-white/10 rounded-3xl px-8 py-4 w-full outline-none focus:border-violet-glow transition-all"
                    placeholder="Enter Name"
                  />
                ) : (
                  <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter leading-none">
                    {profile?.name}
                  </h1>
                )}
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                    <Mail size={16} className="text-violet-glow" />
                    {isEditing ? (
                      <input 
                        type="email"
                        value={profile?.email}
                        onChange={(e) => setProfile(p => p ? {...p, email: e.target.value} : null)}
                        className="bg-transparent outline-none text-white font-medium"
                      />
                    ) : (
                      <span className="text-white/60 font-medium">{profile?.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                    <School size={16} className="text-electric-blue" />
                    {isEditing ? (
                      <input 
                        type="text"
                        value={profile?.college}
                        onChange={(e) => setProfile(p => p ? {...p, college: e.target.value} : null)}
                        className="bg-transparent outline-none text-white font-medium"
                      />
                    ) : (
                      <span className="text-white/60 font-medium">{profile?.college}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 preserve-3d">
            <div className="glass-card p-10 bg-white/[0.02] border-white/5 space-y-8 group/card hover:bg-white/[0.04] transition-all transform hover:translateZ(15px)">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white font-bold text-xl">
                  <div className="w-12 h-12 rounded-xl bg-violet-glow/10 flex items-center justify-center">
                    <BookOpen size={24} className="text-violet-glow" />
                  </div>
                  Academic Matrix
                </div>
                <div className="w-2 h-2 rounded-full bg-violet-glow animate-pulse" />
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Primary Domain</span>
                  {isEditing ? (
                    <input 
                      value={profile?.course}
                      onChange={(e) => setProfile(p => p ? {...p, course: e.target.value} : null)}
                      className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-violet-glow"
                    />
                  ) : (
                    <span className="text-white font-bold">{profile?.course}</span>
                  )}
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Graduation Cycle</span>
                  {isEditing ? (
                    <input 
                      value={profile?.graduationDate}
                      onChange={(e) => setProfile(p => p ? {...p, graduationDate: e.target.value} : null)}
                      className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-violet-glow"
                    />
                  ) : (
                    <span className="text-white font-bold">{profile?.graduationDate}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="glass-card p-10 bg-white/[0.02] border-white/5 space-y-8 group/card hover:bg-white/[0.04] transition-all transform hover:translateZ(15px)">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white font-bold text-xl">
                  <div className="w-12 h-12 rounded-xl bg-coral-glow/10 flex items-center justify-center">
                    <Target size={24} className="text-coral-glow" />
                  </div>
                  Strategic Focus
                </div>
                <div className="w-2 h-2 rounded-full bg-coral-glow animate-pulse" />
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Career Objective</span>
                  {isEditing ? (
                    <input 
                      value={profile?.careerGoal}
                      onChange={(e) => setProfile(p => p ? {...p, careerGoal: e.target.value} : null)}
                      className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-violet-glow"
                    />
                  ) : (
                    <span className="text-white font-bold">{profile?.careerGoal}</span>
                  )}
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Readiness Index</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-violet-glow"
                        initial={{ width: 0 }}
                        animate={{ width: `${profile?.readinessScore}%` }}
                        transition={{ duration: 1.5 }}
                      />
                    </div>
                    <span className="text-violet-glow font-display font-bold">{profile?.readinessScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 preserve-3d">
        {[
          { label: 'Neural Cycles', value: stats.typing.length, icon: <Zap size={20} className="text-electric-blue" /> },
          { label: 'Logic Assessments', value: stats.aptitude.length, icon: <Shield size={20} className="text-violet-glow" /> },
          { 
            label: 'Avg Accuracy', 
            value: `${stats.aptitude.length > 0 ? Math.round(stats.aptitude.reduce((acc, curr) => acc + curr.accuracy, 0) / stats.aptitude.length) : 0}%`,
            icon: <Target size={20} className="text-coral-glow" />
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, translateZ: 20 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card p-10 text-center space-y-4 border-white/5 group hover:bg-white/[0.05] transition-all preserve-3d"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-display font-bold text-white">{stat.value}</div>
              <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
