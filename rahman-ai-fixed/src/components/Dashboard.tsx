import React from 'react';
import { motion } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { Sparkles, ArrowRight, MessageSquare, GraduationCap, ListTodo, ImageIcon, Building2, Zap, Bot, Shield, Globe, Star, Cpu, FileSearch, Brain } from 'lucide-react';

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveSection }) => {
  const features = [
    {
      id: 'chat',
      title: 'Neural Chat',
      description: 'Real-time collaborative intelligence with secure neural synchronization.',
      icon: MessageSquare,
      color: 'from-electric-blue to-violet-glow',
      delay: 0.1,
      size: 'col-span-1 md:col-span-1'
    },
    {
      id: 'image',
      title: 'Vision Studio',
      description: 'Futuristic image synthesis and neural enhancement powered by AI.',
      icon: ImageIcon,
      color: 'from-violet-glow to-coral-glow',
      delay: 0.2,
      size: 'col-span-1 md:col-span-1'
    },
    {
      id: 'career',
      title: 'Career Arena',
      description: 'A high-performance ecosystem for gamified placement preparation.',
      icon: GraduationCap,
      color: 'from-coral-glow to-electric-blue',
      delay: 0.3,
      size: 'col-span-1 md:col-span-2'
    },
    {
      id: 'city',
      title: '3D Metropolis',
      description: 'Visualize your professional growth as a dynamic, growing metropolis.',
      icon: Building2,
      color: 'from-emerald-400 to-electric-blue',
      delay: 0.4,
      size: 'col-span-1 md:col-span-2'
    },
    {
      id: 'tasks',
      title: 'Logic Matrix',
      description: 'Advanced task synchronization mapped to your 3D city development.',
      icon: ListTodo,
      color: 'from-blue-400 to-indigo-600',
      delay: 0.5,
      size: 'col-span-1 md:col-span-2'
    }
  ];

  return (
    <div className="space-y-32 pb-40">
      {/* Hero Section - Recipe 2 & 7 Mixed */}
      <section className="relative pt-32 sm:pt-64 px-4 sm:px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Atmospheric Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] bg-violet-glow/20 rounded-full blur-[80px] sm:blur-[160px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[200px] sm:w-[600px] h-[200px] sm:h-[600px] bg-electric-blue/10 rounded-full blur-[70px] sm:blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-white/5 border border-white/10 text-violet-glow text-[10px] sm:text-xs font-bold mb-8 sm:mb-12 backdrop-blur-md uppercase tracking-[0.2em]"
          >
            <Zap size={14} className="animate-pulse" />
            <span>Next-Gen Career Intelligence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-[10rem] font-display font-bold text-white leading-[0.9] sm:leading-[0.85] mb-8 sm:mb-12 tracking-tighter"
          >
            MASTER YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-violet-glow to-coral-glow">FUTURE.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-base sm:text-lg md:text-2xl text-white/40 max-w-3xl mx-auto mb-12 sm:mb-16 font-medium leading-relaxed tracking-tight px-4"
          >
            The world's first AI-powered ecosystem designed to gamify your career growth, 
            automate your productivity, and architect your professional destiny.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
          >
            <MagneticButton 
              onClick={() => setActiveSection('career')} 
              className="btn-primary w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl group"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Interview Prep <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>
            <button 
              onClick={() => setActiveSection('tasks')} 
              className="text-white/60 hover:text-white font-bold text-base sm:text-lg flex items-center gap-3 transition-colors group"
            >
              Explore Modules <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-colors"><ArrowRight size={20} /></div>
            </button>
          </motion.div>
        </div>

        {/* Floating Abstract Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] w-64 h-64 glass-card opacity-10 rotate-12"
          />
          <motion.div 
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[10%] w-48 h-48 glass-card opacity-10 -rotate-12"
          />
        </div>
      </section>

      {/* Stats Section - Minimal & Clean */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-white/5 py-20">
          {[
            { label: 'Active Users', value: '12K+' },
            { label: 'Interviews Prep', value: '45K+' },
            { label: 'Success Rate', value: '94%' },
            { label: 'AI Accuracy', value: '99.9%' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center space-y-2"
            >
              <p className="text-4xl md:text-6xl font-display font-bold text-white">{stat.value}</p>
              <p className="text-xs font-bold text-white/20 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features - Recipe 5 Mixed */}
      <section className="max-w-7xl mx-auto px-6 perspective-1000">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <div className="label-mono">Core Intelligence</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
              One Platform. <br />
              <span className="text-white/40">Infinite Potential.</span>
            </h2>
          </div>
          <p className="text-white/40 max-w-sm font-medium leading-relaxed">
            Our neural-powered modules work in perfect harmony to accelerate your career trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 preserve-3d">
          {features.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              whileHover={{ 
                scale: 1.02,
                rotateX: 5,
                rotateY: -5,
                translateZ: 20
              }}
              transition={{ 
                delay: f.delay,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              viewport={{ once: true }}
              onClick={() => setActiveSection(f.id)}
              className={`${f.size} glass-card p-6 sm:p-10 cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[280px] sm:min-h-[320px]`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <f.icon size={120} />
              </div>
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-2xl shadow-black/40 group-hover:scale-110 transition-transform duration-500`}>
                <f.icon className="text-white" size={32} />
              </div>

              <div className="space-y-4 relative z-10">
                <h3 className="text-3xl font-display font-bold text-white">{f.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium text-sm group-hover:text-white/60 transition-colors">
                  {f.description}
                </p>
                <div className="pt-4 flex items-center gap-2 text-violet-glow font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  Launch Module <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20 space-y-4">
          <div className="label-mono">The Blueprint</div>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">
            Architecting Your <span className="text-violet-glow">Success.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
          
          {[
            {
              step: '01',
              title: 'Neural Analysis',
              desc: 'Upload your resume for a deep-learning audit against global hiring standards.',
              icon: FileSearch
            },
            {
              step: '02',
              title: 'Skill Synthesis',
              desc: 'Engage in gamified aptitude and technical simulations to sharpen your edge.',
              icon: Brain
            },
            {
              step: '03',
              title: 'Interview Mastery',
              desc: 'Simulate high-stakes HR and technical interviews with real-time AI feedback.',
              icon: Bot
            }
          ].map((item, i) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative z-10 glass-card p-10 text-center space-y-6 group hover:bg-white/[0.05] transition-all"
            >
              <div className="w-20 h-20 rounded-3xl bg-brand-indigo border border-white/10 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                <item.icon size={32} className="text-violet-glow" />
              </div>
              <div className="space-y-2">
                <span className="text-4xl font-display font-bold text-white/10 group-hover:text-violet-glow/20 transition-colors">{item.step}</span>
                <h3 className="text-2xl font-display font-bold text-white">{item.title}</h3>
                <p className="text-white/40 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Showcase / Screenshots */}
      <section className="max-w-7xl mx-auto px-6 py-32 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="label-mono">Visual Intelligence</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white leading-[0.9] tracking-tighter">
              A Interface <br />
              <span className="text-white/40">From the Future.</span>
            </h2>
            <p className="text-xl text-white/40 font-medium leading-relaxed">
              Experience a workspace that adapts to your needs. From 3D metropolis growth tracking to neural image synthesis, every pixel is designed for focus.
            </p>
            <div className="space-y-6">
              {[
                'Real-time 3D growth visualization',
                'Neural-powered resume optimization',
                'Gamified skill acquisition matrix',
                'Secure collaborative chattea'
              ].map(feature => (
                <div key={feature} className="flex items-center gap-4 text-white font-bold">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <Zap size={14} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-[2.5rem] bg-black/40 border border-white/10 overflow-hidden relative group shadow-2xl">
              <img 
                src="https://picsum.photos/seed/dashboard-preview/1200/800" 
                alt="Platform Preview" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                  <ArrowRight size={32} />
                </div>
              </div>
            </div>
            {/* Decorative Floating Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-glow/20 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-electric-blue/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </section>

      {/* AI Interview Assistant Spotlight - Split Layout Recipe 11 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 perspective-1000">
        <motion.div 
          initial={{ opacity: 0, rotateX: 10 }}
          whileInView={{ opacity: 1, rotateX: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 sm:p-12 md:p-24 relative overflow-hidden group preserve-3d"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-violet-glow/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center preserve-3d">
            <div className="space-y-6 sm:space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-violet-glow/10 border border-violet-glow/20 text-violet-glow text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <Bot size={16} /> AI Interview Assistant
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold text-white leading-[0.9] tracking-tighter">
                PREP LIKE A <br />
                <span className="text-violet-glow">PRO.</span>
              </h2>
              <p className="text-lg sm:text-xl text-white/40 font-medium leading-relaxed max-w-lg">
                Our AI analyzes your resume, simulates real-time interviews, and provides deep behavioral feedback to ensure you land your dream role.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Shield size={18} className="text-electric-blue" />
                    <span>ATS Verified</span>
                  </div>
                  <p className="text-xs text-white/20">Optimized for global hiring standards.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Globe size={18} className="text-coral-glow" />
                    <span>Global Benchmarking</span>
                  </div>
                  <p className="text-xs text-white/20">Compare your skills with top 1% candidates.</p>
                </div>
              </div>

              <MagneticButton 
                onClick={() => setActiveSection('career')} 
                className="btn-primary w-full sm:w-auto px-10 py-5"
              >
                Analyze My Resume
              </MagneticButton>
            </div>
            
            <div className="relative mt-12 lg:mt-0">
              <div className="aspect-square rounded-[30px] sm:rounded-[40px] overflow-hidden border border-white/10 bg-black/40 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <img 
                  src="https://picsum.photos/seed/ai-tech/1000/1000" 
                  alt="AI Interface" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay UI Elements */}
                <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 z-20 space-y-4">
                  <div className="glass-card p-3 sm:p-4 flex items-center gap-4 border-white/20 bg-white/10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Readiness Score</p>
                      <p className="text-xl sm:text-2xl font-display text-white">98.4%</p>
                    </div>
                  </div>
                </div>

                {/* Floating Tech Accents */}
                <div className="absolute top-6 sm:top-10 right-6 sm:right-10 z-20">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center animate-float">
                    <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-violet-glow" />
                  </div>
                </div>
              </div>
              
              {/* Decorative Rings */}
              <div className="absolute -top-10 -right-10 w-20 sm:w-40 h-20 sm:h-40 border border-white/5 rounded-full animate-pulse" />
              <div className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-40 sm:w-80 h-40 sm:h-80 border border-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Section - Enhanced with 3D Neural Graphic */}
      <section className="max-w-7xl mx-auto px-6 text-center relative py-20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-[600px] h-[600px] border border-violet-glow/20 rounded-full flex items-center justify-center"
          >
            <div className="w-[400px] h-[400px] border border-electric-blue/20 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-[200px] h-[200px] border border-coral-glow/20 rounded-full" />
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-16">
          <div className="flex flex-col items-center gap-6">
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotateY: [0, 360]
              }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-electric-blue via-violet-glow to-coral-glow p-[1px] shadow-[0_0_50px_rgba(139,92,246,0.3)]"
            >
              <div className="w-full h-full rounded-[23px] bg-brand-indigo flex items-center justify-center">
                <Cpu size={40} className="text-white animate-pulse" />
              </div>
            </motion.div>
            <p className="label-mono">Empowering Students From Global Giants</p>
          </div>

          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map(brand => (
              <motion.span 
                key={brand} 
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-3xl md:text-5xl font-display font-bold tracking-tighter cursor-default"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
