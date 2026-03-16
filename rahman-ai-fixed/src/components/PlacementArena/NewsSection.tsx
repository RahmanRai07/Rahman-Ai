import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Cpu, Briefcase, Lightbulb, ExternalLink, RefreshCw, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: 'world' | 'tech';
  timestamp: string;
}

import { fetchRealNews } from '../../services/gemini';

export const NewsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'world' | 'tech'>('world');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const data = await fetchRealNews(activeTab);
        const formattedData = data.map((item: any) => ({
          ...item,
          category: activeTab
        }));
        setNews(formattedData);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [activeTab]);

  const filteredNews = news;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Newspaper className="text-violet-glow" /> Global Intelligence
          </h2>
          <p className="text-white/60">Stay updated with the latest in world affairs and technology.</p>
        </div>

        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('world')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'world' ? 'bg-violet-glow text-white shadow-lg shadow-violet-glow/20' : 'text-white/40 hover:text-white'
            }`}
          >
            <Globe size={16} /> ALL NEWS (WORLD)
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tech' ? 'bg-violet-glow text-white shadow-lg shadow-violet-glow/20' : 'text-white/40 hover:text-white'
            }`}
          >
            <Cpu size={16} /> TECH, AI & JOBS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center gap-4">
              <RefreshCw className="w-8 h-8 text-violet-glow animate-spin" />
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Fetching Latest Updates...</p>
            </div>
          ) : (
            filteredNews.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 group hover:bg-white/[0.04] transition-all border-white/10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-lg bg-violet-glow/10 border border-violet-glow/20 text-violet-glow text-[10px] font-bold uppercase tracking-widest">
                      {item.source}
                    </span>
                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{item.timestamp}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-violet-glow transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-center">
                  <div className="flex gap-4">
                    {item.category === 'tech' ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-electric-blue uppercase tracking-widest">
                        <Cpu size={12} /> Innovation
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-coral-glow uppercase tracking-widest">
                        <Globe size={12} /> Global
                      </div>
                    )}
                  </div>
                  <a 
                    href={item.url} 
                    className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold transition-all group/link"
                  >
                    Read More <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
