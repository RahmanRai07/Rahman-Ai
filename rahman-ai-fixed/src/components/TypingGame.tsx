import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Timer, RefreshCcw, Trophy, Target, Zap } from 'lucide-react';

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. Artificial intelligence is transforming the way we work and live. Career growth requires constant learning and adaptation in a rapidly changing world. Success is not final, failure is not fatal: it is the courage to continue that counts. Innovation distinguishes between a leader and a follower. The best way to predict the future is to create it. Focus on being productive instead of busy. Your time is limited, so don't waste it living someone else's life. Believe you can and you're halfway there. The only way to do great work is to love what you do.";

export const TypingGame: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [charCount, setCharCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setGameState('playing');
    setUserInput('');
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setCharCount(0);
    setErrorCount(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const finishTest = useCallback(() => {
    setGameState('finished');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft, finishTest]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (gameState !== 'playing') return;

    const value = e.target.value;
    setUserInput(value);

    // Calculate stats
    const timeElapsed = (60 - timeLeft) / 60;
    const standardWords = value.length / 5;
    const currentWpm = timeElapsed > 0 ? Math.round(standardWords / timeElapsed) : 0;
    setWpm(currentWpm);

    // Accuracy calculation
    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== SAMPLE_TEXT[i]) {
        errors++;
      }
    }
    setErrorCount(errors);
    const currentAccuracy = value.length > 0 ? Math.round(((value.length - errors) / value.length) * 100) : 100;
    setAccuracy(currentAccuracy);
    setCharCount(value.length);

    if (value.length >= SAMPLE_TEXT.length) {
      finishTest();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-brand-indigo/20">
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header Stats */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex gap-6">
            <div className="text-left">
              <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                <Timer size={10} /> Time
              </div>
              <div className={`text-2xl font-display font-bold ${timeLeft < 10 ? 'text-coral-glow' : 'text-white'}`}>
                {timeLeft}s
              </div>
            </div>
            <div className="text-left">
              <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                <Zap size={10} /> WPM
              </div>
              <div className="text-2xl font-display font-bold text-violet-glow">{wpm}</div>
            </div>
            <div className="text-left">
              <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                <Target size={10} /> Accuracy
              </div>
              <div className="text-2xl font-display font-bold text-electric-blue">{accuracy}%</div>
            </div>
          </div>
          <div className="text-right">
            <div className="label-mono text-[10px] mb-1">Typing Proficiency Test</div>
            <h3 className="text-xl font-display font-bold text-white">
              Speed <span className="text-violet-glow">Arena</span>
            </h3>
          </div>
        </div>

        {/* Typing Area */}
        <div className="glass-card p-8 bg-white/[0.02] border-white/10 relative min-h-[300px] flex flex-col">
          <div className="relative flex-1 mb-6">
            {/* Display Text */}
            <div className="text-lg md:text-xl font-mono leading-relaxed text-white/20 select-none break-words">
              {SAMPLE_TEXT.split('').map((char, i) => {
                let color = 'text-white/20';
                if (i < userInput.length) {
                  color = userInput[i] === char ? 'text-white' : 'text-coral-glow bg-coral-glow/20';
                }
                return (
                  <span key={i} className={`${color} transition-colors duration-100`}>
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Hidden Input */}
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              disabled={gameState === 'finished'}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
              spellCheck={false}
              autoFocus
            />
          </div>

          {/* Overlays */}
          <AnimatePresence>
            {gameState === 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 backdrop-blur-md bg-brand-indigo/60 flex flex-col items-center justify-center rounded-[20px]"
              >
                <div className="w-16 h-16 bg-violet-glow/20 rounded-2xl flex items-center justify-center mb-4 border border-violet-glow/30">
                  <Keyboard size={32} className="text-violet-glow" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white mb-2">Ready to Race?</h4>
                <p className="text-white/60 text-sm mb-6 font-medium text-center px-8">
                  Test your typing speed and accuracy in a 60-second sprint.
                </p>
                <button 
                  onClick={startTest}
                  className="btn-primary px-10 py-4 text-sm font-bold uppercase tracking-widest"
                >
                  Start Typing Test
                </button>
              </motion.div>
            )}

            {gameState === 'finished' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 backdrop-blur-md bg-brand-indigo/90 flex flex-col items-center justify-center rounded-[20px] border border-violet-glow/30"
              >
                <Trophy size={48} className="text-violet-glow mb-4 animate-bounce" />
                <h4 className="text-3xl font-display font-bold text-white mb-6">Test Complete!</h4>
                
                <div className="grid grid-cols-3 gap-8 mb-10">
                  <div className="text-center">
                    <div className="text-[10px] text-white/40 uppercase font-mono tracking-widest mb-1">Speed</div>
                    <div className="text-4xl font-display font-bold text-white">{wpm}</div>
                    <div className="text-[10px] text-violet-glow font-bold uppercase">WPM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-white/40 uppercase font-mono tracking-widest mb-1">Accuracy</div>
                    <div className="text-4xl font-display font-bold text-white">{accuracy}%</div>
                    <div className="text-[10px] text-electric-blue font-bold uppercase">Precision</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-white/40 uppercase font-mono tracking-widest mb-1">Errors</div>
                    <div className="text-4xl font-display font-bold text-coral-glow">{errorCount}</div>
                    <div className="text-[10px] text-coral-glow font-bold uppercase">Mistakes</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={startTest}
                    className="btn-primary px-8 py-3 text-sm flex items-center gap-2"
                  >
                    <RefreshCcw size={16} /> Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="mt-6 flex justify-center">
          <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
            {gameState === 'playing' ? 'Typing in progress... keep going!' : 'Press the button to begin your assessment'}
          </p>
        </div>
      </div>
    </div>
  );
};
