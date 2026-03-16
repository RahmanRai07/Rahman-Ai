import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Logo } from './components/Logo';
import { Dashboard } from './components/Dashboard';
import { ChatTea } from './components/ChatTea';
import { ImageEnhancement } from './components/ImageEnhancement';
import { PlacementArena } from './components/PlacementArena/PlacementArena';
import { TodoList } from './components/TodoList';
import { Profile } from './components/Profile';
import { Tools } from './components/Tools';
import { City3D } from './components/City/City3D';
import { FocusTimer } from './components/FocusTimer';
import { BackButton } from './components/BackButton';
import { Goal, Task } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [username, setUsername] = useState('Explorer');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [year, setYear] = useState('2026');

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, goalsRes, profileRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/goals'),
          fetch('/api/profile')
        ]);
        
        if (tasksRes.ok) setTasks(await tasksRes.json());
        if (goalsRes.ok) setGoals(await goalsRes.json());
        if (profileRes.ok) {
          const profile = await profileRes.json();
          if (profile) {
            setUsername(profile.name || 'Explorer');
            setUserAvatar(profile.avatar || null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleBack = () => {
    setActiveSection('dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-indigo selection:bg-violet-glow/30 selection:text-white relative overflow-hidden">
      {activeSection !== 'city' && (
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} userAvatar={userAvatar} />
      )}
      
      {activeSection !== 'dashboard' && activeSection !== 'city' && (
        <BackButton onClick={handleBack} />
      )}

      {activeSection !== 'city' && <FocusTimer />}
      
      <main className="relative z-10">
        {/* Mesh Gradient Background */}
        {activeSection !== 'city' && (
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-glow/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-electric-blue/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-coral-glow/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
            
            {/* Scanline Effect */}
            <div className="absolute inset-0 opacity-[0.03] animate-scanline bg-gradient-to-b from-transparent via-white to-transparent bg-[length:100%_4px]" />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeSection === 'dashboard' && <Dashboard setActiveSection={setActiveSection} />}
            {activeSection === 'chat' && <ChatTea />}
            {activeSection === 'image' && <ImageEnhancement />}
            {activeSection === 'career' && <PlacementArena />}
            {activeSection === 'tools' && <Tools />}
            {activeSection === 'tasks' && <TodoList />}
            {activeSection === 'profile' && (
              <Profile onProfileUpdate={(p) => {
                setUsername(p.name);
                setUserAvatar(p.avatar || null);
              }} />
            )}
            {activeSection === 'city' && (
              <div className="relative">
                <BackButton onClick={handleBack} />
                <City3D goals={goals} username={username} year={year} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {activeSection !== 'city' && (
        <footer className="relative z-10 border-t border-white/5 py-12 mt-20 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveSection('dashboard')}>
              <Logo className="w-10 h-10" />
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-display font-black text-white tracking-tighter group-hover:text-electric-blue transition-colors">
                  RAHMAN
                </span>
                <span className="text-[10px] font-mono font-bold text-violet-glow tracking-[0.3em] uppercase">
                  Intelligence
                </span>
              </div>
            </div>
            
            <div className="flex gap-8 text-sm text-white/40 font-medium">
              <a href="#" className="hover:text-violet-glow transition-colors">Platform</a>
              <a href="#" className="hover:text-violet-glow transition-colors">Intelligence</a>
              <a href="#" className="hover:text-violet-glow transition-colors">Security</a>
              <a href="#" className="hover:text-violet-glow transition-colors">Company</a>
            </div>

            <div className="text-right">
              <p className="text-sm text-white/40 font-medium">
                &copy; 2026 Rahman Ai. <span className="text-violet-glow/60">v4.0.2-stable</span>
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
