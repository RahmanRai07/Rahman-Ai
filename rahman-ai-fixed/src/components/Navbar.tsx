import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, MessageSquare, Image as ImageIcon, GraduationCap, ListTodo, User, Wrench } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userAvatar?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection, userAvatar }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'chat', label: 'ChatTea', icon: MessageSquare },
    { id: 'image', label: 'Studio', icon: ImageIcon },
    { id: 'career', label: 'Career', icon: GraduationCap },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 perspective-1000">
      <motion.div 
        initial={{ y: -100, opacity: 0, rotateX: -20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        whileHover={{ rotateX: 5, translateZ: 20 }}
        className="glass-card px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between bg-white/[0.01] backdrop-blur-3xl border-white/5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] preserve-3d"
      >
        <motion.div 
          className="flex items-center gap-2 sm:gap-4 cursor-pointer shrink-0 group"
          whileHover={{ scale: 1.02 }}
          onClick={() => setActiveSection('dashboard')}
        >
          <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
          <div className="flex flex-col -space-y-1 hidden md:flex">
            <span className="text-xl font-display font-black text-white tracking-tighter group-hover:text-electric-blue transition-colors">
              RAHMAN
            </span>
            <span className="text-[10px] font-mono font-bold text-violet-glow tracking-[0.3em] uppercase">
              Intelligence
            </span>
          </div>
        </motion.div>
 
        <div className="flex items-center gap-0.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-full">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`relative px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-500 flex items-center gap-2 shrink-0 ${
                activeSection === item.id 
                  ? 'text-white' 
                  : 'text-white/30 hover:text-white/60'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {item.id === 'profile' && userAvatar ? (
                <div className="relative z-10 w-5 h-5 rounded-full overflow-hidden border border-white/20">
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <item.icon size={16} className={`relative z-10 ${activeSection === item.id ? 'text-violet-glow' : ''}`} />
              )}
              <span className="hidden lg:block relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};
