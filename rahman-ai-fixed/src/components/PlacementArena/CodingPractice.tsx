import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Terminal, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  Brain, 
  Sparkles,
  Trophy,
  BookOpen,
  Search,
  Filter,
  Lightbulb
} from 'lucide-react';
import { ai, MODELS } from '../../services/gemini';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string;
}

const PROBLEMS: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
    ],
    starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n}'
  },
  {
    id: '2',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked Lists',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }
    ],
    starterCode: '/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction reverseList(head) {\n  // Write your code here\n}'
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Strings',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }
    ],
    starterCode: 'function lengthOfLongestSubstring(s) {\n  // Write your code here\n}'
  }
];

export const CodingPractice: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleExplain = async () => {
    if (!selectedProblem) return;
    setIsAnalyzing(true);
    try {
      const prompt = `Explain the logic for solving the coding problem: "${selectedProblem.title}". 
      Problem Description: ${selectedProblem.description}
      Provide a step-by-step approach and time/space complexity analysis.`;

      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: prompt,
      });

      setExplanation(response.text || "Could not generate explanation.");
    } catch (error) {
      console.error("Error explaining problem:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeCode = async () => {
    if (!code.trim() || !selectedProblem) return;
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze the following JavaScript code for the problem "${selectedProblem.title}". 
      Code:
      ${code}
      
      Check for:
      1. Correctness
      2. Time Complexity
      3. Space Complexity
      4. Potential optimizations or edge cases missed.`;

      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: prompt,
      });

      setExplanation(response.text || "Could not analyze code.");
    } catch (error) {
      console.error("Error analyzing code:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {!selectedProblem ? (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-white">Coding Arena</h2>
              <p className="text-white/40 font-medium">Master data structures and algorithms with AI-guided practice.</p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Search problems..."
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50"
                />
              </div>
              <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROBLEMS.map((prob) => (
              <motion.button
                key={prob.id}
                whileHover={{ y: -5 }}
                onClick={() => {
                  setSelectedProblem(prob);
                  setCode(prob.starterCode);
                  setExplanation(null);
                }}
                className="glass-card p-8 text-left space-y-6 group hover:bg-white/[0.05] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-violet-glow/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Code2 className="text-violet-glow" />
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                    prob.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-500' :
                    prob.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-500' :
                    'bg-coral-glow/20 text-coral-glow'
                  }`}>
                    {prob.difficulty}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-glow transition-colors">{prob.title}</h3>
                  <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{prob.category}</p>
                </div>
                <div className="flex items-center gap-2 text-violet-glow font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  Solve Now <ChevronRight size={14} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[800px]">
          {/* Problem Description & Analysis */}
          <div className="flex flex-col space-y-6 overflow-y-auto pr-4 scrollbar-hide">
            <button 
              onClick={() => setSelectedProblem(null)}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ChevronRight size={16} className="rotate-180" /> Back to List
            </button>

            <div className="glass-card p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-display font-bold text-white">{selectedProblem.title}</h3>
                <span className="px-3 py-1 bg-violet-glow/10 border border-violet-glow/20 rounded-full text-[10px] font-bold text-violet-glow uppercase tracking-widest">
                  {selectedProblem.difficulty}
                </span>
              </div>
              <p className="text-white/60 leading-relaxed font-medium">{selectedProblem.description}</p>
              
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Examples</h4>
                {selectedProblem.examples.map((ex, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                    <div className="text-xs"><span className="text-white/40 font-bold">Input:</span> <code className="text-emerald-400">{ex.input}</code></div>
                    <div className="text-xs"><span className="text-white/40 font-bold">Output:</span> <code className="text-electric-blue">{ex.output}</code></div>
                    {ex.explanation && <p className="text-[10px] text-white/40 italic">Explanation: {ex.explanation}</p>}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleExplain}
                  disabled={isAnalyzing}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
                >
                  <Brain size={16} className="text-violet-glow" /> 
                  {isAnalyzing ? 'Thinking...' : 'Explain Logic'}
                </button>
                <button 
                  onClick={handleAnalyzeCode}
                  disabled={isAnalyzing || !code.trim()}
                  className="flex-1 py-3 bg-violet-glow/20 hover:bg-violet-glow/30 border border-violet-glow/30 rounded-xl text-xs font-bold text-violet-glow flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles size={16} /> 
                  {isAnalyzing ? 'Analyzing...' : 'Analyze My Code'}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-8 border-violet-glow/20 bg-violet-glow/5 space-y-4"
                >
                  <h4 className="text-sm font-bold text-violet-glow uppercase tracking-widest flex items-center gap-2">
                    <Lightbulb size={16} /> AI Insight
                  </h4>
                  <div className="whitespace-pre-wrap text-white/70 text-sm leading-relaxed font-medium">
                    {explanation}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Code Editor Mockup */}
          <div className="flex flex-col glass-card p-0 overflow-hidden border-white/10">
            <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-coral-glow/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/40" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/40" />
                </div>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={12} /> solution.js
                </span>
              </div>
              <button className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                <Play size={12} /> Run Code
              </button>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="flex-1 bg-transparent p-8 text-white font-mono text-sm focus:outline-none resize-none scrollbar-hide"
              spellCheck={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
