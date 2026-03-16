import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      id="universal-back-button"
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.1, x: -5 }}
      className="fixed top-6 left-6 z-[100] p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 transition-colors shadow-lg"
      title="Back to Dashboard"
    >
      <ArrowLeft size={24} />
    </motion.button>
  );
};
