import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Target, RotateCcw, Award, ChevronRight, BarChart3 } from 'lucide-react';

const SAMPLE_TEXTS = [
  "The future of artificial intelligence is not just about building smarter machines, but about enhancing human potential. As we move into 2026, the integration of AI into our daily lives becomes more seamless and intuitive.",
  "Success in the tech industry requires a combination of technical proficiency and soft skills. Problem-solving, critical thinking, and effective communication are just as important as knowing how to code in multiple languages.",
  "The rapid evolution of web technologies has transformed the way we interact with information. From static pages to dynamic, AI-driven experiences, the web continues to be the most powerful platform for innovation.",
  "Career preparation is a marathon, not a sprint. It involves continuous learning, networking, and practicing the skills that employers value most in a competitive global market."
];

interface TypingTestProps {
  onComplete: (wpm: number, accuracy: number, mode: '1min' | '3min') => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'1min' | '3min'>( '1min');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const startTest = (selectedMode: '1min' | '3min') => {
    setMode(selectedMode);
    setTimeLeft(selectedMode === '1min' ? 60 : 180);
    setText(SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
    setUserInput('');
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setIsActive(true);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const calculateStats = useCallback(() => {
    if (userInput.length === 0) return;

    const words = userInput.trim().split(/\s+/).length;
    const minutes = (mode === '1min' ? 60 - timeLeft : 180 - timeLeft) / 60;
    const currentWpm = Math.round(words / (minutes || 1/60));
    
    let currentErrors = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== text[i]) {
        currentErrors++;
      }
    }
    
    const currentAccuracy = Math.max(0, Math.round(((userInput.length - currentErrors) / userInput.length) * 100));
    
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
    setErrors(currentErrors);
  }, [userInput, text, timeLeft, mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        calculateStats();
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      onComplete(wpm, accuracy, mode);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, calculateStats, onComplete, wpm, accuracy, mode]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive || isFinished) return;
    setUserInput(e.target.value);
  };

  const getPerformanceLevel = (wpm: number) => {
    if (wpm < 30) return { label: 'Beginner', color: 'text-blue-400' };
    if (wpm < 60) return { label: 'Intermediate', color: 'text-violet-400' };
    return { label: 'Advanced', color: 'text-emerald-400' };
  };

  const performance = getPerformanceLevel(wpm);

  const saveResults = async () => {
    try {
      await fetch('/api/typing/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wpm, accuracy })
      });
      setIsFinished(false);
      onComplete(wpm, accuracy, mode);
    } catch (error) {
      console.error('Failed to save typing result:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Typing Performance Test</h2>
          <p className="text-white/60">Measure your speed and accuracy under pressure.</p>
        </div>
        
        {!isActive && !isFinished && (
          <div className="flex gap-3">
            <button
              onClick={() => startTest('1min')}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all flex items-center gap-2 group"
            >
              <Timer className="w-4 h-4 text-violet-glow group-hover:scale-110 transition-transform" />
              1 Minute Test
            </button>
            <button
              onClick={() => startTest('3min')}
              className="px-6 py-3 bg-violet-glow/20 hover:bg-violet-glow/30 border border-violet-glow/30 rounded-xl text-white font-medium transition-all flex items-center gap-2 group"
            >
              <Zap className="w-4 h-4 text-violet-glow group-hover:scale-110 transition-transform" />
              3 Minute Test
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">WPM</span>
                  <span className="text-3xl font-display font-bold text-white">{wpm}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Accuracy</span>
                  <span className="text-3xl font-display font-bold text-white">{accuracy}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <Timer className="w-4 h-4 text-violet-glow" />
                <span className="text-xl font-mono font-bold text-white">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 pointer-events-none text-2xl font-mono leading-relaxed p-6 whitespace-pre-wrap">
                {text.split('').map((char, i) => {
                  let color = 'text-white/20';
                  if (i < userInput.length) {
                    color = userInput[i] === text[i] ? 'text-white' : 'text-coral-glow';
                  }
                  return (
                    <span key={i} className={`${color} transition-colors duration-150`}>
                      {char}
                    </span>
                  );
                })}
              </div>
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInput}
                onPaste={(e) => e.preventDefault()}
                className="w-full h-48 bg-transparent text-2xl font-mono leading-relaxed p-6 resize-none focus:outline-none text-transparent caret-violet-glow"
                spellCheck={false}
              />
            </div>
          </motion.div>
        ) : isFinished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-glow via-electric-blue to-coral-glow" />
            
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-violet-glow/20 mb-6">
              <Award className="w-10 h-10 text-violet-glow" />
            </div>
            
            <h3 className="text-4xl font-display font-bold text-white mb-2">Test Complete!</h3>
            <p className="text-white/60 mb-12">Here's how you performed in the {mode} challenge.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <span className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Speed</span>
                <span className="text-4xl font-display font-bold text-white">{wpm}</span>
                <span className="block text-sm text-white/40 mt-1">WPM</span>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <span className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Accuracy</span>
                <span className="text-4xl font-display font-bold text-white">{accuracy}%</span>
                <span className="block text-sm text-white/40 mt-1">Correct</span>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <span className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Errors</span>
                <span className="text-4xl font-display font-bold text-coral-glow">{errors}</span>
                <span className="block text-sm text-white/40 mt-1">Mistakes</span>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <span className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Level</span>
                <span className={`text-2xl font-display font-bold ${performance.color}`}>{performance.label}</span>
                <span className="block text-sm text-white/40 mt-1">Proficiency</span>
              </div>
            </div>

            <div className="max-w-md mx-auto p-4 bg-violet-glow/10 rounded-xl border border-violet-glow/20 mb-10">
              <p className="text-sm text-white/80 italic">
                “{accuracy < 95 ? 'Improve accuracy by slowing down slightly.' : 'Great job! Focus on maintaining this speed while pushing for more words.'}”
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsFinished(false)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={saveResults}
                className="px-8 py-4 bg-violet-glow hover:bg-violet-glow/80 rounded-xl text-white font-bold shadow-lg shadow-violet-glow/20 transition-all flex items-center gap-2"
              >
                Save Results
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Precision First</h4>
              <p className="text-sm text-white/40">Focus on accuracy to build muscle memory before speed.</p>
            </div>
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-violet-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Consistent Rhythm</h4>
              <p className="text-sm text-white/40">Maintain a steady pace rather than bursts of speed.</p>
            </div>
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Track Progress</h4>
              <p className="text-sm text-white/40">Regular practice shows significant improvement over time.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
