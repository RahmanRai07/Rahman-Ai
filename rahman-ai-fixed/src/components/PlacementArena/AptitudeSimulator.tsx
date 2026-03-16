import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Timer, 
  Trophy, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  BookOpen,
  Calculator,
  Puzzle,
  Type,
  BarChart3,
  Settings2,
  Play
} from 'lucide-react';

interface Question {
  id: string;
  category: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const CATEGORIES = [
  { 
    id: 'quant', 
    name: 'Quantitative Aptitude', 
    icon: Calculator, 
    color: 'text-blue-400',
    topics: ['Arithmetic Basics', 'Time & Motion', 'Numbers', 'Advanced Math', 'Commercial Math']
  },
  { 
    id: 'logical', 
    name: 'Logical Reasoning', 
    icon: Puzzle, 
    color: 'text-violet-glow',
    topics: ['Series & Coding', 'Analytical Reasoning', 'Deductive Logic', 'Non-Verbal Reasoning']
  },
  { 
    id: 'verbal', 
    name: 'Verbal Ability', 
    icon: Type, 
    color: 'text-coral-glow',
    topics: ['Grammar', 'Vocabulary', 'Comprehension']
  },
  { 
    id: 'di', 
    name: 'Data Interpretation', 
    icon: BarChart3, 
    color: 'text-emerald-400',
    topics: ['Visual Data', 'Complex Data']
  }
];

// Mock Question Database (Simplified for demo)
const QUESTION_DB: Question[] = [
  // Quant
  {
    id: 'q1',
    category: 'quant',
    topic: 'Arithmetic Basics',
    question: 'If a person sells an article for ₹650 and gains 30%, what is the cost price?',
    options: ['₹450', '₹500', '₹550', '₹600'],
    correctAnswer: 1,
    explanation: 'CP = (SP * 100) / (100 + Gain%) = (650 * 100) / 130 = 5 * 100 = ₹500.'
  },
  {
    id: 'q2',
    category: 'quant',
    topic: 'Time & Motion',
    question: 'A train 150m long is running at 54 km/hr. How much time will it take to cross a pole?',
    options: ['8 sec', '10 sec', '12 sec', '15 sec'],
    correctAnswer: 1,
    explanation: 'Speed = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds.'
  },
  {
    id: 'q3',
    category: 'quant',
    topic: 'Numbers',
    question: 'The HCF of two numbers is 11 and their LCM is 7700. If one of the numbers is 275, then the other is:',
    options: ['279', '283', '308', '318'],
    correctAnswer: 2,
    explanation: 'Product of two numbers = HCF * LCM. 275 * x = 11 * 7700. x = (11 * 7700) / 275 = 308.'
  },
  {
    id: 'q4',
    category: 'quant',
    topic: 'Commercial Math',
    question: 'At what rate of simple interest per annum will a sum of money double in 8 years?',
    options: ['11%', '12.5%', '15%', '20%'],
    correctAnswer: 1,
    explanation: 'Let principal be P. Amount becomes 2P. SI = 2P - P = P. SI = (P*R*T)/100 => P = (P*R*8)/100 => R = 100/8 = 12.5%.'
  },
  {
    id: 'q5',
    category: 'quant',
    topic: 'Advanced Math',
    question: 'If x + 1/x = 5, then x² + 1/x² is:',
    options: ['23', '25', '27', '30'],
    correctAnswer: 0,
    explanation: '(x + 1/x)² = x² + 1/x² + 2. So, 5² = x² + 1/x² + 2 => 25 - 2 = 23.'
  },
  // Logical
  {
    id: 'l1',
    category: 'logical',
    topic: 'Series & Coding',
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '44'],
    correctAnswer: 2,
    explanation: 'The differences are 4, 6, 8, 10... so the next difference is 12. 30 + 12 = 42.'
  },
  {
    id: 'l2',
    category: 'logical',
    topic: 'Analytical Reasoning',
    question: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
    options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
    correctAnswer: 1,
    explanation: '"My father\'s son" is the man himself (since he has no siblings). So, "that man\'s father is ME". Thus, the man in the photo is his son.'
  },
  {
    id: 'l3',
    category: 'logical',
    topic: 'Deductive Logic',
    question: 'Statements: All mangoes are golden. No golden things are cheap. Conclusions: I. All mangoes are cheap. II. Golden things are not mangoes.',
    options: ['Only I follows', 'Only II follows', 'Either I or II follows', 'Neither I nor II follows'],
    correctAnswer: 3,
    explanation: 'Since all mangoes are golden and no golden things are cheap, no mangoes are cheap. Conclusion I is false. Conclusion II is false because mangoes ARE golden things.'
  },
  // Verbal
  {
    id: 'v1',
    category: 'verbal',
    topic: 'Grammar',
    question: 'Choose the correct sentence:',
    options: [
      'Neither of the two candidates are eligible.',
      'Neither of the two candidates is eligible.',
      'Neither of the two candidates were eligible.',
      'Neither of the two candidates have been eligible.'
    ],
    correctAnswer: 1,
    explanation: '"Neither" is singular and takes a singular verb "is".'
  },
  {
    id: 'v2',
    category: 'verbal',
    topic: 'Vocabulary',
    question: 'Choose the word which is most nearly the SAME in meaning as the word: ABANDON',
    options: ['Keep', 'Forsake', 'Cherish', 'Adopt'],
    correctAnswer: 1,
    explanation: 'Abandon means to leave or give up completely. Forsake is a synonym.'
  },
  // DI
  {
    id: 'd1',
    category: 'di',
    topic: 'Visual Data',
    question: 'In a pie chart representing expenses, if Food is 25% and the total expense is ₹40,000, how much is spent on Food?',
    options: ['₹8,000', '₹10,000', '₹12,000', '₹15,000'],
    correctAnswer: 1,
    explanation: '25% of 40,000 = (25/100) * 40,000 = 10,000.'
  }
];

