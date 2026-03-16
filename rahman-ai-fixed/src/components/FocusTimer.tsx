import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, X, Play, Pause, RotateCcw, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FocusTimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerEnd();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerEnd = () => {
    setIsActive(false);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#3B82F6', '#F43F5E']
    });
    
    if (Notification.permission === 'granted') {
      new Notification('Time\'s up!', {
        body: 'Great job finishing your task 🎉',
        icon: '/favicon.ico'
      });
    }

    // Play alarm sound
    const playAlarm = async () => {
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        await audio.play();
      } catch (error) {
        console.warn('Audio playback failed, using fallback beep:', error);
        // Fallback: simple beep using Web Audio API
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
          console.error('Web Audio fallback failed:', e);
        }
      }
    };
    playAlarm();
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const setTime = (minutes: number) => {
    const seconds = minutes * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <>
      <motion.button
        id="focus-timer-trigger"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 right-24 z-50 p-3 rounded-full bg-violet-glow/20 border border-violet-glow/30 backdrop-blur-md text-violet-glow shadow-lg shadow-violet-glow/20"
      >
        <Timer size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="focus-timer-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-brand-indigo/80 backdrop-blur-xl"
          >
            <div className="relative glass-card p-12 max-w-md w-full flex flex-col items-center gap-8">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-display text-white">Focus Timer</h2>

              <div className="relative w-64 h-64">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={754}
                    initial={{ strokeDashoffset: 754 }}
                    animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
                    className="text-violet-glow"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-mono font-bold text-white">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => setTime(1)} className="btn-secondary px-4 py-2 text-sm">1m</button>
                <button onClick={() => setTime(25)} className="btn-secondary px-4 py-2 text-sm">25m</button>
                <button onClick={() => setTime(60)} className="btn-secondary px-4 py-2 text-sm">1h</button>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 px-3 py-1">
                  <input 
                    type="text" 
                    placeholder="Custom (e.g. 5m, 1.2h)"
                    className="bg-transparent border-none outline-none text-white text-xs w-32"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.toLowerCase().trim();
                        let mins = 0;
                        if (val.endsWith('m')) mins = parseFloat(val);
                        else if (val.endsWith('h')) mins = parseFloat(val) * 60;
                        else if (val.endsWith('min')) mins = parseFloat(val);
                        else if (val.endsWith('hr')) mins = parseFloat(val) * 60;
                        else mins = parseFloat(val);
                        
                        if (!isNaN(mins) && mins > 0) {
                          setTime(mins);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetTimer}
                  className="p-4 rounded-full bg-white/5 text-white/60 hover:text-white transition-colors"
                >
                  <RotateCcw size={24} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTimer}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-electric-blue to-violet-glow flex items-center justify-center text-white shadow-xl shadow-violet-glow/40"
                >
                  {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (Notification.permission !== 'granted') {
                      Notification.requestPermission();
                    }
                  }}
                  className="p-4 rounded-full bg-white/5 text-white/60 hover:text-white transition-colors"
                >
                  <Bell size={24} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