export const AptitudeSimulator: React.FC = () => {
  const [gameState, setGameState] = useState<'setup' | 'quiz' | 'result'>('setup');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = () => {
    let pool = QUESTION_DB;
    if (selectedCategories.length > 0) {
      pool = QUESTION_DB.filter(q => selectedCategories.includes(q.category));
    }
    
    // Shuffle and pick
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    
    setCurrentQuestions(selected);
    setGameState('quiz');
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(selected.length * 60); // 1 minute per question
  };

  useEffect(() => {
    let timer: any;
    if (gameState === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'quiz') {
      setGameState('result');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleAnswer = (optionIdx: number) => {
    setAnswers({ ...answers, [currentIndex]: optionIdx });
  };

  const calculateScore = () => {
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (gameState === 'result') {
      const score = calculateScore();
      const accuracy = (score / currentQuestions.length) * 100;
      fetch('/api/aptitude/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, total: currentQuestions.length, accuracy })
      }).catch(err => console.error('Failed to save aptitude result:', err));
    }
  }, [gameState]);

  if (gameState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 py-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-display font-bold text-white">Aptitude Masterclass</h2>
          <p className="text-white/60">Configure your training session to match Indian IT company standards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 space-y-6 border-white/10">
            <div className="flex items-center gap-3 text-white font-bold">
              <Settings2 className="text-violet-glow" /> Select Categories
            </div>
            <div className="grid grid-cols-1 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (selectedCategories.includes(cat.id)) {
                      setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                    } else {
                      setSelectedCategories([...selectedCategories, cat.id]);
                    }
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    selectedCategories.includes(cat.id) 
                      ? 'bg-violet-glow/20 border-violet-glow text-white' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon size={20} className={cat.color} />
                    <span className="font-bold">{cat.name}</span>
                  </div>
                  {selectedCategories.includes(cat.id) && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 space-y-6 border-white/10">
            <div className="flex items-center gap-3 text-white font-bold">
              <Timer className="text-coral-glow" /> Quiz Settings
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm text-white/40 font-bold uppercase tracking-widest">Number of Questions</label>
                <div className="grid grid-cols-4 gap-3">
                  {[5, 10, 20, 50].map(count => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`py-3 rounded-xl border font-bold transition-all ${
                        questionCount === count 
                          ? 'bg-coral-glow/20 border-coral-glow text-coral-glow' 
                          : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="w-full py-5 bg-violet-glow hover:bg-violet-glow/80 text-white rounded-2xl font-bold text-lg shadow-xl shadow-violet-glow/20 transition-all flex items-center justify-center gap-3"
              >
                <Play size={20} /> Start Training Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'quiz') {
    const q = currentQuestions[currentIndex];
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-12">
        <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Question {currentIndex + 1} of {currentQuestions.length}</span>
            <div className="flex items-center gap-2 text-violet-glow font-bold">
              <Brain size={18} /> {q.topic}
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/10">
            <Timer className={timeLeft < 30 ? 'text-coral-glow animate-pulse' : 'text-white/40'} />
            <span className={`font-mono font-bold text-xl ${timeLeft < 30 ? 'text-coral-glow' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-violet-glow"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
          />
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-10 space-y-8 border-white/10"
        >
          <h3 className="text-2xl font-display font-bold text-white leading-relaxed">
            {q.question}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`p-6 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  answers[currentIndex] === idx 
                    ? 'bg-violet-glow/20 border-violet-glow text-white' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="font-medium">{opt}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  answers[currentIndex] === idx ? 'border-violet-glow bg-violet-glow' : 'border-white/10 group-hover:border-white/30'
                }`}>
                  {answers[currentIndex] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-between">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded-xl text-white font-bold transition-all"
          >
            Previous
          </button>
          {currentIndex === currentQuestions.length - 1 ? (
            <button
              onClick={() => setGameState('result')}
              className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-12 py-4 bg-violet-glow hover:bg-violet-glow/80 text-white rounded-xl font-bold shadow-lg shadow-violet-glow/20 transition-all flex items-center gap-2"
            >
              Next Question <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const score = calculateScore();
    const percentage = (score / currentQuestions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-12 py-12">
        <div className="glass-card p-12 text-center space-y-8 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-violet-glow via-electric-blue to-coral-glow" />
          
          <div className="space-y-4">
            <div className="w-24 h-24 bg-violet-glow/20 rounded-full flex items-center justify-center mx-auto border border-violet-glow/30">
              <Trophy className="text-violet-glow" size={48} />
            </div>
            <h2 className="text-4xl font-display font-bold text-white">Training Complete!</h2>
            <p className="text-white/40">You've successfully completed the assessment session.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-display font-bold text-white">{score} / {currentQuestions.length}</div>
              <div className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Total Score</div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-display font-bold text-violet-glow">{percentage.toFixed(0)}%</div>
              <div className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Accuracy</div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-display font-bold text-emerald-400">Pass</div>
              <div className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Status</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('setup')}
              className="px-8 py-4 bg-violet-glow hover:bg-violet-glow/80 text-white rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <RefreshCw size={18} /> Retake Quiz
            </button>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all flex items-center gap-2"
            >
              <BookOpen size={18} /> {showExplanation ? 'Hide Review' : 'Review Answers'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-display font-bold text-white px-4">Detailed Review</h3>
              {currentQuestions.map((q, idx) => (
                <div key={q.id} className="glass-card p-8 border-white/10 space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                        <span>Question {idx + 1}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="text-violet-glow">{q.topic}</span>
                      </div>
                      <h4 className="text-xl font-bold text-white">{q.question}</h4>
                    </div>
                    {answers[idx] === q.correctAnswer ? (
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                    ) : (
                      <XCircle className="text-coral-glow shrink-0" size={24} />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, optIdx) => (
                      <div 
                        key={optIdx}
                        className={`p-4 rounded-xl border text-sm font-medium ${
                          optIdx === q.correctAnswer 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                            : optIdx === answers[idx]
                            ? 'bg-coral-glow/10 border-coral-glow/30 text-coral-glow'
                            : 'bg-white/5 border-white/5 text-white/40'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-violet-glow/5 rounded-2xl border border-violet-glow/10">
                    <div className="text-xs font-bold text-violet-glow uppercase tracking-widest mb-2">Explanation</div>
                    <p className="text-sm text-white/70 leading-relaxed italic">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
};
